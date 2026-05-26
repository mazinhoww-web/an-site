# M8 - Fundação Funcional

> Milestone seguinte ao M7. Foco: tirar features do estado "stub" para "produto real" e validar qualidade do site em duas dimensões críticas (performance e acessibilidade).

---

## Contexto

M1 a M5 entregaram a estrutura. M6 polimento. M7 prova visual. Mas o site ainda tem features que existem como esqueleto sem tronco: `DownloadGate` não entrega arquivo, `/admin` tem stubs sem mutações reais, newsletter não dispara. Antes de seguir para ampliações (M9), precisamos consolidar o que já está prometido na UI.

## Objetivo

Transformar 3 features de stub em produto real (DownloadGate, Admin CRUD, Newsletter dispatch) e auditar o site em performance e acessibilidade, corrigindo gaps até atingir os thresholds definidos.

## Dependências

- M7 completo e em produção
- Tabelas `downloads`, `subscribers`, `skills`, `frameworks`, `news`, `events`, `career_chapters`, `career_highlights`, `contacts` migradas em Neon (todas as 16 tabelas já existem)
- Resend configurado com domínio verificado
- Vercel Blob ativo (para storage de assets de download)
- Senha Neon e AUTH_SECRET rotacionados (pendência do M6, validar antes)
- Auth.js v5 + Resend magic link funcionando (M5)

## Decisões travadas (NÃO renegociar)

1. **Assets de download ficam em Vercel Blob**, não em `public/`. Garante URL signed e não vaza por crawler.
2. **DownloadGate exige email + consent LGPD** em todo download. Email confirmado em uma vez vale por 30 dias via cookie `consent_lgpd`.
3. **Token de download é one-time**, expira em 24h, salvo em tabela `downloads` com `used_at` para invalidar reuso.
4. **Admin CRUD usa Server Actions**, não rotas API REST. Drizzle direto, validação Zod.
5. **Newsletter dispatch usa Resend Broadcasts**, não envio em loop. Audience filtrada via API.
6. **Performance threshold**: Lighthouse mobile com Performance 90+, LCP < 2.5s, CLS < 0.1, INP < 200ms. Tudo medido em `aurimarnogueira.com.br` (não localhost).
7. **Acessibilidade threshold**: Lighthouse Accessibility 100, zero violation crítica no axe DevTools, keyboard nav completo, screen reader testado.
8. **Auditorias não inventam features novas**. Se um gap exigir mudança de produto (não de implementação), vira backlog separado.
9. **Admin não tem upload de imagem ainda**. Imagens vêm de `public/photos/` via path manual em formulário (M9 ou backlog para upload UI).
10. **Não tocar em copy ou trajetória** já corrigida em M6. Auditoria de A11y pode trocar `aria-label`, não copy visível.

---

## Slice 8.1 - DownloadGate funcional

### Objetivo

Fluxo end-to-end de download protegido por email + consent: usuário pede arquivo, recebe link por email, baixa asset real do Vercel Blob com token one-time.

### Fluxo

```
1. Usuário em /skills/[slug] clica "Baixar PDF"
2. Modal abre: email + checkbox consent_lgpd
3. Submit chama server action requestDownload(email, skillSlug)
   - Upsert em subscribers (chave = email)
   - Gera token nanoid(32), insere em downloads (skill_id, subscriber_id, token, expires_at +24h)
   - Envia email via Resend com link https://aurimarnogueira.com.br/baixar/[token]
4. User clica no link
5. /baixar/[token]/page.tsx (server component) valida:
   - Token existe, expires_at no futuro, used_at null
   - Se ok: marca used_at = now, marca subscriber.confirmed_at se ainda null
   - Resolve asset_url do skill no Vercel Blob
   - Redireciona para signed URL com download=1
6. Subsequente: cookie consent_lgpd com email pula modal por 30 dias
```

### Tasks

**8.1.1 Schema e migrations**

Validar que `downloads` tem todas as colunas necessárias. Se faltar, gerar migration:

