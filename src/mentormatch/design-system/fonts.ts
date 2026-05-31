import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';

/**
 * Fontes do MentorMatch DS (DESIGN.md secao 3).
 * Plus Jakarta Sans (familia unica), JetBrains Mono (dados densos).
 * Expostas como CSS vars escopadas ao wrapper .mm via className .variable —
 * NUNCA aplicadas ao <body> global do an-site.
 */
export const mmSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--mm-font-sans',
});

export const mmMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--mm-font-mono',
});
