'use server';

import { db } from '@/db';
import { skills } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function starSkill(slug: string): Promise<{ already: boolean; stars: number }> {
  const cookieName = `an_starred_${slug}`;
  const jar = await cookies();

  if (jar.get(cookieName)) {
    const [skill] = await db
      .select({ stars: skills.stars })
      .from(skills)
      .where(eq(skills.slug, slug))
      .limit(1);
    return { already: true, stars: skill?.stars ?? 0 };
  }

  const [updated] = await db
    .update(skills)
    .set({ stars: sql`${skills.stars} + 1` })
    .where(eq(skills.slug, slug))
    .returning({ stars: skills.stars });

  jar.set(cookieName, '1', {
    maxAge: 90 * 24 * 60 * 60,
    path: '/',
    sameSite: 'lax',
    httpOnly: false,
  });

  return { already: false, stars: updated?.stars ?? 0 };
}
