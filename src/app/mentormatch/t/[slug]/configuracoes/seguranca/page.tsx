import { notFound } from 'next/navigation';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';
import { resolveColorScheme } from '@/lib/mentormatch/color-scheme';
import { ChangePasswordForm } from '@/components/mentormatch/account/ChangePasswordForm';

export const dynamic = 'force-dynamic';

// /mentormatch/t/[slug]/configuracoes/seguranca — troca de senha (R19).
// Guard de sessao + ownership vem do layout t/[slug] (404 cross-tenant).
export default async function SecurityPage({ params }: { params: { slug: string } }) {
  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();
  const theme = await resolveColorScheme();

  return <ChangePasswordForm brandColor={tenant.brandColor} theme={theme} />;
}
