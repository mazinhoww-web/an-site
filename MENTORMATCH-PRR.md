# MentorMatch - Production Readiness Review (P7.8)

Data: 2026-06-01
Auditor: revisao multi-papel (CTO / Staff / PM / Security / QA / UX)
Base: codigo real do branch, validado por evidencia observavel (file:line), nao por documentos.
Metodo: instalacao limpa de dependencias, gates de build executados de verdade, leitura de
todas as rotas de API, schema, auth, telas, e tres varreduras profundas independentes.

---

## VEREDITO FINAL: NO GO

Motivo em uma linha: o produto funciona ponta a ponta e o isolamento multi-tenant na camada
de dados e solido e coberto por E2E, mas existem violacoes confirmadas de requisitos travados
(vazamento de WhatsApp pre-match, ausencia de exclusao de usuario e de consentimento LGPD),
mais brute-force de login sem protecao e nao-conformidade de design system nas telas de maior
trafego. Nenhum item e catastrofico isoladamente; a distancia ate o GO e curta e os reparos
sao cirurgicos.

---

## Gates de build (executados, nao assumidos)

Descoberta de processo: o ambiente subiu sem `node_modules`. A primeira rodada de `typecheck`
"passou" apenas porque o pipe mascarou o erro. Apos `pnpm install --frozen-lockfile`:

| Gate | Resultado | Evidencia |
|---|---|---|
| `pnpm typecheck` | PASS (exit 0) | tsc --noEmit limpo |
| `pnpm lint` | PASS (exit 0) | next lint limpo |
| `pnpm build` | PASS (exit 0) | 63 paginas geradas; todas as rotas mentormatch compilam |
| Warning de build | benigno | `jose`/next-auth usa CompressionStream no Edge Runtime - lib-level, nao afeta runtime Node |
| `/sitemap.xml` | OK | agora dinamico (f), nao quebra mais o build |

---

## 1. PRODUTO

Fluxos criticos rastreados UI -> API -> DB. Todos COMPLETE salvo onde indicado.

| Fluxo | Status | Evidencia |
|---|---|---|
| Register + onboarding (mentee/mentor) | COMPLETE | `auth/register/route.ts:25`, `complete-profile/route.ts:14` (atomico, serializable) |
| Login | COMPLETE | Auth.js credentials, `lib/mentormatch/auth.ts` |
| Forgot password | PARTIAL | so envia email com cookie `mm-tenant` setado (`forgot-password/route.ts:40-50`); fora de rota branded, no-op silencioso |
| Reset password | COMPLETE | consumo de token + expiracao (`reset-password/route.ts:28-31`) |
| Browse -> perfil -> solicitar | COMPLETE | `mentors/route.ts:12`, `MentorProfile.tsx`, `connections#POST:77` |
| Aceitar/recusar + limite + waitlist | COMPLETE | serializable, recheck de capacidade (`connections/route.ts:195-201`), promocao de fila (`:23-57`) |
| Pos-match -> WhatsApp | COMPLETE | gated a ACCEPTED nos dois lados (`mentee/page.tsx:34`, `MentorDashboard.tsx:280`) |
| Notificacoes | COMPLETE | poll 30s (`use-notifications.ts:18`) + bell + API |
| Admin (8 secoes) | COMPLETE | todas linkadas (`AdminNav.tsx:7-16`), RBAC em toda API |
| Conta: trocar senha | COMPLETE | verifica senha atual (`users/me/password/route.ts:38`) |
| Conta: excluir/erasure | BROKEN (ausente) | nenhum endpoint de delete de usuario existe |

Recursos que parecem prontos mas nao estao:
- Billing/planos: stub de exibicao ("todos FREE por ora", `SuperAdminView.tsx:161`). Tabelas
  `mm_subscription/mm_invoice/mm_plan` existem, mas nao ha fluxo de compra/ativacao.
- Limite por tenant `mm_tenant.maxMenteesPerMentor` (D-08) e editavel em settings
  (`admin/settings/route.ts:57`) mas nunca propaga para `mmUser.maxMentees`. O limite efetivo
  e o valor por-usuario (default 4). O "max 4" e um default, nao uma regra governada por tenant.

