import { cookies } from 'next/headers';

/** Preferencia light/dark do usuario, persistida em cookie (D004 item 5 — nao localStorage). */
export const MM_COLOR_SCHEME_COOKIE = 'mm-color-scheme';
export type MmColorScheme = 'light' | 'dark';

/**
 * Le a preferencia de tema do cookie. Default 'light' (o DS sem data-theme e
 * light; dark via .mm[data-theme="dark"]). Server-only.
 */
export async function resolveColorScheme(): Promise<MmColorScheme> {
  const jar = await cookies();
  return jar.get(MM_COLOR_SCHEME_COOKIE)?.value === 'dark' ? 'dark' : 'light';
}
