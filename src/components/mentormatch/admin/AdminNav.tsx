'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MentorMatchThemeRoot } from '@/mentormatch/design-system';

const ITEMS: [string, string][] = [
  ['', 'Painel'],
  ['users', 'Usuarios'],
  ['skills', 'Skills'],
  ['library', 'Biblioteca'],
  ['settings', 'Configuracoes'],
  ['reports', 'Relatorios'],
  ['export', 'Export'],
  ['invitations', 'Convites'],
];

interface Props {
  slug: string;
  brandColor?: string | null;
  theme?: 'light' | 'dark';
}

export function AdminNav({ slug, brandColor, theme = 'light' }: Props) {
  const pathname = usePathname();
  const base = `/mentormatch/t/${slug}/admin`;

  return (
    <MentorMatchThemeRoot brand={brandColor} theme={theme} style={{ display: 'block', background: 'transparent' }}>
      <nav
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          paddingBottom: 16,
          marginBottom: 24,
          borderBottom: '1px solid var(--border)',
        }}
      >
        {ITEMS.map(([seg, label]) => {
          const href = seg ? `${base}/${seg}` : base;
          const active = seg ? pathname?.startsWith(`${base}/${seg}`) : pathname === base;
          return (
            <Link
              key={seg || 'painel'}
              href={href}
              className="mm-chip"
              style={
                active
                  ? { background: 'var(--brand-soft)', color: 'var(--brand)', borderColor: 'var(--brand)' }
                  : undefined
              }
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </MentorMatchThemeRoot>
  );
}