Codigo morto / orfaos:
- `components/mentormatch/dashboard/WaitlistManager.tsx`: nunca importado (a UI ativa e
  `WaitlistTab` em `MentorDashboard.tsx:297`).
- `app/mentormatch/admin/page.tsx` (super-admin): sem link de navegacao de entrada; so por URL
  direta (guardado, nao e furo de seguranca).

Limpeza: zero lorem/TODO/"em breve"/mock em caminho de producao. `db/seed.ts` nao e importado
por nenhuma rota/componente. `qa-emails` retorna 404 sem `MM_EMAIL_CAPTURE=1`.

O produto entrega a proposta de valor e o usuario completa a jornada sem ajuda. PASS com ressalvas.

---

## 2. MULTI-TENANT

Modelo: `tenantId` chega por query param mas e SEMPRE revalidado contra o usuario autoritativo
lido do banco (`getMmUserFromDb`), nunca contra claim de JWT estale.

Exemplo canonico (`mentors/route.ts:19`):
```ts
if (user.role !== 'SUPER_ADMIN' && user.tenantId !== tenantId) {
  return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });
}
```
`canAdminTenant` (`auth-helpers.ts:31-34`) governa o admin. Rotas com `:id` buscam a linha
primeiro e autorizam contra o tenant/owner da linha (sem IDOR).

Suite E2E de isolamento (`e2e/isolation.spec.ts`) prova 403 cross-tenant por entidade: users,
mentors, skills, library, invitations, connections, waitlist, notifications, e slug reservado.

| Vetor | Resultado |
|---|---|
| Tenant A le dados de B (lista/admin) | PASS (403, E2E) |
| IDs manipulados (IDOR em rotas `:id`) | PASS (row-then-authorize) |
| Convite cruzado | PASS (`invitations:49` + email-bound) |
| Link compartilhado (token de convite) | RISCO baixo (endpoint publico vaza email/role/tenantId, `invitations/[token]/route.ts:16-21`) |
| `connections` GET/PATCH sem predicado de tenant explicito | RISCO baixo (escopo por ownership; nao explorvel hoje) |

Classificacao geral multi-tenant: PASS na camada de dados, com 1 ponto de design a confirmar
(secao 3, auto-adesao de tenant).

---

## 3. SEGURANCA

| Item | Veredito | Evidencia |
|---|---|---|
| XSS | PASS | zero `dangerouslySetInnerHTML`; tema via objeto `style` React, nao string CSS |
| SQL Injection | PASS | Drizzle parametrizado; `sql``` so interpola colunas (`connections:54`) |
| CSRF | PASS | cookies `sameSite:'lax'` httpOnly secure (`auth.ts:76-88`) + CSRF token Auth.js |
| Session fixation | PASS | JWT stateless, claims re-derivados do DB no login |
| Tenant escaping | PASS | revalidacao contra sessao (secao 2) |
| Reutilizacao de convite | PASS | `used:true` em tx, TTL 7d, email-bound (`register/route.ts:51-80`) |
| Escalada de privilegio | PASS | role/tenant/status nao sao client-settable (`validators.ts:183-193`, `:22`) |
| Broken access control (admin) | PASS | role + tenant; cross-tenant admin = 403 (E2E) |
| Hardcoded secrets | PASS | tudo via env; `qa-emails`/`tenant/clear` seguros |
| Brute-force de login | FAIL | `authorize()` sem rate limit; `lib/rate-limit.ts` fail-open se KV cair |
| Auto-adesao de tenant | RISCO medio | `complete-profile/route.ts:31-46` atribui tenant a partir do cookie client `mm-tenant` e seta `status:'APPROVED'` sem convite |
| Upload | RISCO baixo | qualquer autenticado (ate PENDING), sem rate limit, `svg` permitido (`upload/route.ts`) |

Tentativa real de exploracao:
- Login: nao ha throttle no `authorize`; `bcrypt.compare` em loop sem custo de tentativa.
  Com KV indisponivel, ate os limites de register/forgot somem (fail-open). Exploravel.
