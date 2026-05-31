# MentorMatch — STATUS.md

> Documento de status para continuidade do projeto. Gerado a partir do código real em `main`
> (Fases 0–8). Legenda: ✅ concluído · ⚠️ parcial · ❌ pendente · 🚫 não se aplica ainda.

---

## SEÇÃO 1: RESUMO EXECUTIVO

- **Estado geral:** 8 de 16 fases concluídas (0–8). Faltam 9–15.
- **Backend de domínio:** ✅ completo (auth, onboarding, matching/fila/notificações, admin do tenant).
- **UI/Frontend:** ✅ até a área administrativa do tenant. Dashboards mentor/mentee, busca, confirmação,
  solicitações, notificações (sino+polling), e painel admin (users/skills/library/settings/reports/export/invitations).
- **Proxy:** ⚠️ **ainda ativo**. `next.config.js` reescreve `/mentormatch/*` e `/sicredi/mentormatch/*`
  para o app externo (`MENTORMATCH_URL`). As rotas nativas existem mas ficam **sombreadas** até a Fase 14.
- **O que falta:** Fase 9 (super admin), Fase 10 (theming + landing branded), Fase 11 (biblioteca/skills extras),
  Fase 12 (APIs complementares/`users/me`, `tenant/clear`), Fase 13 (landing pública), Fase 14 (remover proxy),
  Fase 15 (QA). Pendências menores: forgot/reset-password, avatar upload no onboarding.

---

## SEÇÃO 2: DECISÕES ARQUITETURAIS

| # | Decisão | Motivo | Arquivo |
|---|---|---|---|
| 1 | **Auth MM em instância Auth.js separada** (JWT + Credentials + bcrypt, cookies `mm.*`, basePath `/api/mentormatch/auth`) | Credentials exige `strategy:'jwt'`, incompatível com a sessão de banco + magic link do site. Usuários MM ≠ owner-admin | `src/lib/mentormatch/auth.ts` |
| 2 | **Nunca alterar a auth do site** | `/admin` do an-site usa Resend passwordless + DB sessions; intocado | `src/lib/auth.ts` (não tocado) |
| 3 | **PK `uuid().defaultRandom()`** (não serial) | Casar com o padrão de `src/db/schema.ts` | `src/lib/mentormatch/db/schema.ts` |
| 4 | **Tabelas `mm_` no mesmo banco**, schema mesclado no client | Coexistir com o an-site; habilita `db` único | `src/db/index.ts` (`{ ...schema, ...mmSchema }`) |
| 5 | **Rotas `t/[slug]/...` diretas** (não route group) | Um route group `(dashboard)` não recebe `params.slug`; a guarda de ownership precisa do slug | `src/app/mentormatch/t/[slug]/layout.tsx` |
| 6 | **Theming/tenant via cookie `mm-tenant`** resolve no onboarding (fallback `default`) | Landing branded só na Fase 10; cookie ainda não é setado neste repo | `src/lib/mentormatch/tenant.ts` |
| 7 | **Transação serializável + retry em `40001`** para matching/fila | Evitar furar capacidade / duplicar posição (D-09) | `src/lib/mentormatch/tx.ts` |
| 8 | **Leituras em RSC (Drizzle direto); mutações via fetch para APIs** | Padrão CLAUDE.md; mutações de domínio com caminho único (D-01/D-02) | páginas RSC + componentes client |
| 9 | **Guardas de layout aninhadas** (sessão → papel → admin), todas leem o banco | Anti-loop (D-16) e autz autoritativa (D-06) | `t/[slug]/layout.tsx`, `mentor|mentee|admin/layout.tsx`, `admin/layout.tsx` |
| 10 | **`/mentormatch/continue` como dispatcher único pós-auth** | Destino calculado server-side por `resolvePostLoginHref` (D-16) | `src/app/mentormatch/(auth)/continue/page.tsx` |
| 11 | **Capacidade usa `mmUser.maxMentees`** (não `mmTenant.maxMenteesPerMentor`) | R1 por usuário; settings (Fase 8) persiste o default do tenant, propagação a usuários fica para evolução | `connections/route.ts` |
| 12 | **Upload em Blob `access:'public'`** | Logo via next/image (host liberado) + materiais baixados direto | `src/app/api/mentormatch/upload/route.ts` |
| 13 | **E-mail Resend lazy/guarded (best-effort)** | Sem `RESEND_API_KEY` não instancia → não quebra build | `src/lib/mentormatch/email.ts` |
| 14 | **DELETE de skill em uso → soft-delete** (`isActive=false`) | Não quebrar `mm_user_skill` | `skills/route.ts` |
| 15 | **Tipos MM standalone + augmentação só de `@auth/core/jwt`** | Site já augmenta `Session.user` com `isAdmin` (não dá pra redeclarar `user`) | `src/types/mentormatch.ts` |

