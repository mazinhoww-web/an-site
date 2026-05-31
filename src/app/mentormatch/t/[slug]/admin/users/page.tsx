import { notFound } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { mmUser } from '@/lib/mentormatch/db/schema';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';
import { resolveColorScheme } from '@/lib/mentormatch/color-scheme';
import { AdminUsersView } from '@/components/mentormatch/admin/AdminUsersView';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage({ params }: { params: { slug: string } }) {
  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();
  const theme = await resolveColorScheme();

  const rows = await db
    .select()
    .from(mmUser)
    .where(eq(mmUser.tenantId, tenant.id))
    .orderBy(desc(mmUser.createdAt));
  const users = rows.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, status: u.status }));

  return (
    <AdminUsersView tenantId={tenant.id} brandColor={tenant.brandColor} theme={theme} initialUsers={users} />
  );
}
