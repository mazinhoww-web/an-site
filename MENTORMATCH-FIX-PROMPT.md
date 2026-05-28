# Prompt de correcao MentorMatch (para Claude Code)

Cole o bloco abaixo numa sessao do Claude Code aberta **no repositorio do MentorMatch** (app standalone Next.js 16 + Prisma + NextAuth v5, `basePath: /mentormatch`). A secao final trata da proxy no repo `an-site`.

Base: auditoria em `MENTORMATCH-AUDITORIA.md`.

---

## PROMPT (copiar a partir daqui)

Voce esta no repositorio do MentorMatch (Next.js 16, React 19, Prisma 6, NextAuth v5 credentials, Tailwind 4, `basePath: /mentormatch`). Corrija os bugs abaixo. Estilo: TypeScript estrito, sem `any`, sem emoji, sem em-dash. Faca um commit por bloco (P0.1, P0.2, ...). Ao final rode `npm run lint` e `npx tsc --noEmit`, depois `npm run db:seed` num banco de teste.

### P0.1 — Atribuir tenant no fim do onboarding (hoje fica null e gera loop em /select-profile)

Arquivo: `src/app/api/auth/complete-profile/route.ts`.
- Antes do `db.$transaction`, resolva o tenant: leia o cookie `mm-tenant` via `cookies()` de `next/headers`; se vazio, use `"default"`.
- Busque `db.tenant.findUnique({ where: { slug, active: true } })`. Se nao existir, faca fallback para o tenant `default`. Se nem o default existir, retorne 400 com mensagem clara.
- No `tx.user.update`, inclua `tenantId: tenant.id` e `status: "APPROVED"` junto com `role` e `onboardingDone: true`.
- O usuario ja pode existir com `tenantId` (fluxo por convite): nesse caso NAO sobrescreva, mantenha o tenant do convite. So atribua se `tenantId` estiver null.

Verificacao: apos register publico -> select-profile -> onboarding, o usuario deve ter `tenantId` preenchido e `resolvePostLoginHref` deve mandar para `/t/{slug}/{mentor|mentee}` (nao mais para `/select-profile`).

### P0.2 — Seed: criar SUPER_ADMIN e tenant Sicredi

