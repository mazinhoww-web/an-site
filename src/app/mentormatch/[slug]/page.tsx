import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';
import { SetTenantCookie } from '@/components/mentormatch/landing/SetTenantCookie';

export const dynamic = 'force-dynamic';

// Branded landing for a tenant: /mentormatch/{slug}. Applies the tenant theme by
// slug (independent of the cookie) and sets the mm-tenant cookie for the flow
// that follows (register/onboarding read it server-side).
export default async function BrandedLandingPage({ params }: { params: { slug: string } }) {
  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();

  // Per-tenant brand color overrides the named theme's primary.
  const style = { '--mm-primary': tenant.brandColor } as CSSProperties;

  return (
    <div className={`theme-${tenant.themeKey} min-h-screen bg-mm-bg text-mm-text`} style={style}>
      <SetTenantCookie slug={tenant.slug} />
      <main className="mx-auto flex max-w-2xl flex-col items-start gap-8 px-6 py-24">
        {tenant.logoUrl ? (
          <Image src={tenant.logoUrl} alt={tenant.name} width={160} height={48} className="h-12 w-auto" />
        ) : (
          <span
            className="inline-block rounded px-3 py-1 font-mmdisplay text-h3 text-mm-primaryfg"
            style={{ background: 'var(--mm-primary)' }}
          >
            {tenant.name}
          </span>
        )}

        <h1 className="font-mmdisplay text-display-l">{tenant.name}</h1>
        <p className="text-body-l text-mm-muted">
          Programa de mentoria. Conecte-se a mentores e evolua na carreira.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/mentormatch/register"
            className="rounded px-6 py-3 font-mmdisplay text-body text-mm-primaryfg"
            style={{ background: 'var(--mm-primary)' }}
          >
            Quero participar
          </Link>
          <Link
            href="/mentormatch/login"
            className="rounded border border-mm-border px-6 py-3 font-mmdisplay text-body text-mm-text hover:border-mm-primary"
          >
            Ja tenho conta
          </Link>
        </div>
      </main>
    </div>
  );
}
