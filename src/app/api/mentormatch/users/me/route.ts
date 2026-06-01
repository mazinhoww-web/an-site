import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { mmUser } from '@/lib/mentormatch/db/schema';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { mmProfilePatchSchema } from '@/lib/mentormatch/validators';
import { alert5xx } from '@/lib/mentormatch/observability';

export const dynamic = 'force-dynamic';

function publicUser(u: typeof mmUser.$inferSelect) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    headline: u.headline,
    bio: u.bio,
    education: u.education,
    experience: u.experience,
    linkedin: u.linkedin,
    whatsapp: u.whatsapp,
    image: u.image,
    role: u.role,
    status: u.status,
    tenantId: u.tenantId,
    onboardingDone: u.onboardingDone,
  };
}

// GET — the current user, read from the database (D-06).
export async function GET() {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  return NextResponse.json(publicUser(user));
}

// PATCH — update the current user's own profile fields.
export async function PATCH(req: Request) {
  const user = await getMmUserFromDb();
  if (!user) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = mmProfilePatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });
  const d = parsed.data;

  try {
    const updated = await db
      .update(mmUser)
      .set({
        name: d.name ?? user.name,
        headline: d.headline ?? user.headline,
        bio: d.bio ?? user.bio,
        education: d.education ?? user.education,
        experience: d.experience ?? user.experience,
        linkedin: d.linkedin === '' ? null : d.linkedin ?? user.linkedin,
        whatsapp: d.whatsapp ?? user.whatsapp,
        image: d.image === '' ? null : d.image ?? user.image,
        updatedAt: new Date(),
      })
      .where(eq(mmUser.id, user.id))
      .returning();
    return NextResponse.json(publicUser(updated[0]!));
  } catch (error) {
    alert5xx('users/me#PATCH', error, { userId: user.id });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
