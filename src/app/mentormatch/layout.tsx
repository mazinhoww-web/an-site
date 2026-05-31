import type { ReactNode } from 'react';
import { resolveThemeKey } from '@/lib/mentormatch/tenant';
import '@/styles/mentormatch/base.css';
import '@/styles/mentormatch/sicredi.css';

export const dynamic = 'force-dynamic';

// Module root layout: applies the tenant theme via a wrapper div (a nested
// layout cannot set <body>, and we never touch the site root layout). The
// theme key comes from the `mm-tenant` cookie; the branded landing applies its
// own theme by slug regardless of the cookie.
export default async function MentorMatchLayout({ children }: { children: ReactNode }) {
  const themeKey = await resolveThemeKey();
  return <div className={`mm-root theme-${themeKey}`}>{children}</div>;
}
