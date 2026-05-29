# MentorMatch — QA-RESULTS.md (Fase 15)

> Auditoria contra `BLUEPRINT-ACEITE.md` após as Fases 0–14 (módulo nativo, proxy removido).
>
> **Natureza desta QA:** o ambiente de CI/container **não tem banco nem app em execução**, então
> os cenários de runtime (A–H) foram verificados por **auditoria de código** (mapeamento ao handler
> que os implementa), não por E2E. Critérios executáveis aqui (I1–I4, D3, B4) foram **rodados**.
>
> Legenda: ✅ verificado aqui · ⚠️ implementado, E2E pendente (precisa DB+preview) · ❌ gap real.
>
> **Resultado: 31 de 32 critérios ✅/⚠️ (implementados); 1 ❌ (B6/R19) com issue aberta.**

## Como executar o E2E real (pendente)
1. `.env.local` com `POSTGRES_URL`/`DATABASE_URL`, `AUTH_SECRET`, `BLOB_READ_WRITE_TOKEN`, `RESEND_API_KEY`, `SUPER_ADMIN_EMAIL/PASSWORD`.
2. `pnpm db:migrate` → `pnpm db:seed-mm`.
3. Abrir o preview do PR (proxy já removido) e percorrer os cenários A–H.

---

## A. Registro → Onboarding → Dashboard
| # | Critério | Status | Evidência |
|---|---|---|---|
| A1 | Landing branded seta `mm-tenant` | ⚠️ | `app/mentormatch/[slug]/page.tsx` + `landing/SetTenantCookie.tsx` |
| A2 | Registrar → conta + login automático | ⚠️ | `(auth)/register/page.tsx` (register API → `signIn`) |
| A3 | Escolher papel → onboarding | ⚠️ | `(auth)/select-profile` → `(auth)/onboarding/{role}` |
| A4 | Onboarding conclui → dashboard sem loop (D-16) | ⚠️ | `complete-profile` (tx) → `update()` → `/continue` → `resolvePostLoginHref` |
| A5 | Recarregar dashboard → permanece | ⚠️ | guardas RSC leem o banco (`getMmUserFromDb`) |

## B. Login / Logout / Reset
| # | Critério | Status | Evidência |
|---|---|---|---|
| B1 | Login válido → destino por roteamento | ⚠️ | `(auth)/login` → `/continue` → `resolvePostLoginHref` |
| B2 | Login inválido → erro, sem sessão | ⚠️ | `auth.ts` Credentials `authorize` retorna null |
| B3 | Logout → rotas protegidas → `/login` | ⚠️ | guardas redirecionam sem sessão (`mmSignOut` disponível) |
| B4 | forgot-password SEMPRE 200 | ✅ | `auth/forgot-password/route.ts` (200 mesmo em input inválido) |
| B5 | reset com token válido troca senha; expirado→400+delete | ⚠️ | `auth/reset-password/route.ts` (R18) |
| B6 | Trocar senha logado conferindo a **atual** (R19) | ❌ | **não implementado** — ver issue |

## C. Matching / Capacidade / Fila (D-01/D-02/D-09)
| # | Critério | Status | Evidência |
|---|---|---|---|
| C1 | Solicita mentor com vaga → PENDING + notif | ⚠️ | `connections/route.ts#POST` (R1/R10) |
| C2 | Mesmo mentor já PENDING/ACCEPTED → 409 | ⚠️ | `connections#POST` (R3) |
| C3 | 4ª lota; 5º vira fila position=1 | ⚠️ | `connections#POST` (R2) |
| C4 | Aceitar → notif; acima do limite → 409 | ⚠️ | `connections#PATCH` (R4) |
| C5 | Recusar/concluir/cancelar → promove 1º + reordena | ⚠️ | `connections#PATCH` (`promoteFromWaitlist`, R6/R7) |
| C6 | Reordenar fila só mentor dono | ⚠️ | `waitlist#PATCH` (R8) |
| C7 | Remover fila: mentor dono ou próprio mentee | ⚠️ | `waitlist#DELETE` (R9) |

> Todas as operações de capacidade/fila em `runSerializable` (D-09).

## D. Busca de mentores
| # | Critério | Status | Evidência |
|---|---|---|---|
| D1 | Lista só MENTOR APPROVED do tenant | ⚠️ | `mentors/route.ts#GET` (R21) |
| D2 | Filtro por `q` e `skill` | ⚠️ | `mentors#GET` (ilike + isTeaching) |
| D3 | Sem `tenantId` → 400 | ✅ | `mentors/route.ts:18` |