---

## SEÇÃO 3: INVENTÁRIO DE ARQUIVOS

### APIs (`src/app/api/mentormatch/...`)

| Arquivo | Métodos | O que faz | Fase |
|---|---|---|---|
| `auth/[...nextauth]/route.ts` | GET, POST | Handlers da instância Auth.js MM | 3 |
| `auth/register/route.ts` | POST | Registro; consome `invitationToken` (R11); D-05 | 5/8 |
| `auth/complete-profile/route.ts` | POST | Onboarding transacional (R12/R13) | 5 |
| `connections/route.ts` | GET, POST, PATCH | Matching/fila/notif (D-01/D-02; R1–R6,R10) | 6 |
| `waitlist/route.ts` | GET, PATCH, DELETE | Fila (R7/R8/R9) | 6 |
| `notifications/route.ts` | GET, PATCH | Notificações in-app (R20) | 6 |
| `mentors/route.ts` | GET | Busca de mentores (R21) | 7 |
| `upload/route.ts` | POST | Upload Blob público (10MB, allowlist) | 8 |
| `skills/route.ts` | GET, POST, PATCH, DELETE | Skills por tenant (D-03/D-04; R17) | 8 |
| `library/route.ts` | GET, POST, DELETE | Biblioteca (D-03; R16) | 8 |
| `admin/users/route.ts` | GET, PATCH | Listar/aprovar usuários (R14; D-07) | 8 |
| `admin/reports/route.ts` | GET | Métricas do tenant | 8 |
| `admin/export/route.ts` | GET | CSV users/connections/skills (BOM; R22) | 8 |
| `admin/settings/route.ts` | GET, PATCH | Settings; persiste maxMenteesPerMentor (D-08; R23) | 8 |
| `invitations/route.ts` | GET, POST, DELETE | Convites (R15) | 8 |
| `invitations/[token]/route.ts` | GET | Validação de convite | 8 |

### Páginas (`src/app/mentormatch/...`)

| Arquivo | Tipo | Renderiza | Guarda | Fase |
|---|---|---|---|---|
| `(auth)/layout.tsx` | RSC | `MmSessionProvider` (escopo auth) | — | 5 |
| `(auth)/login/page.tsx` | Client | Form login (signIn) | — | 5 |
| `(auth)/register/page.tsx` | Client | Form registro (+`?invitation`) | — | 5 |
| `(auth)/continue/page.tsx` | RSC | Dispatcher → `resolvePostLoginHref` | sessão | 5 |
| `(auth)/select-profile/page.tsx` | RSC+Client | Escolher papel | sessão | 5 |
| `(auth)/onboarding/mentor/page.tsx` | RSC+Client | Wizard (skills do tenant) | sessão | 5 |
| `(auth)/onboarding/mentee/page.tsx` | RSC+Client | Wizard | sessão | 5 |
| `t/[slug]/layout.tsx` | RSC | Guarda ownership + `DashboardShell` | sessão+tenant (DB) | 4/7 |
| `t/[slug]/mentor/layout.tsx` | RSC | Guarda papel MENTOR | DB | 4 |
| `t/[slug]/mentor/page.tsx` | RSC | Dashboard mentor (+WaitlistManager) | papel | 7 |
| `t/[slug]/mentee/layout.tsx` | RSC | Guarda papel MENTEE | DB | 4 |
| `t/[slug]/mentee/page.tsx` | RSC | Dashboard mentee | papel | 7 |
| `t/[slug]/mentors/page.tsx` | RSC+Client | Busca de mentores | ownership | 7 |
| `t/[slug]/confirm/[mentorId]/page.tsx` | RSC+Client | Confirmar solicitação (só MENTEE) | ownership+inline | 7 |
| `t/[slug]/requests/page.tsx` | RSC+Client | Solicitações pendentes (só MENTOR) | ownership+inline | 7 |
| `t/[slug]/admin/layout.tsx` | RSC | Guarda ADMIN/SUPER + `AdminNav` | DB (D-07) | 4/8 |
| `t/[slug]/admin/users\|skills\|library\|settings\|reports\|export\|invitations/page.tsx` | RSC(+Client) | Seções admin | admin | 8 |
| `admin/layout.tsx` | RSC | Guarda SUPER_ADMIN | DB | 4 |
| `admin/page.tsx` | RSC | **Placeholder** super admin | SUPER | 4 (❌ real na 9) |

