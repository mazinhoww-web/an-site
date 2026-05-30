import Link from 'next/link';
import { redirect } from 'next/navigation';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { mmConnection, mmUser } from '@/lib/mentormatch/db/schema';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { whatsappHref } from '@/lib/mentormatch/format';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pendente',
  ACCEPTED: 'Ativa',
};

export default async function MenteeDashboardPage({ params }: { params: { slug: string } }) {
  const user = await getMmUserFromDb();
  if (!user) redirect('/mentormatch/login');

  const connections = await db
    .select()
    .from(mmConnection)
    .where(
      and(eq(mmConnection.menteeId, user.id), inArray(mmConnection.status, ['PENDING', 'ACCEPTED'])),
    )
    .orderBy(desc(mmConnection.createdAt));

  const mentorIds = connections.map((c) => c.mentorId);
  const mentors = mentorIds.length
    ? await db.select().from(mmUser).where(inArray(mmUser.id, mentorIds))
    : [];
  const mentorById = new Map(mentors.map((m) => [m.id, m]));

  const current = connections.find((c) => c.status === 'ACCEPTED');
  const currentMentor = current ? mentorById.get(current.mentorId) : undefined;
  const currentWa = whatsappHref(currentMentor?.whatsapp);

  return (
    <main className="space-y-10">
      <header className="flex items-center justify-between">
        <h1 className="font-mmdisplay text-display-m">Painel do mentorado</h1>
        <Link
          href={`/mentormatch/t/${params.slug}/mentors`}
          className="rounded bg-mm-primary px-4 py-2 text-body-s text-mm-primaryfg hover:bg-mm-primary2"
        >
          Buscar mentores
        </Link>
      </header>

      <section className="space-y-3">
        <h2 className="font-mmdisplay text-h2">Seu mentor</h2>
        {currentMentor ? (
          <div className="flex items-center justify-between rounded border border-mm-border bg-mm-card px-4 py-3">
            <span className="text-body">
              {currentMentor.name ?? 'Mentor'}{' '}
              <span className="text-body-s text-mm-muted">{currentMentor.headline ?? ''}</span>
            </span>
            {currentWa && (
              <a href={currentWa} target="_blank" rel="noreferrer" className="text-body-s text-mm-text underline">
                WhatsApp
              </a>
            )}
          </div>
        ) : (
          <p className="text-body-s text-mm-muted">
            Voce ainda nao tem um mentor ativo. Use &quot;Buscar mentores&quot; para solicitar.
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-mmdisplay text-h2">Suas solicitacoes</h2>
        {connections.length === 0 ? (
          <p className="text-body-s text-mm-muted">Nenhuma solicitacao ainda.</p>
        ) : (
          <ul className="space-y-2">
            {connections.map((c) => {
              const m = mentorById.get(c.mentorId);
              return (
                <li
                  key={c.id}
                  className="flex items-center justify-between rounded border border-mm-border bg-mm-card px-4 py-3"
                >
                  <span className="text-body">{m?.name ?? 'Mentor'}</span>
                  <span className="font-mono text-mono-meta uppercase tracking-wide text-mm-muted">
                    {STATUS_LABEL[c.status] ?? c.status}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
