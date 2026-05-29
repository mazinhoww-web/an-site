# MentorMatch — Blueprint de Reconstrução

> Engenharia reversa do app MentorMatch (snapshot `mentormatch-main.zip`, 163 arquivos) com a camada **corrigida**: separa comportamento **intencional** de **defeito**, mapeia para a stack alvo (an-site) e entrega critérios de aceite.
> Toda afirmação é baseada em evidência do código. Hipóteses estão marcadas com **(HIPÓTESE)**.
> Documentos irmãos no repo: `MENTORMATCH-AUDITORIA.md` (defeitos) e `MENTORMATCH-QA-FIXES.md` (aceite).

Critério-mestre: *"Se o repositório fosse apagado agora, este doc permite reconstruir o sistema com o mesmo comportamento, banco, integrações, deploy e regras — corrigindo os defeitos conhecidos em vez de reproduzi-los."*

---

## 0. Como ler / fontes

- **Stack de origem:** Next.js 16 (App Router) + React 19 + TypeScript + Prisma 6 (PostgreSQL) + NextAuth v5 (Credentials + JWT) + Tailwind v4 + Vercel (Blob, Postgres) + Resend. `basePath: /mentormatch`.
- **Integração atual:** o app roda standalone num projeto Vercel próprio; o site `an-site` apenas proxia `/mentormatch/*` e `/sicredi/mentormatch/*` via rewrites.
- **Stack alvo (an-site), se "dentro de casa":** Next.js 14 App Router + React 18 + Drizzle (Postgres/Neon) + Auth.js v5 + Tailwind v3 + Resend + Vercel Blob/KV.

---

## 1. Visão executiva

**O que é:** plataforma **white-label multi-tenant de mentoria**. Conecta mentores a mentorados dentro de organizações (tenants), com biblioteca de materiais, notificações, painel admin por tenant e um painel central de super admin para gerir tenants.

**Problema que resolve:** estruturar programas de mentoria corporativa (matching, agenda, materiais, governança) sob a marca de cada cliente, sem reescrever o app por cliente.

**Usuários (papéis):** `SUPER_ADMIN` (plataforma), `ADMIN` (um tenant), `MENTOR`, `MENTEE`.

**Proposta de valor:** "programa de mentoria branded em minutos" — um app, N tenants, tema/branding por tenant via tokens.

**Módulos centrais:** Multi-tenancy & tema; Auth & onboarding; Matching/Conexões; Biblioteca; Notificações; Admin de tenant; Super-admin; (Billing — presente, **inativo**).

**Fluxo principal:** landing (genérica ou branded) → registro → seleção de perfil → onboarding → dashboard do papel dentro do tenant.

---

## 2. Arquitetura

### Frontend
- **Framework:** Next.js App Router, Server Components por padrão; `"use client"` nos dashboards interativos e forms.
- **Roteamento:** grupos `(auth)` (fluxo de entrada) e `(dashboard)` (área logada sob `/t/[slug]`); rotas top-level `/admin` (super), `/dashboard` (alias de redirecionamento), `/sicredi` (landing branded), `/` (landing genérica).
- **Estado:** sem store global; `useState`/`useEffect` por página + `useSession` (NextAuth) + `TenantContext` (provider) para o slug ativo. Hooks: `useTenantRouter`, `useCurrentUser`, `useNotifications`.
- **Theming:** CSS variables (`--primary`, `--background`, etc.) resolvidas por `theme-engine`/`theme-parser`/`design-tokens` a partir do `themeKey`/`tokens` do tenant; classe `theme-<key>` no root. Temas em `src/styles/themes/*.css` (`base`, `dark`, `sicredi`).
- **Navegação:** `pushTenant` (full-page via `window.location.assign`, prefixa `basePath`) e `<Link>`/`router.push` (soft, basePath automático).

