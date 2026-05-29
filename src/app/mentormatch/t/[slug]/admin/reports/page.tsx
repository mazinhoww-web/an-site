import { notFound } from 'next/navigation';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';
import { ReportsView } from '@/components/mentormatch/admin/ReportsView';

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage({ params }: { params: { slug: string } }) {
  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();
  return (
    <main className="space-y-6">
      <h1 className="font-heading text-display-m">Relatorios</h1>
      <ReportsView tenantId={tenant.id} />
    </main>
  );
}
