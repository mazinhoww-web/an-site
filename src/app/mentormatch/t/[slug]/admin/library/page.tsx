import { notFound } from 'next/navigation';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';
import { LibraryManager } from '@/components/mentormatch/admin/LibraryManager';

export const dynamic = 'force-dynamic';

export default async function AdminLibraryPage({ params }: { params: { slug: string } }) {
  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();
  return (
    <main className="space-y-6">
      <h1 className="font-mmdisplay text-display-m">Biblioteca</h1>
      <LibraryManager tenantId={tenant.id} />
    </main>
  );
}
