import type { CSSProperties } from 'react';
import { brandStyle } from '@/mentormatch/design-system/brand';

interface TenantBrandInput {
  brandColor?: string | null;
  secondaryColor?: string | null;
}

/**
 * Style inline que injeta a marca do tenant em runtime (D004 item 3).
 * - Define o `--brand` do design system (com `--brand-contrast` calculado por
 *   contraste WCAG); `--brand-hover/soft/ring` derivam por color-mix no CSS.
 * - Faz bridge para `--mm-primary`/`--mm-secondary`, os tokens que a landing
 *   branded ja consome.
 * Fallback: Indigo default quando o tenant nao tem cor.
 */
export function tenantBrandStyle(tenant: TenantBrandInput): CSSProperties {
  const brand = tenant.brandColor || '#4f46e5';
  const ds = brandStyle(brand) as Record<string, string>;
  const bridge: Record<string, string> = { ...ds, '--mm-primary': brand };
  if (tenant.secondaryColor) bridge['--mm-secondary'] = tenant.secondaryColor;
  return bridge as CSSProperties;
}