- Auto-adesao: usuario que se registra sem convite escolhe qualquer tenant pondo o slug no
  cookie nao-httpOnly, e entra como MENTOR/MENTEE APPROVED. Para B2B isso e adesao
  auto-declarada. Confirmar intencao de produto; se tenant deve ser invite-only, e furo.

---

## 4. LGPD

| Checagem | Resultado | Evidencia |
|---|---|---|
| Email oculto antes do match | ADERENTE | `mentors/route.ts:82-92` e perfil `mentors/[mentorId]/page.tsx:82-96` nao retornam email |
| WhatsApp oculto antes do match | NAO ADERENTE | `mentor/page.tsx:56` inclui `whatsapp` no payload de requests PENDING |
| Exclusao de usuario (erasure) | AUSENTE | nenhum DELETE de usuario; admin so PATCH suspend (`admin/users/route.ts:50`) |
| Exportacao de dados | ADERENTE (admin) | `admin/export/route.ts:18` CSV tenant-scoped + `canAdminTenant`; nao ha export self-service do titular |
| Consentimento | AUSENTE | register e onboarding sem aceite de termos/privacidade; nenhum flag persistido |

Confirmacao first-hand do vazamento (`mentor/page.tsx:46-59`): o array `requests` (conexoes
PENDING, ainda nao aceitas) serializa `whatsapp: whatsappHref(m?.whatsapp)` no payload RSC/HTML
enviado ao navegador do mentor antes do aceite. A UI nao renderiza, mas o dado esta no fio
(view-source/network). O `waitlist` map (`:75`) corretamente omite. Fix = remover a linha 56.

Resposta: "O sistema esta aderente ao minimo de LGPD para operar?" NAO. Tres lacunas bloqueantes
num produto B2B que processa PII de colaboradores: WhatsApp pre-match, ausencia de erasure,
ausencia de consentimento. Email e export-admin estao ok. Decisao travada #8 (double opt-in,
export, delete) nao esta cumprida no ponto delete.

---

## 5. UX PREMIUM (contra D022)

Achado-cabecalho: tres sistemas de tema coexistem, divididos por fronteira de render. Componentes
client interativos adotam o DS canonico (`.mm`, `src/mentormatch/design-system`), mas as paginas
server que os hospedam e o chrome do dashboard usam tokens do an-site (`bg-bone`, `text-ink`,
`bg-paper`), e o layout raiz ainda aplica o legado Sprint-1 (`theme-*`) a toda a subarvore.

| Tela | Classificacao | Evidencia |
|---|---|---|
| Mentors (lista) | DS (referencia premium) | `MatchGrid.tsx:26` skeleton+empty+error+motion |
| Perfil de mentor | DS | `MentorProfile.tsx` |
| Mentor dashboard | DS | `MentorDashboard.tsx` |
| Admin (todas) | DS | managers com `mm-*` |
| Mentee dashboard | LEGACY (MVP) | `mentee/page.tsx:53,59,82` `bg-paper text-ink` |
| Requests | LEGACY (MVP) | `requests/page.tsx:38,46` |
| Library | LEGACY (MVP) | `library/page.tsx:29,30` |
| Auth (login/register/forgot/reset) | LEGACY | `(auth)/layout.tsx:9` + cada pagina |
| Chrome de todo `/t/[slug]` | LEGACY | `DashboardShell.tsx:22,23,32` envolve tudo |
| Landing `/mentormatch` e branded | LEGACY | `page.tsx:58` `theme-dark bg-bone` |

Dark mode: o toggle (`ColorSchemeToggle.tsx`) e o cookie `mm-color-scheme` so viram `.mm[data-theme]`.
Chrome, telas legadas e auth nao assinam `data-theme` -> alternar dark deixa cards DS escuros
dentro de shell claro an-site. Split light/dark na mesma tela.

Estados de UX:
- `error.tsx`: ZERO em todo `src/app/mentormatch`. Erro de render/query cai no fallback global.
- `loading.tsx`: apenas 1 (`t/[slug]/loading.tsx`). Mentee/requests/library/mentor dashboards
  sao server-rendered sem skeleton.
