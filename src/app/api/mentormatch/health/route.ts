import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { alert5xx } from '@/lib/mentormatch/observability';

export const dynamic = 'force-dynamic';

// Diagnostico de go-live do MentorMatch. Gated por token (MM_DIAG_TOKEN): sem a
// env o endpoint fica DESLIGADO (404), e o token deve bater por header
// `x-diag-token` ou query `?token=`. Nao expoe PII — so estado estrutural do
// banco (colunas, contagens, slugs/brand de tenant). Serve para confirmar em
// segundos se um 500 ("Erro interno") vem de schema desatualizado ou seed.
//
//   curl -s "$BASE/api/mentormatch/health?token=$MM_DIAG_TOKEN" | jq
//
// Colunas criticas verificadas (D-22): mm_user.can_mentor / can_mentee. Se uma
// faltar, qualquer SELECT/INSERT do Drizzle em mm_user quebra → 500 no cadastro.
const REQUIRED_MM_USER_COLUMNS = ['can_mentor', 'can_mentee', 'tenant_id', 'status', 'role'];

function authorized(req: Request): boolean {
  const expected = process.env.MM_DIAG_TOKEN;
  if (!expected) return false; // endpoint desligado sem token configurado
  const url = new URL(req.url);
  const provided = req.headers.get('x-diag-token') ?? url.searchParams.get('token') ?? '';
  // Comparacao de tamanho fixo simples (token de diagnostico, baixo risco).
  return provided.length > 0 && provided === expected;
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    // 404 (nao 401) para nao revelar a existencia do endpoint sem token.
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const checks: Record<string, unknown> = {};
  let ok = true;

  try {
    // 1. Conectividade.
    await db.execute(sql`select 1`);
    checks.db = 'up';

    // 2. Colunas do mm_user (drift de schema = causa comum de 500 no cadastro).
    const cols = (await db.execute(sql`
      select column_name from information_schema.columns
      where table_schema = 'public' and table_name = 'mm_user'
    `)) as unknown as { rows?: { column_name: string }[] } | { column_name: string }[];
    const colRows = Array.isArray(cols) ? cols : (cols.rows ?? []);
    const present = new Set(colRows.map((r) => r.column_name));
    const missing = REQUIRED_MM_USER_COLUMNS.filter((c) => !present.has(c));
    checks.mmUserColumns = { ok: missing.length === 0, missing };
    if (missing.length > 0) ok = false;

    // 3. Tenants (sem PII: so slug/brand/active) — revela seed e branding.
    const tenants = (await db.execute(sql`
      select slug, brand_color, active from mm_tenant order by slug
    `)) as unknown as { rows?: Record<string, unknown>[] } | Record<string, unknown>[];
    const tenantRows = Array.isArray(tenants) ? tenants : (tenants.rows ?? []);
    checks.tenants = tenantRows;

    // 4. Contagens estruturais (sem emails).
    const counts = (await db.execute(sql`
      select
        (select count(*)::int from mm_user) as users,
        (select count(*)::int from mm_user where role = 'SUPER_ADMIN') as super_admins,
        (select count(*)::int from mm_user where email like '%.test') as test_accounts
    `)) as unknown as { rows?: Record<string, unknown>[] } | Record<string, unknown>[];
    const countRows = Array.isArray(counts) ? counts : (counts.rows ?? []);
    checks.counts = countRows[0] ?? {};
  } catch (error) {
    ok = false;
    checks.db = 'error';
    alert5xx('health', error);
    checks.error = error instanceof Error ? error.message : String(error);
  }

  return NextResponse.json({ ok, ts: new Date().toISOString(), checks }, { status: ok ? 200 : 503 });
}
