import { notFound } from 'next/navigation';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';
import { SettingsForm } from '@/components/mentormatch/admin/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage({ params }: { params: { slug: string } }) {
  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();
  return (
    <main className="space-y-6">
      <h1 className="font-heading text-display-m">Configuracoes</h1>
      <SettingsForm
        initial={{
          name: tenant.name,
          slug: tenant.slug,
          brandColor: tenant.brandColor,
          secondaryColor: tenant.secondaryColor,
          logoUrl: tenant.logoUrl,
          themeKey: tenant.themeKey,
          maxMenteesPerMentor: tenant.maxMenteesPerMentor,
        }}
      />
    </main>
  );
}
