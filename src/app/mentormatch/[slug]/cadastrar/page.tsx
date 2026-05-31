import { notFound } from 'next/navigation';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';
import { resolveColorScheme } from '@/lib/mentormatch/color-scheme';
import { MentorMatchThemeRoot } from '@/mentormatch/design-system';
import { SetTenantCookie } from '@/components/mentormatch/landing/SetTenantCookie';
import { BrandedAuthShell } from '@/components/mentormatch/auth/BrandedAuthShell';
import { BrandedRegisterForm } from '@/components/mentormatch/auth/BrandedRegisterForm';

export const dynamic = 'force-dynamic';

// Cadastro branded por tenant: /mentormatch/{slug}/cadastrar. Registro aberto
// (D007); associa ao tenant via cookie mm-tenant. notFound se tenant invalido.
export default async function BrandedRegisterPage({ params }: { params: { slug: string } }) {
  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();
  const theme = await resolveColorScheme();

  return (
    <MentorMatchThemeRoot brand={tenant.brandColor} theme={theme}>
      <SetTenantCookie slug={tenant.slug} />
      <BrandedAuthShell tenant={tenant}>
        <BrandedRegisterForm slug={tenant.slug} />
      </BrandedAuthShell>
    </MentorMatchThemeRoot>
  );
}
