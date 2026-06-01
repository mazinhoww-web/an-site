import { notFound } from 'next/navigation';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';
import { resolveColorScheme } from '@/lib/mentormatch/color-scheme';
import { SkillsManager } from '@/components/mentormatch/admin/SkillsManager';

export const dynamic = 'force-dynamic';

export default async function AdminSkillsPage({ params }: { params: { slug: string } }) {
  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();
  const theme = await resolveColorScheme();
  return <SkillsManager tenantId={tenant.id} brandColor={tenant.brandColor} theme={theme} />;
}