### Libs (`src/lib/mentormatch/...`)

| Arquivo | Exportações | Responsabilidade | Fase |
|---|---|---|---|
| `auth.ts` | `handlers, mmAuth, mmSignIn, mmSignOut` | Instância Auth.js MM (JWT+Credentials) | 3 |
| `auth-helpers.ts` | `MmDbUser, getMmSession, getMmUserFromDb, canAdminTenant, getActiveTenantBySlug` | Identidade/autz lendo o banco (D-06) | 3/8 |
| `dashboard-href.ts` | `resolvePostLoginHref` | Destino pós-login (fonte única; D-16) | 4 |
| `tenant.ts` | `MM_TENANT_COOKIE, MM_DEFAULT_TENANT_SLUG, resolveOnboardingTenant` | Resolver tenant (R13) | 5 |
| `tx.ts` | `runSerializable` | Transação serializável + retry (D-09) | 6 |
| `notifications.ts` | `MmTx, CreateNotificationInput, createNotification` | Notificação dentro da tx (R10) | 6 |
| `email.ts` | `sendAccountApprovedEmail, sendInvitationEmail` | E-mail best-effort (lazy Resend) | 8 |
| `csv.ts` | `toCsv` | CSV com BOM | 8 |
| `format.ts` | `whatsappHref, MmFileTypeValue, fileTypeFromName` | Utils (wa.me, fileType por extensão R16) | 7/8 |
| `validators.ts` | ver Seção 5/abaixo | Schemas Zod compartilhados | 3–8 |
| `db/schema.ts` | tabelas `mm*` | Schema Drizzle | 1 |
| `db/seed.ts` | `seed` | Seed idempotente | 2 |

Validators exportados: `mmRegisterSchema, mmLoginSchema, mmCompleteProfileSchema, mmOnboardingFormSchema,
mmConnectionRequestSchema, mmConnectionRespondSchema, mmWaitlistReorderSchema, mmWaitlistDeleteSchema,
mmNotificationPatchSchema, mmSkillCreateSchema, mmSkillUpdateSchema, mmLibraryCreateSchema,
mmUserStatusPatchSchema, mmSettingsPatchSchema, mmInvitationCreateSchema` (+ tipos inferidos).

### Componentes (`src/components/mentormatch/...`)

| Arquivo | Props | Responsabilidade | Fase |
|---|---|---|---|
| `providers/MmSessionProvider.tsx` | children | SessionProvider basePath MM | 5 |
| `onboarding/SelectProfile.tsx` | — | Escolher MENTOR/MENTEE → rota | 5 |
| `onboarding/OnboardingWizard.tsx` | role, skills, defaultName | Form perfil + skills → complete-profile → update() | 5 |
| `layout/DashboardShell.tsx` | slug, children | Header + sino | 7 |
| `layout/NotificationsBell.tsx` | — | Badge + dropdown (useNotifications) | 7 |
| `dashboard/RequestActions.tsx` | connectionId | Aceitar/Recusar → PATCH connections | 7 |
| `dashboard/WaitlistManager.tsx` | initial | Reordenar/remover fila | 7 |
| `dashboard/MentorSearch.tsx` | slug, tenantId, skills | Busca debounce → GET mentors | 7 |
| `dashboard/RequestForm.tsx` | mentorId | POST connections (criada/fila) | 7 |
| `admin/AdminNav.tsx` | slug | Navegação admin | 8 |
| `admin/UsersTable.tsx` | tenantId | Listar/mudar status | 8 |
| `admin/SkillsManager.tsx` | tenantId | CRUD skills | 8 |
| `admin/LibraryManager.tsx` | tenantId | Upload + listar/excluir | 8 |
| `admin/SettingsForm.tsx` | initial | Editar tenant + logo | 8 |
| `admin/InvitationsManager.tsx` | tenantId | Criar/listar/revogar convites | 8 |
| `admin/ReportsView.tsx` | tenantId | Métricas (fetch reports) | 8 |

### Hooks / Styles / Types

