import { notFound, redirect } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { mmUser } from '@/lib/mentormatch/db/schema';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { RequestForm } from '@/components/mentormatch/dashboard/RequestForm';

export const dynamic = 'force-dynamic';

export default async function ConfirmPage({
  params,
}: {
  params: { slug: string; mentorId: string };
}) {
  const user = await getMmUserFromDb();
  if (!user) redirect('/mentormatch/login');
  // Only mentees request mentorship.
  if (user.role !== 'MENTEE') redirect(`/mentormatch/t/${params.slug}/mentor`);

  const rows = await db
    .select()
    .from(mmUser)
    .where(
      and(
        eq(mmUser.id, params.mentorId),
        eq(mmUser.role, 'MENTOR'),
        eq(mmUser.status, 'APPROVED'),
        eq(mmUser.tenantId, user.tenantId!),
      ),
    )
    .limit(1);
  const mentor = rows[0];
  if (!mentor) notFound();

  return (
    <main className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-1">
        <h1 className="font-heading text-display-m">{mentor.name ?? 'Mentor'}</h1>
        {mentor.headline && <p className="text-body text-graphite">{mentor.headline}</p>}
      </header>
      {mentor.bio && <p className="text-body text-ink">{mentor.bio}</p>}
      <RequestForm mentorId={mentor.id} />
    </main>
  );
}
