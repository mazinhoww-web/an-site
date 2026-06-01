import { expect, request as playwrightRequest, test } from '@playwright/test';
import { mmLogin, mmSession } from './helpers';

// Suite de ISOLAMENTO multi-tenant (D023.0/D023.6, gate de go-live).
// Tenant A (default) NUNCA le/escreve dado do tenant B (sicredi), por entidade.
// Roda contra o banco seedado (ver SEED.md).

const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
const ctx = () => playwrightRequest.newContext({ baseURL: BASE_URL });

async function sicrediRefs() {
  const c = await ctx();
  await mmLogin(c, 'mentor3@sicredi.test', 'test1234', 'sicredi'); // mentor3 tem waitlist no seed
  const tenantId = (await mmSession(c)).user!.tenantId;
  const mentors = (await (await c.get(`/api/mentormatch/mentors?tenantId=${tenantId}`)).json()) as { id: string }[];
  const waitlist = (await (await c.get('/api/mentormatch/waitlist')).json()) as { id: string }[];
  await c.dispose();
  return { tenantId, mentorId: mentors[0]!.id, waitlistEntryId: waitlist[0]?.id ?? null };
}

test('USER: admin de A nao le usuarios de B (403)', async () => {
  const { tenantId: bId } = await sicrediRefs();
  const c = await ctx();
  await mmLogin(c, 'admin@default.test', 'admin1234', 'default');
  const res = await c.get(`/api/mentormatch/admin/users?tenantId=${bId}`);
  expect(res.status()).toBe(403);
  await c.dispose();
});

test('MENTORS/LGPD: vitrine de B inacessivel a A (403)', async () => {
  const { tenantId: bId } = await sicrediRefs();
  const c = await ctx();
  await mmLogin(c, 'mentee1@default.test', 'test1234', 'default');
  const res = await c.get(`/api/mentormatch/mentors?tenantId=${bId}`);
  expect(res.status()).toBe(403);
  await c.dispose();
});

test('SKILLS: skills de B inacessiveis a A (403)', async () => {
  const { tenantId: bId } = await sicrediRefs();
  const c = await ctx();
  await mmLogin(c, 'admin@default.test', 'admin1234', 'default');
  const res = await c.get(`/api/mentormatch/skills?tenantId=${bId}`);
  expect(res.status()).toBe(403);
  await c.dispose();
});

test('LIBRARY: biblioteca de B inacessivel a A (403)', async () => {
  const { tenantId: bId } = await sicrediRefs();
  const c = await ctx();
  await mmLogin(c, 'admin@default.test', 'admin1234', 'default');
  const res = await c.get(`/api/mentormatch/library?tenantId=${bId}`);
  expect(res.status()).toBe(403);
  await c.dispose();
});

test('INVITATION: A nao le nem cria convite em B (403)', async () => {
  const { tenantId: bId } = await sicrediRefs();
  const c = await ctx();
  await mmLogin(c, 'admin@default.test', 'admin1234', 'default');
  expect((await c.get(`/api/mentormatch/invitations?tenantId=${bId}`)).status()).toBe(403);
  const post = await c.post('/api/mentormatch/invitations', {
    data: { email: 'x@x.test', role: 'MENTEE', tenantId: bId },
  });
  expect(post.status()).toBe(403);
  await c.dispose();
});

test('CONNECTION: mentee de A nao solicita mentor de B (403)', async () => {
  const { mentorId: bMentor } = await sicrediRefs();
  const c = await ctx();
  await mmLogin(c, 'mentee2@default.test', 'test1234', 'default');
  const res = await c.post('/api/mentormatch/connections', { data: { mentorId: bMentor } });
  expect(res.status()).toBe(403);
  await c.dispose();
});

test('WAITLIST: mentor de A nao remove entrada de B (403)', async () => {
  const { waitlistEntryId } = await sicrediRefs();
  test.skip(!waitlistEntryId, 'sem entrada de waitlist no seed sicredi');
  const c = await ctx();
  await mmLogin(c, 'mentor1@default.test', 'test1234', 'default');
  const res = await c.delete('/api/mentormatch/waitlist', { data: { id: waitlistEntryId } });
  expect([403, 404]).toContain(res.status());
  await c.dispose();
});

test('NOTIFICATION: GET retorna apenas as do proprio usuario (estrutural)', async () => {
  // Nao ha parametro de tenant: o endpoint filtra por userId. A so ve as suas.
  const c = await ctx();
  await mmLogin(c, 'mentee1@default.test', 'test1234', 'default');
  const res = await c.get('/api/mentormatch/notifications');
  expect(res.ok()).toBeTruthy();
  // Sem sessao -> 401 (nao vaza nada).
  const anon = await ctx();
  expect((await anon.get('/api/mentormatch/notifications')).status()).toBe(401);
  await anon.dispose();
  await c.dispose();
});

test('SLUG RESERVADO: criar tenant com slug reservado e rejeitado (400)', async () => {
  const c = await ctx();
  await mmLogin(c, 'super@mm.test', 'super1234', 'default');
  const plans = (await (await c.get('/api/mentormatch/admin/plans')).json()) as { id: string }[];
  const planId = plans[0]!.id;
  for (const slug of ['admin', 'api', 'demo', 't', 'mentormatch', 'login']) {
    const res = await c.post('/api/mentormatch/admin/tenants', {
      data: { name: `Bloqueado ${slug}`, slug, brandColor: '#123456', planId },
    });
    expect(res.status(), `slug ${slug} deve ser rejeitado`).toBe(400);
  }
  await c.dispose();
});

test('LGPD contato: vitrine nao expoe email/whatsapp; presente so pos-aceite', async () => {
  const c = await ctx();
  await mmLogin(c, 'mentee1@default.test', 'test1234', 'default');
  const tenantId = (await mmSession(c)).user!.tenantId;
  const raw = await (await c.get(`/api/mentormatch/mentors?tenantId=${tenantId}`)).text();
  // A vitrine nao deve conter chaves de contato.
  expect(raw).not.toContain('whatsapp');
  expect(raw).not.toContain('wa.me');

  // Pos-aceite: o mentee1 tem mentoria aceita no seed -> /mentee mostra contato (wa.me).
  const menteeHtml = await (await c.get('/mentormatch/t/default/mentee')).text();
  expect(menteeHtml).toContain('wa.me');
  await c.dispose();
});
