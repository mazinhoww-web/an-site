import { expect, request as playwrightRequest, test } from '@playwright/test';
import { mmLogin, mmSession } from './helpers';

// Cobre as mudancas de "resolver login + resolucao de tenant":
// - auto-cadastro (sem convite) em tenant REAL entra como PENDING e nao acessa
//   o dashboard (bounce para /mentormatch/pendente);
// - auto-cadastro no tenant default/demo segue aberto (APPROVED);
// - login tem rate limit anti brute-force.

const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;

function ctxWithTenantCookie(slug: string) {
  return playwrightRequest.newContext({
    baseURL: BASE_URL,
    storageState: {
      cookies: [
        {
          name: 'mm-tenant',
          value: slug,
          domain: 'localhost',
          path: '/',
          expires: -1,
          httpOnly: false,
          secure: false,
          sameSite: 'Lax',
        },
      ],
      origins: [],
    },
  });
}

async function firstSkillId(tenantSlug: string): Promise<{ tenantId: string; skillId: string }> {
  // tenantId do tenant alvo (via um mentee seedado) + skills via super admin.
  const m = await playwrightRequest.newContext({ baseURL: BASE_URL });
  await mmLogin(m, `mentee1@${tenantSlug}.test`, 'test1234', tenantSlug);
  const tenantId = (await mmSession(m)).user!.tenantId;
  await m.dispose();

  const sup = await playwrightRequest.newContext({ baseURL: BASE_URL });
  await mmLogin(sup, 'super@mm.test', 'super1234', 'default');
  const skills = (await (await sup.get(`/api/mentormatch/skills?tenantId=${tenantId}`)).json()) as {
    id: string;
  }[];
  await sup.dispose();
  expect(skills.length, 'tenant tem skills seedadas').toBeGreaterThan(0);
  return { tenantId, skillId: skills[0]!.id };
}

test('auto-cadastro em tenant real -> PENDING e dashboard faz bounce p/ /pendente', async () => {
  const { skillId } = await firstSkillId('sicredi');
  const email = `selfjoin-pending-${Date.now()}@mm.test`;

  const ctx = await ctxWithTenantCookie('sicredi');
  const reg = await ctx.post('/api/mentormatch/auth/register', {
    data: { name: 'Self Join', email, password: 'test1234', consent: true },
  });
  expect(reg.status()).toBe(201);

  // Usuario unassigned resolve sob o slug do tenant alvo.
  await mmLogin(ctx, email, 'test1234', 'sicredi');

  const cp = await ctx.post('/api/mentormatch/auth/complete-profile', {
    data: { role: 'MENTEE', name: 'Self Join', skills: [skillId], canMentee: true },
  });
  expect(cp.ok()).toBeTruthy();
  expect(((await cp.json()) as { redirectTo: string }).redirectTo).toBe('/mentormatch/pendente');

  // PENDING nao acessa o dashboard do tenant: bounce para /mentormatch/pendente.
  const dash = await ctx.get('/mentormatch/t/sicredi/mentee', { maxRedirects: 0 });
  expect([302, 307, 308]).toContain(dash.status());
  expect(dash.headers()['location']).toContain('/mentormatch/pendente');
  await ctx.dispose();
});

test('auto-cadastro no tenant default/demo segue aberto (APPROVED)', async () => {
  const { skillId } = await firstSkillId('default');
  const email = `selfjoin-open-${Date.now()}@mm.test`;

  const ctx = await ctxWithTenantCookie('default');
  expect(
    (
      await ctx.post('/api/mentormatch/auth/register', {
        data: { name: 'Open Join', email, password: 'test1234', consent: true },
      })
    ).status(),
  ).toBe(201);
  await mmLogin(ctx, email, 'test1234', 'default');

  const cp = await ctx.post('/api/mentormatch/auth/complete-profile', {
    data: { role: 'MENTEE', name: 'Open Join', skills: [skillId], canMentee: true },
  });
  expect(cp.ok()).toBeTruthy();
  // Aprovado: vai direto para o dashboard de mentorado, nao para /pendente.
  expect(((await cp.json()) as { redirectTo: string }).redirectTo).toBe('/mentormatch/t/default/mentee');
  await ctx.dispose();
});

test('login: rate limit bloqueia apos exceder tentativas (anti brute-force)', async () => {
  // Email dedicado (mentee8 nao e usado por outros testes) para nao contaminar.
  const email = 'mentee8@default.test';

  // 10 tentativas com senha errada: permitidas (sem sessao), consomem o limite.
  for (let i = 0; i < 10; i++) {
    const c = await playwrightRequest.newContext({ baseURL: BASE_URL });
    await mmLogin(c, email, 'senha-errada', 'default');
    await c.dispose();
  }

  // A proxima tentativa, mesmo com a senha CORRETA, e barrada pelo limiter.
  const c = await playwrightRequest.newContext({ baseURL: BASE_URL });
  await mmLogin(c, email, 'test1234', 'default');
  expect((await mmSession(c)).user?.id).toBeFalsy();
  await c.dispose();
});
