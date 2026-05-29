import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { resolvePostLoginHref } from '@/lib/mentormatch/dashboard-href';

// Tenant admin guard. ADMIN or SUPER_ADMIN (D-07). The parent ownership guard
// already pins a non-super ADMIN to its own tenant; this only checks role.
export default async function TenantAdminLayout({ children }: { children: ReactNode }) {
  const user = await getMmUserFromDb();
  if (!user) redirect('/mentormatch/login');

  if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') return <>{children}</>;
  redirect(await resolvePostLoginHref(user));
}
