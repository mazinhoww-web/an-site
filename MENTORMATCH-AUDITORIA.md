# MentorMatch — Auditoria de bugs (snapshot do zip)

Base: `mentormatch-main.zip` enviado em 2026-05-28. Analise estatica (sem rodar com banco).
App standalone Next.js 16 + React 19 + Prisma 6 + Tailwind 4 + NextAuth v5 (credentials + bcrypt), `basePath: /mentormatch`.
An-site apenas proxia `/mentormatch/*` e `/sicredi/mentormatch/*` via rewrite.

Severidade: P0 quebra a jornada, P1 quebra funcionalidade/seguranca, P2 fragil/risco, P3 cosmetico.

---

## P0 — Quebram a jornada principal

### P0.1 — Registro publico nunca recebe tenant. Usuario fica preso em loop.
- `api/auth/register`: sem convite, cria user com `status=PENDING`, `role=null`, `tenantId=null`.
- `select-profile/SelectProfileClient`: so navega no client (`pushTenant("/onboarding/mentor")`). Nao grava nada no banco.
- `api/auth/complete-profile`: grava `role` + `onboardingDone=true`, mas **nunca grava `tenantId`**. O cookie `mm-tenant` jamais e lido para atribuir o tenant.
- Resultado: apos onboarding o user tem `role` mas `tenantId=null`. `resolvePostLoginHref`/`getDashboardHref` fazem `if (!tenant?.slug) return "/select-profile"`. **Loop infinito de volta ao select-profile. Nunca chega ao dashboard.**
- Provavel causa raiz do "login e direcionamento nao funcionam".
- Fix: `complete-profile` (ou register) deve resolver o tenant pelo cookie `mm-tenant` (fallback `default`) e gravar `tenantId`. Validar que o tenant existe e esta ativo.