### Backend
- **API Routes** (`src/app/api/**`) para REST/CRUD (mentors, skills, library, connections, notifications, waitlist, invitations, admin/*, users/me, upload, auth/*).
- **Server Actions** (`src/app/actions/**` e `app/admin/actions.ts`) para mutações de UI (onboarding, profile, connections, requests, library, notifications, cookie de tenant, CRUD de tenant do super admin).
- **Camadas:** `lib/` concentra auth, db (Prisma singleton), tenant (queries cacheadas), helpers de roteamento, theme, email, validações Zod, feature flags.
- **Sem** filas/jobs/workers. E-mail é fire-and-forget via Resend.

---

## 3. Stack atual + mapeamento para a stack alvo (an-site)

| Aspecto | Origem (MentorMatch) | Alvo (an-site) | Ação de port |
|---|---|---|---|
| Framework | Next 16 / React 19 | Next 14 / React 18 | Ajustar APIs Next 16-only; `params` como Promise já é compatível |
| ORM | Prisma 6 | Drizzle | Reescrever schema (ver §5) e todas as queries `db.x.find/create/update` para Drizzle |
| Tabelas | prefixo `mm_` | manter prefixo `mm_` | Evita colidir com tabelas do an-site (`user`, `account`, `session` já existem) |
| Auth | NextAuth credentials + JWT, cookies `mm.*` | Auth.js v5 (an-site usa magic link no `/admin`) | **2º contexto de auth** isolado, credentials+JWT, cookies `mm.*`, escopo `/mentormatch` |
| Senhas | `bcryptjs` | manter `bcryptjs` (ou `node:crypto` scrypt) | Adicionar dep ou usar crypto nativo |
| Estilo | Tailwind v4 + CSS vars inline | Tailwind v3 + tokens | Mapear `--primary/--background/...` para tokens `mm-*`; tema por classe |
| basePath | `/mentormatch` | grupo de rota `/mentormatch` (sem basePath) | Trocar fetches `'/mentormatch/api/...'` por `'/mentormatch/api/...'` relativo ao grupo; revisar `pushTenant` |
| Storage | Vercel Blob | Vercel Blob (an-site já usa) | Reuso direto |
| Email | Resend | Resend (an-site já usa) | Reuso direto |
| Hospedagem | projeto Vercel próprio + proxy | rotas nativas no an-site OU subpasta | Decisão pendente (port vs vendor) |

---

## 4. Modelo de domínio (entidades)

| Entidade | Finalidade | Campos-chave | Relações | Estados |
|---|---|---|---|---|
| **Tenant** | Organização white-label | slug(unique), name, brandColor, secondaryColor, logoUrl, domain(unique), active, themeKey, themeCssUrl, tokens, maxUsers/Connections/LibraryItems, planId | users, connections, libraryItems, invitations, notifications, subscription, plan | active true/false |
| **User** | Pessoa em um tenant | email, password(hash), name, role(Role?), status(UserStatus), bio/headline/position/department/education/experience/linkedin/whatsapp, maxMentees, onboardingDone, tenantId | tenant, skills, conexões (mentor/mentee), notifications, libraryItems, invitationsSent | status PENDING→APPROVED/REJECTED/SUSPENDED; role null→MENTOR/MENTEE/ADMIN |
| **Skill** | Habilidade (catálogo global) | name(unique), category, usageCount, isActive | users(UserSkill) | isActive |
| **UserSkill** | Skill de um usuário | userId, skillId, **isTeaching** | user, skill | ensino vs aprendizado (coexistem) |
| **Connection** | Relação mentor↔mentee | mentorId, menteeId, tenantId, status, message, startedAt, endedAt | mentor, mentee, tenant | ver §7 (state machine) |
| **WaitlistEntry** | Fila p/ mentor lotado | mentorId, menteeId, position | mentor, mentee | posição na fila |
| **LibraryItem** | Material | title, description, fileUrl, fileType(PDF/VIDEO/ARTICLE/OTHER), fileSize, tenantId, uploadedById | tenant, uploadedBy | — |
| **Invitation** | Convite p/ entrar no tenant | email, tenantId, role, token(unique), used, expiresAt, invitedById, type | tenant, invitedBy | criado→usado/expirado |
| **Notification** | Aviso ao usuário | userId, tenantId, type(NotificationType), title, message, read, metadata(Json) | user, tenant | read true/false |
| **Plan** | Plano comercial | slug(unique), priceMonthly/Yearly, maxUsers/Connections/LibraryItems/Admins, features(Json), active | tenants, subscriptions | active |
| **Subscription** | Assinatura do tenant | tenantId(unique), planId, active, start/endDate | tenant, plan, invoices | active |
| **Invoice** | Fatura | subscriptionId, amount, currency(BRL), status, paidAt | subscription | paid (default) |
| **Usage** | Métrica de uso | tenantId, metric, value, period (unique trio) | — | — |
| **Account/Session/VerificationToken** | NextAuth | padrão adapter | user | — |

**Enums:** `Role`, `UserStatus`, `ConnectionStatus`, `FileType`, `NotificationType`.

---

## 5. Banco de dados

- **SGBD:** PostgreSQL (Vercel Postgres/Neon). **ORM:** Prisma → (alvo) Drizzle.
- **Multi-tenancy:** *shared schema, discriminator column* — `tenantId` em User, Connection, LibraryItem, Invitation, Notification, Usage; `Subscription.tenantId` unique. **Sem RLS no banco**; o isolamento é **na aplicação** (filtros por tenantId nas queries/guards). **(RISCO)** Reconstruir mantendo o filtro por tenant em TODA query, ou adotar RLS no alvo.
- **Unicidade-chave:** `User @@unique([email, tenantId])` — o mesmo e-mail pode existir em tenants diferentes; e-mail **não** é global. `Skill.name` é global (único). `Connection @@unique([mentorId, menteeId, status])`.
- **Índices:** User(tenantId; role,tenantId; status,tenantId); Connection(mentorId,status; menteeId; tenantId); Skill(usageCount; category); Notification(userId,read; tenantId).
- **Tabelas (prefixo `mm_`):** tenant, account, session, verification_token, user, skill, user_skill, connection, waitlist_entry, library_item, invitation, notification, plan, subscription, invoice, usage.
- **Sem** triggers/views/procedures/functions no schema.

### ER (resumo)
`Plan 1—N Tenant 1—N User`; `User N—N Skill (UserSkill, isTeaching)`; `Connection N:1 mentor(User) / N:1 mentee(User) / N:1 Tenant`; `WaitlistEntry mentor/mentee`; `LibraryItem N:1 Tenant/Uploader`; `Invitation N:1 Tenant`; `Notification N:1 User/Tenant`; `Subscription 1:1 Tenant, N:1 Plan, 1:N Invoice`.

---

## 6. Seed / fixtures OBRIGATÓRIOS (sem isto o sistema não sobe)

1. **Planos:** free, starter, pro, enterprise (limites/preços conforme `prisma/seed.ts`).
2. **Skills:** 20 skills com categorias (Technology, Design, Management, Marketing, Career).
3. **Tenant `default`** ("MentorMatch Demo", brandColor `#6366f1`, plano free).
4. **Tenant `sicredi`** ("MentorMatch Sicredi", brandColor `#33820D`, `themeKey: "sicredi"`, fontes Exo 2 + Nunito) — *ausente no seed original; correção P0.2.*
5. **Super Admin** `espindolanogueira@yahoo.com.br` / `Facil022@` (`role SUPER_ADMIN`, `status APPROVED`, `onboardingDone true`) — *ausente no seed original; correção P0.2.*
6. (Opcional) admin de tenant `admin@mentormatch.com` / `admin123`.

---

## 7. Máquinas de estado

**Connection** `ConnectionStatus`:
```
(mentee solicita) -> PENDING
PENDING -> ACCEPTED   (mentor aceita; set startedAt)
PENDING -> REJECTED   (mentor recusa)
PENDING|ACCEPTED -> CANCELLED (qualquer parte cancela)
ACCEPTED -> COMPLETED (encerrada; set endedAt)
```
**User.status:** `PENDING` (auto-registro) → `APPROVED` (após onboarding/convite) | `REJECTED` | `SUSPENDED` (admin).
**User.role:** `null` (recém-registrado) → `MENTOR`|`MENTEE` (onboarding) | `ADMIN`/`SUPER_ADMIN` (seed/convite). Troca MENTOR↔MENTEE permitida pós-onboarding (skills coexistem via `isTeaching`).
**Invitation:** criado → `used=true` (consumido no registro) | expirado (`expiresAt`).
**Onboarding:** `onboardingDone=false` → seleção de perfil → form mentor/mentee → `complete-profile` grava role+**tenantId**+`onboardingDone=true`.

---

## 8. Autenticação & Autorização

- **Provedor:** NextAuth v5, **Credentials** (email+senha, `bcrypt.compare`), estratégia **JWT**. `basePath: /api/auth`.
- **Cookies (prefixo `mm.`):** `mm.session-token` (httpOnly), `mm.callback-url`, `mm.csrf-token`. *(Isola do an-site admin.)*
- **Claims no JWT** (callback `jwt`): `role`, `status`, `tenantId`, `tenantSlug`, `onboardingDone` — populados no sign-in e em `trigger:"update"`.
- **Registro:** `POST /api/auth/register` — valida convite (se houver), cria User (`PENDING`, role/tenant do convite se houver), hash bcrypt(10), envia welcome email. Erro de e-mail duplicado → 409.
- **Reset de senha:** `forgot-password` cria `VerificationToken` (1h) e envia link Resend; `reset-password` valida token e troca a senha.
- **Autorização:** guards em **layouts server** (`auth()`), por papel e por tenant. **Regra de ouro (corrigida): ler papel/tenant do BANCO, não do JWT**, porque o JWT fica defasado logo após onboarding (causou o loop `ERR_TOO_MANY_REDIRECTS`).
- **Magic link / OAuth / SSO / MFA:** **não implementados** (flag `ENABLE_MAGIC_LINK` existe mas o handler é placeholder).

---

## 9. Tabela de decisão de roteamento pós-login (CORE — origem dos bugs)

Helpers: `getDashboardHref(role, tenantSlug, onboardingDone)` e `resolvePostLoginHref(userId)` (lê DB + cookie `mm-tenant`). Devem **concordar** e ler a **mesma fonte (banco)**.

| role | tenant | onboardingDone | Destino |
|---|---|---|---|
| SUPER_ADMIN | — | — | `/admin` |
| null | — | — | `/select-profile` |
| MENTOR/MENTEE | null | — | `/select-profile` → (corrigir: atribuir tenant no onboarding, P0.1) |
| MENTOR | set | false | `/onboarding/mentor` |
| MENTEE | set | false | `/onboarding/mentee` |
| ADMIN | set | true | `/t/{slug}/admin/users` |
| MENTOR | set | true | `/t/{slug}/mentor` |
| MENTEE | set | true | `/t/{slug}/mentee` |

**Guarda de tenant-ownership** (`/t/[slug]` dashboard): se `role≠SUPER_ADMIN` e `tenantSlug(DB)≠slug` → redireciona ao próprio dashboard. **Guarda de papel-rota:** MENTEE em `/mentor` → `/mentee` e vice-versa (ler do DB).

---

## 10. Fluxos funcionais

- **Registro→Dashboard (principal):** landing → `/register` (signIn automático) → `/select-profile` → `/onboarding/{mentor|mentee}` (grava role+tenant+skills) → `/welcome` (texto por papel) → `/dashboard` (alias) → `resolvePostLoginHref` → `/t/{slug}/{mentor|mentee}`.
- **Login retorno:** `/login` → signIn → `/dashboard` → dashboard do papel (sem repassar select-profile/onboarding).
- **Tenant branded (Sicredi):** `/sicredi` (landing) seta cookie `mm-tenant=sicredi` (middleware) → fluxo de auth na rota genérica, tenant via cookie.
- **Matching:** mentee em `/t/{slug}/mentors` → detalhe → solicita conexão (`message`) → mentor em `/requests` aceita/recusa → conexão `ACCEPTED`; mentor lotado → `WaitlistEntry`.
- **Biblioteca:** upload (Vercel Blob) → `LibraryItem` por tenant → listagem/detalhe.
- **Notificações:** geradas em eventos de conexão/material/aprovação; marcar lido.
- **Admin tenant:** users (aprovar/convidar), skills, library, reports (export CSV), settings (nome/cor/logo) — *settings precisa da rota de API ausente, P1/rotas.*
- **Super admin (`/admin`):** lista tenants + stats, cria tenant (slug, brandColor, design.md opcional no Blob), ativa/desativa.
- **Fluxos de erro:** credenciais inválidas, e-mail duplicado (com CTA login), convite inválido/expirado/usado, token de reset inválido/expirado, tenant inexistente/inativo (notFound/redirect).

---

## 11. APIs e contratos (REST sob `/mentormatch/api`)

> Todas exigem sessão salvo indicado. Erros: 400 (validação Zod), 401 (sem sessão), 403 (papel/tenant), 404, 409 (duplicado), 500.

| Endpoint | Método | Entrada | Saída / efeito | Auth |
|---|---|---|---|---|
| `/api/auth/[...nextauth]` | * | NextAuth | sessão/JWT, `/session` | público |
| `/api/auth/register` | POST | name,email,password,invitationToken? | cria User; 409 se existe | público |
| `/api/auth/forgot-password` | POST | email | cria token + email (sempre 200) | público |
| `/api/auth/reset-password` | POST | token,password | troca senha | público |
| `/api/auth/complete-profile` | POST | role,name,headline,bio,...,whatsapp,skills[] | grava perfil+role+**tenant**+skills+onboardingDone | sessão |
| `/api/users/me` | GET/PATCH | (PATCH: campos perfil, role?) | usuário; troca de papel | sessão |
| `/api/mentors` | GET | tenantId, filtros | lista mentores | sessão |
| `/api/connections` | GET/POST/PATCH | status? / mentorId,message / id,status | CRUD conexões | sessão |
| `/api/waitlist` | GET/POST | — / mentorId | fila | sessão |
| `/api/library` | GET/POST/DELETE | tenantId / item / id | materiais | sessão |
| `/api/skills` | GET/POST/PATCH/DELETE | tenantId / name / id | catálogo (admin) | admin |
| `/api/notifications` | GET/PATCH | — / id|all read | notificações | sessão |
| `/api/invitations` `[/token]` | GET/POST/PATCH | email,role / token | convites | admin/público(token) |
| `/api/upload` | POST | FormData(file) | `{url}` Vercel Blob | sessão |
| `/api/tenant/clear` | POST | — | apaga cookie `mm-tenant` | sessão |
| `/api/admin/users` | GET/POST/PATCH | — | usuários do tenant | admin |
| `/api/admin/export` | GET | type=users | CSV | admin |
| `/api/admin/reports` | GET | — | métricas | admin |
| `/api/admin/settings` | GET/PATCH | slug / name,brandColor,logo | **AUSENTE no original** — criar (correção rotas) | admin |

**Server Actions:** `completeOnboarding`, profile, connections, requests, library, notifications, `setTenantCookie/clear/get`, `createTenant/setTenantActive/deleteTenant`(super admin, com `requireSuperAdmin`).

---

## 12. Integrações externas

| Serviço | Uso | Dependência | Falhas possíveis |
|---|---|---|---|
| **Vercel Postgres (Neon)** | persistência | crítica | indisponibilidade = app down |
| **Vercel Blob** | upload de logo/materiais (`/api/upload`, design.md de tenant) | alta | upload falha → feature degrada |
| **Resend** | welcome email, reset de senha | média | sem `RESEND_API_KEY` → e-mails não saem (reset trava silencioso) |
| **NextAuth** | sessão/JWT | crítica | secret errado → ninguém loga |
| Stripe | billing | **não usado** (flag off) | — |

---

## 13. Infraestrutura, Vercel e proxy (an-site)

- **Origem:** projeto Vercel próprio, framework Next, `basePath:/mentormatch`. Sem `vercel.json` (settings via dashboard). Sem CI/Actions/Docker/cron no repo.
- **Proxy (an-site `next.config.js`):** `beforeFiles` rewrites — `/mentormatch(/*)` → `${MENTORMATCH_URL}/mentormatch(/*)`; `/sicredi/mentormatch` → `.../mentormatch/sicredi` (landing); `/sicredi/mentormatch/:path*` → `.../mentormatch/:path*` (resto no app genérico, tenant via cookie).
- **Modelo de hospedagem (decisão p/ "dentro de casa"):**
  - **(A) Port nativo:** rotas `/mentormatch/**` dentro do an-site, sem proxy, sem basePath, Drizzle/Tailwind3/Auth.js — 2º contexto de auth isolado.
  - **(B) Vendor subpasta:** app mantido como está, em subpasta, 2 projetos Vercel, proxy mantido.
- **DNS/domínio:** `aurimarnogueira.com.br` (an-site) é o canônico; MentorMatch servido sob `/mentormatch`.

---

## 14. Variáveis de ambiente

| Var | Função | Obrigatória |
|---|---|---|
| `DATABASE_URL` / `POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING` | Postgres (pooled/non-pooled) | sim |
| `NEXTAUTH_URL` / `AUTH_URL` | base URL do app (NÃO incluir `/mentormatch` p/ não duplicar — correção P2.1) | sim |
| `NEXTAUTH_SECRET` / `AUTH_SECRET` | assinatura JWT (≥32 chars) | sim |
| `RESEND_API_KEY` | e-mail | sim (prod) |
| `EMAIL_FROM` / `RESEND_FROM` | remetente | sim (prod) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob | sim (upload) |
| `APP_URL` / `NEXT_PUBLIC_APP_URL` | URLs públicas | sim |
| `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` | admin inicial (seed) | recomendada |
| `ENABLE_MAGIC_LINK` / `ENABLE_PUBLIC_REGISTRATION` / `ENABLE_BILLING` / `ENABLE_PUSH_NOTIFICATIONS` | feature flags | opcional |
| `MENTORMATCH_URL` (no **an-site**) | destino do proxy | sim (se proxy) |

Nunca expor segredos ao client. No alvo an-site, segregar de `POSTGRES_URL`/`AUTH_SECRET` existentes.

---

## 15. Feature flags (`lib/feature-flags.ts`)
`magicLink` (default off), `publicRegistration` (default **on**), `billing` (default off), `pushNotifications` (default off). Mudam comportamento de registro/login/billing.

---

## 16. Observabilidade
- **Logs:** `console.error` com tags (`[REGISTER_ERROR]`, `[COMPLETE_PROFILE_ERROR]`, etc.). Sem Sentry/tracing/métricas/alertas. **(RISCO)** Adicionar error tracking no alvo.

---

## 17. DEFEITOS CONHECIDOS — atual vs. intencional (LER ANTES DE RECONSTRUIR)

> Reconstrua o **intencional**, não o atual. Detalhe em `MENTORMATCH-AUDITORIA.md`.

| # | Atual (bug) | Intencional (reconstruir assim) |
|---|---|---|
| P0.1 | `complete-profile` não grava `tenantId` → usuário preso em `/select-profile` | gravar `tenantId` do cookie `mm-tenant` (fallback `default`) + `status APPROVED` |
| P0.2 | seed sem `sicredi` e sem SUPER_ADMIN | seed cria ambos |
| LOOP | guarda do dashboard confia no **JWT** (defasado pós-onboarding) → diverge do `select-profile` → `ERR_TOO_MANY_REDIRECTS` | guardas leem **DB** (fonte única) |
| P1.1 | sem checagem de tenant-ownership / papel-rota | guards por tenant e por papel (no DB) |
| P1.3 | middleware só checa presença do cookie; `select-profile`/`onboarding` públicos | exigir sessão; idealmente validar JWT |
| P2.1 | reset URL pode duplicar `/mentormatch` | normalizar base URL |
| ROTA | `/api/admin/settings` não existe → settings 404 | criar GET/PATCH com guard |
| ONBOARDING | dois fluxos (`/onboarding/setup` wizard vs `mentor|mentee`); wizard finaliza em `/` (apaga cookie de tenant) | um único fluxo `mentor|mentee`; remover wizard |

---

## 18. Código ativo vs. morto (NÃO reconstruir o morto)
- **Morto/legado:** `/onboarding/setup` + `OnboardingWizard`; `components/dashboard/BottomNav.tsx` (duplicado de `layout/bottom-nav.tsx`).
- **Presente porém inativo (flag off):** Billing — `Plan`/`Subscription`/`Invoice`/`Usage`. Reconstruir só o schema; UI/fluxo só se `ENABLE_BILLING`.

---

## 19. Dependências críticas (impacto se remover)
- **Postgres** → app não sobe. **Seed** → sem tenants/admin, fluxos quebram. **NextAuth secret/cookies `mm.*`** → sem login/sessão. **`tenantId` no User + filtros por tenant** → vazamento entre tenants. **Helpers de roteamento (DB)** → loops/redirecionamento errado. **Vercel Blob** → sem upload. **Resend** → sem e-mails transacionais.

---

## 20. Riscos
- Isolamento multi-tenant **só na aplicação** (sem RLS) — risco de vazamento se uma query esquecer `tenantId`.
- Sincronização JWT × DB (origem do loop) — preferir sempre DB nas decisões de acesso.
- `pushTenant` descarta o slug (URL branded só na landing) — decisão de produto.
- Skills globais entre tenants — pode conflitar com isolamento.
- E-mail dependente de config Resend; reset falha silencioso sem ele.
- Dois Next apps com stacks diferentes (se vendor) ou port grande (se nativo).

---

## 21. Critérios de aceitação E2E
Usar `MENTORMATCH-QA-FIXES.md` como suíte (18 fixes). Mínimo verificável:
1. Register (sicredi) → onboarding mentor → `/t/sicredi/mentor` **sem loop**.
2. Login retorno vai direto ao dashboard (sem select-profile).
3. Super admin → `/admin` lista `default`+`sicredi`; cria/desativa tenant.
4. MENTEE não acessa `/mentor`; usuário do tenant A não acessa tenant B.
5. Admin settings carrega e salva (nome/cor/logo).
6. Reset de senha entrega link e troca a senha.
7. Tema sicredi (verde/Exo2/Nunito) no fluxo logado.

---

## 22. Blueprint universal (tech-agnostic)
1. **Arquitetura:** app web multi-tenant, server-rendered, com camada de dados relacional, auth por credenciais+token de sessão assinado, storage de arquivos, e-mail transacional.
2. **Domínio:** Tenant 1:N User(role/status) ; User N:N Skill(ensino/aprendizado) ; Connection(mentor↔mentee, máquina de estados) ; Library/Notification/Invitation por tenant ; Billing opcional.
3. **Banco:** relacional, discriminador `tenant_id` em toda tabela de negócio + isolamento garantido (app ou RLS); unicidade `email+tenant`; índices por tenant/role/status.
4. **APIs:** CRUD por recurso, todas autenticadas e filtradas por tenant; contrato de erro padronizado.
5. **Fluxos:** entrada (registro→perfil→onboarding→dashboard) decidida por tabela (role×tenant×onboarding) com fonte de verdade única; matching com fila; biblioteca; notificações.
6. **Infra:** um app servindo N tenants; branding por tokens; segredos em env; storage e e-mail como serviços externos.
7. **Deploy:** build do app + migração de schema + **seed obrigatório** + env configuradas + domínio.

---

## 23. PROMPT MESTRE DE RECONSTRUÇÃO (para outra IA)

> Reconstrua uma plataforma web **multi-tenant white-label de mentoria** chamada MentorMatch, servida sob o caminho `/mentormatch`.
>
> **Papéis:** SUPER_ADMIN (plataforma), ADMIN (um tenant), MENTOR, MENTEE.
>
> **Domínio (entidades, prefixo de tabela `mm_`):** Tenant(slug único, name, brandColor, secondaryColor, logoUrl, domain único, active, themeKey, tokens, limites, planId); User(email, passwordHash, name, role nullable[SUPER_ADMIN|ADMIN|MENTOR|MENTEE], status[PENDING|APPROVED|REJECTED|SUSPENDED], perfil[bio,headline,position,department,education,experience,linkedin,whatsapp], maxMentees, onboardingDone, tenantId; **único por (email,tenantId)**); Skill(name único global, category, isActive); UserSkill(userId,skillId,isTeaching); Connection(mentorId,menteeId,tenantId,status[PENDING|ACCEPTED|REJECTED|CANCELLED|COMPLETED],message,startedAt,endedAt; único (mentorId,menteeId,status)); WaitlistEntry(mentorId,menteeId,position); LibraryItem(title,description,fileUrl,fileType[PDF|VIDEO|ARTICLE|OTHER],tenantId,uploadedById); Invitation(email,tenantId,role,token único,used,expiresAt); Notification(userId,tenantId,type,title,message,read,metadata); Plan/Subscription/Invoice/Usage (billing, opcional/atrás de flag); tabelas de sessão/conta/token de verificação para o auth.
>
> **Banco:** PostgreSQL; isolamento multi-tenant por `tenantId` em TODA query (ou RLS); índices por tenant/role/status. **Seed obrigatório:** planos (free/starter/pro/enterprise), 20 skills categorizadas, tenant `default`, tenant `sicredi` (brandColor #33820D, themeKey "sicredi", Exo 2 + Nunito), e um SUPER_ADMIN.
>
> **Auth:** credenciais (email+senha com bcrypt) + sessão JWT assinada, cookies com prefixo `mm.`; claims role/status/tenantId/tenantSlug/onboardingDone; registro com convite opcional (409 se e-mail já existe no tenant); reset de senha por token (1h) via e-mail; **sem** OAuth/SSO/MFA. **Decisões de acesso SEMPRE lendo o banco, nunca o JWT** (evita loop pós-onboarding).
>
> **Roteamento pós-login (tabela de decisão única):** SUPER_ADMIN→/admin; role null ou tenant null→/select-profile; onboarding incompleto→/onboarding/{mentor|mentee}; completo→/t/{slug}/{admin/users|mentor|mentee}. Guarda de tenant-ownership (não acessar tenant alheio, SUPER_ADMIN isento) e de papel-rota (mentee↔mentor), ambas lendo o banco.
>
> **Fluxos:** registro→seleção de perfil→onboarding (grava role+tenant[do cookie mm-tenant, fallback default]+skills+onboardingDone)→welcome→dashboard; matching mentee→mentor com solicitação/aceite e fila; biblioteca com upload; notificações por evento; admin de tenant (usuários, skills, biblioteca, relatórios/export, **settings: nome/cor/logo**); super admin (lista/cria/desativa tenants, stats). Tenant branded por landing que seta cookie `mm-tenant`.
>
> **Integrações:** Postgres, storage de arquivos (logo/materiais), e-mail transacional (welcome + reset). Billing inativo por padrão.
>
> **Infra/deploy:** um app, N tenants, branding por tokens/CSS-vars (classe de tema por tenant); env para DB/secret/email/storage; migração + seed + domínio. Servir sob `/mentormatch`.
>
> **Não implemente:** o segundo fluxo de onboarding (wizard `/onboarding/setup`), bottom-nav duplicado, nem reproduza os defeitos: tenant não atribuído no onboarding, guarda baseada em JWT (loop), rota de settings ausente, URL de reset duplicando o path.
>
> **Aceite:** registrar no tenant sicredi, completar onboarding e cair no dashboard sem loop; login de retorno direto ao dashboard; super admin gerencia tenants; isolamento entre tenants e entre papéis; settings de tenant salva; reset de senha funciona.

---

*Fim do blueprint. Próximo passo (quando decidir): escolher Port nativo (A) ou Vendor subpasta (B) e iniciar a reconstrução no an-site usando este doc + a suíte de aceite.*
