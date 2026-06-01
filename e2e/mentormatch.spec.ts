import { expect, request as playwrightRequest, test } from '@playwright/test';
import { mmLogin, mmSession } from './helpers';

// E2E real contra o banco seedado (ver SEED.md). Cada teste cria seu proprio
// `request` context (cookie jar isolado). Tolerante a re-execucao (seed
// idempotente; pedidos duplicados -> 409 esperado).

const SLUG = 'default';
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;

async function tenantIdOf(slug: string): Promise<{ tenantId: string }> {
  const ctx = await playwrightRequest.newContext({ baseURL: BASE_URL });
  await mmLogin(ctx, `mentee1@${slug}.test`, 'test1234', slug);
  const s = await mmSession(ctx);
  const tenantId = s.user!.tenantId;
  await ctx.dispose();
  return { tenantId };
}

test('login resolve por (email, tenantSlug) e carrega a sessao do tenant', async ({ request }) => {
  await mmLogin(request, `mentee1@${SLUG}.test`, 'test1234', SLUG);
  const s = await mmSession(request);
  expect(s.user?.role).toBe('MENTEE');
  expect(s.user?.tenantSlug).toBe(SLUG);
  expect(s.user?.onboardingDone).toBe(true);
});

test('vitrine de match lista os mentores do tenant', async ({ request }) => {
  await mmLogin(request, `mentee1@${SLUG}.test`, 'test1234', SLUG);
  const { user } = await mmSession(request);
  const res = await request.get(`/api/mentormatch/mentors?tenantId=${user!.tenantId}`);
  expect(res.ok()).toBeTruthy();
  const mentors = (await res.json()) as { name: string; maxMentees: number; activeConnections: number }[];
  expect(mentors.length).toBeGreaterThanOrEqual(6);
  expect(mentors[0]).toHaveProperty('maxMentees');
});

test('mentorado envia solicitacao; duplicada e bloqueada (R3)', async ({ request }) => {
  await mmLogin(request, `mentee5@${SLUG}.test`, 'test1234', SLUG);
  const { user } = await mmSession(request);
  const list = (await (await request.get(`/api/mentormatch/mentors?tenantId=${user!.tenantId}`)).json()) as {
    id: string;
    activeConnections: number;
    maxMentees: number;
  }[];
  const available = list.find((m) => m.activeConnections < m.maxMentees);
  expect(available, 'ha mentor disponivel no seed').toBeTruthy();

  const first = await request.post('/api/mentormatch/connections', { data: { mentorId: available!.id } });
  // 201 (primeira vez) ou 409 (re-execucao): em ambos a solicitacao existe.
  expect([201, 409]).toContain(first.status());

  const dup = await request.post('/api/mentormatch/connections', { data: { mentorId: available!.id } });
  expect(dup.status()).toBe(409);
});

test('mentor aceita solicitacao -> ACCEPTED + notificacao ao mentorado (D006/R4)', async ({ request }) => {
  // Mentorado dedicado envia para um mentor com vaga.
  await mmLogin(request, `mentee7@${SLUG}.test`, 'test1234', SLUG);
  const menteeSession = await mmSession(request);
  const mentors = (await (
    await request.get(`/api/mentormatch/mentors?tenantId=${menteeSession.user!.tenantId}`)
  ).json()) as { id: string; activeConnections: number; maxMentees: number }[];
  const mentor = mentors.find((m) => m.activeConnections < m.maxMentees)!;
  await request.post('/api/mentormatch/connections', { data: { mentorId: mentor.id } });

  // Descobre a conexao (como mentorado).
  const myConns = (await (await request.get('/api/mentormatch/connections')).json()) as {
    id: string;
    mentorId: string;
    status: string;
  }[];
  const conn = myConns.find((c) => c.mentorId === mentor.id && ['PENDING', 'ACCEPTED'].includes(c.status))!;
  expect(conn, 'conexao registrada').toBeTruthy();

  // Mentor faz login em outro contexto e aceita.
  const mentorCtx = await playwrightRequest.newContext({ baseURL: BASE_URL });
  // Acha o email do mentor pelo indice nao e trivial; loga cada mentorN ate ser o dono.
  let accepted = false;
  for (let i = 1; i <= 6 && !accepted; i++) {
    await mmLogin(mentorCtx, `mentor${i}@${SLUG}.test`, 'test1234', SLUG);
    const res = await mentorCtx.patch('/api/mentormatch/connections', {
      data: { connectionId: conn.id, status: 'ACCEPTED' },
    });
    if (res.ok()) accepted = true; // 403 quando nao e o mentor dono (R5)
  }
  await mentorCtx.dispose();
  expect(accepted, 'o mentor dono aceitou').toBeTruthy();

  // Notificacao de aceite chegou ao mentorado.
  const notifs = (await (await request.get('/api/mentormatch/notifications')).json()) as { type: string }[];
  expect(notifs.some((n) => n.type === 'CONNECTION_ACCEPTED')).toBeTruthy();
});

