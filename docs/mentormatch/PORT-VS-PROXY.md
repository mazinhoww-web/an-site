# MentorMatch no an-site — Fronteira Port vs Proxy

Documento de decisao para o modelo **hibrido**. Define, por feature, o que e
reconstruido nativamente no an-site (**port**, stack Drizzle + Auth.js v5) e o
que continua servido pelo app standalone via rewrite (**proxy**).

Status: aguardando decisao por linha (coluna "Sua escolha").

---

## Estado atual (fatos)

1. **Proxy ja ativo.** `next.config.js` faz rewrite de `/mentormatch/*` e
   `/sicredi/mentormatch/*` para o app standalone (`MENTORMATCH_URL`,
   default `https://mentormatch-five.vercel.app`, que roda com `basePath:/mentormatch`).
   Hoje o app inteiro — landing, auth, onboarding, dashboards, admin, tenant
   `/t/:slug/*`, api — ja resolve por proxy. O tenant ativo viaja no cookie
   `mm-tenant`, nao na URL.
2. **PR #1 (merged)** estabeleceu esse caminho: "stacks incompativeis, a
   arquitetura correta e proxy, nao port".
3. **PR #16 (este)** portou a **fundacao** para o an-site: theme system
   (`.theme-dark` / `.theme-sicredi`) e componentes transversais (skeleton,
   toast, modal, empty-state). Codigo stack-neutro, **ainda nao plugado em
   nenhuma rota** — baixo arrependimento, reaproveitavel nos dois caminhos.

---

## Principio de fronteira proposto: a parede de autenticacao

> **Publico / marketing -> port.  Aplicacao autenticada / stateful -> proxy.**

Racional:
- **Port faz sentido** onde a superficie e UI dirigida por tokens, com pouco ou
  nenhum estado de servidor, e onde o an-site ganha em SEO, performance e marca
  proprios (landing, selecao de papel visual, paginas estaticas). Reaproveita a
  fundacao do PR #16 direto.
- **Proxy faz sentido** onde existe modelo de dados, RBAC, sessao e multi-tenant
  (dashboards, solicitacoes, conexoes, biblioteca, perfil, notificacoes, admin).
  Portar isso exige recriar no Drizzle todo o schema (organizations, users,
  mentorships, sessions, materials, notifications, connectionRequests, reviews),
  reescrever cada Server Action, e reconstruir auth/middleware no Auth.js v5 —
  trabalho grande, sem reaproveitamento, duplicando o que o app standalone ja faz.

---

## Grade de decisao por feature

| # | Feature | Proxy hoje? | Estado de servidor | Reaproveita fundacao PR#16? | Custo de port | Recomendacao | Sua escolha |
|---|---|---|---|---|---|---|---|
| 1 | Landing generica (`/mentormatch`) | Sim | Nenhum | Sim (total) | Baixo | **Port** (marca/SEO an-site) | ☐ port ☐ proxy |
| 2 | Landing Sicredi (`/sicredi/mentormatch`) | Sim | Nenhum | Sim (total) | Baixo | **Port** | ☐ port ☐ proxy |
| 3 | Role selector (UI) | Sim | Grava role na sessao | Parcial (UI sim, submit nao) | Medio | **Proxy** (submit depende de auth) | ☐ port ☐ proxy |
| 4 | Onboarding wizard | Sim | Grava perfil/disponibilidade | Parcial | Medio-alto | **Proxy** | ☐ port ☐ proxy |
| 5 | Dashboard (mentor/mentee) | Sim | Alto (queries + sessao) | So chrome visual | Alto | **Proxy** | ☐ port ☐ proxy |
| 6 | Solicitacoes (kanban) | Sim | Alto | So UI dos cards | Alto | **Proxy** | ☐ port ☐ proxy |
| 7 | Minhas conexoes | Sim | Alto | So UI dos cards | Alto | **Proxy** | ☐ port ☐ proxy |
| 8 | Biblioteca + upload | Sim | Alto (Blob + DB) | So UI dos cards | Alto | **Proxy** | ☐ port ☐ proxy |
| 9 | Meu perfil | Sim | Alto | So UI | Alto | **Proxy** | ☐ port ☐ proxy |
| 10 | Notificacoes | Sim | Alto | So UI | Alto | **Proxy** | ☐ port ☐ proxy |
| 11 | Mentor drawer | Sim | Medio (envia request) | So UI | Medio-alto | **Proxy** | ☐ port ☐ proxy |
| 12 | Admin do tenant | Sim | Alto (RBAC + branding + convites) | So UI | Alto | **Proxy** | ☐ port ☐ proxy |
| 13 | Admin geral (super) | Sim | Alto (CRUD tenants + provision) | So UI | Alto | **Proxy** | ☐ port ☐ proxy |
| 14 | Auth / sessao / RBAC | Sim | Critico | Nao | Muito alto | **Proxy** | ☐ port ☐ proxy |
| 15 | DB / tabela organizations + modelos | Sim (no app standalone) | Critico | Nao | Muito alto | **Proxy** | ☐ port ☐ proxy |
| 16 | Middleware / resolucao de tenant | Sim (cookie mm-tenant) | Critico | Nao | Alto | **Proxy** | ☐ port ☐ proxy |

---

## Recomendacao resumida

- **Port** apenas itens 1-2 (landings): reaproveitam 100% da fundacao do PR #16,
  ganham marca/SEO no an-site, e nao tocam auth nem DB. Baixo risco, alto retorno.
- **Proxy** itens 3-16: ja funcionam pelo standalone; portar significaria
  reconstruir schema + auth + RBAC + multi-tenant no Drizzle/Auth.js, sem
  reaproveitamento e duplicando o que ja roda. So vale se houver decisao
  estrategica de migrar o app inteiro para dentro do an-site (e ai vira projeto
  proprio, nao "feature por feature").
- A fundacao do PR #16 fica como **design system do MentorMatch dentro do
  an-site** — usada pelas landings portadas e pronta caso algum item stateful
  seja promovido a port no futuro.

---

## Se um item stateful for marcado "port" (checklist do custo real)

1. Modelar no Drizzle (`src/db/schema.ts`) as tabelas da feature + relacoes, e
   atualizar `DATABASE.md` + gerar migration (`pnpm db:generate`).
2. Sessao Auth.js v5 carregando `role`, `organizationId`, `onboardingDone`
   (estender `next-auth.d.ts` + callbacks em `src/lib/auth.ts`).
3. Server Actions em Drizzle (nao Prisma) com RBAC server-side.
4. Resolucao de tenant por path/cookie no `src/middleware.ts` sem quebrar as
   rotas existentes do an-site (`/admin` do site pessoal ja existe — risco de
   colisao com o `/admin` do MentorMatch).
5. Conviver com o proxy: a rota portada precisa **substituir** o rewrite
   correspondente no `next.config.js`, senao o proxy tem precedencia (`beforeFiles`).

> A colisao de `/admin` (an-site pessoal vs MentorMatch) e a precedencia do
> `beforeFiles` sao os dois pontos que tornam o port stateful arriscado sem um
> plano de namespacing de rotas dedicado.
