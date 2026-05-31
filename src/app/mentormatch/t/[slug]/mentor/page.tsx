import { notFound, redirect } from 'next/navigation';
import { and, asc, desc, eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { mmConnection, mmUser, mmWaitlistEntry } from '@/lib/mentormatch/db/schema';
import { getActiveTenantBySlug, getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { resolvePostLoginHref } from '@/lib/mentormatch/dashboard-href';
import { resolveColorScheme } from '@/lib/mentormatch/color-scheme';
import { whatsappHref } from '@/lib/mentormatch/format';
import { MentorDashboard } from '@/components/mentormatch/mentor/MentorDashboard';

export const dynamic = 'force-dynamic';

export default async function MentorDashboardPage({ params }: { params: { slug: string } }) {
  const user = await getMmUserFromDb();
  if (!user) redirect('/mentormatch/login');
  if (user.role !== 'MENTOR') redirect(await resolvePostLoginHref(user));

  const tenant = await getActiveTenantBySlug(params.slug);
  if (!tenant) notFound();
  const theme = await resolveColorScheme();

  const pending = await db
    .select()
    .from(mmConnection)
    .where(and(eq(mmConnection.mentorId, user.id), eq(mmConnection.status, 'PENDING')))
    .orderBy(desc(mmConnection.createdAt));

  const accepted = await db
    .select()
    .from(mmConnection)
    .where(and(eq(mmConnection.mentorId, user.id), eq(mmConnection.status, 'ACCEPTED')))
    .orderBy(desc(mmConnection.startedAt));

  const wl = await db
    .select()
    .from(mmWaitlistEntry)
    .where(eq(mmWaitlistEntry.mentorId, user.id))
    .orderBy(asc(mmWaitlistEntry.position));

  const ids = [
    ...new Set([...pending, ...accepted].map((c) => c.menteeId).concat(wl.map((e) => e.menteeId))),
  ];
  const users = ids.length ? await db.select().from(mmUser).where(inArray(mmUser.id, ids)) : [];
  const byId = new Map(users.map((u) => [u.id, u]));

  const requests = pending.map((c) => {
    const m = byId.get(c.menteeId);
    return {
      connectionId: c.id,
      message: c.message,
      createdAt: c.createdAt ? c.createdAt.toISOString() : null,
      mentee: {
        name: m?.name ?? null,
        headline: m?.headline ?? null,
        image: m?.image ?? null,
        whatsapp: whatsappHref(m?.whatsapp),
      },
    };
  });

  const actives = accepted.map((c) => {
    const m = byId.get(c.menteeId);
    return {
      connectionId: c.id,
      startedAt: c.startedAt ? c.startedAt.toISOString() : null,
      mentee: {
        name: m?.name ?? null,
        headline: m?.headline ?? null,
        image: m?.image ?? null,
        whatsapp: whatsappHref(m?.whatsapp),
      },
    };
  });

  const waitlist = wl.map((e) => {
    const m = byId.get(e.menteeId);
    return { id: e.id, position: e.position, mentee: { name: m?.name ?? null, headline: m?.headline ?? null } };
  });

  return (
    <MentorDashboard
      brandColor={tenant.brandColor}
      theme={theme}
      requests={requests}
      actives={actives}
      waitlist={waitlist}
      maxMentees={user.maxMentees}
    />
  );
}
