import Link from 'next/link';
import { redirect } from 'next/navigation';
import { and, asc, desc, eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { mmConnection, mmUser, mmWaitlistEntry } from '@/lib/mentormatch/db/schema';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { whatsappHref } from '@/lib/mentormatch/format';
import { WaitlistManager } from '@/components/mentormatch/dashboard/WaitlistManager';

export const dynamic = 'force-dynamic';

export default async function MentorDashboardPage({ params }: { params: { slug: string } }) {
  const user = await getMmUserFromDb();
  if (!user) redirect('/mentormatch/login');

  const accepted = await db
    .select()
    .from(mmConnection)
    .where(and(eq(mmConnection.mentorId, user.id), eq(mmConnection.status, 'ACCEPTED')))
    .orderBy(desc(mmConnection.startedAt));

  const pendingCount = await db.$count(
    mmConnection,
    and(eq(mmConnection.mentorId, user.id), eq(mmConnection.status, 'PENDING')),
  );

  const menteeIds = accepted.map((c) => c.menteeId);
  const mentees = menteeIds.length
    ? await db.select().from(mmUser).where(inArray(mmUser.id, menteeIds))
    : [];
  const menteeById = new Map(mentees.map((m) => [m.id, m]));

  const wl = await db
    .select()
    .from(mmWaitlistEntry)
    .where(eq(mmWaitlistEntry.mentorId, user.id))
    .orderBy(asc(mmWaitlistEntry.position));
  const wlMenteeIds = wl.map((e) => e.menteeId);
  const wlMentees = wlMenteeIds.length
    ? await db.select().from(mmUser).where(inArray(mmUser.id, wlMenteeIds))
    : [];
  const wlMenteeById = new Map(wlMentees.map((m) => [m.id, m]));
  const waitlist = wl.map((e) => {
    const m = wlMenteeById.get(e.menteeId);
    return {
      id: e.id,
      position: e.position,
      mentee: m ? { id: m.id, name: m.name, headline: m.headline } : null,
    };
  });

  return (
    <main className="space-y-10">
      <header className="flex items-center justify-between">
        <h1 className="font-heading text-display-m">Painel do mentor</h1>
        <Link
          href={`/mentormatch/t/${params.slug}/requests`}
          className="rounded border border-hairline px-4 py-2 text-body-s text-ink hover:border-ink"
        >
          Ver solicitacoes{pendingCount > 0 ? ` (${pendingCount})` : ''}
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Mentorados ativos" value={accepted.length} />
        <Stat label="Solicitacoes pendentes" value={pendingCount} />
        <Stat label="Na fila" value={waitlist.length} />
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-h2">Mentorados</h2>
        {accepted.length === 0 ? (
          <p className="text-body-s text-graphite">Nenhum mentorado ativo ainda.</p>
        ) : (
          <ul className="space-y-2">
            {accepted.map((c) => {
              const m = menteeById.get(c.menteeId);
              const wa = whatsappHref(m?.whatsapp);
              return (
                <li
                  key={c.id}
                  className="flex items-center justify-between rounded border border-hairline bg-paper px-4 py-3"
                >
                  <span className="text-body">
                    {m?.name ?? 'Mentee'}{' '}
                    <span className="text-body-s text-graphite">{m?.headline ?? ''}</span>
                  </span>
                  {wa && (
                    <a href={wa} target="_blank" rel="noreferrer" className="text-body-s text-ink underline">
                      WhatsApp
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-h2">Fila de espera</h2>
        <WaitlistManager initial={waitlist} />
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-hairline bg-paper p-5">
      <p className="font-heading text-display-m">{value}</p>
      <p className="font-mono text-mono-meta uppercase tracking-wide text-graphite">{label}</p>
    </div>
  );
}
