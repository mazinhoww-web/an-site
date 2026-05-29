import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { mmTenant, mmUser } from '@/lib/mentormatch/db/schema';
import { mmAuth } from '@/lib/mentormatch/auth';

// Authoritative user record straight from the database. Every MentorMatch
// authorization decision (API handlers, layout guards) must call this rather
// than trusting JWT claims, which go stale right after onboarding (defect D-06).
export type MmDbUser = typeof mmUser.$inferSelect;

export async function getMmSession() {
  return mmAuth();
}

/**
 * Returns the current MentorMatch user re-read from the database, or null if
 * there is no session or the user no longer exists.
 */
export async function getMmUserFromDb(): Promise<MmDbUser | null> {
  const session = await mmAuth();
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!id) return null;
  const rows = await db.select().from(mmUser).where(eq(mmUser.id, id)).limit(1);
  return rows[0] ?? null;
}

/** Resolve an active tenant by slug (used by guards and tenant resolution). */
export async function getActiveTenantBySlug(slug: string) {
  const rows = await db
    .select()
    .from(mmTenant)
    .where(and(eq(mmTenant.slug, slug), eq(mmTenant.active, true)))
    .limit(1);
  return rows[0] ?? null;
}