- Empty states: DS na lista de mentors; `<p>` cru nas telas legadas (`mentee/page.tsx:66`).
- Reports admin: loading e texto literal "Carregando..." (`ReportsView.tsx:44`).

"Existe tela com cara de MVP enquanto o resto e premium?" SIM, e sao as de maior trafego do
usuario final: Mentee dashboard, Requests, Library, e toda Auth. A lista de mentors e o admin
sao premium; o caminho diario do mentee nao e.

A11y/responsivo (spot-check): `<img>` cru em vez de `next/image` em 6 pontos (`MentorCard.tsx:34`,
`MentorProfile.tsx:353`, `MentorDashboard.tsx:440`, `MmOnboardingWizard.tsx:417`,
`AdminBrandingView.tsx:123,224`); `alt=""` num logo real (`AdminBrandingView.tsx:224`). Viola a
regra "next/image em TODAS imagens". Sem larguras fixas quebrando mobile; grids responsivos.

---

## 6. DESIGN SYSTEM (conformidade)

Grep completo de tokens legados vazando no MentorMatch:

an-site (`bg-bone|text-ink|bg-paper`): `mentormatch/page.tsx:58,74,85,98,115,118`,
`[slug]/page.tsx:22,51`, `mentee/page.tsx:53,59,82`, `library/page.tsx:29,30`,
`confirm/[mentorId]/page.tsx:41`, `requests/page.tsx:38,46`, `(auth)/layout.tsx:9` +
forgot/reset/register/login, `DashboardShell.tsx:22,23,32`, `SelectProfile.tsx:28,39`,
`WaitlistManager.tsx:83,113`, `RequestActions.tsx:49`, `RequestForm.tsx:51,64`.

Sprint-1 (`--accent|theme-dark`): `styles/themes/base.css:4,12-14`, `sicredi.css:12-14`,
`mentormatch/page.tsx:58`, `EmptyState.tsx:88,115`, `ToastContainer.tsx:10`,
`ThemeProvider.tsx:6,21`, `globals.css:1-3`. Default de tenant resolve para `theme-dark`
(`theme-engine.ts:18`, `schema.ts:51`).

Hex hardcoded: `SuperAdminView.tsx:366,397`, `AdminBrandingView.tsx:167`, `EmptyState.tsx:89,116`,
`ConfirmModal.tsx:84`, `NotificationsBell.tsx:100`. O `#4f46e5` aparece 3x (DS `--brand`, legado
`--accent`, literais) sem referenciar token.

Duas arvores de primitivos UI: a canonica (`src/mentormatch/design-system/components/`) e uma
duplicata legada (`src/components/mentormatch/ui/`) dependente de `--accent`. A duplicata e
leftover do Sprint-1.

Relatorio de conformidade: REPROVA. Existe `bg-bone`, `text-ink`, `--accent` e tema Sprint-1 vivos.
A migracao D022 chegou aos componentes interativos e ao admin, mas nao ao chrome, dashboards
de usuario final e auth.

---

## 7. PERFORMANCE

NAO MEDIDO neste ambiente. Nao ha browser headless nem URL de producao/preview disponivel para
rodar Lighthouse. As metas (Perf >=90, A11y >=95, BP >=95, SEO >=90) permanecem NAO VERIFICADAS,
o que e em si uma lacuna de go-live: os alvos precisam ser provados no preview do Vercel antes de
vender.

Gargalos observaveis no codigo (proxy, sem nota):
- 6 `<img>` cru sem otimizacao next/image (secao 5) -> LCP/CLS pior em telas com avatar.
- `framer-motion` no bundle de varias telas (First Load JS ~146-193kB nas rotas de tenant).
- Telas server-rendered sem skeleton -> tempo ate conteudo perceptivel maior no mentee/requests.

Acao: rodar Lighthouse Desktop e Mobile no preview e anexar os scores antes do GO.

---

## 8. BANCO DE DADOS

Schema e a camada mais forte: bem indexado nos caminhos de tenant, sem N+1, migrations em sync
(`drizzle/0003` casa com `schema.ts` linha a linha; inclui `can_mentor/can_mentee`).

