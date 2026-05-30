import { put } from '@vercel/blob';
import { parseDesignMd } from './theme-parser';
import { tokensToCSS } from './theme-engine';

export interface ProvisionResult {
  tokens: Record<string, string>;
  css: string;
  cssUrl: string;
}

/**
 * Provisiona o tema de um tenant a partir de um design.md:
 *   1. parse dos tokens
 *   2. geracao do CSS .theme-{key}
 *   3. upload no Vercel Blob (themes/{key}.css)
 *
 * ORM-agnostico de proposito: a persistencia do resultado na tabela
 * organizations (themeKey / themeCssUrl / tokens) e feita pela camada de
 * dados do tenant quando a tabela existir (sprint Admin Geral). Assim este
 * modulo permanece testavel e independente do Drizzle.
 */
export async function provisionTheme(themeKey: string, mdContent: string): Promise<ProvisionResult> {
  const tokens = parseDesignMd(mdContent);
  const css = tokensToCSS(themeKey, tokens);
  const { url } = await put(`themes/${themeKey}.css`, css, {
    access: 'public',
    allowOverwrite: true,
    contentType: 'text/css',
  });
  return { tokens, css, cssUrl: url };
}
