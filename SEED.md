# SEED.md — Base de validação real do MentorMatch (D023)

Dados reais para rodar e verificar os fluxos. Sem mock. Seed idempotente
(`scripts/seed-mentormatch.ts`), rodável N vezes.

## Como rodar

```bash
# 1. Subir um Postgres (qualquer um). Exemplo local efêmero:
#    docker run -d -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=mentormatch -p 5432:5432 postgres:16
export POSTGRES_URL="postgresql://postgres:postgres@127.0.0.1:5432/mentormatch"

# 2. Aplicar o schema
pnpm db:push          # ou: POSTGRES_URL=... npx drizzle-kit push

# 3. Popular (idempotente — pode rodar várias vezes)
pnpm seed
```

## O que o seed cria

- **2 tenants:** `default` (brand `#6366F1`, tema dark) e `sicredi` (brand `#33820D`, tema sicredi).
- **Por tenant:** 1 admin, 6 mentores, 8 mentorados, 6 skills, conexões aceitas/pendentes, waitlist e notificações.
- **1 super admin global.**

### Capacidade dos mentores (por tenant) — para testar disponível/lotado/waitlist

| Mentor | Aceitos | Estado | Extra |
|---|---|---|---|
| mentor1 | 0/4 | Disponível | 2 solicitações PENDENTES para aceitar/recusar |
| mentor2 | 2/4 | Disponível | |
| mentor3 | 4/4 | Lotado | |
| mentor4 | 0/4 | Disponível | |
| mentor5 | 2/4 | Disponível | |
| mentor6 | 4/4 | Lotado | 3 na fila de espera |

## Credenciais de teste

Senhas: admin = `admin1234`, mentores/mentorados = `test1234`, super admin = `super1234`.
O login é sempre dentro do slug do tenant (`/mentormatch/{slug}/login`) — D023.1.

| Conta | Email | Senha | Representa |
|---|---|---|---|
| Super admin | `super@mm.test` | `super1234` | Acesso global a `/mentormatch/admin` |
| Admin (default) | `admin@default.test` | `admin1234` | Admin do tenant default |
| Admin (sicredi) | `admin@sicredi.test` | `admin1234` | Admin do tenant Sicredi |
| Mentor disponível | `mentor1@default.test` | `test1234` | 0/4 + 2 solicitações pendentes |
| Mentor lotado | `mentor6@default.test` | `test1234` | 4/4 + 3 na waitlist |
| Mentorado | `mentee1@default.test` | `test1234` | Tem 1 mentoria aceita |
| Mentorado livre | `mentee8@default.test` | `test1234` | Sem conexão (bom para enviar request) |

> Os mesmos padrões valem para o tenant `sicredi` (troque `@default.test` por `@sicredi.test`).

Super admin pode ser sobrescrito por `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD`.

## E2E

`pnpm test:e2e` sobe o app contra o banco seedado e exercita: login (com tenant),
vitrine de match, enviar solicitação, mentor aceitar. Ver `e2e/`.
Requer `POSTGRES_URL`, `AUTH_SECRET` e `MM_AUTH_SECRET` no ambiente.
