import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';
import { MentorMatchThemeRoot } from '@/mentormatch/design-system';
import { resolveColorScheme } from '@/lib/mentormatch/color-scheme';
import { SetTenantCookie } from '@/components/mentormatch/landing/SetTenantCookie';

export const dynamic = 'force-dynamic';

// Branded landing for a tenant: /mentormatch/{slug}. Applies the tenant brand by
// slug (independent of the cookie) and sets the mm-tenant cookie for the flow
// that follows (register/onboarding read it server-side). DS canonico (D022).
export default async function BrandedLandingPage({ params }: { params: { slug: string } }) {
  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();

  const theme = await resolveColorScheme();

  return (
    <MentorMatchThemeRoot
      theme={theme}
      brand={tenant.brandColor}
      style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}
    >
      <SetTenantCookie slug={tenant.slug} />
      <main
        className="mx-auto flex flex-col items-start"
        style={{ maxWidth: 640, gap: 32, padding: '96px 24px' }}
      >
        {tenant.logoUrl ? (
          <Image src={tenant.logoUrl} alt={tenant.name} width={160} height={48} style={{ height: 48, width: 'auto' }} />
        ) : (
          <span
            className="mm-h3"
            style={{
              display: 'inline-block',
              borderRadius: 'var(--r-md)',
              padding: '4px 12px',
              background: 'var(--brand)',
              color: 'var(--brand-contrast)',
            }}
          >
            {tenant.name}
          </span>
        )}

        <h1 className="mm-display">{tenant.name}</h1>
        <p className="mm-body" style={{ color: 'var(--text-secondary)', fontSize: 18 }}>
          Programa de mentoria. Conecte-se a mentores e evolua na carreira.
        </p>

        <div className="flex flex-wrap" style={{ gap: 12 }}>
          <Link
            href={`/mentormatch/${tenant.slug}/cadastrar`}
            className="mm-btn mm-btn--primary"
            style={{ textDecoration: 'none' }}
          >
            Quero participar
          </Link>
          <Link
            href={`/mentormatch/${tenant.slug}/login`}
            className="mm-btn mm-btn--secondary"
            style={{ textDecoration: 'none' }}
          >
            Ja tenho conta
          </Link>
        </div>
      </main>
    </MentorMatchThemeRoot>
  );
}
