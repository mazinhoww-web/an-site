import type { ReactNode } from 'react';
import { Inter, Exo_2, Nunito } from 'next/font/google';
import { resolveThemeKey } from '@/lib/mentormatch/tenant';
import '@/styles/mentormatch/base.css';
import '@/styles/mentormatch/sicredi.css';

export const dynamic = 'force-dynamic';

// Fonts from the design.md: Inter (default), Exo 2 + Nunito (Sicredi). Exposed as
// CSS variables consumed by the theme tokens in base.css / sicredi.css.
const inter = Inter({ subsets: ['latin'], variable: '--font-mm-inter', display: 'swap' });
const exo2 = Exo_2({ subsets: ['latin'], variable: '--font-mm-exo2', display: 'swap' });
const nunito = Nunito({ subsets: ['latin'], variable: '--font-mm-nunito', display: 'swap' });

// Module root layout: applies the tenant theme via a wrapper div (a nested
// layout cannot set <body>, and we never touch the site root layout). The
// theme key comes from the `mm-tenant` cookie; the branded landing applies its
// own theme by slug regardless of the cookie.
export default async function MentorMatchLayout({ children }: { children: ReactNode }) {
  const themeKey = await resolveThemeKey();
  return (
    <div className={`mm-root theme-${themeKey} ${inter.variable} ${exo2.variable} ${nunito.variable}`}>
      {children}
    </div>
  );
}
