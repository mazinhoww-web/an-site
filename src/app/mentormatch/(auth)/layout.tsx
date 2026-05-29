import type { ReactNode } from 'react';
import { MmSessionProvider } from '@/components/mentormatch/providers/MmSessionProvider';

// Wraps the MentorMatch auth/onboarding pages with the MM session context so
// client forms can call signIn / useSession().update() against the MM instance.
export default function MmAuthLayout({ children }: { children: ReactNode }) {
  return (
    <MmSessionProvider>
      <div className="min-h-screen bg-bone text-ink">{children}</div>
    </MmSessionProvider>
  );
}