### P0.2 — Seed nao cria SUPER_ADMIN nem o tenant Sicredi.
- `prisma/seed.ts` cria apenas: planos, skills, tenant `default` e `admin@mentormatch.com` (role ADMIN, senha `admin123`).
- Nao existe: usuario `SUPER_ADMIN`, o `espindolanogueira@yahoo.com.br` / `Facil022@` (citados na QA FIX #16/#17), nem o tenant `sicredi`.
- Consequencias:
  - `/mentormatch/admin` (painel super admin) inacessivel: ninguem tem role SUPER_ADMIN.
  - `/mentormatch/t/sicredi/*` retorna `notFound()` (sem linha de tenant). FIX #18 quebrado na camada de dados.
  - A landing `/sicredi` renderiza, mas qualquer fluxo logado do tenant sicredi falha.
- Fix: adicionar ao seed o tenant `sicredi` (brandColor #33820D, tokens/tema) e um usuario SUPER_ADMIN.

---

## P1 — Quebram funcionalidade ou seguranca

### P1.1 — Sem checagem de papel x rota e sem checagem de tenant-ownership no grupo (dashboard).
- `t/[slug]/(dashboard)/layout.tsx`: so valida `session` existe e `tenant` existe. **Nao valida que o usuario pertence ao `slug`, nem que o `role` casa com a pagina.**
- Um MENTEE consegue abrir `/t/{slug}/mentor`; um usuario do tenant A consegue abrir dashboards do tenant B. A QA "Teste de seguranca" espera redirect.
- `admin/layout.tsx` e `admin/page.tsx` (super) checam role (ok), mas o grupo dashboard nao.
- Fix: no layout do grupo dashboard, redirecionar se `session.user.tenantSlug !== slug` e se o role nao corresponde a sub-rota.

### P1.2 — Redirect de auth para usuario logado e so client-side.
- FIX #8 (login/register redirecionam quem ja tem sessao) so acontece via `useEffect` no `login/page.tsx` (`isAuthenticated -> pushTenant`). Causa flash do form e nao cobre `/register` server-side.
- Middleware nao trata isso. Fix: tratar no middleware ou em server component.

### P1.3 — Middleware so checa presenca do cookie, nao valida a sessao.
- `middleware.ts` apenas verifica se `mm.session-token` existe; nao verifica assinatura/validade. Cookie forjado/expirado passa pela guarda de borda (as paginas ainda re-checam via `auth()`, entao nao e bypass total, mas a guarda e ilusoria).
- `select-profile` e `onboarding` estao em `publicPaths`: acessiveis sem login (dependem de guarda na pagina/API).

### P1.4 — Tema/branding do Sicredi sem dados.
- Existe `styles/themes/sicredi.css`, `theme-engine.ts` e a landing branded, mas sem linha de tenant `sicredi` no banco (ver P0.2) o tema/tokens nao carregam no fluxo logado. FIX #18 (Exo 2 + Nunito + verde) so funciona na landing estatica.

### P1.5 — Reset de senha depende de envio de email nao garantido.
- `forgot-password` cria `verificationToken` e chama `sendPasswordResetEmail`. Se Resend nao estiver configurado (`RESEND_API_KEY`/`from`), o link nunca chega e o fluxo trava silenciosamente (retorna sucesso sempre por design anti-enumeracao). Verificar config de email em producao.

---

## P2 — Fragilidades e riscos

### P2.1 — basePath misturado com paths hardcoded.
- App tem `basePath: /mentormatch`. `redirect()`/`<Link>`/`signIn.pages` recebem o prefixo automaticamente, mas o codigo mistura: `fetch("/mentormatch/api/...")` hardcoded (welcome, onboarding clients) e `forgot-password` monta `${NEXTAUTH_URL}/mentormatch/reset-password`. Se `NEXTAUTH_URL` ja incluir `/mentormatch`, vira `/mentormatch/mentormatch/...`. Padronizar a construcao de URLs.

### P2.2 — Cookie de tenant atraves do proxy (cross-domain) precisa de verificacao E2E.
- O `mm-tenant` e setado pelo middleware do app em `/sicredi`. Via proxy do an-site (`aurimarnogueira.com.br` -> vercel), o Set-Cookie volta pelo dominio do an-site. As rotas internas do sicredi sao reescritas para a rota generica (`/mentormatch/login`). Validar ponta a ponta que o cookie persiste e e lido no register/complete-profile.

### P2.3 — `deleteTenant` na verdade so desativa (`active:false`).
- Nome enganoso. Funcional, mas o painel chama "deletar" e o registro permanece. Alinhar UX/nomenclatura.

### P2.4 — Skills globais, nao por tenant.
- `Skill.name` unico global; `complete-profile` cria/reaproveita por nome. Tenants compartilham o catalogo de skills. Pode ser intencional, mas conflita com isolamento multitenant.

### P2.5 — Switch Mentor<->Mentorado (FIX #15).
- `PATCH /api/users/me` aceita troca de `role`. Confirmar que existe o botao na sidebar e que a sessao (JWT) e atualizada via `update()` apos a troca, senao o redirect usa role antigo.

---

## P3 — Cosmeticos / menores

- `welcome/page.tsx` depende de `SessionProvider` (next-auth/react). Confirmar provider no layout.
- Empty states / dados mockados (FIX #6), contraste (FIX #10), 7 dias de disponibilidade (FIX #12): exigem verificacao visual rodando o app (fora do escopo estatico).

---

## Itens que JA estao corretos no codigo
- Cookies `mm.session-token` / `mm.csrf-token` (FIX da QA): ok em `lib/auth.ts`.
- Erro de email duplicado com mensagem certa (FIX #11): `register` retorna 409 "Um usuario com este email ja existe" (falta so o link inline "Fazer login" no client).
- Labels neutros sem "corporativo" (FIX #13): login usa "E-mail" / "seu@email.com".
- Texto de welcome por papel (FIX #9): ok.
- Redirect por papel centralizado (FIX #16): `dashboard-href.ts` + `post-login-href.ts` ok (exceto o bug de tenant em P0.1).
- CRUD de tenants pelo super admin (FIX #17): `admin/actions.ts` ok (createTenant, setTenantActive).

---

## Recomendacao de ordem de correcao
1. P0.1 (atribuir tenant no complete-profile) e P0.2 (seed SUPER_ADMIN + sicredi). Sem isso nada loga ate o dashboard.
2. P1.1 (RBAC tenant/role no grupo dashboard).
3. P1.4 + P2.2 (tenant sicredi com tokens + cookie E2E).
4. P1.2 / P1.3 (guardas de auth/middleware).
5. Resto.

Observacao de execucao: estas correcoes sao no repositorio do MentorMatch (app standalone), nao no an-site. Esta sessao so tem acesso de escrita ao `mazinhoww-web/an-site`.