```ts
// drizzle/schema.ts (validar/ajustar)
export const downloads = pgTable('downloads', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  skillId: text('skill_id').references(() => skills.id).notNull(),
  subscriberId: text('subscriber_id').references(() => subscribers.id).notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const skills = pgTable('skills', {
  // ... campos existentes
  assetBlobKey: text('asset_blob_key'), // novo: chave no Vercel Blob
  assetFilename: text('asset_filename'), // novo: nome do arquivo para download
})
```

Comando:
```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

**8.1.2 Upload manual dos assets para Vercel Blob**

Script utilitário em `scripts/upload-asset.ts`:

```ts
import { put } from '@vercel/blob'
import { readFile } from 'fs/promises'

const file = process.argv[2]
const key = process.argv[3]

const buffer = await readFile(file)
const { url } = await put(key, buffer, {
  access: 'public',
  addRandomSuffix: false,
})
console.log(`Uploaded to: ${url}`)
console.log(`Key: ${key}`)
```

Execução para cada skill com PDF:
```bash
pnpm tsx scripts/upload-asset.ts ./assets/metodo-jet-ski.pdf skills/metodo-jet-ski.pdf
```

Atualizar `assetBlobKey` da skill no Neon (via /admin após 8.2, ou via SQL direto agora).

**8.1.3 Server action requestDownload**

```ts
// src/app/actions/download.ts
'use server'

import { z } from 'zod'
import { nanoid } from 'nanoid'
import { db } from '@/lib/db'
import { downloads, subscribers, skills } from '@/drizzle/schema'
import { Resend } from 'resend'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { rateLimit } from '@/lib/rate-limit'

const schema = z.object({
  email: z.string().email().max(200),
  skillSlug: z.string().min(1).max(120),
  consentLgpd: z.literal(true),
})

const resend = new Resend(process.env.RESEND_API_KEY)

export async function requestDownload(input: unknown) {
  const data = schema.parse(input)

  // rate limit por IP (10 requests / 10min)
  const ip = (await headers()).get('x-forwarded-for') ?? 'unknown'
  await rateLimit(`download:${ip}`, 10, 600)

  const [skill] = await db.select().from(skills).where(eq(skills.slug, data.skillSlug)).limit(1)
  if (!skill?.assetBlobKey) {
    throw new Error('Skill ou asset não encontrado')
  }

  // upsert subscriber
  const [subscriber] = await db
    .insert(subscribers)
    .values({ email: data.email, consentLgpd: true })
    .onConflictDoUpdate({
      target: subscribers.email,
      set: { consentLgpd: true },
    })
    .returning()

  // gera token
  const token = nanoid(32)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await db.insert(downloads).values({
    skillId: skill.id,
    subscriberId: subscriber.id,
    token,
    expiresAt,
  })

  // envia email
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/baixar/${token}`
  await resend.emails.send({
    from: 'AN. <download@aurimarnogueira.com.br>',
    to: data.email,
    subject: `Seu download: ${skill.name}`,
    text: [
      `Olá,`,
      ``,
      `Aqui está o link para baixar ${skill.name}:`,
      url,
      ``,
      `Link expira em 24 horas e é de uso único.`,
      ``,
      `Aurimar Nogueira`,
    ].join('\n'),
  })

  return { ok: true }
}
```

**8.1.4 Página /baixar/[token]**

```ts
// src/app/baixar/[token]/page.tsx
import { db } from '@/lib/db'
import { downloads, subscribers, skills } from '@/drizzle/schema'
import { eq, and, isNull, gt } from 'drizzle-orm'
import { redirect, notFound } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function DownloadPage(
  props: { params: Promise<{ token: string }> }
) {
  const { token } = await props.params

  const [record] = await db
    .select({
      id: downloads.id,
      skillId: downloads.skillId,
      subscriberId: downloads.subscriberId,
      expiresAt: downloads.expiresAt,
      usedAt: downloads.usedAt,
      assetBlobKey: skills.assetBlobKey,
      assetFilename: skills.assetFilename,
      skillName: skills.name,
      subscriberEmail: subscribers.email,
    })
    .from(downloads)
    .innerJoin(skills, eq(downloads.skillId, skills.id))
    .innerJoin(subscribers, eq(downloads.subscriberId, subscribers.id))
    .where(eq(downloads.token, token))
    .limit(1)

  if (!record) notFound()
  if (record.usedAt) {
    return <ExpiredOrUsed reason="used" />
  }
  if (record.expiresAt < new Date()) {
    return <ExpiredOrUsed reason="expired" />
  }

  // marca como usado
  await db
    .update(downloads)
    .set({ usedAt: new Date() })
    .where(eq(downloads.id, record.id))

  await db
    .update(subscribers)
    .set({ confirmedAt: new Date() })
    .where(and(eq(subscribers.id, record.subscriberId), isNull(subscribers.confirmedAt)))

  // grava cookie de bypass por 30 dias
  const cookieStore = await cookies()
  cookieStore.set('consent_lgpd_email', record.subscriberEmail, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  })

  // gera URL pública do Blob (já é signed se access=public)
  const blobUrl = `https://${process.env.BLOB_HOSTNAME}/${record.assetBlobKey}`

  redirect(blobUrl)
}

