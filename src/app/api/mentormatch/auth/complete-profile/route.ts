import { NextResponse } from 'next/server';
import { and, eq, inArray, ne, sql } from 'drizzle-orm';
import { db } from '@/db';
import { mmSkill, mmUser, mmUserSkill } from '@/lib/mentormatch/db/schema';
import { mmAuth } from '@/lib/mentormatch/auth';
import { resolveOnboardingTenant } from '@/lib/mentormatch/tenant';
import { resolvePostLoginHref } from '@/lib/mentormatch/dashboard-href';
import { mmCompleteProfileSchema } from '@/lib/mentormatch/validators';
import { alert5xx } from '@/lib/mentormatch/observability';

export const dynamic = 'force-dynamic';

// The single onboarding write path (R12). Reads the user from the DB (D-06),
// resolves the tenant (R13), and persists role + profile + skills atomically.
export async function POST(req: Request) {
  const session = await mmAuth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = mmCompleteProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });
  }
  const data = parsed.data;

  try {
    const currentRows = await db.select().from(mmUser).where(eq(mmUser.id, userId)).limit(1);
    const current = currentRows[0];
    if (!current) return NextResponse.json({ error: 'Usuario nao encontrado' }, { status: 404 });

    // Tenant: keep an invite-assigned tenant; otherwise resolve cookie/default.
    let tenantId = current.tenantId;
    if (!tenantId) {
      const tenant = await resolveOnboardingTenant();
      if (!tenant) return NextResponse.json({ error: 'Tenant nao encontrado' }, { status: 400 });
      tenantId = tenant.id;
      // D-05: block only a duplicate within the SAME tenant.
      const clash = await db
        .select()
        .from(mmUser)
        .where(and(eq(mmUser.email, current.email), eq(mmUser.tenantId, tenantId), ne(mmUser.id, userId)))
        .limit(1);
      if (clash[0]) {
        return NextResponse.json({ error: 'Email ja cadastrado neste tenant' }, { status: 409 });
      }
    }

    // Only accept skills that belong to this tenant and are active.
    const validSkills = await db
      .select()
      .from(mmSkill)
      .where(and(inArray(mmSkill.id, data.skills), eq(mmSkill.tenantId, tenantId), eq(mmSkill.isActive, true)));
    const validSkillIds = validSkills.map((s) => s.id);
    if (validSkillIds.length === 0) {
      return NextResponse.json({ error: 'Selecione ao menos uma habilidade valida' }, { status: 400 });
    }

    // D-22: dual-role. `role` segue como papel primario; capacidades derivam do
    // payload (wizard branded) ou de `role` (wizard legada). Skills do usuario
    // sao "de ensino" quando ele pode mentorar.
    const canMentor = data.canMentor ?? data.role === 'MENTOR';
    const canMentee = data.canMentee ?? data.role === 'MENTEE';
    const isTeaching = canMentor;

    const updatedUser = await db.transaction(async (tx) => {
      const upd = await tx
        .update(mmUser)
        .set({
          role: data.role,
          canMentor,
          canMentee,
          name: data.name,
          headline: data.headline ?? null,
          position: data.position ?? null,
          department: data.department ?? null,
          bio: data.bio ?? null,
          education: data.education ?? null,
          experience: data.experience ?? null,
          linkedin: data.linkedin ? data.linkedin : null,
          whatsapp: data.whatsapp ?? null,
          image: data.image ?? null,
          maxMentees: data.maxMentees ?? current.maxMentees,
          tenantId,
          status: 'APPROVED',
          onboardingDone: true,
          updatedAt: new Date(),
        })
        .where(eq(mmUser.id, userId))
        .returning();

      // Recreate the user's skill links (idempotent re-onboard).
      await tx.delete(mmUserSkill).where(eq(mmUserSkill.userId, userId));
      await tx
        .insert(mmUserSkill)
        .values(validSkillIds.map((skillId) => ({ userId, skillId, isTeaching })));
      await tx
        .update(mmSkill)
        .set({ usageCount: sql`${mmSkill.usageCount} + 1` })
        .where(inArray(mmSkill.id, validSkillIds));

      return upd[0]!;
    });

    const redirectTo = await resolvePostLoginHref(updatedUser);
    return NextResponse.json({
      user: {
        id: updatedUser.id,
        role: updatedUser.role,
        tenantId: updatedUser.tenantId,
        onboardingDone: updatedUser.onboardingDone,
      },
      redirectTo,
    });
  } catch (error) {
    alert5xx('auth/complete-profile', error, { userId });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
