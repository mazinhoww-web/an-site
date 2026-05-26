import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, Building2, Users, ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { Label } from '@/components/brand/Label';
import { Hairline } from '@/components/brand/Hairline';

type Event = {
  slug: string;
  date: string;
  type: string;
  role: string;
  roleHighlight: boolean;
  title: string;
  topic: string;
  description: string;
  city: string;
  organizer: string;
  audienceSize?: string;
  content: string;
  tags: readonly string[];
};

const EVENTS: Event[] = [
  {
    slug: 'summit-sicredi-2026',
    date: '21-22 Mai 2026',
    type: 'SUMMIT',
    role: 'PALESTRANTE',
    roleHighlight: true,
    title: 'Summit de Inovacao Sicredi Central Centro-Norte',
    topic: 'Loyalty como ativo financeiro em cooperativas de credito',
    description:
      'Participacao como speaker no Summit de Inovacao da Sicredi, com video promocional gravado em parceria com LATAM Pass.',
    city: 'Cuiaba, MT',
    organizer: 'Sicredi',
    audienceSize: '~300',
    content:
      'O convite surgiu da relacao construida entre LATAM Pass e o sistema Sicredi, que busca ampliar sua oferta de valor para associados atraves de programas de fidelidade. O painel discutiu como cooperativas de credito podem usar loyalty como alavanca financeira, saindo do modelo tradicional de beneficio de marketing para operar como ativo financeiro de fato.',
    tags: ['Loyalty', 'Cooperativas', 'Inovacao'],
  },
  {
    slug: 'embedded-credit-cubo-itau',
    date: '10 Mai 2026',
    type: 'PAINEL',
    role: 'PAINELISTA',
    roleHighlight: false,
    title: 'Painel Embedded Credit no Cubo Itau',
    topic: 'Credito embarcado e programas de fidelidade como originadores de valor',
    description:
      'Apresentacao no evento GYRA+ sobre tendencias de credito embarcado e o papel de programas de fidelidade como originadores de valor financeiro.',
    city: 'Sao Paulo, SP',
    organizer: 'GYRA+',
    audienceSize: '~150',
    content:
      'O painel explorou como credito embarcado (embedded credit) esta mudando a cadeia de valor financeira, permitindo que plataformas nao-financeiras ofereçam produtos de credito integrados. A discussao focou no papel de programas de fidelidade como LATAM Pass na originacao de valor, combinando dados de comportamento do consumidor com infraestrutura financeira regulada.',
    tags: ['Fintech', 'Credito', 'Embedded Finance'],
  },
  {
    slug: 'inclusao-produtiva-segundo-voo',
    date: '28 Abr 2026',
    type: 'MESA-REDONDA',
    role: 'MEDIADOR',
    roleHighlight: false,
    title: 'Inclusao Produtiva Segundo Voo',
    topic: 'Programas de inclusao via fidelidade e aviacao',
    description:
      'Mesa redonda sobre modelos de inclusao produtiva via programas de fidelidade com foco em populacoes de baixa renda.',
    city: 'Brasilia, DF',
    organizer: 'LATAM Airlines',
    content:
      'A mesa redonda reuniu representantes de programas sociais, companhias aereas e fintechs para discutir como programas de fidelidade podem ser transformados em ferramentas de inclusao produtiva. O debate abordou modelos em que o acumulo de pontos nao depende de consumo, mas de comportamentos produtivos como educacao financeira e capacitacao profissional.',
    tags: ['Inclusao', 'Loyalty', 'Social'],
  },
];

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return EVENTS.map((event) => ({ slug: event.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const event = EVENTS.find((e) => e.slug === params.slug);
  if (!event) return { title: 'Evento nao encontrado' };
  return {
    title: event.title,
    description: event.topic,
  };
}

export default function EventoDetailPage({ params }: Props) {
  const event = EVENTS.find((e) => e.slug === params.slug);
  if (!event) notFound();

  const eventIndex = EVENTS.findIndex((e) => e.slug === params.slug);
  const prev = eventIndex > 0 ? EVENTS[eventIndex - 1] : null;
  const next = eventIndex < EVENTS.length - 1 ? EVENTS[eventIndex + 1] : null;

  return (
    <>
      {/* Hero */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            <Link href="/eventos" className="transition-colors hover:text-ink">EVENTOS</Link>
            {' / '}
            <span className="text-ink">{event.title}</span>
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Label>{event.type}</Label>
            <span className="text-smoke">{'·'}</span>
            <span
              className={`font-mono text-[10px] font-medium uppercase tracking-[0.08em] ${
                event.roleHighlight ? 'text-lime' : 'text-ink'
              }`}
            >
              {event.role}
            </span>
          </div>

          <h1 className="mt-4 max-w-3xl font-heading text-display-l">{event.title}</h1>
          <p className="mt-4 text-body-l text-graphite">{event.topic}</p>

          <div className="mt-6 flex flex-wrap gap-6">
            <span className="flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
              <Calendar size={14} strokeWidth={1.5} />
              {event.date}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
              <MapPin size={14} strokeWidth={1.5} />
              {event.city}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
              <Building2 size={14} strokeWidth={1.5} />
              {event.organizer}
            </span>
            {event.audienceSize && (
              <span className="flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                <Users size={14} strokeWidth={1.5} />
                {event.audienceSize} pessoas
              </span>
            )}
          </div>

          <Hairline className="mt-8" />
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto grid max-w-container gap-12 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="font-heading text-h2">Sobre esta participacao</h2>
            <p className="mt-4 max-w-prose text-body text-graphite">{event.content}</p>

            <div className="mt-8 flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-hairline px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="border border-hairline bg-paper p-6">
              <Label withTab className="mb-4 block">DETALHES</Label>
              <div className="space-y-3 text-body-s text-graphite">
                <p><span className="font-medium text-ink">Data:</span> {event.date}</p>
                <p><span className="font-medium text-ink">Local:</span> {event.city}</p>
                <p><span className="font-medium text-ink">Tipo:</span> {event.type}</p>
                <p><span className="font-medium text-ink">Organizador:</span> {event.organizer}</p>
                {event.audienceSize && (
                  <p><span className="font-medium text-ink">Audiencia:</span> {event.audienceSize} pessoas</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eventos relacionados */}
      {(() => {
        const related = EVENTS.filter((e) => e.slug !== event.slug).slice(0, 2);
        if (related.length === 0) return null;
        return (
          <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
            <div className="mx-auto max-w-container">
              <Label withTab className="mb-6 block">RELACIONADOS</Label>
              <div className="grid gap-6 md:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/eventos/${r.slug}`}
                    className="group border border-hairline p-6 transition-colors duration-200 hover:border-lime"
                  >
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                      {r.date}
                    </p>
                    <h3 className="mt-2 font-heading text-h3">{r.title}</h3>
                    <p className="mt-1 text-body-s text-graphite">{r.topic}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* CTA */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Hairline className="mb-12" />
          <h2 className="font-heading text-h2">Tem um evento? Vamos conversar.</h2>
          <p className="mt-4 max-w-prose text-body text-graphite">
            Posso participar como palestrante, painelista, jurado ou mentor em
            iniciativas alinhadas com loyalty, fintech ou inovacao.
          </p>
          <Link
            href="/contato"
            className="mt-8 inline-flex items-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-lime transition-colors duration-150 hover:bg-lime hover:text-ink"
          >
            CONVIDAR PARA UM EVENTO
            <Send size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </section>

      {/* Navigation */}
      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Hairline className="mb-8" />
          <div className="flex justify-between">
            {prev ? (
              <Link
                href={`/eventos/${prev.slug}`}
                className="group flex items-center gap-2 text-body-s text-graphite transition-colors hover:text-ink"
              >
                <ArrowLeft
                  size={16}
                  strokeWidth={1.5}
                  className="transition-transform duration-200 group-hover:-translate-x-1"
                />
                <div>
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                    EVENTO ANTERIOR
                  </p>
                  <p className="mt-0.5">{prev.title}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/eventos/${next.slug}`}
                className="group flex items-center gap-2 text-right text-body-s text-graphite transition-colors hover:text-ink"
              >
                <div>
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                    PROXIMO EVENTO
                  </p>
                  <p className="mt-0.5">{next.title}</p>
                </div>
                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