| Arquivo | Retorno/Conteúdo | Fase |
|---|---|---|
| `hooks/mentormatch/use-notifications.ts` | `{ items, unreadCount, loading, markRead, markAllRead, refresh }` (polling 30s) | 7 |
| `styles/mentormatch/.gitkeep` | vazio (theming na Fase 10) | 0 |
| `types/mentormatch.ts` | `MMRole, MMUserStatus, MMConnectionStatus, MMFileType, MMNotificationType, MMSessionUser, MMSession, MMTokenClaims` + augment `@auth/core/jwt` | 3 |

---

## SEÇÃO 4: FASE POR FASE — PEDIDO vs ENTREGUE

### Fase 0–1: Estrutura + Schema + Migration
- **Pedido:** estrutura de pastas; schema Drizzle `mm_*` (14 tabelas); migration versionada.
- **Entregue:** diretórios; `db/schema.ts` (14 tabelas); `drizzle.config.ts` multi-schema; `src/db/index.ts` mesclado; migration `drizzle/0002_*`.
- **Status:** ✅ tudo. **Defeitos:** D-04, D-05, D-08, D-14, D-15 embutidos no schema.

### Fase 2: Seed
- **Pedido:** planos, tenant default+sicredi, super admin (env), skills por tenant, subscriptions.
- **Entregue:** `db/seed.ts` idempotente; script `db:seed-mm`. ✅ (execução exige DB).

### Fase 3: Autenticação
- **Pedido:** instância Auth.js separada JWT+Credentials+bcrypt; claims do banco; cookies `mm.*`.
- **Entregue:** `auth.ts`, route handler, `auth-helpers.ts` (`getMmUserFromDb`), tipos. ✅
- **Defeitos:** D-06 (helper lê banco), D-10 (sem magic link), D-15.

### Fase 4: Guardas + Roteamento
- **Pedido:** guardas (ownership, papel, admin, super) lendo o banco; `resolvePostLoginHref`.
- **Entregue:** 5 layouts-guarda + `dashboard-href.ts` + placeholders. ✅
- **Defeitos:** D-06, D-07, D-16.

### Fase 5: Onboarding
- **Pedido:** select-profile, onboarding mentor/mentee, complete-profile API. (Ampliado: +login/register/register API.)
- **Entregue:** páginas `(auth)/*`, dispatcher `/continue`, `register` e `complete-profile` APIs, `MmSessionProvider`, `tenant.ts`. ✅
- **Defeitos:** D-05, D-06, D-16. **Pendente:** forgot/reset-password (❌), avatar upload (adiado).

### Fase 6: Matching + Fila + Notificações
- **Pedido:** POST/PATCH connections; waitlist GET/PATCH/DELETE; notifications; serializável.
- **Entregue:** `connections`, `waitlist`, `notifications` APIs; `tx.ts`, `notifications.ts`. ✅
- **Defeitos:** D-01, D-02, D-09. **Nota:** REJECT de PENDING também promove fila (segue R6 à risca).

### Fase 7: Dashboards + Busca + Solicitações + Notificações UI
- **Pedido:** dashboards mentor/mentee, busca (`GET /mentors`), confirmação, requests, sino+polling.
- **Entregue:** páginas reais (substituindo placeholders), `mentors` API, `use-notifications`, componentes. ✅
- **Defeitos:** D-01/D-02 (mutações só via API), D-06, R21.

### Fase 8: Admin do Tenant
- **Pedido:** users, reports, export, skills CRUD, library, settings, invitations.
- **Entregue:** 7 páginas + APIs + `upload` + `email.ts` + `csv.ts` + consumo de convite no register. ✅
- **Defeitos:** D-03, D-04, D-07, D-08.

| # | Item (Fase 8) | Status | Arquivo |
|---|---|---|---|
| 1 | Users listar/aprovar/rejeitar/suspender + email/notif | ✅ | `admin/users/route.ts`, `UsersTable.tsx` |
| 2 | Skills CRUD por tenant (D-03/D-04) | ✅ | `skills/route.ts`, `SkillsManager.tsx` |
| 3 | Library GET/POST/DELETE + upload (D-03) | ✅ | `library/route.ts`, `upload/route.ts`, `LibraryManager.tsx` |
| 4 | Settings persiste maxMenteesPerMentor (D-08) | ✅ | `admin/settings/route.ts`, `SettingsForm.tsx` |
| 5 | Reports | ✅ | `admin/reports/route.ts`, `ReportsView.tsx` |
| 6 | Export CSV com BOM (R22) | ✅ | `admin/export/route.ts`, `csv.ts` |
| 7 | Invitations criar/listar/revogar/validar + register | ✅ | `invitations/*`, `auth/register/route.ts` |

