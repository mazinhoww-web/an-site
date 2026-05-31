import { notFound } from 'next/navigation';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';
import { resolveColorScheme } from '@/lib/mentormatch/color-scheme';
import { AdminBrandingView } from '@/components/mentormatch/admin/AdminBrandingView';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage({ params }: { params: { slug: string } }) {
  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();
  const theme = await resolveColorScheme();

  return (
    <AdminBrandingView
      slug={tenant.slug}
      theme={theme}
      initial={{
        name: tenant.name,
        brandColor: tenant.brandColor,
        logoUrl: tenant.logoUrl,
        maxMenteesPerMentor: tenant.maxMenteesPerMentor,
      }}
    />
  );
}
