import { and, eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { mmPlan, mmSkill, mmSubscription, mmTenant, mmUser } from '@/lib/mentormatch/db/schema';
import { MM_DEFAULT_SKILLS } from '@/lib/mentormatch/constants';

// ---------------------------------------------------------------------------
// Idempotent MentorMatch seed. Run with: pnpm db:seed-mm (needs a live DB).
// Creates plans, tenants (default + sicredi), subscriptions, an admin demo
// user, the super admin (from env), and a per-tenant skill catalog.
// ---------------------------------------------------------------------------

const BCRYPT_COST = 10;
const DEFAULT_SKILLS = MM_DEFAULT_SKILLS;

type PlanSeed = {
  name: string;
  slug: string;
  priceMonthly: number; // BRL cents
  priceYearly: number;
  maxUsers: number;
  maxConnections: number;
  maxLibraryItems: number;
  maxAdmins: number;
};

const PLANS: PlanSeed[] = [
  {
    name: 'Free',
    slug: 'free',
    priceMonthly: 0,
    priceYearly: 0,
    maxUsers: 50,
    maxConnections: 100,
    maxLibraryItems: 10,
    maxAdmins: 1,
  },
  {
    name: 'Starter',
    slug: 'starter',
    priceMonthly: 29900,
    priceYearly: 299000,
    maxUsers: 200,
    maxConnections: 500,
    maxLibraryItems: 50,
    maxAdmins: 3,
  },
  {
    name: 'Pro',
    slug: 'pro',
    priceMonthly: 79900,
    priceYearly: 799000,
    maxUsers: 1000,
    maxConnections: 999999,
    maxLibraryItems: 200,
    maxAdmins: 10,
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    priceMonthly: 99999900,
    priceYearly: 0,
    maxUsers: 999999,
    maxConnections: 999999,
    maxLibraryItems: 999999,
    maxAdmins: 999999,
  },
];

async function upsertPlan(p: PlanSeed): Promise<string> {
  const existing = await db.select({ id: mmPlan.id }).from(mmPlan).where(eq(mmPlan.slug, p.slug)).limit(1);
  if (existing[0]) return existing[0].id;
  const inserted = await db.insert(mmPlan).values(p).returning({ id: mmPlan.id });
  return inserted[0]!.id;
}

type TenantSeed = {
  name: string;
  slug: string;
  brandColor: string;
  secondaryColor?: string;
  themeKey: string;
};

async function upsertTenant(t: TenantSeed, planId: string): Promise<string> {
  const existing = await db
    .select({ id: mmTenant.id })
    .from(mmTenant)
    .where(eq(mmTenant.slug, t.slug))
    .limit(1);
  if (existing[0]) return existing[0].id;
  const inserted = await db
    .insert(mmTenant)
    .values({ ...t, planId })
    .returning({ id: mmTenant.id });
  return inserted[0]!.id;
}

async function ensureSubscription(tenantId: string, planId: string): Promise<void> {
  const existing = await db
    .select({ id: mmSubscription.id })
    .from(mmSubscription)
    .where(eq(mmSubscription.tenantId, tenantId))
    .limit(1);
  if (existing[0]) return;
  await db.insert(mmSubscription).values({ tenantId, planId, active: true });
}

async function ensureUser(opts: {
  email: string;
  name: string;
  password: string; // plaintext, hashed here
  role: string;
  tenantId: string;
}): Promise<void> {
  const existing = await db
    .select({ id: mmUser.id })
    .from(mmUser)
    .where(and(eq(mmUser.email, opts.email), eq(mmUser.tenantId, opts.tenantId)))
    .limit(1);
  if (existing[0]) return;
  const hash = await bcrypt.hash(opts.password, BCRYPT_COST);
  await db.insert(mmUser).values({
    email: opts.email,
    name: opts.name,
    password: hash,
    role: opts.role,
    status: 'APPROVED',
    onboardingDone: true,
    tenantId: opts.tenantId,
  });
}

async function ensureSkills(tenantId: string): Promise<void> {
  for (const name of DEFAULT_SKILLS) {
    const existing = await db
      .select({ id: mmSkill.id })
      .from(mmSkill)
      .where(and(eq(mmSkill.name, name), eq(mmSkill.tenantId, tenantId)))
      .limit(1);
    if (existing[0]) continue;
    await db.insert(mmSkill).values({ name, tenantId });
  }
}

export async function seed(): Promise<void> {
  // 1. Plans
  const planIds = new Map<string, string>();
  for (const p of PLANS) {
    planIds.set(p.slug, await upsertPlan(p));
  }
  const freePlanId = planIds.get('free')!;

  // 2. Tenants + subscriptions
  const defaultTenantId = await upsertTenant(
    { name: 'MentorMatch Demo', slug: 'default', brandColor: '#6366f1', themeKey: 'dark' },
    freePlanId,
  );
  await ensureSubscription(defaultTenantId, freePlanId);

  const sicrediTenantId = await upsertTenant(
    {
      name: 'MentorMatch Sicredi',
      slug: 'sicredi',
      brandColor: '#33820D',
      secondaryColor: '#0A4B1E',
      themeKey: 'sicredi',
    },
    freePlanId,
  );
  await ensureSubscription(sicrediTenantId, freePlanId);

  // 3. Demo admin (default tenant)
  await ensureUser({
    email: 'admin@mentormatch.com',
    name: 'Admin',
    password: 'admin123',
    role: 'ADMIN',
    tenantId: defaultTenantId,
  });

  // 4. Super admin (env-driven; distinct fallback to avoid colliding with the
  //    demo admin in the default tenant).
  const superEmail = process.env.SUPER_ADMIN_EMAIL ?? 'superadmin@mentormatch.com';
  const superPassword = process.env.SUPER_ADMIN_PASSWORD ?? 'admin123';
  if (!process.env.SUPER_ADMIN_EMAIL || !process.env.SUPER_ADMIN_PASSWORD) {
    console.warn(
      '[MM_SEED] SUPER_ADMIN_EMAIL/SUPER_ADMIN_PASSWORD not set — using insecure fallbacks. Set them before production.',
    );
  }
  await ensureUser({
    email: superEmail,
    name: 'Super Admin',
    password: superPassword,
    role: 'SUPER_ADMIN',
    tenantId: defaultTenantId,
  });

  // 5. Per-tenant skills (D-04)
  await ensureSkills(defaultTenantId);
  await ensureSkills(sicrediTenantId);

  console.log('[MM_SEED] done: plans, tenants (default + sicredi), subscriptions, users, skills.');
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('[MM_SEED] failed', e);
    process.exit(1);
  });
