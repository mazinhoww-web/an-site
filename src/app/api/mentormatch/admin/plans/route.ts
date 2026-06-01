import { NextResponse } from 'next/server';
import { asc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { mmPlan } from '@/lib/mentormatch/db/schema';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { mmPlanUpdateSchema } from '@/lib/mentormatch/validators';
import { alert5xx } from '@/lib/mentormatch/observability';

export const dynamic = 'force-dynamic';

// Operacoes GLOBAIS -> SUPER_ADMIN apenas (leem do banco, D-06).
async function requireSuperAdmin() {
  const user = await getMmUserFromDb();
  if (!user) return { error: NextResponse.json({ error: 'Nao autenticado' }, { status: 401 }) };
  if (user.role !== 'SUPER_ADMIN') return { error: NextResponse.json({ error: 'Sem permissao' }, { status: 403 }) };
  return { error: null };
}

// GET — lista de planos.
export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;
  const rows = await db.select().from(mmPlan).orderBy(asc(mmPlan.priceMonthly));
  return NextResponse.json(rows);
}

// PATCH {id, active?, features?} — toggle de ativo / feature flags.
export async function PATCH(req: Request) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = mmPlanUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });
  const { id, active, features } = parsed.data;

  try {
    const rows = await db.select().from(mmPlan).where(eq(mmPlan.id, id)).limit(1);
    const plan = rows[0];
    if (!plan) return NextResponse.json({ error: 'Plano nao encontrado' }, { status: 404 });

    const updated = await db
      .update(mmPlan)
      .set({
        active: active ?? plan.active,
        features: features ?? plan.features,
        updatedAt: new Date(),
      })
      .where(eq(mmPlan.id, id))
      .returning();
    return NextResponse.json(updated[0]);
  } catch (error_) {
    alert5xx('admin/plans#PATCH', error_);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