Indices presentes: user (tenant/role/status), connection (mentor+status/mentee/tenant), skill,
library, invitation, notification, waitlist (mentor+position). Cobertura boa.

Riscos futuros:

| Severidade | Risco | Evidencia |
|---|---|---|
| ALTA | FKs de `mm_connection`/`mm_waitlist_entry` para users sao `onDelete: no action` -> deletar usuario com conexoes falha ou orfa; sem orquestracao de limpeza nas rotas | `schema.ts:147,150,178,181` |
| ALTA | Delete de tenant bloqueado/orfanando -> todos os FK `tenant_id` sao `no action` | `schema.ts:90,151,202,243` |
| MEDIA | `mm_user_skill.skillId` sem indice; consultado por skill em mentors e reports | `mentors/route.ts:29` |
| MEDIA | `mm_waitlist_entry` sem `tenantId`; unique `(mentor,mentee)` nao tenant-scoped | `schema.ts:174-191` |
| MEDIA | unique de `mm_connection` exclui `tenant_id`; integridade depende da app | `schema.ts:163` |
| BAIXA | `mm_usage` usa uuid de tenant sem FK e sem indice standalone | `schema.ts:287-303` |

Nota cruzada: o risco ALTA de cascade compoe a lacuna de erasure (secao 4) - mesmo adicionando
endpoint de delete, ele erra no banco sem estrategia de cascade/limpeza.

N+1: limpo. `mentors/route.ts` e `reports/route.ts` batelam tudo com `inArray` e reduzem em JS.

---

## 9. OPERACAO

| Item | Resultado | Evidencia |
|---|---|---|
| Logs | PASS | log estruturado JSON (`observability.ts:12-18`) |
| Observabilidade | PARCIAL | `captureError/alert5xx/alertEmailFailure` + webhook opcional; PR #35 espalha `alert5xx` por todo 5xx |
| Error tracking | AUSENTE por padrao | Sentry e so seam comentado (`observability.ts:43`); ativa so com `SENTRY_DSN` |
| Rate limiting | PARCIAL | register/forgot/troca-senha sim; login nao; fail-open se KV cair |
| Backup | DOCUMENTADO (manual) | `DEPLOY.md:31-39` pg_dump pre-deploy; sem backup automatizado alem do default Neon |
| Recovery | PARCIAL | restore via dump documentado; sem runbook de PITR testado |
| CI gate | PASS | `.github/workflows/mentormatch-e2e.yml` sobe Postgres efemero, seed real, E2E bloqueia merge |
| Smoke prod | PASS | `scripts/smoke.ts` valida login+match+email real |
| Seed de prod | PASS | `seed-production.ts` so Sicredi+super admin, idempotente, recusa sem creds, guarda anti-`*.test` |

Sinal de maturidade operacional: PR #35 mostra que o register deu 500 em producao por SCHEMA
DRIFT (migrations nao aplicadas ao DB de prod), nao por bug de codigo (register validado = 201).
Indica que o processo de migrate em prod ainda nao esta blindado.

Resposta: "Se um cliente entrar amanha, consigo operar sem intervencao manual?" PARCIALMENTE.
Da para operar com vigilancia, mas faltam: error tracking ativo, rate limit de login, processo
de migrate confiavel, e backup automatizado verificado. Hoje depende de operador atento.

---

## 10. GO-LIVE REVIEW

### O que impede producao hoje

P0 (bloqueia venda, viola requisito travado):
1. LGPD - WhatsApp no payload de requests PENDING antes do aceite (`mentor/page.tsx:56`).
   Viola "WhatsApp oculto antes do match". Fix: remover 1 linha.

P1 (must-fix antes de vender):
2. LGPD - sem exclusao de usuario (erasure). Viola decisao travada #8. Precisa endpoint +
   estrategia de cascade (ligado ao risco ALTA de DB).
3. LGPD - sem captura de consentimento no cadastro/onboarding.
4. Seguranca - brute-force de login: `authorize` sem rate limit + limiter fail-open.
5. Seguranca - auto-adesao de tenant via cookie client com `status APPROVED` sem convite
   (confirmar intencao de produto; se invite-only, e furo de integridade de tenant).
