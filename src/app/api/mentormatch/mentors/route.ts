import { NextResponse } from 'next/server';
import { and, eq, ilike, inArray, or } from 'drizzle-orm';
import { db } from '@/db';
import { mmConnection, mmSkill, mmUser, mmUserSkill } from '@/lib/mentormatch/db/schema';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';

export const dynamic = 'force-dynamic';

// GET ?tenantId=&q=&skill= — approved mentors of a tenant (R21).
// tenantId is required (400 otherwise — acceptance D3); the caller must belong
// to that tenant (or be SUPER_ADMIN). Authorization reads the DB (D-06).
export async function GET(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });

  const params = new URL(req.url).searchParams;
  const tenantId = params.get('tenantId');
  if (!tenantId) return NextResponse.json({ error: 'tenantId obrigatorio' }, { status: 400 });
  if (user.role !== 'SUPER_ADMIN' && user.tenantId !== tenantId) {
    return NextResponse.json({ error: 'Sem permissao' }, { status: 403 });
  }

  const q = params.get('q')?.trim();
  const skillId = params.get('skill');

  try {
    // Optional skill filter → restrict to mentors teaching that skill.
    let mentorIdFilter: string[] | null = null;
    if (skillId) {
      const teaching = await db
        .select()
        .from(mmUserSkill)
        .where(and(eq(mmUserSkill.skillId, skillId), eq(mmUserSkill.isTeaching, true)));
      mentorIdFilter = teaching.map((t) => t.userId);
      if (mentorIdFilter.length === 0) return NextResponse.json([]);
    }

    const conditions = [
      eq(mmUser.tenantId, tenantId),
      eq(mmUser.role, 'MENTOR'),
      eq(mmUser.status, 'APPROVED'),
    ];
    if (q) {
      const like = `%${q}%`;
      const text = or(ilike(mmUser.name, like), ilike(mmUser.headline, like), ilike(mmUser.bio, like));
      if (text) conditions.push(text);
    }
    if (mentorIdFilter) conditions.push(inArray(mmUser.id, mentorIdFilter));

    const mentors = await db.select().from(mmUser).where(and(...conditions));
    if (mentors.length === 0) return NextResponse.json([]);

    const mentorIds = mentors.map((m) => m.id);

    // activeConnections per mentor (full-select + reduce; avoids partial-select).
    const accepted = await db
      .select()
      .from(mmConnection)
      .where(and(inArray(mmConnection.mentorId, mentorIds), eq(mmConnection.status, 'ACCEPTED')));
    const activeByMentor = new Map<string, number>();
    for (const c of accepted) activeByMentor.set(c.mentorId, (activeByMentor.get(c.mentorId) ?? 0) + 1);

    // Teaching skills per mentor.
    const links = await db
      .select()
      .from(mmUserSkill)
      .where(and(inArray(mmUserSkill.userId, mentorIds), eq(mmUserSkill.isTeaching, true)));
    const skillIds = [...new Set(links.map((l) => l.skillId))];
    const skillRows = skillIds.length
      ? await db.select().from(mmSkill).where(inArray(mmSkill.id, skillIds))
      : [];
    const skillName = new Map(skillRows.map((s) => [s.id, s.name]));
    const skillsByMentor = new Map<string, string[]>();
    for (const l of links) {
      const name = skillName.get(l.skillId);
      if (!name) continue;
      const arr = skillsByMentor.get(l.userId) ?? [];
      arr.push(name);
      skillsByMentor.set(l.userId, arr);
    }

    const result = mentors.map((m) => ({
      id: m.id,
      name: m.name,
      headline: m.headline,
      bio: m.bio,
      image: m.image,
      skills: skillsByMentor.get(m.id) ?? [],
      activeConnections: activeByMentor.get(m.id) ?? 0,
    }));
    return NextResponse.json(result);
  } catch (error) {
    console.error('[MM_API_ERROR]', { endpoint: 'mentors#GET', userId: user.id, error });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
