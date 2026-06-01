/**
 * Smoke test do MentorMatch contra um ambiente REAL (producao ou preview).
 * Nao usa seed: usa contas reais passadas por env. Mutacoes minimas (1 match).
 *
 *   SMOKE_BASE_URL=https://aurimarnogueira.com.br \
 *   SMOKE_TENANT=sicredi \
 *   SMOKE_ADMIN_EMAIL=... SMOKE_ADMIN_PASSWORD=... \
 *   [SMOKE_MENTEE_EMAIL=... SMOKE_MENTEE_PASSWORD=... SMOKE_MENTOR_EMAIL=... SMOKE_MENTOR_PASSWORD=...] \
 *   pnpm smoke
 *
 * Sai 0 se verde, 1 se qualquer passo falhar. O recebimento do EMAIL real e
 * observado pelo operador na caixa de entrada (o smoke dispara o evento).
 */

const BASE = (process.env.SMOKE_BASE_URL ?? '').replace(/\/$/, '');
const TENANT = process.env.SMOKE_TENANT ?? 'sicredi';
if (!BASE) throw new Error('SMOKE_BASE_URL obrigatorio');

const AUTH = `${BASE}/api/mentormatch/auth`;
let pass = 0;
let fail = 0;
function check(ok: boolean, label: string) {
  console.log(`${ok ? 'OK  ' : 'FAIL'}  ${label}`);
  if (ok) pass++;
  else fail++;
}

// Cookie jar minimo.
function jar() {
  const store = new Map<string, string>();
  return {
    header: () => [...store.entries()].map(([k, v]) => `${k}=${v}`).join('; '),
    absorb: (res: Response) => {
      const sc = res.headers.getSetCookie?.() ?? [];
      for (const c of sc) {
        const [pair] = c.split(';');
        const eq = pair!.indexOf('=');
        if (eq > 0) store.set(pair!.slice(0, eq), pair!.slice(eq + 1));
      }
    },
  };
}

async function asJson<T>(res: Response, label: string): Promise<T> {
  const ct = res.headers.get('content-type') ?? '';
  if (!ct.includes('application/json')) {
    throw new Error(`${label}: HTTP ${res.status} com resposta nao-JSON (${ct || 'sem content-type'}). O ambiente esta no ar e saudavel?`);
  }
  return (await res.json()) as T;
}

async function login(email: string, password: string): Promise<ReturnType<typeof jar>> {
  const j = jar();
  const csrfRes = await fetch(`${AUTH}/csrf`, { headers: { cookie: j.header() } });
  j.absorb(csrfRes);
  const { csrfToken } = await asJson<{ csrfToken: string }>(csrfRes, 'csrf');
  const body = new URLSearchParams({ csrfToken, email, password, tenantSlug: TENANT, json: 'true' });
  const res = await fetch(`${AUTH}/callback/credentials`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', cookie: j.header() },
    body,
    redirect: 'manual',
  });
  j.absorb(res);
  return j;
}

async function session(j: ReturnType<typeof jar>) {
  const res = await fetch(`${AUTH}/session`, { headers: { cookie: j.header() } });
  return ((await res.json()) ?? {}) as { user?: { id: string; role: string; tenantId: string } };
}

async function main() {
  // 1. Landing branded do tenant responde.
  const landing = await fetch(`${BASE}/mentormatch/${TENANT}`);
  check(landing.status === 200, `landing /mentormatch/${TENANT} → 200`);

  // 2. Login do admin real.
  const adminEmail = process.env.SMOKE_ADMIN_EMAIL;
  const adminPass = process.env.SMOKE_ADMIN_PASSWORD;
  if (adminEmail && adminPass) {
    const j = await login(adminEmail, adminPass);
    const s = await session(j);
    check(Boolean(s.user), 'login admin → sessao');
    if (s.user) {
      const users = await fetch(`${BASE}/api/mentormatch/admin/users?tenantId=${s.user.tenantId}`, {
        headers: { cookie: j.header() },
      });
      check(users.status === 200, 'admin le usuarios do proprio tenant → 200');
    }
  } else {
    console.log('SKIP  login admin (SMOKE_ADMIN_* nao setado)');
  }

  // 3. Match ponta a ponta (opcional, com contas reais ja onboardadas).
  const me = process.env.SMOKE_MENTEE_EMAIL;
  const mp = process.env.SMOKE_MENTEE_PASSWORD;
  const tr = process.env.SMOKE_MENTOR_EMAIL;
  const trp = process.env.SMOKE_MENTOR_PASSWORD;
  if (me && mp && tr && trp) {
    // Mira o mentor configurado (login p/ obter o id) — match deterministico.
    const jt = await login(tr, trp);
    const st = await session(jt);
    const mentorId = st.user!.id;
    check(Boolean(mentorId), 'login mentor configurado');

    const jm = await login(me, mp);
    const sm = await session(jm);
    const menteeId = sm.user!.id;
    const req = await fetch(`${BASE}/api/mentormatch/connections`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: jm.header() },
      body: JSON.stringify({ mentorId }),
    });
    check([201, 409].includes(req.status), `mentee solicita o mentor → ${req.status}`);

    const myConns = (await (
      await fetch(`${BASE}/api/mentormatch/connections`, { headers: { cookie: jt.header() } })
    ).json()) as { id: string; menteeId: string; status: string }[];
    const pending = myConns.find((c) => c.menteeId === menteeId && c.status === 'PENDING');
    if (pending) {
      const acc = await fetch(`${BASE}/api/mentormatch/connections`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json', cookie: jt.header() },
        body: JSON.stringify({ connectionId: pending.id, status: 'ACCEPTED' }),
      });
      check(acc.ok, 'mentor aceita → MATCH criado (email disparado; verifique a caixa)');
    } else {
      const already = myConns.find((c) => c.menteeId === menteeId && c.status === 'ACCEPTED');
      check(Boolean(already), 'match ja ativo entre as contas (idempotente)');
    }
  } else {
    console.log('SKIP  match e2e (SMOKE_MENTEE_*/SMOKE_MENTOR_* nao setados)');
  }

  console.log(`\nResultado: ${pass} OK, ${fail} FAIL`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('smoke falhou', e);
  process.exit(1);
});
