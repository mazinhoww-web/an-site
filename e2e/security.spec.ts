import { expect, request as playwrightRequest, test } from '@playwright/test';
import { mmLogin, mmSession } from './helpers';

// QA adversarial: hardening + LGPD. Cada teste tenta explorar uma fraqueza e
// espera que o sistema bloqueie/oculte. Roda contra o banco seedado.

const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
const ctx = () => playwrightRequest.newContext({ baseURL: BASE_URL });

function defaultCookieCtx() {
  return playwrightRequest.newContext({
    baseURL: BASE_URL,
    storageState: {
      cookies: [
        { name: 'mm-tenant', value: 'default', domain: 'localhost', path: '/', expires: -1, httpOnly: false, secure: false, sameSite: 'Lax' },
      ],
      origins: [],
    },
  });
}

async function defaultRefs(): Promise<{ tenantId: string; skillId: string }> {
  // Super admin esta no tenant default (seed) -> evita logins extras de mentee1
  // que poderiam esbarrar no rate limit de login compartilhado por localhost.
  const sup = await ctx();
  await mmLogin(sup, 'super@mm.test', 'super1234', 'default');
  const tenantId = (await mmSession(sup)).user!.tenantId;
  const skills = (await (await sup.get(`/api/mentormatch/skills?tenantId=${tenantId}`)).json()) as { id: string }[];
  await sup.dispose();
  return { tenantId, skillId: skills[0]!.id };
}

test('LGPD: WhatsApp do mentorado NAO vaza no PENDING; aparece so pos-aceite', async () => {
  const { tenantId, skillId } = await defaultRefs();
  const WA = '5511977776666'; // numero unico para buscar no HTML
  const email = `wa-leak-${Date.now()}@mm.test`;

  // Mentorado novo, aprovado (tenant default aberto), com WhatsApp conhecido.
  const me = await defaultCookieCtx();
  expect((await me.post('/api/mentormatch/auth/register', { data: { name: 'WA Probe', email, password: 'test1234', consent: true } })).status()).toBe(201);
  await mmLogin(me, email, 'test1234', 'default');
  const cp = await me.post('/api/mentormatch/auth/complete-profile', {
    data: { role: 'MENTEE', name: 'WA Probe', skills: [skillId], canMentee: true, whatsapp: WA },
  });
  expect(cp.ok()).toBeTruthy();
  // O id da sessao (sub) e estavel; o tenantId da sessao so atualiza apos
  // session.update(), entao usamos o tenantId conhecido (default) do defaultRefs.
  const menteeId = (await mmSession(me)).user!.id;

  // Solicita um mentor com vaga.
  const mentors = (await (await me.get(`/api/mentormatch/mentors?tenantId=${tenantId}`)).json()) as { id: string; activeConnections: number; maxMentees: number }[];
  const mentor = mentors.find((m) => m.activeConnections < m.maxMentees)!;
  expect((await me.post('/api/mentormatch/connections', { data: { mentorId: mentor.id } })).status()).toBe(201);
  await me.dispose();

  // Acha o mentor dono e exercita a visao dele.
  let accepted = false;
  for (let i = 1; i <= 6 && !accepted; i++) {
    const mc = await ctx();
    await mmLogin(mc, `mentor${i}@default.test`, 'test1234', 'default');
    const conns = (await (await mc.get('/api/mentormatch/connections')).json()) as { id: string; menteeId: string; status: string }[];
    const conn = conns.find((c) => c.menteeId === menteeId && c.status === 'PENDING');
    if (!conn) {
      await mc.dispose();
      continue;
    }
    // PENDING: o WhatsApp do mentorado NAO pode estar no payload da pagina.
    const beforeHtml = await (await mc.get('/mentormatch/t/default/mentor')).text();
    expect(beforeHtml, 'WhatsApp nao vaza antes do aceite').not.toContain(WA);

    // Aceita -> agora o contato e revelado (actives).
    expect((await mc.patch('/api/mentormatch/connections', { data: { connectionId: conn.id, status: 'ACCEPTED' } })).ok()).toBeTruthy();
    const afterHtml = await (await mc.get('/mentormatch/t/default/mentor')).text();
    expect(afterHtml, 'WhatsApp aparece apos o aceite').toContain(WA);
    accepted = true;
    await mc.dispose();
  }
  expect(accepted, 'o mentor dono foi exercitado').toBeTruthy();
});