---

## SEÇÃO 5: APIs REST — CATÁLOGO

| Método · Path | Authz | Entrada | Saída | Erros | Fase |
|---|---|---|---|---|---|
| GET/POST `/api/mentormatch/auth/[...nextauth]` | — | NextAuth | sessão | — | 3 |
| POST `/auth/register` | público | `{name,email,password,invitationToken?}` | `{id,email}` | 400/409 | 5/8 |
| POST `/auth/complete-profile` | sessão | `{role,name,...,skills[]}` | `{user,redirectTo}` | 400/401/404/409 | 5 |
| GET `/connections` | sessão | `?status?` | conn[] | 401 | 6 |
| POST `/connections` | MENTEE APPROVED | `{mentorId,message?}` | conn \| `{waitlisted,position}` | 400/401/403/404/409 | 6 |
| PATCH `/connections` | mentor / partes | `{connectionId,status}` | `{ok}` | 400/401/403/404/409 | 6 |
| GET/PATCH/DELETE `/waitlist` | sessão/mentor | reorder/`{id}` | `{ok}`/lista | 400/401/403/404 | 6 |
| GET/PATCH `/notifications` | sessão | `{id}`/`{all}` | lista/`{ok}` | 400/401 | 6 |
| GET `/mentors` | sessão (tenant) | `?tenantId&q?&skill?` | mentor[] | 400/401/403 | 7 |
| POST `/upload` | sessão | multipart `file` | `{url,fileSize,fileType}` | 400/401/500 | 8 |
| GET/POST/PATCH/DELETE `/skills` | sessão/admin | `?tenantId`/`?id` | skill[]/skill/`{ok}` | 400/401/403/404/409 | 8 |
| GET/POST/DELETE `/library` | sessão/admin\|mentor | `?tenantId`/`?id` | item[]/item/`{ok}` | 400/401/403/404 | 8 |
| GET/PATCH `/admin/users` | admin tenant | `?tenantId&status?&q?`/`{userId,status}` | user[]/`{ok}` | 400/401/403/404 | 8 |
| GET `/admin/reports` | admin tenant | `?tenantId` | métricas | 400/401/403 | 8 |
| GET `/admin/export` | admin tenant | `?type&tenantId` | CSV | 400/401/403 | 8 |
| GET/PATCH `/admin/settings` | admin slug/super | `?slug`/`{slug,...}` | settings | 400/401/403/404 | 8 |
| GET/POST/DELETE `/invitations` | admin tenant | `?tenantId`/`{email,role,tenantId?}`/`?id` | invite[]/invite/`{ok}` | 400/401/403/404/409 | 8 |
| GET `/invitations/[token]` | público | — | `{valid,...}` | — | 8 |

**[PENDENTE] referenciados nas specs mas ainda não criados:** `GET/PATCH /api/mentormatch/users/me` (Fase 12),
`POST /api/mentormatch/tenant/clear` (Fase 10/12), `auth/forgot-password`, `auth/reset-password` (pendente),
`admin/tenants` (super admin — Fase 9).

---

## SEÇÃO 6: SCHEMA DO BANCO (tabelas `mm_*`)

- **mm_plan** (slug unique; preços/limites).
- **mm_tenant** (slug unique; domain unique; brandColor/secondaryColor/themeKey/logoUrl; **`maxMenteesPerMentor` default 4 — D-08**; planId).
- **mm_user** (`password` hash; role/status; languages json; whatsapp; maxMentees=4; onboardingDone; tenantId; **UNIQUE(email,tenantId) — D-05**; índices tenantId, (role,tenantId), (status,tenantId)).
- **mm_skill** (**tenantId NOT NULL + UNIQUE(name,tenantId) — D-04**; usageCount; isActive).
- **mm_user_skill** (userId, skillId cascade; isTeaching; UNIQUE(userId,skillId)).
- **mm_connection** (mentorId/menteeId/tenantId; status; UNIQUE(mentorId,menteeId,status); índices (mentorId,status), menteeId, tenantId).
- **mm_waitlist_entry** (mentorId/menteeId; position; UNIQUE(mentorId,menteeId); índice (mentorId,position)).
- **mm_library_item** (title, fileUrl, fileType, fileSize, tenantId, uploadedById; índice tenantId).
- **mm_invitation** (email, tenantId, role, token unique, used, expiresAt, invitedById, type; índices tenantId, token).
- **mm_notification** (userId cascade, tenantId, type, title, message, read, metadata json; índices (userId,read), tenantId).
- **mm_subscription** (tenantId unique, planId, active, startDate, endDate).
- **mm_invoice** (subscriptionId, amount, currency BRL, status, paidAt).
- **mm_usage** (tenantId, metric, value, period; UNIQUE(tenantId,metric,period)).
- **mm_verification_token** (identifier, token unique, expires; UNIQUE(identifier,token)).
- **D-15:** sem tabelas Session/Account ociosas (JWT + verification token bastam).

