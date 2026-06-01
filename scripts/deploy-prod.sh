#!/usr/bin/env bash
# deploy-prod.sh — go-live do MentorMatch em UM comando, com guardas e backup.
# Encadeia: validacao de envs -> BACKUP -> migrations -> seed:prod -> smoke.
#
# Uso (com os segredos de producao no ambiente):
#   CONFIRM_PROD=1 \
#   POSTGRES_URL=... MM_AUTH_SECRET=... AUTH_SECRET=... \
#   SUPER_ADMIN_EMAIL=... SUPER_ADMIN_PASSWORD='...' \
#   RESEND_API_KEY=... BLOB_READ_WRITE_TOKEN=... \
#   [SMOKE_BASE_URL=https://aurimarnogueira.com.br SMOKE_TENANT=sicredi \
#    SMOKE_ADMIN_EMAIL=... SMOKE_ADMIN_PASSWORD=... \
#    SMOKE_MENTOR_EMAIL=... SMOKE_MENTOR_PASSWORD=... \
#    SMOKE_MENTEE_EMAIL=... SMOKE_MENTEE_PASSWORD=...] \
#   pnpm release:prod
#
# O deploy do APP e automatico (Vercel no push para main). Este script cuida do
# banco (controlado, com backup) + smoke. NUNCA roda o seed de dev/fake.
set -euo pipefail

red()  { printf '\033[31m%s\033[0m\n' "$*"; }
grn()  { printf '\033[32m%s\033[0m\n' "$*"; }
ylw()  { printf '\033[33m%s\033[0m\n' "$*"; }
step() { printf '\n\033[1m== %s ==\033[0m\n' "$*"; }

# --- 0. Guarda de seguranca ---
if [ "${CONFIRM_PROD:-}" != "1" ]; then
  red "Recusado: defina CONFIRM_PROD=1 para confirmar que e PRODUCAO."
  red "Isto aplica migrations e seed no banco apontado por POSTGRES_URL."
  exit 1
fi

# --- 1. Validacao de envs obrigatorias ---
step "Validando variaveis de ambiente"
missing=0
need() { if [ -z "${!1:-}" ]; then red "  faltando: $1"; missing=1; else grn "  ok: $1"; fi; }
need POSTGRES_URL
need SUPER_ADMIN_EMAIL
need SUPER_ADMIN_PASSWORD
if [ -z "${MM_AUTH_SECRET:-}" ] && [ -z "${AUTH_SECRET:-}" ]; then
  red "  faltando: MM_AUTH_SECRET ou AUTH_SECRET"; missing=1
else grn "  ok: MM_AUTH_SECRET/AUTH_SECRET"; fi
[ -z "${RESEND_API_KEY:-}" ] && ylw "  aviso: RESEND_API_KEY ausente -> emails NAO serao enviados."
[ -z "${BLOB_READ_WRITE_TOKEN:-}" ] && ylw "  aviso: BLOB_READ_WRITE_TOKEN ausente -> uploads (logo/material) falharao."
[ -z "${ALERT_WEBHOOK_URL:-}${SENTRY_DSN:-}" ] && ylw "  aviso: sem ALERT_WEBHOOK_URL/SENTRY_DSN -> alertas so em log."
if [ "$missing" = "1" ]; then red "Abortado: envs obrigatorias ausentes."; exit 1; fi

# --- 2. BACKUP (antes de qualquer escrita) ---
step "Backup do banco (pg_dump)"
PG_DUMP="$(command -v pg_dump || ls /usr/lib/postgresql/*/bin/pg_dump 2>/dev/null | head -1 || true)"
if [ -z "$PG_DUMP" ]; then red "pg_dump nao encontrado. Instale postgresql-client ou faca backup manual antes."; exit 1; fi
BACKUP="backup-pre-deploy-$(date +%Y%m%d-%H%M%S).dump"
"$PG_DUMP" "$POSTGRES_URL" -Fc -f "$BACKUP"
grn "  backup salvo: $BACKUP ($(du -h "$BACKUP" | cut -f1))"

# --- 3. Migrations (schema) ---
step "Aplicando schema (drizzle-kit push)"
pnpm exec drizzle-kit push --force

# --- 4. Seed de producao (so Sicredi + super admin, zero fake) ---
step "Seed de producao"
pnpm seed:prod

# Guarda anti-fake: producao nao pode conter contas *.test
if command -v psql >/dev/null 2>&1; then
  FAKE="$(psql "$POSTGRES_URL" -tA -c "select count(*) from mm_user where email like '%.test'" 2>/dev/null || echo 0)"
  if [ "${FAKE:-0}" != "0" ]; then red "  ALERTA: $FAKE conta(s) *.test no banco de PRODUCAO. Investigue antes de seguir."; fi
fi

# --- 5. Smoke (opcional, contra o ambiente real) ---
if [ -n "${SMOKE_BASE_URL:-}" ]; then
  step "Smoke test em $SMOKE_BASE_URL"
  pnpm smoke
else
  ylw "\nSmoke pulado (SMOKE_BASE_URL nao setado). Rode depois: pnpm smoke (ver DEPLOY.md §6)."
fi

step "Concluido"
grn "Backup: $BACKUP | Schema aplicado | Seed Sicredi+super | Smoke: ${SMOKE_BASE_URL:-pendente}"
grn "DONE quando o smoke estiver verde em producao e o email do match for recebido."
