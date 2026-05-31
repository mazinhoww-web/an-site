import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';
import { tenantBrandStyle } from '@/lib/mentormatch/tenant-theme';
import { SetTenantCookie } from '@/components/mentormatch/landing/SetTenantCookie';

export const dynamic = 'force-dynamic';

// Branded landing for a tenant: /mentormatch/{slug}. Applies the tenant theme by
// slug (independent of the cookie) and sets the mm-tenant cookie for the flow
// that follows (register/onboarding read it server-side).
export default async function BrandedLandingPage({ params }: { params: { slug: string } }) {
  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();

  // Per-tenant brand color injected at runtime: --mm-primary (legacy) + --brand
  // (design system), com --brand-contrast calculado por contraste WCAG.
  const style = tenantBrandStyle(tenant);

  return (
    <div className={`theme-${tenant.themeKey} min-h-screen bg-bone text-ink`} style={style}>
      <SetTenantCookie slug={tenant.slug} />
      <main className="mx-auto flex max-w-2xl flex-col items-start gap-8 px-6 py-24">
        {tenant.logoUrl ? (
          <Image src={tenant.logoUrl} alt={tenant.name} width={160} height={48} className="h-12 w-auto" />
        ) : (
          <span
            className="inline-block rounded px-3 py-1 font-heading text-h3 text-paper"
            style={{ background: 'var(--mm-primary)' }}
          >
            {tenant.name}
          </span>
        )}

        <h1 className="font-heading text-display-l">{tenant.name}</h1>
        <p className="text-body-l text-graphite">
          Programa de mentoria. Conecte-se a mentores e evolua na carreira.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/mentormatch/register"
            className="rounded px-6 py-3 font-heading text-body text-paper"
            style={{ background: 'var(--mm-primary)' }}
          >
            Quero participar
          </Link>
          <Link
            href="/mentormatch/login"
            className="rounded border border-hairline px-6 py-3 font-heading text-body text-ink hover:border-ink"
          >
            Ja tenho conta
          </Link>
        </div>
      </main>
    </div>
  );
}
