import { notFound } from 'next/navigation';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';
import { SkillsManager } from '@/components/mentormatch/admin/SkillsManager';

export const dynamic = 'force-dynamic';

export default async function AdminSkillsPage({ params }: { params: { slug: string } }) {
  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();
  return (
    <main className="space-y-6">
      <h1 className="font-mmdisplay text-display-m">Habilidades</h1>
      <SkillsManager tenantId={tenant.id} />
    </main>
  );
}
