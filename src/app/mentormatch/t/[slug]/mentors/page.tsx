import { notFound } from 'next/navigation';
import { and, asc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { mmSkill } from '@/lib/mentormatch/db/schema';
import { getActiveTenantBySlug } from '@/lib/mentormatch/auth-helpers';
import { resolveColorScheme } from '@/lib/mentormatch/color-scheme';
import { MatchGrid } from '@/components/mentormatch/match/MatchGrid';

export const dynamic = 'force-dynamic';

export default async function MentorsPage({ params }: { params: { slug: string } }) {
  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();

  const theme = await resolveColorScheme();
  const skillRows = await db
    .select()
    .from(mmSkill)
    .where(and(eq(mmSkill.tenantId, tenant.id), eq(mmSkill.isActive, true)))
    .orderBy(asc(mmSkill.name));
  const skills = skillRows.map((s) => ({ id: s.id, name: s.name }));

  return (
    <MatchGrid slug={params.slug} tenantId={tenant.id} brandColor={tenant.brandColor} theme={theme} skills={skills} />
  );
}
