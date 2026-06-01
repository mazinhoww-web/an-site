import { NextResponse } from 'next/server';
import { and, desc, eq, ilike } from 'drizzle-orm';
import { db } from '@/db';
import { mmSkill, mmUserSkill } from '@/lib/mentormatch/db/schema';
import { canAdminTenant, getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { mmSkillCreateSchema, mmSkillUpdateSchema } from '@/lib/mentormatch/validators';
import { alert5xx } from '@/lib/mentormatch/observability';

export const dynamic = 'force-dynamic';

// GET ?tenantId — skills of a tenant (D-04: filtered by tenantId).
export async function GET(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });

  const tenantId = new URL(req.url).searchParams.get('tenantId');
  if (!tenantId) return NextResponse.json({ error: 'tenantId obrigatorio' }, { status: 400 });
  if (user.role !== 'SUPER_ADMIN' && user.tenantId !== tenantId) {
    return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });
  }

  const rows = await db
    .select()
    .from(mmSkill)
    .where(eq(mmSkill.tenantId, tenantId))
    .orderBy(desc(mmSkill.usageCount));
  return NextResponse.json(rows);
}

// POST ?tenantId — create a skill (ADMIN/SUPER). Unique by (lower(name), tenant) — R17.
export async function POST(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  const tenantId = new URL(req.url).searchParams.get('tenantId');
  if (!tenantId) return NextResponse.json({ error: 'tenantId obrigatorio' }, { status: 400 });
  if (!canAdminTenant(user, tenantId)) {
    return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = mmSkillCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });

  try {
    const existing = await db
      .select()
      .from(mmSkill)
      .where(and(eq(mmSkill.tenantId, tenantId), ilike(mmSkill.name, parsed.data.name)))
      .limit(1);
    if (existing[0]) return NextResponse.json({ error: 'Habilidade ja existe' }, { status: 409 });

    const inserted = await db
      .insert(mmSkill)
      .values({ name: parsed.data.name, category: parsed.data.category ?? null, tenantId })
      .returning();
    return NextResponse.json(inserted[0], { status: 201 });
  } catch (error) {
    alert5xx('skills#POST', error, { userId: user.id });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// PATCH ?id — edit a skill (D-03). ADMIN/SUPER of the skill's tenant.
export async function PATCH(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id obrigatorio' }, { status: 400 });

  const body = await req.json().catch(() => null);
  const parsed = mmSkillUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });

  try {
    const rows = await db.select().from(mmSkill).where(eq(mmSkill.id, id)).limit(1);
    const skill = rows[0];
    if (!skill) return NextResponse.json({ error: 'Nao encontrada' }, { status: 404 });
    if (!canAdminTenant(user, skill.tenantId)) {
      return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });
    }

    if (parsed.data.name && parsed.data.name.toLowerCase() !== skill.name.toLowerCase()) {
      const clash = await db
        .select()
        .from(mmSkill)
        .where(and(eq(mmSkill.tenantId, skill.tenantId), ilike(mmSkill.name, parsed.data.name)))
        .limit(1);
      if (clash[0]) return NextResponse.json({ error: 'Habilidade ja existe' }, { status: 409 });
    }

    const updated = await db
      .update(mmSkill)
      .set({
        name: parsed.data.name ?? skill.name,
        category: parsed.data.category ?? skill.category,
        isActive: parsed.data.isActive ?? skill.isActive,
        updatedAt: new Date(),
      })
      .where(eq(mmSkill.id, id))
      .returning();
    return NextResponse.json(updated[0]);
  } catch (error) {
    alert5xx('skills#PATCH', error, { userId: user.id });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// DELETE ?id — remove a skill (D-03). If in use, soft-delete (isActive=false).
export async function DELETE(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id obrigatorio' }, { status: 400 });

  try {
    const rows = await db.select().from(mmSkill).where(eq(mmSkill.id, id)).limit(1);
    const skill = rows[0];
    if (!skill) return NextResponse.json({ error: 'Nao encontrada' }, { status: 404 });
    if (!canAdminTenant(user, skill.tenantId)) {
      return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });
    }

    const usage = await db.$count(mmUserSkill, eq(mmUserSkill.skillId, id));
    if (usage > 0) {
      await db.update(mmSkill).set({ isActive: false, updatedAt: new Date() }).where(eq(mmSkill.id, id));
      return NextResponse.json({ ok: true, softDeleted: true });
    }
    await db.delete(mmSkill).where(eq(mmSkill.id, id));
    return NextResponse.json({ ok: true, softDeleted: false });
  } catch (error) {
    alert5xx('skills#DELETE', error, { userId: user.id });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
