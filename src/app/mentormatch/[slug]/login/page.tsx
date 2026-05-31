import { notFound } from 'next/navigation';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';
import { resolveColorScheme } from '@/lib/mentormatch/color-scheme';
import { MentorMatchThemeRoot } from '@/mentormatch/design-system';
import { SetTenantCookie } from '@/components/mentormatch/landing/SetTenantCookie';
import { BrandedAuthShell } from '@/components/mentormatch/auth/BrandedAuthShell';
import { BrandedLoginForm } from '@/components/mentormatch/auth/BrandedLoginForm';

export const dynamic = 'force-dynamic';

// Login branded por tenant: /mentormatch/{slug}/login. Area publica (sem guard),
// marca do tenant aplicada via --brand. notFound para tenant inexistente/inativo.
export default async function BrandedLoginPage({ params }: { params: { slug: string } }) {
  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();
  const theme = await resolveColorScheme();

  return (
    <MentorMatchThemeRoot brand={tenant.brandColor} theme={theme}>
      <SetTenantCookie slug={tenant.slug} />
      <BrandedAuthShell tenant={tenant}>
        <BrandedLoginForm slug={tenant.slug} />
      </BrandedAuthShell>
    </MentorMatchThemeRoot>
  );
}
