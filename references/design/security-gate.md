# Security / LGPD Gate — go-live (D023.0 / D023.6)

Resultado do gate de segurança e privacidade antes do go-live. Verificação por
**suite E2E real** (`e2e/isolation.spec.ts`) contra banco seedado, não revisão estática.

## 1. Isolamento multi-tenant (DONE)

Suite `e2e/isolation.spec.ts` — **10/10 verde**, cobrindo cross-tenant (A=default, B=sicredi) por entidade:

| Entidade | Controle | Resultado |
|---|---|---|
| user | `canAdminTenant` em `admin/users` | A→B 403 |
| mentors (vitrine) | `user.tenantId !== tenantId` | A→B 403 |
| skills | `user.tenantId !== tenantId` | A→B 403 |
| library | `user.tenantId !== tenantId` | A→B 403 |
| invitation (R/W) | `canAdminTenant` | A→B 403 (GET e POST) |
| connection | `mentor.tenantId !== user.tenantId` | A solicita mentor de B → 403 |
| waitlist | ownership por `mentorId/menteeId` | A remove entrada de B → 403/404 |
| notification | filtro por `userId` (sem param de tenant) | só as próprias; anon → 401 |

Tenant-scoping é **app-level** (D-06/D-07): guards de layout + filtro por `tenantId`/ownership em toda query. Provado pela suite.

## 2. LGPD — visibilidade e contato (D023.6)

- Perfis visíveis **só dentro do mesmo tenant autenticado** (vitrine 403 cross-tenant).
- **Contato (email/WhatsApp) nunca na vitrine**: `GET /api/mentormatch/mentors` não retorna `whatsapp`/`email`. Verificado por E2E (`raw` sem `whatsapp`/`wa.me`).
- Contato **só pós-aceite**: `/mentee` (mentor ativo) expõe `wa.me`. Verificado por E2E.
- Admin vê **só o próprio tenant** (guards acima).

## 3. Slugs reservados

`RESERVED_TENANT_SLUGS` + `refine` no `mmTenantCreateSchema`. E2E: criar tenant com `admin/api/demo/t/mentormatch/login` → **400**. (verde)

## 4. RLS nativo Postgres — avaliação (D023.0)

**Decisão: backlog, não bloqueia go-live.** Racional:
- A app usa um único papel Postgres para todos os tenants e **não** propaga contexto de tenant por request (`SET LOCAL app.tenant_id`). RLS exigiria: (a) policies por tabela `mm_*` com `USING (tenant_id = current_setting('app.tenant_id'))`, e (b) setar a variável em cada conexão/transação no `postgres-js`.
- Mudança de infra significativa e arriscada às vésperas do go-live; o controle primário (app-level, provado pela suite) já garante isolamento.
- Entra no backlog como **defesa em profundidade** (rede de segurança), não como controle único.

## 5. XSS / sanitização

- React **escapa por padrão** todo conteúdo em JSX; não há `dangerouslySetInnerHTML` com input de usuário nas telas.
- Única superfície de HTML cru: templates de email (`email.ts`) — usam `escapeHtml` em nome/título/CTA.
- Inputs validados por Zod (tamanho, formato) nos endpoints.

## 6. Rate-limit

- `auth/users/me/password` (troca de senha): rate-limit por usuário (5/15min).
- `auth/register`: por IP (10/10min). `auth/forgot-password`: por IP (5/10min).
- Implementação `lib/rate-limit` (Vercel KV); **no-op gracioso sem KV** (não quebra dev/E2E). Em produção, configurar KV.
- Login (NextAuth Credentials): proteção via `authorize` estrito + recomendado throttle no edge/WAF.

## 7. Acessibilidade

- **`--brand-contrast` ≥ 4.5:1 por tenant**: `brandStyle()` escolhe branco ou texto escuro conforme contraste WCAG do `--brand` — o texto sobre a marca é **sempre** ≥4.5:1 por construção. `brandContrastPasses()` valida no admin de branding.
- **prefers-reduced-motion**: respeitado no DS (`@media (prefers-reduced-motion)` em `components.css`/temas + `useReducedMotion()` em todos os componentes de motion).
- **Foco visível**: `.mm-btn`/`.mm-input` definem `:focus-visible` (outline `--brand`).
- **Alvos ≥44px**: botões `.mm-btn` h44; inputs min-height 44.
- **Lighthouse a11y/perf**: rodar no **Vercel preview** (browser não instala no sandbox). Telas-chave: vitrine, perfil, dashboards.

## 8. Performance (parcial — backlog)

- Vitrine: paginação 12/página (client) já implementada.
- `next/image`: a vitrine/cards usam `<img>` com `eslint-disable` (avatares de Blob público) — migrar para `next/image` é melhoria.
- Cache de tenant config: `getActiveTenantBySlug` por request; cachear (React `cache()`/unstable_cache) é melhoria.
- N+1: as queries de listagem usam `inArray` em lote (sem N+1 nos pontos quentes — mentors, dashboards).