test('isolamento de tenant: mentorado de A nao acessa mentores de B (G1/D023.6)', async ({ request }) => {
  await mmLogin(request, `mentee1@${SLUG}.test`, 'test1234', SLUG);
  const { tenantId: otherTenantId } = await tenantIdOf('sicredi');
  const res = await request.get(`/api/mentormatch/mentors?tenantId=${otherTenantId}`);
  expect(res.status()).toBe(403);
});

test('mesmo email em tenants diferentes = contas distintas e isoladas (D023.1)', async () => {
  const a = await playwrightRequest.newContext({ baseURL: BASE_URL });
  const b = await playwrightRequest.newContext({ baseURL: BASE_URL });
  await mmLogin(a, 'shared@mm.test', 'test1234', 'default');
  await mmLogin(b, 'shared@mm.test', 'test1234', 'sicredi');
  const sa = await mmSession(a);
  const sb = await mmSession(b);
  expect(sa.user?.tenantSlug).toBe('default');
  expect(sb.user?.tenantSlug).toBe('sicredi');
  expect(sa.user?.tenantId).toBeTruthy();
  expect(sa.user?.tenantId).not.toBe(sb.user?.tenantId);
  expect(sa.user?.id).not.toBe(sb.user?.id);
  await a.dispose();
  await b.dispose();
});

test('login sem tenantSlug e rejeitado — nao resolve por email-so (D023.1)', async ({ request }) => {
  await mmLogin(request, 'shared@mm.test', 'test1234', '');
  const s = await mmSession(request);
  expect(s.user?.id).toBeFalsy();
});

test('sessao de um tenant em rota de outro = 404, sem vazar existencia (D023.1/3)', async ({ request }) => {
  await mmLogin(request, `mentee1@${SLUG}.test`, 'test1234', SLUG);
  const res = await request.get('/mentormatch/t/sicredi/mentors', { maxRedirects: 0 });
  expect(res.status()).toBe(404);
});

test('role-switcher: usuario dual acessa as duas visoes; mentee puro nao acessa mentor (D023.8)', async ({ request }) => {
  // Marcador exclusivo da visao de mentor (a de mentorado nao tem este texto).
  const MENTOR_MARK = 'Gerencie solicitacoes';
  await mmLogin(request, `dual@${SLUG}.test`, 'test1234', SLUG);
  const mentorHtml = await (await request.get(`/mentormatch/t/${SLUG}/mentor`)).text();
  const menteeHtml = await (await request.get(`/mentormatch/t/${SLUG}/mentee`)).text();
  // Dual ve a visao de mentor em /mentor e uma visao DIFERENTE em /mentee.
  expect(mentorHtml).toContain(MENTOR_MARK);
  expect(menteeHtml).not.toContain(MENTOR_MARK);

  // Mentee puro nao acessa a visao de mentor (guard redireciona).
  const pure = await playwrightRequest.newContext({ baseURL: BASE_URL });
  await mmLogin(pure, `mentee1@${SLUG}.test`, 'test1234', SLUG);
  const blockedHtml = await (await pure.get(`/mentormatch/t/${SLUG}/mentor`)).text();
  expect(blockedHtml).not.toContain(MENTOR_MARK);
  await pure.dispose();
});

