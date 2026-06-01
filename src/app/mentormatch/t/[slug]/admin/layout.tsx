import { notFound, redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getActiveTenantBySlug, getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { resolvePostLoginHref } from '@/lib/mentormatch/dashboard-href';
import { resolveColorScheme } from '@/lib/mentormatch/color-scheme';
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

  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();
  const theme = await resolveColorScheme();

  return (
    <div>
      <AdminNav slug={params.slug} brandColor={tenant.brandColor} theme={theme} />
      {children}
    </div>
  );
}
