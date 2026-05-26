# Bug: Admin auth retorna HTTP 400 em produção

## Status
Bloqueado. Diagnóstico completo. Fix planejado para slice 8.2.

## Causa raiz (confirmada)
Edge runtime incompatibility no middleware do Next.js.

`src/middleware.ts` importa `auth` de `src/lib/auth.ts`.
`src/lib/auth.ts` contém `DrizzleAdapter(db)` no mesmo arquivo.
Middleware roda obrigatoriamente em Edge runtime no Next.js.
Bundler empacota DrizzleAdapter + drivers pg no edge bundle.
Edge runtime não suporta drivers Node-only (pg, postgres).
Worker crasha silencioso na inicializacao -> HTTP 400 sem log.

Documentacao oficial do problema:
https://authjs.dev/guides/edge-compatibility

## Sintomas observados
- /admin/login renderiza OK
- Magic link envia via Resend OK (email chega)
- Click no link retorna 400
- curl /api/auth/csrf retorna 400
- vercel logs nao mostra nada para o request /api/auth/*
  (crash antes do logging hook)

## Componentes verificados OK (nao sao a causa)
- Schema Auth.js no Neon: 4 tabelas existem (account, session, user, verificationToken)
- Versoes compativeis: next-auth@5.0.0-beta.31 + @auth/drizzle-adapter@1.11.2
- Middleware exclui /admin/login e /api/auth/* do redirect
- Layout admin nao faz mais redirect que cria loop
- Route handler exporta GET/POST corretamente
- AUTH_URL, AUTH_TRUST_HOST, AUTH_SECRET setados em production
- Resend API key funcional (email chega)

## Fix planejado para slice 8.2 (estimativa: 30-45min)
Split em 2 arquivos conforme Auth.js v5 docs:

1. Criar src/lib/auth.config.ts:
   - Edge-safe
   - Providers (sem adapter)
   - Callbacks
   - Pages config

2. Refatorar src/lib/auth.ts:
   - Importa auth.config.ts
   - Adiciona DrizzleAdapter(db)
   - Exporta handlers, auth, signIn, signOut

3. Refatorar src/middleware.ts:
   - Importa apenas de auth.config.ts (nao auth.ts)
   - Recria instancia NextAuth(authConfig) leve

4. Adicionar em src/app/api/auth/[...nextauth]/route.ts:
   - export const runtime = 'nodejs' (defensive)

5. Validar:
   - curl /api/auth/csrf -> HTTP 200
   - Login flow end-to-end com magic link
   - Sessao persiste em /admin

## Workaround atual
Acesso admin desativado em producao.
Operacoes de dados via Neon SQL Editor (https://console.neon.tech)
ou pnpm tsx local com .env.local.

