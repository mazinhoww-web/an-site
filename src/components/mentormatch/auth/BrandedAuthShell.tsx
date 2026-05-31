import Image from 'next/image';
import type { ReactNode } from 'react';
import { Reveal } from '@/mentormatch/design-system';

const TAGLINE = 'Onde mentoria vira sistema.';

interface BrandedAuthShellProps {
  tenant: { name: string; logoUrl: string | null };
  children: ReactNode;
}

/**
 * Layout split das telas de auth branded: lado esquerdo com a marca do tenant
 * (bg --brand, logo + frase), lado direito com o card do formulario em --surface.
 * Mobile: empilha, com a marca como header compacto. Renderizar dentro de
 * MentorMatchThemeRoot (que injeta .mm + --brand do tenant).
 */
export function BrandedAuthShell({ tenant, children }: BrandedAuthShellProps) {
  const logo = tenant.logoUrl ? (
    <Image src={tenant.logoUrl} alt={tenant.name} width={160} height={48} className="h-10 w-auto" />
  ) : (
    <span className="mm-h3" style={{ color: 'var(--brand-contrast)' }}>
      {tenant.name}
    </span>
  );

  return (
    <div className="mm-auth-grid grid min-h-screen md:grid-cols-2">
      {/* Brand panel (desktop) */}
      <div
        className="hidden flex-col justify-between p-12 md:flex"
        style={{ background: 'var(--brand)', color: 'var(--brand-contrast)' }}
      >
        {logo}
        <p className="mm-h2" style={{ color: 'var(--brand-contrast)', maxWidth: 360 }}>
          {TAGLINE}
        </p>
        <span className="mm-body-small" style={{ color: 'var(--brand-contrast)', opacity: 0.85 }}>
          MentorMatch · {tenant.name}
        </span>
      </div>

      {/* Form side */}
      <div className="flex flex-col" style={{ background: 'var(--surface)' }}>
        {/* Brand header compacto (mobile) */}
        <div
          className="flex items-center gap-3 px-6 py-5 md:hidden"
          style={{ background: 'var(--brand)', color: 'var(--brand-contrast)' }}
        >
          {logo}
        </div>

        <div className="flex flex-1 items-center justify-center p-6">
          <Reveal className="w-full">
            <div
              className="mm-card"
              style={{ maxWidth: 420, width: '100%', margin: '0 auto', padding: 32, boxShadow: 'var(--shadow-sm)' }}
            >
              {children}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
