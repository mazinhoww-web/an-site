import { notFound, redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getActiveTenantBySlug, getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { resolvePostLoginHref } from '@/lib/mentormatch/dashboard-href';
import { DashboardShell } from '@/components/mentormatch/layout/DashboardShell';

// Guard: session + tenant ownership. Source of truth is the database (D-06).
// SUPER_ADMIN bypasses ownership (superset of ADMIN — D-07).
export default async function TenantDashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug: string };
}) {
  const user = await getMmUserFromDb();
  if (!user) redirect('/mentormatch/login');

  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();

  if (user.role !== 'SUPER_ADMIN' && user.tenantId !== tenant.id) {
    redirect(await resolvePostLoginHref(user));
  }

  return <DashboardShell slug={params.slug}>{children}</DashboardShell>;
}
