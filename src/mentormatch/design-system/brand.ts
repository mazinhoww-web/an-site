import type { CSSProperties } from 'react';

/**
 * Injecao de marca por tenant (DESIGN.md secao 9).
 * O tenant define apenas --brand. hover/soft/ring derivam via color-mix no CSS.
 * --brand-contrast e escolhido aqui validando contraste WCAG (>= 4.5:1):
 * branco se passar sobre o brand, senao o texto escuro --text (#121217).
 */

function hexToRgb(hex: string): [number, number, number] | null {
  let h = hex.trim().replace('#', '');
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (h.length !== 6) return null;
  const r = Number.parseInt(h.slice(0, 2), 16);
  const g = Number.parseInt(h.slice(2, 4), 16);
  const b = Number.parseInt(h.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return [r, g, b];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(l1: number, l2: number): number {
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/** Texto escuro padrao do DS (token --text light). */
const DARK_TEXT: [number, number, number] = [0x12, 0x12, 0x17];

/**
 * Retorna o style inline a aplicar no wrapper .mm para o brand do tenant.
 * Sem brand -> objeto vazio (usa o default Indigo do tokens.css).
 */
export function brandStyle(brand?: string | null): CSSProperties {
  if (!brand) return {};
  const rgb = hexToRgb(brand);
  if (!rgb) return {};

  const lumBrand = relativeLuminance(rgb);
  const lumWhite = 1;
  const lumDark = relativeLuminance(DARK_TEXT);

  const whiteOk = contrastRatio(lumBrand, lumWhite) >= 4.5;
  const contrast = whiteOk ? '#FFFFFF' : '#121217';
  void lumDark;

  const vars: Record<string, string> = {
    '--brand': brand,
    '--brand-contrast': contrast,
  };
  return vars as CSSProperties;
}

/** True se o branco passa 4.5:1 sobre a cor; util para validacao no upload. */
export function brandContrastPasses(brand: string): boolean {
  const rgb = hexToRgb(brand);
  if (!rgb) return false;
  return contrastRatio(relativeLuminance(rgb), 1) >= 4.5;
}