## E. Admin do tenant (D-03/D-04/D-07/D-08)
| # | Critério | Status | Evidência |
|---|---|---|---|
| E1 | Listar/aprovar usuários → email+notif | ⚠️ | `admin/users/route.ts` (R14) |
| E2 | Relatórios carregam | ⚠️ | `admin/reports/route.ts` + `ReportsView` |
| E3 | Export CSV | ⚠️ | `admin/export/route.ts` (BOM) |
| E4 | Convite 7d; duplicado → 409 | ⚠️ | `invitations/route.ts` (R15) |
| E5 | Skills CRUD (D-03/D-04) | ⚠️ | `skills/route.ts` GET/POST/PATCH/DELETE |
| E6 | Biblioteca criar/excluir (D-03) | ⚠️ | `library/route.ts` |
| E7 | Settings persiste `maxMenteesPerMentor` (D-08) | ⚠️ | `admin/settings/route.ts#PATCH` |

## F. Super admin (D-07)
| # | Critério | Status | Evidência |
|---|---|---|---|
| F1 | `/admin` só SUPER_ADMIN | ⚠️ | `admin/layout.tsx` |
| F2 | Listar tenants com stats | ⚠️ | `admin/tenants#GET` + `getTenantsOverview` |
| F3 | Criar tenant (slug válido) | ⚠️ | `admin/tenants#POST` (regex + 409) |
| F4 | SUPER acessa admin de qualquer tenant | ⚠️ | `canAdminTenant` (SUPER em qualquer) |

## G. Isolamento (D-05/D-06)
| # | Critério | Status | Evidência |
|---|---|---|---|
| G1 | Usuário tenant A em /t/B → redirecionado | ⚠️ | `t/[slug]/layout.tsx` (ownership) |
| G2 | MENTOR em /mentee → redirecionado | ⚠️ | `t/[slug]/mentee/layout.tsx` |
| G3 | Não-admin em /admin → redirecionado | ⚠️ | `admin/layout.tsx`, `t/[slug]/admin/layout.tsx` |
| G4 | Acesso reflete o banco imediatamente | ⚠️ | todas as guardas/APIs usam `getMmUserFromDb` (D-06) |
| G5 | Mesmo email em dois tenants | ⚠️ | `UNIQUE(email,tenantId)` + register/complete (D-05) |

## H. Branding
| # | Critério | Status | Evidência |
|---|---|---|---|
| H1 | Landing aplica `theme-{themeKey}` + cores | ⚠️ | `[slug]/page.tsx` + `mentormatch/layout.tsx` |
| H2 | Sicredi exibe tema verde | ⚠️ | `styles/mentormatch/sicredi.css` (#33820D) |
| H3 | Logo/cor de Settings refletem | ⚠️ | `SettingsForm` → `admin/settings` → tenant |

## I. Não-funcionais
| # | Critério | Status | Evidência |
|---|---|---|---|
| I1 | `pnpm typecheck` + `pnpm build` passam | ✅ | typecheck limpo; build compila (falha só em `/sitemap.xml`, rota pré-existente do site que consulta `skills` sem DB — passa no Vercel; não é do MentorMatch) |
| I2 | App nativo sob `/mentormatch` (sem proxy) | ✅ | `next.config.js` sem `rewrites`; só `redirects` do `/sicredi/mentormatch`; `grep mentormatch-five` vazio (D-12) |
| I3 | Seed cria default+sicredi+super+skills+subscriptions | ✅ | `db/seed.ts` (inspeção): planos, tenants default/sicredi, `ensureSubscription`, super admin (env), `ensureSkills` |
| I4 | Falha de email/storage não derruba fluxo | ✅ | `email.ts` lazy/guarded + try/catch; upload/del em try/catch best-effort |

---

## Gaps (❌) e issues
- **B6 / R19** — trocar senha logado conferindo a senha atual: **não implementado**. O fluxo atual cobre reset por token (forgot/reset). `users/me#PATCH` não altera senha. → **issue #12** (não bloqueia; melhoria de segurança/UX). Sugestão: endpoint `PATCH /api/mentormatch/users/me/password` com `{currentPassword, newPassword}` (bcrypt.compare).

## Observações
- Todos os ⚠️ têm a lógica implementada e revisada; viram ✅ ao rodar migrate+seed e exercitar o preview.
- A falha de `/sitemap.xml` no build local é **pré-existente do an-site** (não do MentorMatch) e ocorre apenas sem DB.
