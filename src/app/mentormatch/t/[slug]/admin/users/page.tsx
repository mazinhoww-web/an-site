import { notFound } from 'next/navigation';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';
import { UsersTable } from '@/components/mentormatch/admin/UsersTable';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage({ params }: { params: { slug: string } }) {
  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();
  return (
    <main className="space-y-6">
      <h1 className="font-mmdisplay text-display-m">Usuarios</h1>
      <UsersTable tenantId={tenant.id} />
    </main>
  );
}