---

## SEÇÃO 7: REGRAS DE NEGÓCIO

| Regra | Status | Onde |
|---|---|---|
| R1 capacidade ≤ maxMentees | ✅ | `connections#POST` ($count ACCEPTED) |
| R2 lotado → fila position=max+1 | ✅ | `connections#POST` |
| R3 anti-duplicado (PENDING\|ACCEPTED) → 409 | ✅ | `connections#POST` |
| R4 recheck capacidade no ACCEPT | ✅ | `connections#PATCH` |
| R5 só mentor ACCEPT/REJECT | ✅ | `connections#PATCH` |
| R6 promoção FIFO em REJECT/COMPLETE/CANCEL | ✅ | `connections#PATCH` (`promoteFromWaitlist`) |
| R7 fila contígua | ✅ | promote + waitlist DELETE (decrementa) |
| R8 reordenar só mentor dono | ✅ | `waitlist#PATCH` |
| R9 remover fila: mentor dono ou mentee | ✅ | `waitlist#DELETE` |
| R10 notificações automáticas | ✅ | `notifications.ts` dentro das tx |
| R11 registro com/sem convite | ✅ | `auth/register` |
| R12 completar perfil (tx) | ✅ | `complete-profile` |
| R13 resolver tenant (cookie/default) | ✅ | `tenant.ts` |
| R14 aprovar usuário (email+notif) | ✅ | `admin/users#PATCH` |
| R15 convite 7d, sem duplicado | ✅ | `invitations#POST` |
| R16 biblioteca ADMIN/MENTOR + tipo por extensão | ✅ | `library`, `format.fileTypeFromName` |
| R17 skill única por tenant (case-insensitive) | ✅ | `skills#POST/PATCH` (ilike) |
| R18 reset por VerificationToken | ❌ | pendente |
| R19 trocar senha confere atual | ❌ | pendente |
| R20 marcar notif lida | ✅ | `notifications#PATCH` |
| R21 buscar mentores do tenant | ✅ | `mentors#GET` |
| R22 export CSV | ✅ | `admin/export` |
| R23 settings persiste maxMentees | ✅ | `admin/settings#PATCH` |

---

## SEÇÃO 8: DEFEITOS — STATUS

| ID | Sev | Status | Fase | Como | Onde |
|---|---|---|---|---|---|
| D-01 | 🔴 | ✅ | 6 | accept/reject só via PATCH connections | `connections/route.ts` |
| D-02 | 🔴 | ✅ | 6/7 | um caminho de solicitação (POST) | `connections`, `RequestForm` |
| D-03 | 🟠 | ✅ | 8 | PATCH/DELETE skills + DELETE library | `skills`, `library` |
| D-04 | 🟠 | ✅ | 1/8 | skills por tenant + filtros | schema + `skills` |
| D-05 | 🟠 | ✅ | 1/5/8 | unicidade (email,tenantId) | schema + register/complete |
| D-06 | 🟡 | ✅ | 3–8 | autz lê banco (`getMmUserFromDb`/`canAdminTenant`) | guardas + APIs |
| D-07 | 🟠 | ✅ | 4/8 | SUPER ⊇ ADMIN | guardas + `canAdminTenant` |
| D-08 | 🟠 | ✅ | 1/8 | maxMenteesPerMentor persistido | schema + settings |
| D-09 | 🟡 | ✅ | 6 | transação serializável + retry | `tx.ts` |
| D-10 | 🟡 | ✅ | 3 | sem magic link anunciado | `auth.ts` |
| D-11 | 🟡 | ✅ | — | sem código morto (placeholders substituídos) | — |
| D-12 | 🟡 | ⚠️ | 10/14 | URLs via env (`appUrl`); proxy ainda hardcoded | `email.ts`; `next.config.js` |
| D-13 | 🟡 | 🚫 | 13/14 | PWA/manifest — não há PWA no módulo ainda | — |
| D-14 | 🟡 | ✅ | 1 | migrations versionadas (drizzle-kit) | `drizzle/` |
| D-15 | 🟡 | ✅ | 1 | sem tabelas auth ociosas | schema |
| D-16 | 🟡 | ✅ | 4/5 | guardas leem banco + dispatcher único | guardas + `/continue` |

