import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { mmTenant } from '@/lib/mentormatch/db/schema';
import type { MmDbUser } from '@/lib/mentormatch/auth-helpers';

// Single source of truth for the post-login destination. Reads the database for
// the tenant slug (never the JWT — D-06). Every guard that needs to bounce a
// user to "their" area calls this, so crossing guards never disagree (D-16).
export async function resolvePostLoginHref(user: MmDbUser): Promise<string> {
  if (user.role === 'SUPER_ADMIN') return '/mentormatch/admin';
  if (!user.role || !user.tenantId) return '/mentormatch/select-profile';
  if (!user.onboardingDone) return `/mentormatch/onboarding/${user.role.toLowerCase()}`;

  const rows = await db
    .select()
    .from(mmTenant)
    .where(eq(mmTenant.id, user.tenantId))
    .limit(1);
  const tenant = rows[0];
  if (!tenant) return '/mentormatch/select-profile';

  switch (user.role) {
    case 'ADMIN':
      return `/mentormatch/t/${tenant.slug}/admin/users`;
    case 'MENTOR':
      return `/mentormatch/t/${tenant.slug}/mentor`;
    case 'MENTEE':
      return `/mentormatch/t/${tenant.slug}/mentee`;
    default:
      return '/mentormatch/select-profile';
  }
}
