'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

// Client session context bound to the SEPARATE MentorMatch Auth.js instance.
// basePath must match the MM route handler so signIn/useSession/update() target
// /api/mentormatch/auth/* (and the mm.* cookies), not the site's auth.
export function MmSessionProvider({ children }: { children: ReactNode }) {
  return <SessionProvider basePath="/api/mentormatch/auth">{children}</SessionProvider>;
}
