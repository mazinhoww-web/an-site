import { notFound } from 'next/navigation';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';
import { resolveColorScheme } from '@/lib/mentormatch/color-scheme';
import { InvitationsManager } from '@/components/mentormatch/admin/InvitationsManager';

export const dynamic = 'force-dynamic';

export default async function AdminInvitationsPage({ params }: { params: { slug: string } }) {
  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();
  const theme = await resolveColorScheme();
  return <InvitationsManager tenantId={tenant.id} brandColor={tenant.brandColor} theme={theme} />;
}