test('LGPD: consentimento e obrigatorio no cadastro (sem consent -> 400)', async () => {
  const c = await ctx();
  const res = await c.post('/api/mentormatch/auth/register', {
    data: { name: 'Sem Consent', email: `noconsent-${Date.now()}@mm.test`, password: 'test1234' },
  });
  expect(res.status()).toBe(400);
  await c.dispose();
});

test('Upload: nao autenticado -> 401; SVG rejeitado -> 400', async () => {
  // Anonimo nao sobe nada.
  const anon = await ctx();
  const r401 = await anon.post('/api/mentormatch/upload', {
    multipart: { file: { name: 'x.png', mimeType: 'image/png', buffer: Buffer.from('x') } },
  });
  expect(r401.status()).toBe(401);
  await anon.dispose();

  // Autenticado, mas SVG (vetor de XSS) e barrado.
  const c = await ctx();
  await mmLogin(c, 'mentee2@default.test', 'test1234', 'default');
  const rSvg = await c.post('/api/mentormatch/upload', {
    multipart: { file: { name: 'x.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg onload="alert(1)"/>') } },
  });
  expect(rSvg.status()).toBe(400);
  await c.dispose();
});

test('Convite: endpoint publico do token nao expoe email nem tenantId', async () => {
  const admin = await ctx();
  await mmLogin(admin, 'admin@default.test', 'admin1234', 'default');
  const tenantId = (await mmSession(admin)).user!.tenantId;
  const inviteEmail = `invitee-${Date.now()}@mm.test`;
  const created = await admin.post('/api/mentormatch/invitations', {
    data: { email: inviteEmail, role: 'MENTEE', tenantId },
  });
  expect(created.status()).toBe(201);
  const token = ((await created.json()) as { token: string }).token;
  await admin.dispose();

  // Endpoint publico: valido, com role, mas SEM email/tenantId.
  const pub = await ctx();
  const body = await (await pub.get(`/api/mentormatch/invitations/${token}`)).text();
  expect(body).toContain('"valid":true');
  expect(body).not.toContain(inviteEmail);
  expect(body).not.toContain(tenantId);
  await pub.dispose();
});

test('LGPD erasure: admin exclui usuario; ele some e nao loga mais', async () => {
  const { tenantId, skillId } = await defaultRefs();
  const email = `erase-${Date.now()}@mm.test`;

  // Cria + aprova (default aberto) um usuario descartavel.
  const u = await defaultCookieCtx();
  expect((await u.post('/api/mentormatch/auth/register', { data: { name: 'Erase Me', email, password: 'test1234', consent: true } })).status()).toBe(201);
  await mmLogin(u, email, 'test1234', 'default');
  await u.post('/api/mentormatch/auth/complete-profile', { data: { role: 'MENTEE', name: 'Erase Me', skills: [skillId], canMentee: true } });
  // id (sub) estavel; tenantId conhecido (default) via defaultRefs.
  const userId = (await mmSession(u)).user!.id;
  await u.dispose();

  // Admin exclui.
  const admin = await ctx();
  await mmLogin(admin, 'admin@default.test', 'admin1234', 'default');
  const del = await admin.fetch('/api/mentormatch/admin/users', {
    method: 'DELETE',
    data: { userId, tenantId },
  });
  expect(del.ok()).toBeTruthy();

  // Sumiu da lista do tenant.
  const list = (await (await admin.get(`/api/mentormatch/admin/users?tenantId=${tenantId}`)).json()) as { id: string }[];
  expect(list.some((x) => x.id === userId)).toBeFalsy();
  await admin.dispose();

  // Nao loga mais.
  const after = await ctx();
  await mmLogin(after, email, 'test1234', 'default');
  expect((await mmSession(after)).user?.id).toBeFalsy();
  await after.dispose();
});
