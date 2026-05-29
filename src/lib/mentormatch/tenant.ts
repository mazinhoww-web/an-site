import { cookies } from 'next/headers';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';

// Tenant resolution for onboarding (R13). The branded landing (Fase 10) sets the
// `mm-tenant` cookie; until then everything falls back to the `default` tenant.
export const MM_TENANT_COOKIE = 'mm-tenant';
export const MM_DEFAULT_TENANT_SLUG = 'default';

/**
 * Resolves the active tenant for the current request: cookie `mm-tenant` slug,
 * falling back to `default`. Returns null only if neither exists/active.
 * getActiveTenantBySlug filters by slug AND active=true in SQL (see auth-helpers).
 */
export async function resolveOnboardingTenant() {
  const jar = await cookies();
  const slug = jar.get(MM_TENANT_COOKIE)?.value || MM_DEFAULT_TENANT_SLUG;
  const tenant = await getActiveTenantBySlug(slug);
  if (tenant) return tenant;
  if (slug !== MM_DEFAULT_TENANT_SLUG) return getActiveTenantBySlug(MM_DEFAULT_TENANT_SLUG);
  return null;
}