---

## SEÇÃO 9: FLUXOS FUNCIONAIS

- **Registro → login → /continue → select-profile → onboarding → dashboard:** ✅ implementado (E2E só após Fase 14, pois o proxy sombreia as rotas). APIs: register, complete-profile; dispatcher `/continue`.
- **Mentee busca → solicita → mentor aceita:** ✅ implementado. APIs: `mentors`, `connections` (POST/PATCH).
- **Mentor lotado → fila → promoção FIFO:** ✅ implementado. `connections` + `waitlist`.
- **Admin gerencia tenant (users/skills/library/settings/reports/export/invitations):** ✅ Fase 8.
- **Super admin (painel global):** ❌ Fase 9 (hoje só placeholder).
- **Landing branded (Sicredi):** ❌ Fase 10.
- **Nota geral:** ⚠️ nada é testável em preview/produção até a **Fase 14** remover o proxy. Verificação atual = `typecheck`/`lint`/`build` + revisão.

---

## SEÇÃO 10: O QUE FALTA (Fases 9–15)

| Fase | Nome | Entrega | Defeitos | Depende de |
|---|---|---|---|---|
| 9 | Super Admin | `/mentormatch/admin` real: listar tenants+stats, criar tenant (slug `^[a-z0-9-]+$` + subscription + skills), ativar/desativar; APIs `admin/tenants` | D-07 | 4, 8 |
| 10 | Theming + Landing branded | CSS vars por `themeKey`, classe no `<body>`; landing `/mentormatch/{slug}` seta cookie `mm-tenant`; `tenant/clear` | D-12, D-13 | 5, 8 |
| 11 | Biblioteca + Skills (extras) | refinamentos/visualização pública de materiais; PATCH/DELETE já existem | D-03/D-04 (✔) | 8 |
| 12 | APIs complementares | `users/me` GET/PATCH, `tenant/clear`, forgot/reset-password | R18/R19 | 5 |
| 13 | Landing pública | `/mentormatch` (marketing, planos, CTA demo) | — | 10 |
| 14 | Eliminação do proxy | remover rewrites de `next.config.js`; rotas nativas ativas; remover `MENTORMATCH_URL` | D-12 | todas |
| 15 | QA | rodar BLUEPRINT-ACEITE (A–I); type-check/build | — | todas |

---

## SEÇÃO 11: INVARIANTES DO PROJETO

- Auth MM é instância separada (`mm.*` cookies, `/api/mentormatch/auth/*`).
- Nunca alterar a auth do site (`src/lib/auth.ts`).
- Toda decisão de acesso lê o banco (`getMmUserFromDb`/`canAdminTenant`), nunca o JWT.
- SUPER_ADMIN ⊇ ADMIN.
- UM caminho por operação de domínio (sem server actions divergentes).
- Operações de capacidade/fila em transação serializável (`runSerializable`).
- PK `uuid` `defaultRandom`; `timestamp` (mode date) `defaultNow`.
- Skills por tenant (D-04); e-mail único por (email,tenantId) (D-05).
- Sem código morto (D-11); sem URL hardcoded de domínio (D-12) — usar env/`appUrl`.
- Leituras em RSC; mutações via fetch para as APIs REST.
- Commits: `feat(mentormatch): descricao`. Branch: `claude/mentormatch-native-integration-iFaks`.

---

## SEÇÃO 12: ENV VARS

| Var | Obrig? | Usada em | Exemplo |
|---|---|---|---|
| `MM_AUTH_SECRET` | Não (fallback `AUTH_SECRET`) | `auth.ts` | base64 random |
| `AUTH_SECRET` | Sim | `auth.ts` (fallback) | base64 random |
| `AUTH_URL` / `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_SITE_URL` | Reco | `email.ts` (`appUrl`) | `https://aurimarnogueira.com.br` |
| `SUPER_ADMIN_EMAIL` | Reco (seed) | `db/seed.ts` | `superadmin@mentormatch.com` |
| `SUPER_ADMIN_PASSWORD` | Reco (seed) | `db/seed.ts` | senha forte |
| `RESEND_API_KEY` | Não (email best-effort) | `email.ts` | `re_...` |
| `RESEND_FROM` / `RESEND_REPLY_TO` | Não | `email.ts` | `AN. <...>` |
| `BLOB_READ_WRITE_TOKEN` | Sim p/ upload | `@vercel/blob put` | token Vercel |
| `POSTGRES_URL`/`DATABASE_URL` | Sim | `src/lib/db-url.ts` | postgres URL |
| `NODE_ENV` | auto | `auth.ts` (secure cookies) | production |
| `MENTORMATCH_URL` | removido na Fase 14 (proxy eliminado) | — | — |

