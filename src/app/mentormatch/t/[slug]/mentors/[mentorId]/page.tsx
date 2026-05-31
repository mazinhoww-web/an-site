import { notFound, redirect } from 'next/navigation';
import { and, eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { mmConnection, mmSkill, mmUser, mmUserSkill, mmWaitlistEntry } from '@/lib/mentormatch/db/schema';
import { getActiveTenantBySlug, getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { resolveColorScheme } from '@/lib/mentormatch/color-scheme';
import { MentorProfile } from '@/components/mentormatch/match/MentorProfile';

export const dynamic = 'force-dynamic';

export default async function MentorProfilePage({
  params,
}: {
  params: { slug: string; mentorId: string };
}) {
  const viewer = await getMmUserFromDb();
  if (!viewer) redirect('/mentormatch/login');

  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();

  const rows = await db
    .select()
    .from(mmUser)
    .where(
      and(
        eq(mmUser.id, params.mentorId),
        eq(mmUser.role, 'MENTOR'),
        eq(mmUser.status, 'APPROVED'),
        eq(mmUser.tenantId, tenant.id),
      ),
    )
    .limit(1);
  const mentor = rows[0];
  if (!mentor) notFound();

  // Teaching skills.
  const links = await db
    .select()
    .from(mmUserSkill)
    .where(and(eq(mmUserSkill.userId, mentor.id), eq(mmUserSkill.isTeaching, true)));
  const skillIds = links.map((l) => l.skillId);
  const skillRows = skillIds.length
    ? await db.select().from(mmSkill).where(inArray(mmSkill.id, skillIds))
    : [];
  const skills = skillRows.map((s) => s.name);

  // Capacity + stats.
  const activeConnections = await db.$count(
    mmConnection,
    and(eq(mmConnection.mentorId, mentor.id), eq(mmConnection.status, 'ACCEPTED')),
  );
  const totalConnections = await db.$count(mmConnection, eq(mmConnection.mentorId, mentor.id));

  // Already requested? (active connection or waitlist for this viewer).
  const existingConn = await db
    .select()
    .from(mmConnection)
    .where(
      and(
        eq(mmConnection.mentorId, mentor.id),
        eq(mmConnection.menteeId, viewer.id),
        inArray(mmConnection.status, ['PENDING', 'ACCEPTED']),
      ),
    )
    .limit(1);
  const existingWl = await db
    .select()
    .from(mmWaitlistEntry)
    .where(and(eq(mmWaitlistEntry.mentorId, mentor.id), eq(mmWaitlistEntry.menteeId, viewer.id)))
    .limit(1);

  const theme = await resolveColorScheme();

  return (
    <MentorProfile
      slug={params.slug}
      brandColor={tenant.brandColor}
      theme={theme}
      canRequest={viewer.role === 'MENTEE'}
      alreadyRequested={Boolean(existingConn[0] || existingWl[0])}
      mentor={{
        id: mentor.id,
        name: mentor.name,
        headline: mentor.headline,
        department: mentor.department,
        bio: mentor.bio,
        education: mentor.education,
        experience: mentor.experience,
        image: mentor.image,
        languages: (mentor.languages as string[] | null) ?? [],
        skills,
        activeConnections,
        maxMentees: mentor.maxMentees,
        totalConnections,
      }}
    />
  );
}
