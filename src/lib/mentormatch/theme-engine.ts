/**
 * Theme engine multi-tenant do MentorMatch.
 * ORM-agnostico: nao importa Drizzle nem Prisma. Recebe apenas o shape minimo
 * de organizacao necessario para resolver a classe de tema.
 */

export type ThemeKey = 'dark' | 'sicredi' | (string & {});

export interface ThemeOrg {
  themeKey?: string | null;
}

/**
 * Resolve a classe CSS de tema para uma organizacao.
 * Tenants sem tema definido usam "theme-dark" por padrao.
 */
export function resolveThemeClass(org: ThemeOrg | null | undefined): string {
  if (!org) return 'theme-dark';
  return `theme-${org.themeKey ?? 'dark'}`;
}

/**
 * Gera CSS custom properties a partir de um objeto de tokens.
 * Usado pelo provisioner quando um novo tenant faz upload de design.md.
 */
export function tokensToCSS(themeKey: string, tokens: Record<string, string>): string {
  const vars = Object.entries(tokens)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join('\n');
  return `.theme-${themeKey} {\n${vars}\n}`;
}