6. UX/DS - nao-conformidade D022 nas telas de maior trafego (mentee/requests/library/auth) e
   dark mode meio-ligado (split light/dark). Viola criterio "UX Premium" de go-live.
7. DB - estrategia de delete-cascade ausente (delete de user/tenant falha ou orfa).
8. Performance - Lighthouse nao medido; metas nao provadas.

P2 (corrigir cedo, nao bloqueia):
9. Endpoint publico de convite vaza email/role/tenantId (`invitations/[token]/route.ts:16`).
10. Upload sem rate limit, aberto a PENDING, aceita `svg`.
11. Forgot-password no-op sem cookie `mm-tenant`.
12. `maxMenteesPerMentor` por tenant nao propaga para `user.maxMentees`.
13. Indices faltando (`mm_user_skill.skillId`, etc.).
14. Error tracking (Sentry) nao ativado.

P3 (pode esperar):
15. `connections` GET/PATCH sem predicado de tenant explicito (defesa em profundidade).
16. Sem revogacao de sessao na troca/reset de senha.
17. Super-admin sem link de navegacao; `WaitlistManager.tsx` morto; billing stub.
18. Hex hardcoded e primitivos UI legados duplicados.

### O que deveria ser corrigido antes de vender
P0 e todos os P1. Sao o conjunto minimo que separa NO GO de GO. A maioria e cirurgica.

### O que pode esperar
P2 e P3. Billing e i18n ja estavam fora do MVP por decisao.

### Veredito: NO GO

---

## Plano de correcao priorizado (NO GO -> GO)

Slice 1 - LGPD e seguranca (bloqueantes, ~1-2 dias):
- [ ] Remover `whatsapp` do map `requests` em `mentor/page.tsx:56` (manter so em `actives`).
      Adicionar teste E2E: payload de PENDING nao contem `wa.me`.
- [ ] Rate limit no login: throttle por `ip+email+tenantSlug` no `authorize` (`auth.ts`).
      Avaliar fail-closed no caminho de auth.
- [ ] Decisao de produto sobre auto-adesao de tenant. Se invite-only: exigir convite ou
      aprovacao admin antes de atribuir tenant nao-default; ou `status:'PENDING'` em self-join.
- [ ] Consentimento: checkbox de termos/privacidade no register + flag persistido (coluna
      `consentAt`/`consentVersion` em `mm_user`).

Slice 2 - Erasure + integridade de dados (~1-2 dias):
- [ ] Endpoint de exclusao de usuario (self + admin) com anonimizacao/limpeza de conexoes,
      waitlist, notifications, skills.
- [ ] Definir `onDelete` (cascade/set null) nos FKs de connection/waitlist/tenant; gerar migration.
- [ ] Indices faltantes (`mm_user_skill.skillId` e cia).

Slice 3 - UX premium / DS (~2-4 dias):
- [ ] Migrar DashboardShell e telas mentee/requests/library/auth do an-site token set para o DS
      `.mm`/`--brand`. Mapa de equivalencia de tokens primeiro.
- [ ] Ligar dark mode no chrome e telas legadas (assinar `data-theme`), eliminar `theme-*` Sprint-1.
- [ ] Adicionar `error.tsx` e loading/skeleton nas telas server de usuario final.
- [ ] Trocar `<img>` por `next/image` nos 6 pontos.
- [ ] Remover primitivos UI duplicados e hex hardcoded.

Slice 4 - Operacao + performance (~1 dia):
- [ ] Ativar Sentry (`SENTRY_DSN`) e `ALERT_WEBHOOK_URL` em prod.
- [ ] Blindar o processo de migrate em prod (rodar migrate no deploy; healthcheck de schema -
      PR #35 ja adiciona `/health`).
- [ ] Rodar Lighthouse Desktop+Mobile no preview e anexar scores; fechar gargalos ate as metas.
- [ ] Backup automatizado verificado + runbook de restore testado.

Quando Slice 1 e 2 fecharem e o DS das telas de usuario final subir, o veredito vira GO WITH RISKS;
com Slice 3-4 fechados e Lighthouse provado, GO.
