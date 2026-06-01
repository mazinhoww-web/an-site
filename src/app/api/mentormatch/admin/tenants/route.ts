import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { mmPlan, mmSkill, mmSubscription, mmTenant } from '@/lib/mentormatch/db/schema';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { getTenantsOverview } from '@/lib/mentormatch/admin-stats';
import { runSerializable } from '@/lib/mentormatch/tx';
import { MM_DEFAULT_SKILLS } from '@/lib/mentormatch/constants';
import { mmTenantCreateSchema, mmTenantUpdateSchema } from '@/lib/mentormatch/validators';
import { alert5xx } from '@/lib/mentormatch/observability';

export const dynamic = 'force-dynamic';

// All operations here are GLOBAL → SUPER_ADMIN only (read from DB, D-06).
async function requireSuperAdmin() {
  const user = await getMmUserFromDb();
  if (!user) return { error: NextResponse.json({ error: 'Nao autenticado' }, { status: 401 }), user: null };
  if (user.role !== 'SUPER_ADMIN') {
    return { error: NextResponse.json({ error: 'Sem permissao' }, { status: 403 }), user: null };
  }
  return { error: null, user };
}

// GET — tenants overview + totals.
export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;
  return NextResponse.json(await getTenantsOverview());
}

// POST — create a tenant + subscription + default skills (transaction).
export async function POST(req: Request) {
  const { error, user } = await requireSuperAdmin();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = mmTenantCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dados invalidos' }, { status: 400 });
  }
  const data = parsed.data;

  try {
    const plan = await db.select().from(mmPlan).where(eq(mmPlan.id, data.planId)).limit(1);
    if (!plan[0]) return NextResponse.json({ error: 'Plano invalido' }, { status: 400 });

    const slugClash = await db.select().from(mmTenant).where(eq(mmTenant.slug, data.slug)).limit(1);
    if (slugClash[0]) return NextResponse.json({ error: 'Slug ja existe' }, { status: 409 });

    const tenant = await runSerializable(async (tx) => {
      const inserted = await tx
        .insert(mmTenant)
        .values({
          name: data.name,
          slug: data.slug,
          brandColor: data.brandColor,
          secondaryColor: data.secondaryColor ?? null,
          themeKey: data.themeKey ?? 'dark',
          planId: data.planId,
        })
        .returning();
      const t = inserted[0]!;
      await tx.insert(mmSubscription).values({ tenantId: t.id, planId: data.planId, active: true });
      await tx.insert(mmSkill).values(MM_DEFAULT_SKILLS.map((name) => ({ name, tenantId: t.id })));
      return t;
    });

    return NextResponse.json(tenant, { status: 201 });
  } catch (err) {
    alert5xx('admin/tenants#POST', err, { userId: user.id });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// PATCH — update tenant (name/colors/theme/plan/active). Syncs subscription plan.
export async function PATCH(req: Request) {
  const { error, user } = await requireSuperAdmin();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = mmTenantUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dados invalidos' }, { status: 400 });
  }
  const data = parsed.data;

  try {
    const rows = await db.select().from(mmTenant).where(eq(mmTenant.id, data.id)).limit(1);
    const tenant = rows[0];
    if (!tenant) return NextResponse.json({ error: 'Tenant nao encontrado' }, { status: 404 });

    if (data.planId) {
      const plan = await db.select().from(mmPlan).where(eq(mmPlan.id, data.planId)).limit(1);
      if (!plan[0]) return NextResponse.json({ error: 'Plano invalido' }, { status: 400 });
    }

    const updated = await runSerializable(async (tx) => {
      const u = await tx
        .update(mmTenant)
        .set({
          name: data.name ?? tenant.name,
          brandColor: data.brandColor ?? tenant.brandColor,
          secondaryColor: data.secondaryColor ?? tenant.secondaryColor,
          themeKey: data.themeKey ?? tenant.themeKey,
          planId: data.planId ?? tenant.planId,
          active: data.active ?? tenant.active,
          updatedAt: new Date(),
        })
        .where(eq(mmTenant.id, data.id))
        .returning();
      if (data.planId) {
        await tx.update(mmSubscription).set({ planId: data.planId }).where(eq(mmSubscription.tenantId, data.id));
      }
      return u[0]!;
    });

    return NextResponse.json(updated);
  } catch (err) {
    alert5xx('admin/tenants#PATCH', err, { userId: user.id });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
