# CLAUDE.md — Contexto para Claude Code

Este arquivo eh lido automaticamente pelo Claude Code no inicio de cada sessao. Mantenha atualizado.

---

## Quem eh o owner

**Aurimar Nogueira** (mazinhoww-web no GitHub).

Comunicacao:
- Estilo "Aurimar PROF": objetivo, direto, contexto -> solucao -> acao.
- Vocabulario tecnico, frases curtas.
- ZERO emoticons. ZERO em-dashes. ZERO inicio com "Great" / "Otimo" / cumprimentos vazios.
- Listas quando necessario, nao por padrao.
- Bilingue PT/EN se solicitado, mas padrao eh PT.

---

## O que estamos construindo

Site pessoal **AN. — Aurimar Nogueira** com:
1. Paginas publicas (home, sobre, projetos, skills, notícias, contato)
2. Skills hub com email gate de download (modelo similar a SCIENT)
3. Pagina "Como Instalar" educativa
4. Painel admin para CRUD de tudo + disparo de newsletter
5. Newsletter com double opt-in via Resend

Tagline do projeto: **"Onde estrategia vira sistema."**
Descritor: **LOYALTY × FINTECH × INNOVATION** (com `×`, nunca `+` nem `&`).

---

## Stack

- **Framework:** Next.js 14 App Router + TypeScript estrito
- **Estilo:** Tailwind CSS + shadcn/ui
- **DB:** Vercel Postgres (Neon) + Drizzle ORM
- **Auth:** Auth.js v5 + Resend magic link
- **Storage:** Vercel Blob
- **Cache/KV:** Vercel KV
- **Feature flags:** Vercel Edge Config
- **Analytics:** Vercel Analytics + Vercel Speed Insights
- **Email:** Resend
- **Hosting:** Vercel
- **Forms:** React Hook Form + Zod

---

## Documentos de referencia (LEIA ANTES DE CODAR)

| Documento | Conteudo |
|---|---|
| `PROJECT.md` | Visao, objetivos, escopo v1, decisoes de arquitetura |
| `REQUIREMENTS.md` | Must-haves verificaveis por area (R1 a R14) |
| `ROADMAP.md` | Milestones, slices, tasks GSD2 |
| `DESIGN.md` | Design system completo (tokens, componentes, layouts) |
| `DATABASE.md` | Schema SQL completo + RLS + seeds |
| `.env.example` | Todas variaveis de ambiente |
| `PROMPTS.md` | Prompts copy/paste por sprint |
| `STITCH-PROMPTS.md` | Prompts para Google Stitch (mockups) |
| `ANALISE-COMPARATIVA.md` | Por que essa stack vs alternativas |

**Regra de ouro:** se algo nao esta nestes documentos, eh suspeito. Pergunte antes de inventar.

---

## Metodologia GSD2 (obrigatoria)

Trabalho **sempre** estruturado como Milestone > Slice > Task:

1. **Planning:** entender o slice, listar tasks com criterio de pronto.
2. **Build:** implementar uma task por commit.
3. **Review:** rodar lint, type-check, build local.
4. **Done:** task riscada no ROADMAP.md, commit com mensagem padrao.
5. **Release:** quando slice inteiro pronto, criar PR `feat(M{X}.{Y}): {nome}`.

Padrao de commit:
```
feat(M2.3): adiciona pagina /projetos com filtro por tag
fix(M3.2): corrige cookie do email gate em mobile Safari
chore(M1.4): atualiza schema Drizzle apos migration
docs(M1): atualiza README com instrucoes de seed
```

---

## Estrutura de pastas (alvo)

```
.
├── src/
│   ├── app/
│   │   ├── (public)/         # rotas publicas
│   │   │   ├── page.tsx       # home
│   │   │   ├── sobre/
│   │   │   ├── projetos/
│   │   │   ├── skills/
│   │   │   ├── noticias/
│   │   │   └── contato/
│   │   ├── admin/             # rotas protegidas
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   ├── projetos/
│   │   │   ├── skills/
│   │   │   ├── noticias/
│   │   │   ├── subscribers/
│   │   │   ├── mensagens/
│   │   │   └── newsletter/
│   │   ├── api/
│   │   │   ├── health/
│   │   │   └── unsubscribe/[token]/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── brand/             # Mark, PhotoFrame, Label, Hairline
│   │   ├── layout/            # Nav, Footer, Container
│   │   ├── ui/                # shadcn/ui customizados
│   │   ├── home/
│   │   ├── projects/
│   │   ├── skills/
│   │   └── admin/
│   ├── db/
│   │   ├── schema.ts
│   │   └── index.ts
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── resend/
│   │   ├── validators/        # schemas Zod
│   │   └── utils.ts
│   ├── server-actions/        # Server Actions agrupadas por dominio
│   │   ├── contacts.ts
│   │   ├── subscribers.ts
│   │   ├── downloads.ts
│   │   └── newsletter.ts
│   ├── types/
│   │   └── next-auth.d.ts
│   └── middleware.ts
├── drizzle/
├── public/
├── PROJECT.md
├── REQUIREMENTS.md
├── ROADMAP.md
├── DESIGN.md
├── DATABASE.md
├── PROMPTS.md
├── README.md
├── CLAUDE.md
├── ANALISE-COMPARATIVA.md
├── STITCH-PROMPTS.md
├── .env.example
└── package.json
```

