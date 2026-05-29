import { redirect } from 'next/navigation';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { mmConnection, mmUser } from '@/lib/mentormatch/db/schema';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { resolvePostLoginHref } from '@/lib/mentormatch/dashboard-href';
import { RequestActions } from '@/components/mentormatch/dashboard/RequestActions';

export const dynamic = 'force-dynamic';

export default async function RequestsPage() {
  const user = await getMmUserFromDb();
  if (!user) redirect('/mentormatch/login');
  if (user.role !== 'MENTOR') redirect(await resolvePostLoginHref(user));

  const pending = await db
    .select()
    .from(mmConnection)
    .where(and(eq(mmConnection.mentorId, user.id), eq(mmConnection.status, 'PENDING')))
    .orderBy(desc(mmConnection.createdAt));

  const menteeIds = pending.map((c) => c.menteeId);
  const mentees = menteeIds.length
    ? await db.select().from(mmUser).where(inArray(mmUser.id, menteeIds))
    : [];
  const menteeById = new Map(mentees.map((m) => [m.id, m]));

  return (
    <main className="space-y-8">
      <h1 className="font-heading text-display-m">Solicitacoes</h1>
      {pending.length === 0 ? (
        <p className="text-body-s text-graphite">Nenhuma solicitacao pendente.</p>
      ) : (
        <ul className="space-y-3">
          {pending.map((c) => {
            const m = menteeById.get(c.menteeId);
            return (
              <li key={c.id} className="rounded border border-hairline bg-paper p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-body">
                    {m?.name ?? 'Mentee'}{' '}
                    <span className="text-body-s text-graphite">{m?.headline ?? ''}</span>
                  </span>
                  <RequestActions connectionId={c.id} />
                </div>
                {c.message && <p className="text-body-s text-ink">{c.message}</p>}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
