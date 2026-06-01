import { redirect } from 'next/navigation';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { mmConnection, mmUser } from '@/lib/mentormatch/db/schema';
import { Inbox } from 'lucide-react';
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
    <main style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <h1 className="mm-h1">Solicitacoes</h1>
      {pending.length === 0 ? (
        <div className="mm-empty">
          <span className="mm-empty__icon" aria-hidden>
            <Inbox size={28} />
          </span>
          <h3 className="mm-h3">Nenhuma solicitacao pendente</h3>
          <p className="mm-body" style={{ color: 'var(--text-secondary)', maxWidth: 420 }}>
            Quando um mentorado solicitar mentoria, o pedido aparece aqui para voce
            aceitar ou recusar.
          </p>
        </div>
      ) : (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none', padding: 0, margin: 0 }}>
          {pending.map((c) => {
            const m = menteeById.get(c.menteeId);
            return (
              <li key={c.id} className="mm-card">
                <div className="flex items-center justify-between" style={{ marginBottom: 8, gap: 16 }}>
                  <span className="mm-body">
                    {m?.name ?? 'Mentee'}{' '}
                    <span className="mm-body-small" style={{ color: 'var(--text-secondary)' }}>
                      {m?.headline ?? ''}
                    </span>
                  </span>
                  <RequestActions connectionId={c.id} />
                </div>
                {c.message && (
                  <p className="mm-body-small" style={{ color: 'var(--text-secondary)' }}>
                    {c.message}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
