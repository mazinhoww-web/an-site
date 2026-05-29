import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { resolvePostLoginHref } from '@/lib/mentormatch/dashboard-href';
import { AdminNav } from '@/components/mentormatch/admin/AdminNav';

// Tenant admin guard. ADMIN or SUPER_ADMIN (D-07). The parent ownership guard
// already pins a non-super ADMIN to its own tenant; this only checks role.
export default async function TenantAdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug: string };
}) {
  const user = await getMmUserFromDb();
  if (!user) redirect('/mentormatch/login');

  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    redirect(await resolvePostLoginHref(user));
  }

  return (
    <div>
      <AdminNav slug={params.slug} />
      {children}
    </div>
  );
}