---

## Regras de codigo

### TypeScript
- `strict: true`, `noUncheckedIndexedAccess: true`.
- ZERO `any`. Se inevitavel, comentar com `// HACK:` e justificativa.
- Componentes funcionais com nomes em PascalCase.
- Hooks em camelCase prefixados `use`.

### Estilizacao
- Apenas Tailwind. Sem CSS Modules, sem styled-components.
- Cores SEMPRE via tokens do `tailwind.config.ts` (definidos a partir do DESIGN.md). NUNCA hex hardcoded em componente.
- Fontes via `next/font/google` configuradas em `app/layout.tsx`.

### Server vs Client
- Server Component por padrao.
- `"use client"` apenas onde necessario (forms, interatividade JS, hooks de estado).
- Mutations via Server Actions, nao API Routes (exceto webhooks e unsubscribe).

### Data fetching
- Server Components leem direto do Drizzle client (db.select...).
- Client Components usam Server Actions ou SWR para revalidacao.

### Forms
- React Hook Form + Zod resolver.
- Schemas Zod em `lib/validators/` reutilizados client + server.
- Erros exibidos inline abaixo do input.

### Acessibilidade
- Toda interacao funciona com teclado.
- Imagens com `alt`.
- Forms com `<label>` associado.

### Performance
- `next/image` em TODAS imagens.
- `priority` apenas no LCP da pagina.
- Static generation onde possivel; ISR para conteudo dinamico (`revalidate: 60`).

---

## Comandos uteis

```bash
# desenvolvimento
pnpm dev

# build local
pnpm build

# type-check
pnpm type-check

# lint
pnpm lint

# Drizzle (DB migrations)
pnpm db:generate     # gera migration SQL a partir do schema.ts
pnpm db:migrate      # aplica migrations no Vercel Postgres
pnpm db:studio       # abre Drizzle Studio (GUI do banco)

# Vercel
vercel              # deploy preview
vercel --prod       # deploy prod (preferir via git push)
```

---

## Anti-padroes (NAO FAZER)

1. NAO usar `getServerSideProps` (estamos em App Router).
2. NAO criar API Route quando Server Action serve.
3. NAO expor `POSTGRES_URL` ou `AUTH_SECRET` ao client.
4. NAO hardcodar cores; usar tokens.
5. NAO inventar fontes; apenas Space Grotesk, Inter, JetBrains Mono.
6. NAO criar tabelas sem atualizar `DATABASE.md` e gerar migration.
7. NAO instalar libs sem justificar em commit.
8. NAO usar `useEffect` para fetch inicial (usar Server Component + `fetch`).
9. NAO commitar `.env.local`, nunca.
10. NAO usar emoji em UI ou texto de copy. NAO usar em-dash (`—`).

---

## Como continuar uma sessao quebrada

Se voce eh um Claude novo entrando neste projeto:

1. Leia este arquivo `CLAUDE.md` inteiro.
2. Leia `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md` em ordem.
3. Leia `DESIGN.md` e `DATABASE.md`.
4. Confira o STATE atual em `skills/context-skill/STATE.md` (se existir) para saber qual slice esta em andamento.
5. Liste tasks pendentes do slice atual com `grep -A 5 "Slice X.Y" ROADMAP.md`.
6. Pergunte ao Aurimar qual task atacar primeiro se nao estiver obvio.

NUNCA assuma estado. Sempre confirme antes de comecar mudanca grande.

---

## Decisoes ja travadas (NAO renegociar sem aprovacao)

| # | Decisao | Onde |
|---|---|---|
| 1 | Stack Next.js 14 + Vercel Postgres + Drizzle + Auth.js + Blob/KV + Resend | STACK-V5.md |
| 2 | App Router only, sem Pages Router | PROJECT.md secao 7 |
| 3 | Server Actions para mutations | PROJECT.md secao 7 |
| 4 | RBAC server-side em todas Server Actions | STACK-V5.md secao 3.2 |
| 5 | Email gate com cookie 30d | REQUIREMENTS.md R8.4-R8.5 |
| 6 | Admin via Auth.js magic link + allow-list ADMIN_EMAILS | STACK-V5.md secao 3.3 |
| 7 | Sem comentarios, sem likes em v1 | PROJECT.md secao 4.1 |
| 8 | LGPD: double opt-in, export, delete | REQUIREMENTS.md R13 |
| 9 | Tokens de cor/fonte do brand book AN. v1.0 | DESIGN.md secao 2 |
| 10 | Mark AN. em nav, footer, favicon, OG | REQUIREMENTS.md R1.3 |