function ExpiredOrUsed({ reason }: { reason: 'expired' | 'used' }) {
  return (
    <main className="container py-24">
      <h1 className="font-heading text-h2">Link inválido</h1>
      <p className="mt-4 text-body">
        {reason === 'expired'
          ? 'Este link expirou. Peça um novo na página da skill.'
          : 'Este link já foi usado. Cada link só funciona uma vez.'}
      </p>
    </main>
  )
}
```

**8.1.5 Rate limit utility**

```ts
// src/lib/rate-limit.ts
import { kv } from '@vercel/kv'

export async function rateLimit(key: string, max: number, windowSec: number) {
  const count = await kv.incr(`rl:${key}`)
  if (count === 1) await kv.expire(`rl:${key}`, windowSec)
  if (count > max) {
    throw new Error('Muitas tentativas. Tente novamente em alguns minutos.')
  }
}
```

**8.1.6 Atualizar DownloadGate component**

- Conectar form ao server action `requestDownload`
- Loading state durante submit
- Success state: "Enviamos o link para [email]. Confira sua caixa"
- Error state: mensagens claras (rate limit, email inválido, skill não encontrada)
- Bypass: se cookie `consent_lgpd_email` existir, pular modal e disparar download direto

**8.1.7 Template de email**

Email é texto puro (já no snippet acima). Não usar HTML rich agora. Razão: simplicidade, entregabilidade, sem manter template separado.

### Must-haves verificáveis

- [ ] Submit no DownloadGate com email válido envia email real via Resend
- [ ] Email recebido contém link `https://aurimarnogueira.com.br/baixar/[token]`
- [ ] Clicar no link baixa o arquivo correto do Vercel Blob
- [ ] Segundo clique no mesmo link mostra "Link já foi usado"
- [ ] Após 24h sem uso, link mostra "Link expirou"
- [ ] Cookie `consent_lgpd_email` é setado após uso bem sucedido
- [ ] Próxima visita à mesma skill em até 30 dias pula o modal
- [ ] Tentar 11 requests em 10 min de mesmo IP retorna erro de rate limit
- [ ] Tabela `downloads` registra cada request, com `used_at` populado após uso
- [ ] Subscriber tem `confirmed_at` populado após primeiro download bem sucedido

### Commit proposto

```
feat(download): implementar DownloadGate real com Vercel Blob e Resend

- Schema: adiciona asset_blob_key e asset_filename em skills
- Server action requestDownload com Zod, rate limit e Resend
- Página /baixar/[token] valida one-time use, marca usado, redireciona para Blob
- Cookie consent_lgpd_email com bypass de 30 dias
- Rate limit via Vercel KV (10 requests / 10min por IP)
```

---

## Slice 8.2 - Admin CRUD real

### Objetivo

