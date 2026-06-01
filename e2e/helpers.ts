import type { APIRequestContext } from '@playwright/test';

const AUTH = '/api/mentormatch/auth';

export interface MmSession {
  user?: {
    id: string;
    email: string;
    role: string;
    tenantId: string;
    tenantSlug?: string;
    onboardingDone?: boolean;
  };
}

/**
 * Login no NextAuth (instancia MentorMatch) via Credentials. O cookie de sessao
 * fica no proprio `request` context (cookie jar do Playwright). Resolve sempre
 * por (email, tenantSlug) — D023.1.
 */
export async function mmLogin(
  request: APIRequestContext,
  email: string,
  password: string,
  tenantSlug: string,
): Promise<void> {
  const csrfRes = await request.get(`${AUTH}/csrf`);
  const { csrfToken } = (await csrfRes.json()) as { csrfToken: string };
  await request.post(`${AUTH}/callback/credentials`, {
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: { csrfToken, email, password, tenantSlug, json: 'true' },
  });
}

export async function mmSession(request: APIRequestContext): Promise<MmSession> {
  const res = await request.get(`${AUTH}/session`);
  // NextAuth devolve `null` quando nao ha sessao — normaliza para {} para os testes.
  return ((await res.json()) ?? {}) as MmSession;
}
