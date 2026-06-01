import type { ReactNode } from 'react';
import { MmSessionProvider } from '@/components/mentormatch/providers/MmSessionProvider';
import { MentorMatchThemeRoot } from '@/mentormatch/design-system';
import { resolveColorScheme } from '@/lib/mentormatch/color-scheme';

// Wraps the MentorMatch auth/onboarding pages with the MM session context so
// client forms can call signIn / useSession().update() against the MM instance.
// Escopa o DS (.mm) com tema (dark) para que login/registro/onboarding fiquem
// no design system canonico (D022) e respondam ao toggle de tema.
export default async function MmAuthLayout({ children }: { children: ReactNode }) {
  const theme = await resolveColorScheme();
  return (
    <MmSessionProvider>
      <MentorMatchThemeRoot
        theme={theme}
        style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}
      >
        {children}
      </MentorMatchThemeRoot>
    </MmSessionProvider>
  );
}