Substituir stubs do `/admin` por mutações reais no Neon. Permitir criar, editar e deletar conteúdos do site sem mexer no código.

### Recursos com CRUD completo

| Recurso | Operações | Notas |
|---|---|---|
| skills | CRUD | Inclui `assetBlobKey` para download |
| frameworks | CRUD | Sem asset |
| news | CRUD | `published_at` controla visibilidade |
| events | CRUD | `published_at`, `event_date` |
| career_chapters | CRUD | Ordem via campo `order` |
| career_highlights | CRUD | Filho de chapter, ordem própria |

### Recursos read-only

| Recurso | UI |
|---|---|
| downloads | Lista paginada, filtro por skill, export CSV |
| subscribers | Lista paginada, filtro por confirmado/não, export CSV |
| contacts | Lista paginada, marcar como lido |
| click_events | Lista paginada (últimos 1000), filtro por tipo |
| page_analytics | Dashboard mínimo: views por página últimos 7 dias |

### Tasks

**8.2.1 Estrutura de rotas /admin**

```
/admin
  /skills           → lista
  /skills/new       → form
  /skills/[id]      → form de edit
  /frameworks       → idem
  /news             → idem
  /events           → idem
  /trajetoria       → chapters + highlights aninhados
  /downloads        → read-only
  /subscribers      → read-only
  /contatos         → read-only
  /analytics        → read-only
```

**8.2.2 Padrão de form com Server Action**

```tsx
// src/app/admin/skills/_components/SkillForm.tsx
'use client'
import { useFormState, useFormStatus } from 'react-dom'
import { saveSkill } from '@/app/actions/skills'

export function SkillForm({ initial }: { initial?: Skill }) {
  const [state, action] = useFormState(saveSkill, { ok: false })
  return (
    <form action={action}>
      <input type="hidden" name="id" value={initial?.id ?? ''} />
      <label>
        Nome
        <input name="name" defaultValue={initial?.name} required />
      </label>
      {/* ... outros campos */}
      <SubmitButton />
      {state.error && <p className="text-error">{state.error}</p>}
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? 'Salvando' : 'Salvar'}</button>
}
```

```ts
// src/app/actions/skills.ts
'use server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { skills } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-helpers'

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  description: z.string().max(2000).optional(),
  assetBlobKey: z.string().optional(),
  assetFilename: z.string().optional(),
})

export async function saveSkill(_: any, formData: FormData) {
  await requireAdmin()
  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, error: parsed.error.message }

  const { id, ...data } = parsed.data
  if (id) {
    await db.update(skills).set(data).where(eq(skills.id, id))
  } else {
    await db.insert(skills).values(data)
  }
  revalidatePath('/admin/skills')
  revalidatePath('/skills')
  return { ok: true }
}

export async function deleteSkill(id: string) {
  await requireAdmin()
  await db.delete(skills).where(eq(skills.id, id))
  revalidatePath('/admin/skills')
  revalidatePath('/skills')
}
```

**8.2.3 Auth guard**

```ts
// src/lib/auth-helpers.ts
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(s => s.trim())

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.email) redirect('/admin/login')
  if (!ADMIN_EMAILS.includes(session.user.email)) {
    throw new Error('Não autorizado')
  }
  return session
}
```

Adicionar `ADMIN_EMAILS=aurimar@...` nas env vars do Vercel.

**8.2.4 Export CSV**

```ts
// src/app/admin/subscribers/export/route.ts
import { db } from '@/lib/db'
import { subscribers } from '@/drizzle/schema'
import { requireAdmin } from '@/lib/auth-helpers'

export async function GET() {
  await requireAdmin()
  const rows = await db.select().from(subscribers)
  const csv = [
    ['email', 'consent_lgpd', 'confirmed_at', 'created_at'].join(','),
    ...rows.map(r => [
      r.email,
      r.consentLgpd,
      r.confirmedAt?.toISOString() ?? '',
      r.createdAt.toISOString(),
    ].join(',')),
  ].join('\n')

  return new Response(csv, {
    headers: {
      'content-type': 'text/csv',
      'content-disposition': `attachment; filename="subscribers-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