Arquivo: `prisma/seed.ts`.
- Crie (upsert) o tenant `sicredi`:
  - `name: "MentorMatch Sicredi"`, `slug: "sicredi"`, `brandColor: "#33820D"`, `secondaryColor` adequado, `themeKey` apontando para o tema sicredi, `active: true`, plano free.
  - Se houver coluna `tokens`/`themeCssUrl`, popule com os tokens de `src/styles/themes/sicredi.css` (Exo 2 + Nunito, verde #33820D) para o tema carregar no fluxo logado.
- Crie (upsert) o usuario SUPER_ADMIN:
  - `email: "espindolanogueira@yahoo.com.br"`, senha `Facil022@` (bcrypt hash 10), `role: "SUPER_ADMIN"`, `status: "APPROVED"`, `onboardingDone: true`. SUPER_ADMIN nao precisa de tenant (ou use o `default`).
- Mantenha o `admin@mentormatch.com` existente.

Verificacao: login com as credenciais do SUPER_ADMIN redireciona para `/admin`; o painel lista os tenants `default` e `sicredi`; `/t/sicredi/admin/users` carrega.

### P1.1 — RBAC no grupo (dashboard): checar tenant-ownership e papel-x-rota

Arquivo: `src/app/t/[slug]/(dashboard)/layout.tsx`.
- Depois de obter `session` e `tenant`:
  - Se `session.user.role !== "SUPER_ADMIN"` e `session.user.tenantSlug !== slug`, `redirect` para o dashboard do tenant correto do usuario via `getDashboardHref(session.user.role, session.user.tenantSlug, true)`.
- Crie guarda de papel-x-rota nas paginas `mentor/page.tsx` e `mentee/page.tsx` (ou num layout intermediario): se a sub-rota e `/mentor` e o role e `MENTEE`, redirecionar para `/t/{slug}/mentee` e vice-versa. ADMIN/SUPER_ADMIN podem ver ambos.

Verificacao: MENTEE acessando `/t/{slug}/mentor` e redirecionado; usuario do tenant A nao abre dashboard do tenant B.

### P1.2 — Redirect server-side de usuario logado nas rotas de auth

Arquivos: `src/app/(auth)/login/page.tsx` e `register/page.tsx` (converter para checagem server-side, ou criar um `layout.tsx` no grupo `(auth)` que faca `auth()` e `redirect(getDashboardHref(...))` quando ja houver sessao).
- Manter o `useEffect` so como fallback. Objetivo: nao mostrar o form para quem ja esta logado (sem flash).

### P1.3 — Middleware: validar a sessao, nao so a presenca do cookie

Arquivo: `src/middleware.ts`.
- Use o helper de sessao do NextAuth v5 (`auth` como wrapper de middleware) em vez de so checar `req.cookies.get("mm.session-token")`. Assim cookie expirado/forjado nao passa.
- Mantenha `select-profile` e `onboarding` exigindo sessao (tire de `publicPaths` ou adicione guarda na pagina): so quem registrou (logado) deve acessa-los.
- Confirme que o redirect de nao-logado usa o caminho com basePath correto e nao duplica `/mentormatch`.

### P1.5 — Reset de senha: garantir envio de email

Arquivo: `src/lib/email.ts` + envs.
- Valide `RESEND_API_KEY` e `RESEND_FROM` em producao. Logue erro real se o envio falhar (sem revelar ao usuario). Documente as envs no `.env.example`.

### P2.1 — Padronizar construcao de URLs (basePath)

- Centralize num helper o prefixo de API client-side. Hoje ha `fetch("/mentormatch/api/...")` espalhado (welcome, onboarding clients) e `forgot-password` monta `${NEXTAUTH_URL}/mentormatch/reset-password`.
- Garanta que `NEXTAUTH_URL` NAO inclua `/mentormatch` (senao vira `/mentormatch/mentormatch/...`). Ajuste o `.env.example` e o codigo para um unico ponto de verdade.

### P2.3 / P2.4 / P2.5 (menores)
- `deleteTenant`: renomear UX para "Desativar" (ja so faz `active:false`).
- Avaliar se `Skill` deve ser por tenant (hoje e global por `name` unico).
- Switch Mentor<->Mentorado: apos `PATCH /api/users/me` trocar o role, chamar `update()` da sessao (JWT) antes de redirecionar, senao o destino usa o role antigo.

### Ao final
- `npm run lint` e `npx tsc --noEmit` limpos.
- `npm run db:seed` aplicado.
- Teste manual das jornadas: register -> select-profile -> onboarding -> dashboard (mentor e mentee); login SUPER_ADMIN -> /admin -> criar/gerenciar tenant; landing `/sicredi` -> registro -> dashboard do tenant sicredi com tema verde.
- Abra PR draft descrevendo os fixes por bloco.

## FIM DO PROMPT

---

## Secao proxy (rodar/validar no repo `an-site`)

A proxy ja existe em `an-site/next.config.js` (rewrites de `/mentormatch/*` e `/sicredi/mentormatch/*` -> `${MENTORMATCH_URL}`). Contrato que o app DEVE satisfazer para a proxy funcionar:

1. O app serve sob `basePath: /mentormatch`. Manter. A proxy reescreve `/mentormatch -> {mmUrl}/mentormatch` (1:1) e `/sicredi/mentormatch -> {mmUrl}/mentormatch/sicredi`.
2. `MENTORMATCH_URL` no Vercel do an-site deve apontar para o deploy atual do MentorMatch (hoje fallback `https://mentormatch-five.vercel.app`). Atualizar se o projeto mudou.
3. Cookies `mm.*` e `mm-tenant` devem ter `path:/` e `sameSite:lax` (ja estao). Validar E2E que, via proxy, o Set-Cookie do app persiste no dominio `aurimarnogueira.com.br` e e lido no register/complete-profile (ver P2.2 da auditoria).
4. As rotas internas do sicredi sao reescritas para a rota generica do app (`/sicredi/mentormatch/login -> {mmUrl}/mentormatch/login`). O contexto de tenant vem do cookie `mm-tenant=sicredi` setado na landing. Confirmar que o cookie sobrevive a navegacao entre `/sicredi/mentormatch/*` e o app generico.

Prompt para Claude Code no an-site (proxy):

> No repo an-site, confirme em `next.config.js` que todos os rewrites de `/mentormatch/*` e `/sicredi/mentormatch/*` cobrem as rotas reais do app (incluir `/select-profile`, `/onboarding/:path*`, `/welcome`, `/dashboard`, `/api/:path*`, `/t/:path*`, `/admin/:path*`). Garanta que `MENTORMATCH_URL` no Vercel aponta para o deploy correto. Faca um teste E2E de set/leitura do cookie `mm-tenant` atravessando a proxy no fluxo `/sicredi/mentormatch -> register -> dashboard`.