---

## SEÇÃO 13: DEPENDÊNCIAS DO MÓDULO

| Pacote | Versão | Função |
|---|---|---|
| `bcryptjs` | ^3.0.3 | Hash de senha (cost 10) |
| `tsx` | ^4.22.3 (dev) | Runner do `db:seed-mm` |

Reusados (já no an-site): `drizzle-orm`, `postgres`, `next-auth`/`@auth/*`, `zod`, `resend`, `@vercel/blob`, `react-hook-form`, `@hookform/resolvers`.

---

## SEÇÃO 14: RISCOS E PENDÊNCIAS

- ⚠️ **Proxy ativo**: `next.config.js` sombreia `/mentormatch/*` → rotas nativas não exercitáveis até Fase 14.
- ❌ **forgot/reset-password** não implementados (link de login inativo). R18/R19 pendentes.
- ⏸️ **Avatar upload no onboarding** adiado (campo `image` aceito, sem widget).
- ⚠️ **Cookie `mm-tenant`** só será setado pela landing (Fase 10); hoje onboarding cai em `default`.
- ⚠️ **Build local** falha apenas em `/sitemap.xml` (rota pré-existente do site que consulta `skills` sem DB); passa no Vercel.
- ⚠️ **Duas instâncias NextAuth** no mesmo app — isoladas por basePath + cookies `mm.*`.
- ⚠️ **Login ambíguo** com o mesmo email em vários tenants sem `tenantSlug` (authorize usa 1º por email; cookie passa slug quando disponível).
- ⚠️ **Upload público** (sem signed URL) — aceitável para logo/materiais; limite 10MB + allowlist.
- ⚠️ **Capacidade** usa `mmUser.maxMentees`; mudar `mmTenant.maxMenteesPerMentor` em settings não repropaga aos usuários existentes (decisão a revisitar).
- ⚠️ Latente: `src/lib/resend/index.ts` (do site) instancia Resend no load — não afeta o módulo (MM usa `email.ts` lazy).

---

## SEÇÃO 15: COMO CONTINUAR

1. **Type-check:** `pnpm typecheck`
2. **Lint:** `pnpm lint`
3. **Build:** `pnpm build` (a falha de `/sitemap.xml` sem DB é esperada localmente)
4. **Seed:** `pnpm db:seed-mm` (precisa DB + `.env.local`)
5. **Migrate:** `pnpm db:migrate` (precisa DB + `.env.local`); gerar: `pnpm db:generate`
6. **Estrutura:** módulo em `src/{app,components,hooks,lib,styles}/mentormatch` + `src/app/api/mentormatch` + `src/types/mentormatch.ts`.
7. **Auth MM:** `src/lib/mentormatch/auth.ts` (instância separada, JWT+Credentials, basePath `/api/mentormatch/auth`, cookies `mm.*`); helpers em `auth-helpers.ts`.
8. **Schema:** `src/lib/mentormatch/db/schema.ts` (mesclado no client `src/db/index.ts`); migrations em `drizzle/`.
9. **Guardas:** layouts em `t/[slug]/layout.tsx` (ownership) → `mentor|mentee|admin/layout.tsx` (papel) → `admin/layout.tsx` (super). Todas chamam `getMmUserFromDb()` e, no admin, `canAdminTenant()`.
10. **Roteamento pós-login:** `resolvePostLoginHref(user)` (`dashboard-href.ts`) é a fonte única; o dispatcher é `/mentormatch/continue`.
11. **Commits:** `feat(mentormatch): ...`. Branch de trabalho: `claude/mentormatch-native-integration-iFaks`.
12. **Cadência de PR:** mergear o PR de cada fase antes de começar a próxima mantém um PR por fase.

---

> Próximo passo recomendado: **Fase 9 — Super Admin** (`/mentormatch/admin` real + APIs `admin/tenants`), que depende das Fases 4 e 8.