```

**8.2.5 Layout do admin**

- Sidebar com lista de recursos
- Breadcrumb no topo
- Tipografia mono nas labels, body nos inputs
- Botão "salvar" lime background bar
- Sem decorações além do hairline frame
- Tabelas com hairline border, zero zebra

### Must-haves verificáveis

- [ ] Login em `/admin/login` redireciona para `/admin` se email autorizado
- [ ] Tentativa de acessar `/admin/*` sem login redireciona para login
- [ ] Acessar com email não autorizado mostra erro
- [ ] Criar nova skill via form persiste no Neon e aparece em `/skills`
- [ ] Editar skill atualiza no banco e na página pública após `revalidatePath`
- [ ] Deletar skill remove do banco e da página pública
- [ ] Idem para frameworks, news, events, career_chapters, career_highlights
- [ ] `/admin/downloads` lista downloads com filtro por skill
- [ ] `/admin/subscribers/export` baixa CSV com todos os subscribers
- [ ] Validação Zod rejeita inputs malformados (slug com espaço, nome vazio, etc.)
- [ ] Slug duplicado retorna erro claro, não 500

### Commit proposto

```
feat(admin): substituir stubs por CRUD real com Server Actions

- 6 recursos com CRUD completo (skills, frameworks, news, events, career_chapters, career_highlights)
- 5 recursos read-only (downloads, subscribers, contacts, click_events, page_analytics)
- Auth guard via ADMIN_EMAILS env var
- Export CSV em subscribers e downloads
- Validação Zod em todos os forms
- revalidatePath após cada mutação para refletir em produção
```

---

## Slice 8.3 - Newsletter dispatch

### Objetivo

Permitir que Aurimar componha e dispare emails para a base de subscribers confirmados, com histórico de envios.

### Tasks

**8.3.1 Schema**

```ts
export const newsletters = pgTable('newsletters', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  subject: text('subject').notNull(),
  bodyMarkdown: text('body_markdown').notNull(),
  bodyHtml: text('body_html').notNull(),
  sentAt: timestamp('sent_at'),
  sentCount: integer('sent_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  createdBy: text('created_by').notNull(), // email do admin
})
```

**8.3.2 Compositor em /admin/newsletter/new**

- Campo subject (input)
- Campo body em markdown (textarea, mono font)
- Preview ao lado com markdown renderizado
- Botão "Enviar teste para mim" (dispara só para Aurimar)
- Botão "Enviar para [N] subscribers confirmados"
- Confirm dialog antes de envio massivo

**8.3.3 Server action sendNewsletter**

```ts
'use server'
import { Resend } from 'resend'
import { marked } from 'marked'
import { db } from '@/lib/db'
import { newsletters, subscribers } from '@/drizzle/schema'
import { and, isNotNull, eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/auth-helpers'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendNewsletter(input: {
  subject: string
  bodyMarkdown: string
  testOnly?: boolean
}) {
  const session = await requireAdmin()
  const bodyHtml = await marked.parse(input.bodyMarkdown)

  const audience = input.testOnly
    ? [{ email: session.user!.email! }]
    : await db
        .select({ email: subscribers.email })
        .from(subscribers)
        .where(and(isNotNull(subscribers.confirmedAt), eq(subscribers.consentLgpd, true)))

  // batch 100 por vez (limite Resend)
  let sent = 0
  for (let i = 0; i < audience.length; i += 100) {
    const batch = audience.slice(i, i + 100)
    await resend.batch.send(
      batch.map(s => ({
        from: 'Aurimar <newsletter@aurimarnogueira.com.br>',
        to: s.email,
        subject: input.subject,
        html: bodyHtml,
        // unsubscribe header
        headers: {
          'List-Unsubscribe': `<https://aurimarnogueira.com.br/descadastrar?email=${encodeURIComponent(s.email)}>`,
        },
      }))
    )
    sent += batch.length
  }

  if (!input.testOnly) {
    await db.insert(newsletters).values({
      subject: input.subject,
      bodyMarkdown: input.bodyMarkdown,
      bodyHtml,
      sentAt: new Date(),
      sentCount: sent,
      createdBy: session.user!.email!,
    })
  }

  return { ok: true, sent }
}
```

**8.3.4 Página /descadastrar**

```ts
// src/app/descadastrar/page.tsx
import { db } from '@/lib/db'
import { subscribers } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export default async function Unsubscribe({
  searchParams,
}: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams
  if (!email) return <p>Link inválido.</p>

  await db
    .update(subscribers)
    .set({ confirmedAt: null, consentLgpd: false })
    .where(eq(subscribers.email, email))

  return (
    <main className="container py-24">
      <h1 className="font-heading text-h2">Descadastrado</h1>
      <p>{email} não receberá mais emails.</p>
    </main>
  )
}
```

**8.3.5 Histórico em /admin/newsletter**

- Tabela com colunas: subject, sentAt, sentCount, createdBy
- Clicar em linha mostra preview do body HTML em modal

### Must-haves verificáveis

- [ ] Composer renderiza preview de markdown em tempo real
- [ ] "Enviar teste para mim" entrega email só para o admin logado
- [ ] "Enviar para [N]" dispara para todos os subscribers confirmados com consent_lgpd
- [ ] Email contém header `List-Unsubscribe` com link funcional
- [ ] Acessar `/descadastrar?email=X` zera `confirmed_at` e `consent_lgpd`
- [ ] Newsletter aparece no histórico com `sent_at` e `sent_count` corretos
- [ ] Subscribers descadastrados não recebem newsletters subsequentes
- [ ] Falha de envio (rate limit Resend, email inválido) é capturada e exibida

### Commit proposto

```
feat(newsletter): implementar composer e dispatch via Resend Batch

- Schema newsletters com markdown + html + audit
- Composer em /admin/newsletter/new com preview ao vivo
- Server action com batch de 100, header List-Unsubscribe
- Página /descadastrar funcional
- Histórico de envios em /admin/newsletter
```

---

## Slice 8.4 - Performance audit e correções

### Objetivo

Medir o site em produção, identificar gaps de performance e corrigir até atingir os thresholds definidos.

### Thresholds

| Métrica | Threshold |
|---|---|
| Lighthouse Performance (mobile) | 90+ |
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |
| TBT | < 200ms |
| Bundle First Load JS | < 200kb gzipped |

### Tasks

**8.4.1 Baseline**

Rodar Lighthouse mobile em produção para 6 rotas e registrar baseline em `.planning/lighthouse-baseline.md`:

- `/`
- `/sobre`
- `/eventos`
- `/eventos/[slug-de-um-evento]`
- `/skills`
- `/skills/[slug-de-uma-skill]`

Comando:
```bash
pnpm dlx lighthouse https://aurimarnogueira.com.br/ \
  --preset=mobile \
  --output=json \
  --output-path=./lighthouse-home.json \
  --chrome-flags="--headless"
```

**8.4.2 Bundle analysis**

```bash
ANALYZE=true pnpm build
```

(Requer `@next/bundle-analyzer` configurado em `next.config.mjs`.)

Identificar 5 maiores módulos. Avaliar:
- `marked` (newsletter): só carregar em /admin
- `lucide-react`: importar icons individualmente, não namespace
- `@vercel/blob`: server-only, validar que não vaza para client
- Drizzle ORM: server-only, validar

**8.4.3 Otimizações comuns**

- Adicionar `loading="lazy"` em imagens abaixo do fold (já é default do next/image, validar)
- `priority` na hero photo
- `font-display: swap` em todas as fontes (já é default do next/font, validar)
- Preload `<link rel="preconnect">` para Resend, Vercel Blob, Vercel Analytics
- Move dynamic imports onde houver code split possível (ex: composer de newsletter, marquee)
- Server components onde ainda for client desnecessariamente
- Cache headers em rotas estáticas (`Cache-Control: public, max-age=3600`)

**8.4.4 LCP target: hero photo**

- Hero photo já deve ter `priority` (M7)
- Validar que `next/image` está gerando `srcset` correto
- Considerar AVIF além de WebP

**8.4.5 CLS prevenção**

- Toda `<Image>` com width/height ou aspect-ratio reservado
- Fontes com `size-adjust` para evitar shift
- Marquee logo: viewport com height fixa, não auto

**8.4.6 Re-audit**

Após correções, rodar Lighthouse de novo. Se ainda abaixo do threshold, iterar.

### Must-haves verificáveis

- [ ] Lighthouse Performance mobile 90+ nas 6 rotas
- [ ] LCP < 2.5s na home
- [ ] CLS < 0.1 em todas as 6 rotas
- [ ] Bundle First Load JS < 200kb gzipped na home
- [ ] `/admin/*` não infla bundle público (validar via analyzer)
- [ ] Vercel Speed Insights configurado e coletando dados
- [ ] `.planning/lighthouse-after.md` com prints/JSONs do após
- [ ] Diff baseline vs after documentado em `.planning/perf-report.md`

### Commit proposto

```
perf: corrigir gaps de performance até atingir threshold 90+

- Lazy-load de marked (newsletter) e composer markdown
- Lucide-react com imports individuais
- Preconnect para Resend, Vercel Blob, Analytics
- Hero photo com priority, AVIF habilitado
- Aspect-ratio reservado em todas as imagens
- Speed Insights ativado
```

---

## Slice 8.5 - Acessibilidade audit e correções

### Objetivo

Atingir WCAG AA em todas as páginas públicas e Lighthouse Accessibility 100.

### Thresholds

| Métrica | Threshold |
|---|---|
| Lighthouse Accessibility | 100 |
| axe DevTools critical violations | 0 |
| axe DevTools serious violations | 0 |
| Keyboard nav | 100% das ações reachable |
| Screen reader | Todas as rotas com landmark e heading hierarchy |

### Tasks

**8.5.1 Baseline**

- Rodar axe DevTools em cada uma das 6 rotas e listar violations
- Salvar prints em `.planning/a11y-baseline/`

**8.5.2 Categorias de gaps prováveis**

- Imagens sem `alt` ou com alt redundante (decorativas devem ter `alt=""`)
- Botões icon-only sem `aria-label`
- Contraste insuficiente em texto secundário (validar mono caption com opacity baixa)
- Focus visible inconsistente (definir global: `focus-visible: outline 2px solid #CCFF00; outline-offset: 2px;`)
- Ordem de tab quebrada (especialmente no marquee)
- Falta de skip link
- Headings fora de ordem (h1 > h3 sem h2)
- Forms sem labels associados
- `<form>` sem `aria-label` ou heading que descreva propósito
- Links que só dizem "clique aqui" ou "saiba mais"
- Atributo `lang="pt-BR"` no html

**8.5.3 Skip link global**

```tsx
// src/components/SkipLink.tsx
export function SkipLink() {
  return (
    <a href="#main" className="skip-link">
      Pular para o conteúdo principal
    </a>
  )
}
```

```css
.skip-link {
  position: absolute;
  left: -9999px;
  top: 8px;
  background: #0A0A0A;
  color: #F5F4EF;
  padding: 8px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  z-index: 100;
}
.skip-link:focus {
  left: 8px;
}
```

Inserir no `layout.tsx` antes do header. Adicionar `id="main"` no `<main>`.

**8.5.4 Focus visible global**

```css
*:focus-visible {
  outline: 2px solid #CCFF00;
  outline-offset: 2px;
  border-radius: 0;
}
*:focus:not(:focus-visible) {
  outline: none;
}
```

**8.5.5 Keyboard nav teste**

Percorrer cada rota só com `Tab`, `Shift+Tab`, `Enter`, `Space`, `Esc`. Garantir:
- Toda ação clicável é alcançável
- Modal (DownloadGate) tem focus trap
- Esc fecha modal
- Marquee não captura foco (logos não são clicáveis)
- Sidebar do admin é navegável

**8.5.6 Screen reader teste**

VoiceOver no Mac:
- Cmd+F5 ativa
- Ctrl+Option+A lê do início
- Ctrl+Option+U abre rotor

Validar:
- Heading hierarchy faz sentido
- Landmarks (`main`, `nav`, `aside`, `footer`) presentes
- Form fields anunciam label e estado
- Imagens decorativas não são lidas
- Mono captions são lidas como texto, não como código

**8.5.7 Re-audit**

Rodar axe DevTools de novo após correções. Repetir até zero violations critical/serious.

### Must-haves verificáveis

- [ ] Lighthouse Accessibility 100 nas 6 rotas
- [ ] axe DevTools zero violations critical e serious
- [ ] Skip link funcional (Tab no início da página, Enter pula para `#main`)
- [ ] Focus visible com outline lime em toda ação clicável
- [ ] DownloadGate modal com focus trap e Esc fecha
- [ ] Tab order lógico nas 6 rotas
- [ ] `<html lang="pt-BR">` presente
- [ ] Todas as imagens com alt apropriado (vazio se decorativo)
- [ ] Todos os botões icon-only com aria-label
- [ ] `.planning/a11y-after/` com prints de validação

### Commit proposto

```
a11y: atingir WCAG AA e Lighthouse Accessibility 100

- Skip link global
- Focus visible com outline lime
- aria-label em botões icon-only
- alt corrigido em imagens decorativas e de conteúdo
- Heading hierarchy normalizada
- Focus trap no DownloadGate modal
- lang="pt-BR" no html
```

---

## Critérios de aceite do milestone

- [ ] Slice 8.1: usuário consegue baixar PDF de skill em produção, ponta a ponta
- [ ] Slice 8.2: Aurimar consegue criar, editar e deletar conteúdo via `/admin` sem tocar em código
- [ ] Slice 8.3: Aurimar consegue compor e enviar newsletter para a base
- [ ] Slice 8.4: Lighthouse Performance 90+ em mobile em todas as 6 rotas
- [ ] Slice 8.5: Lighthouse Accessibility 100 em todas as 6 rotas
- [ ] Zero regressão visual no site público (validar manualmente as 6 rotas)
- [ ] Tag `v0.8.0` aplicada após push da última slice

## Plano de commits

```
1. feat(download): implementar DownloadGate real com Vercel Blob e Resend
2. feat(admin): substituir stubs por CRUD real com Server Actions
3. feat(newsletter): implementar composer e dispatch via Resend Batch
4. perf: corrigir gaps de performance até atingir threshold 90+
5. a11y: atingir WCAG AA e Lighthouse Accessibility 100
```

## Ordem de execução sugerida

1. **8.1 DownloadGate** (prioridade explícita do usuário, destrava valor de produto)
2. **8.2 Admin CRUD** (destrava manutenção sem dev intervention)
3. **8.3 Newsletter** (depende de 8.2 estar funcional para subscribers count)
4. **8.4 Performance audit** (depois das features para medir o estado real)
5. **8.5 A11y audit** (idem, e usa os componentes finais)

## Pendências antes de executar M8

- [ ] M7 completo em produção
- [ ] Senha Neon rotacionada
- [ ] AUTH_SECRET rotacionado
- [ ] `ADMIN_EMAILS` configurado nas env vars Vercel
- [ ] Resend com domínio verificado e DKIM/SPF/DMARC OK
- [ ] Vercel Blob ativado no projeto
- [ ] Vercel KV ativado no projeto (para rate limit)
- [ ] Assets PDF prontos para upload (caminho local `./assets/`)

## Não-objetivos do M8

- Upload de imagens via UI do admin (path manual por enquanto)
- Editor rich text para news/events (markdown direto)
- A/B testing
- Segmentação de audiência da newsletter (envia para todos os confirmados)
- Captcha no DownloadGate (rate limit + email confirmation já filtra abuso comum)
- Logging estruturado (Sentry, etc) - backlog
- I18n EN/ES (backlog)
