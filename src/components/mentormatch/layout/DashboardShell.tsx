import Link from 'next/link';
import type { ReactNode } from 'react';
import { MentorMatchThemeRoot } from '@/mentormatch/design-system';
import { NotificationsBell } from '@/components/mentormatch/layout/NotificationsBell';
import { RoleSwitcher } from '@/components/mentormatch/layout/RoleSwitcher';

// Chrome compartilhado por todas as paginas /t/[slug]: header com marca, nav
// rapida e o sino de notificacoes. Guardas vivem no layout que renderiza isto.
// Migrado para o DS (D022): escopo .mm + tema (dark) + --brand do tenant, para
// que o chrome E o conteudo respondam ao toggle de tema e ao white-label.
export function DashboardShell({
  slug,
  children,
  brandColor,
  theme,
  dual,
}: {
  slug: string;
  children: ReactNode;
  brandColor?: string | null;
  theme?: 'light' | 'dark';
  dual?: boolean;
}) {
  return (
    <MentorMatchThemeRoot
      theme={theme}
      brand={brandColor}
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: 'var(--mm-font-sans)',
      }}
    >
      <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div
          className="mx-auto flex items-center justify-between"
          style={{ maxWidth: 1200, padding: '16px 24px' }}
        >
          <Link href={`/mentormatch/t/${slug}`} className="mm-h3" style={{ textDecoration: 'none' }}>
            MentorMatch
          </Link>
          <div className="flex items-center" style={{ gap: 16 }}>
            {dual && <RoleSwitcher slug={slug} brandColor={brandColor} theme={theme} />}
            <Link
              href={`/mentormatch/t/${slug}/library`}
              className="mm-body-small"
              style={{ color: 'var(--text-secondary)' }}
            >
              Biblioteca
            </Link>
            <NotificationsBell brandColor={brandColor} theme={theme} />
          </div>
        </div>
      </header>
      <div className="mx-auto" style={{ maxWidth: 1200, padding: '40px 24px' }}>
        {children}
      </div>
    </MentorMatchThemeRoot>
  );
}
