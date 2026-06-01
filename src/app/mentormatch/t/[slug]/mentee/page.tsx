import Link from 'next/link';
import { redirect } from 'next/navigation';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { mmConnection, mmUser } from '@/lib/mentormatch/db/schema';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { whatsappHref } from '@/lib/mentormatch/format';
import { Badge } from '@/mentormatch/design-system';

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
    <main style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <header className="flex items-center justify-between" style={{ gap: 16 }}>
        <h1 className="mm-h1">Painel do mentorado</h1>
        <Link
          href={`/mentormatch/t/${params.slug}/mentors`}
          className="mm-btn mm-btn--primary"
          style={{ textDecoration: 'none' }}
        >
          Buscar mentores
        </Link>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 className="mm-h2">Seu mentor</h2>
        {currentMentor ? (
          <div
            className="mm-card flex items-center justify-between"
            style={{ gap: 16 }}
          >
            <span className="mm-body">
              {currentMentor.name ?? 'Mentor'}{' '}
              <span className="mm-body-small" style={{ color: 'var(--text-secondary)' }}>
                {currentMentor.headline ?? ''}
              </span>
            </span>
            {currentWa && (
              <a
                href={currentWa}
                target="_blank"
                rel="noreferrer"
                className="mm-btn mm-btn--secondary"
                style={{ textDecoration: 'none' }}
              >
                WhatsApp
              </a>
            )}
          </div>
        ) : (
          <p className="mm-body" style={{ color: 'var(--text-secondary)' }}>
            Voce ainda nao tem um mentor ativo. Use &quot;Buscar mentores&quot; para solicitar.
          </p>
        )}
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 className="mm-h2">Suas solicitacoes</h2>
        {connections.length === 0 ? (
          <p className="mm-body" style={{ color: 'var(--text-secondary)' }}>
            Nenhuma solicitacao ainda.
          </p>
        ) : (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
            {connections.map((c) => {
              const m = mentorById.get(c.mentorId);
              return (
                <li key={c.id} className="mm-card flex items-center justify-between" style={{ gap: 16 }}>
                  <span className="mm-body">{m?.name ?? 'Mentor'}</span>
                  <Badge tone={c.status === 'ACCEPTED' ? 'success' : 'warning'}>
                    {STATUS_LABEL[c.status] ?? c.status}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