test('emails: recusa e promocao de waitlist disparam email branded capturado (D023.8)', async ({ request }) => {
  await request.delete('/api/mentormatch/qa-emails');

  // Recusa: mentor1 recusa uma solicitacao pendente.
  const mentor1 = await playwrightRequest.newContext({ baseURL: BASE_URL });
  await mmLogin(mentor1, `mentor1@${SLUG}.test`, 'test1234', SLUG);
  const c1 = (await (await mentor1.get('/api/mentormatch/connections')).json()) as { id: string; status: string }[];
  const pending = c1.find((c) => c.status === 'PENDING')!;
  expect((await mentor1.patch('/api/mentormatch/connections', { data: { connectionId: pending.id, status: 'REJECTED' } })).ok()).toBeTruthy();
  await mentor1.dispose();

  // Promocao: mentor6 (lotado + fila) conclui uma mentoria -> promove o 1o da fila.
  const mentor6 = await playwrightRequest.newContext({ baseURL: BASE_URL });
  await mmLogin(mentor6, `mentor6@${SLUG}.test`, 'test1234', SLUG);
  const c6 = (await (await mentor6.get('/api/mentormatch/connections')).json()) as { id: string; status: string }[];
  const accepted = c6.find((c) => c.status === 'ACCEPTED')!;
  expect((await mentor6.patch('/api/mentormatch/connections', { data: { connectionId: accepted.id, status: 'COMPLETED' } })).ok()).toBeTruthy();
  await mentor6.dispose();

  const emails = (await (await request.get('/api/mentormatch/qa-emails')).json()) as { subject: string }[];
  expect(emails.some((e) => /solicitacao/i.test(e.subject))).toBeTruthy(); // recusa
  expect(emails.some((e) => /avancou na fila/i.test(e.subject))).toBeTruthy(); // promocao
});

test('waitlist write: mentor reordena e remove; persiste no banco (R8/R9/D023.8)', async ({ request }) => {
  await mmLogin(request, `mentor3@${SLUG}.test`, 'test1234', SLUG);
  const before = (await (await request.get('/api/mentormatch/waitlist')).json()) as { id: string; position: number }[];
  expect(before.length).toBeGreaterThanOrEqual(2);

  // Reordena: troca as duas primeiras posicoes.
  const entries = before.map((e, i) => ({ id: e.id, position: i === 0 ? 2 : i === 1 ? 1 : i + 1 }));
  expect((await request.patch('/api/mentormatch/waitlist', { data: { entries } })).ok()).toBeTruthy();
  const after = (await (await request.get('/api/mentormatch/waitlist')).json()) as { id: string }[];
  expect(after[0]!.id).toBe(before[1]!.id);

  // Remove o primeiro -> persiste.
  expect((await request.delete('/api/mentormatch/waitlist', { data: { id: after[0]!.id } })).ok()).toBeTruthy();
  const final = (await (await request.get('/api/mentormatch/waitlist')).json()) as unknown[];
  expect(final.length).toBe(before.length - 1);
});

test('troca de senha: atual errada falha; correta troca; nova autentica e antiga nao (R19/D023.8)', async () => {
  const email = `mentee3@${SLUG}.test`;
  const OLD = 'test1234';
  const NEW = 'novasenha-9182';
  const url = '/api/mentormatch/users/me/password';

  const ctx = await playwrightRequest.newContext({ baseURL: BASE_URL });
  await mmLogin(ctx, email, OLD, SLUG);

  // Senha atual errada -> 400.
  const wrong = await ctx.post(url, { data: { currentPassword: 'errada-000', newPassword: NEW } });
  expect(wrong.status()).toBe(400);

  // Senha atual correta -> troca.
  const okRes = await ctx.post(url, { data: { currentPassword: OLD, newPassword: NEW } });
  expect(okRes.ok()).toBeTruthy();

  // Nova senha autentica no proximo login.
  const cNew = await playwrightRequest.newContext({ baseURL: BASE_URL });
  await mmLogin(cNew, email, NEW, SLUG);
  expect((await mmSession(cNew)).user?.id).toBeTruthy();
  await cNew.dispose();

  // Senha antiga nao loga mais.
  const cOld = await playwrightRequest.newContext({ baseURL: BASE_URL });
  await mmLogin(cOld, email, OLD, SLUG);
  expect((await mmSession(cOld)).user?.id).toBeFalsy();
  await cOld.dispose();

  // Restaura (idempotencia entre execucoes).
  const restore = await ctx.post(url, { data: { currentPassword: NEW, newPassword: OLD } });
  expect(restore.ok()).toBeTruthy();
  await ctx.dispose();
});
