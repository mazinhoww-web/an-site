# DEPLOY.md — MentorMatch em produção

> Critério de DONE: **observado em produção, smoke verde** (match real + email real).
> Estes passos rodam com **acesso de produção** (Vercel + Postgres + Resend) que
> NÃO está no sandbox do Claude. O código/scripts abaixo já estão prontos e
> verificados localmente; execute na ordem.

## 0. Pré-requisitos
- Projeto Vercel ligado ao repo (deploy por git push).
- Banco Postgres de produção (Vercel Postgres/Neon).
- Conta Resend com domínio verificado.

## 1. Variáveis de ambiente (Vercel → Project → Settings → Environment Variables)
Ver `.env.production.example` para a lista completa. Mínimo para o MentorMatch:

| Var | Uso |
|---|---|
| `POSTGRES_URL` | banco (mesmo do an-site) |
| `AUTH_SECRET` | NextAuth do site |
| `MM_AUTH_SECRET` | NextAuth do MentorMatch (gere outro: `openssl rand -base64 32`) |
| `AUTH_URL` / `NEXT_PUBLIC_APP_URL` | `https://aurimarnogueira.com.br` |
| `AUTH_TRUST_HOST` | `true` |
| `RESEND_API_KEY` / `RESEND_FROM` / `RESEND_REPLY_TO` | email transacional |
| `BLOB_READ_WRITE_TOKEN` | upload (logo, materiais, avatar) |
| `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` | seed do super admin (senha ≥12) |
| `ALERT_WEBHOOK_URL` | (opcional) alerta de erro/5xx/falha de email |
| `SENTRY_DSN` | (opcional) captura de erro — ver §5 |

Setar para **Production** (e Preview se quiser). Nunca commitar valores reais.

## 2. Migrations (com BACKUP antes) — must-have
```bash
# 2.1 BACKUP primeiro (irreversível sem isso)
pg_dump "$POSTGRES_URL" -Fc -f backup-pre-deploy-$(date +%F).dump

# 2.2 Aplicar o schema. Em DB já existente preferir migrate; em DB novo, push.
POSTGRES_URL=... pnpm db:migrate     # aplica drizzle/*.sql versionados
# (alternativa em DB vazio) POSTGRES_URL=... pnpm db:push
```
> O repo gera migrations estilo snapshot (ver `drizzle/`). Em DB já populado,
> revisar o diff do `db:push`/`migrate` antes de aplicar. Sempre com backup.

## 3. Seed de produção (SÓ Sicredi + super admin, ZERO fake) — must-have
```bash
POSTGRES_URL=... \
SUPER_ADMIN_EMAIL=espindolanogueira@yahoo.com.br \
SUPER_ADMIN_PASSWORD='<senha-forte-12+>' \
pnpm seed:prod
```
- Cria: plano Free, tenant `sicredi` (#33820D), super admin, skills padrão.
- Idempotente. Recusa sem credenciais. **Nunca** rode `pnpm seed` (dev/fake) em produção.
- Verificação: `select slug from mm_tenant;` → só `sicredi`; `select count(*) from mm_user where email like '%.test';` → **0**.

## 4. Deploy
`git push` na branch de produção (Vercel faz o build). O build **não depende de DB**
(o `/sitemap.xml` é dinâmico agora). Confirme deploy verde no Vercel.

## 5. Observabilidade — must-have (alerta em erro/5xx e falha de email)
- Já incluso: `src/lib/mentormatch/observability.ts` — log estruturado (JSON) +
  `captureError` / `alert5xx` / `alertEmailFailure`. Falhas de email já chamam
  `alertEmailFailure` em `email.ts`.
- **Alerta externo:** setar `ALERT_WEBHOOK_URL` (Slack/Discord/webhook) → recebe POST
  em cada erro/5xx/falha de email.
- **Sentry (recomendado):** `pnpm add @sentry/nextjs`, configurar com `SENTRY_DSN`, e
  rotear `captureError`/`alert*` para `Sentry.captureException` (seam comentado no
  arquivo). Logs estruturados funcionam sem Sentry.
- **Cobertura:** todos os route handlers `mm_*` chamam `alert5xx('<endpoint>', error)`
  no catch — qualquer 500 ("Erro interno") vira log estruturado `error:<endpoint>` +
  webhook, com a mensagem real do Postgres. É assim que se descobre a causa de um
  cadastro/login que falha em produção.

## 5b. Diagnóstico de go-live — `GET /api/mentormatch/health`
Endpoint protegido por `MM_DIAG_TOKEN` (sem a env → 404, fica desligado). Confirma
em segundos, sem `psql`, se um 500 vem de **schema desatualizado** ou **seed**:
```bash
curl -s "https://aurimarnogueira.com.br/api/mentormatch/health?token=$MM_DIAG_TOKEN" | jq
```
Retorna (sem PII): `db` up/error, `mmUserColumns` (colunas críticas D-22
`can_mentor`/`can_mentee` presentes), `tenants` (slug/brand/active) e `counts`
(users, super_admins, test_accounts). Leitura:
- `mmUserColumns.missing` não-vazio → **rode as migrations** (`drizzle-kit push --force`).
  Drizzle emite a lista explícita de colunas; faltando uma, todo SELECT/INSERT em
  `mm_user` quebra → 500 no cadastro.
- só `sicredi` (#33820D) em `tenants` e `test_accounts: 0` → seed de produção correto.
  Presença de `default` (#6366f1) ou `test_accounts > 0` → seed de **dev** vazou para
  produção; limpar antes do go-live.

## 6. Smoke test em produção — DONE
Com contas **reais** (não seed). Crie/aprove no painel: 1 admin (já é o seed),
1 mentor e 1 mentee onboardados no tenant Sicredi. Então:
```bash
SMOKE_BASE_URL=https://aurimarnogueira.com.br SMOKE_TENANT=sicredi \
SMOKE_ADMIN_EMAIL=... SMOKE_ADMIN_PASSWORD=... \
SMOKE_MENTOR_EMAIL=... SMOKE_MENTOR_PASSWORD=... \
SMOKE_MENTEE_EMAIL=... SMOKE_MENTEE_PASSWORD=... \
pnpm smoke
```
Verifica: landing branded 200 → login admin → admin lê o próprio tenant →
mentee solicita o mentor → mentor aceita (**MATCH criado**). O **email real** do
aceite é observado na caixa de entrada do mentee. Saída `0 FAIL` = smoke verde.

**DONE** = `pnpm smoke` verde em produção + email do match recebido (observado).

## Checklist final
- [ ] Backup do DB feito antes das migrations.
- [ ] Migrations aplicadas; deploy Vercel verde.
- [ ] `pnpm seed:prod` rodado; só `sicredi` + super admin, zero `*.test`.
- [ ] `ALERT_WEBHOOK_URL` (e/ou Sentry) ativo; testar um erro proposital opcional.
- [ ] `pnpm smoke` verde em produção; email do match recebido.
