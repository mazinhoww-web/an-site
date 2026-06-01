'use client';

import { usePathname, useRouter } from 'next/navigation';
import { MentorMatchThemeRoot } from '@/mentormatch/design-system';

interface Props {
  slug: string;
  brandColor?: string | null;
  theme?: 'light' | 'dark';
}

// Alterna a visao ativa do usuario dual (canMentor && canMentee). Persiste a
// escolha em cookie (mm-active-view) e navega para o dashboard correspondente.
export function RoleSwitcher({ slug, brandColor, theme = 'light' }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const seg = pathname?.split(`/t/${slug}/`)[1]?.split('/')[0];
  const active: 'mentor' | 'mentee' = seg === 'mentor' ? 'mentor' : 'mentee';

  function go(view: 'mentor' | 'mentee') {
    document.cookie = `mm-active-view=${view};path=/;max-age=31536000;samesite=lax`;
    router.push(`/mentormatch/t/${slug}/${view}`);
  }

  return (
    <MentorMatchThemeRoot brand={brandColor} theme={theme} style={{ display: 'inline-flex', background: 'transparent' }}>
      <div
        role="group"
        aria-label="Alternar visao"
        style={{ display: 'inline-flex', gap: 2, padding: 2, border: '1px solid var(--border)', borderRadius: 'var(--r-pill)' }}
      >
        {(['mentor', 'mentee'] as const).map((v) => {
          const on = v === active;
          return (
            <button
              key={v}
              type="button"
              aria-pressed={on}
              onClick={() => go(v)}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--r-pill)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'var(--mm-font-sans)',
                background: on ? 'var(--brand)' : 'transparent',
                color: on ? 'var(--brand-contrast)' : 'var(--text-secondary)',
              }}
            >
              {v === 'mentor' ? 'Mentor' : 'Mentorado'}
            </button>
          );
        })}
      </div>
    </MentorMatchThemeRoot>
  );
}
