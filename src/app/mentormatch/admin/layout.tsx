import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { resolvePostLoginHref } from '@/lib/mentormatch/dashboard-href';

// Super admin guard. Only SUPER_ADMIN; everyone else is routed to their own
// area via the single post-login resolver (no raw 403 in the App Router).
export default async function SuperAdminLayout({ children }: { children: ReactNode }) {
  const user = await getMmUserFromDb();
  if (!user) redirect('/mentormatch/login');

  if (user.role === 'SUPER_ADMIN') return <>{children}</>;
  redirect(await resolvePostLoginHref(user));
}
