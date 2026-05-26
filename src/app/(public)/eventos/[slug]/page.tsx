import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, Building2, Users, ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { Eyebrow } from '@/components/brand/Eyebrow';
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
    title: 'Summit de Inovação Sicredi Central Centro-Norte',
    topic: 'Loyalty como ativo financeiro em cooperativas de crédito',
    description:
      'Participação como speaker no Summit de Inovação da Sicredi, com vídeo promocional gravado em parceria com LATAM Pass.',
    city: 'Cuiabá, MT',
    organizer: 'Sicredi',
    audienceSize: '~300',
    content:
      'O convite surgiu da relação construída entre LATAM Pass e o sistema Sicredi, que busca ampliar sua oferta de valor para associados através de programas de fidelidade. O painel discutiu como cooperativas de crédito podem usar loyalty como alavanca financeira, saindo do modelo tradicional de benefício de marketing para operar como ativo financeiro de fato.',
    tags: ['Loyalty', 'Cooperativas', 'Inovação'],
  },
  {
    slug: 'embedded-credit-cubo-itau',
    date: '10 Mai 2026',
    type: 'PAINEL',
    role: 'PAINELISTA',
    roleHighlight: false,
    title: 'Painel Embedded Credit no Cubo Itaú',
    topic: 'Crédito embarcado e programas de fidelidade como originadores de valor',
    description:
      'Apresentação no evento GYRA+ sobre tendências de crédito embarcado e o papel de programas de fidelidade como originadores de valor financeiro.',
    city: 'São Paulo, SP',
    organizer: 'GYRA+',
    audienceSize: '~150',
    content:
      'O painel explorou como crédito embarcado (embedded credit) está mudando a cadeia de valor financeira, permitindo que plataformas não financeiras ofereçam produtos de crédito integrados. A discussão focou no papel de programas de fidelidade como LATAM Pass na originação de valor, combinando dados de comportamento do consumidor com infraestrutura financeira regulada.',
    tags: ['Fintech', 'Crédito', 'Embedded Finance'],
  },
  {
    slug: 'inclusao-produtiva-segundo-voo',
    date: '28 Abr 2026',
    type: 'MESA-REDONDA',
    role: 'MEDIADOR',
    roleHighlight: false,
    title: 'Inclusão Produtiva Segundo Voo',
    topic: 'Programas de inclusão via fidelidade e aviação',
    description:
      'Mesa redonda sobre modelos de inclusão produtiva via programas de fidelidade com foco em populações de baixa renda.',
    city: 'Brasília, DF',
    organizer: 'LATAM Airlines',
    content:
      'A mesa redonda reuniu representantes de programas sociais, companhias aéreas e fintechs para discutir como programas de fidelidade podem ser transformados em ferramentas de inclusão produtiva. O debate abordou modelos em que o acúmulo de pontos não depende de consumo, mas de comportamentos produtivos como educação financeira e capacitação profissional.',
    tags: ['Inclusão', 'Loyalty', 'Social'],
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
  if (!event) return { title: 'Evento não encontrado' };
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
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-ink">
              {event.roleHighlight && <span className="text-lime leading-none">{'•'}</span>}
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
            <h2 className="font-heading text-h2">Sobre esta participação</h2>
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
              <Eyebrow className="mb-4 block">DETALHES</Eyebrow>
              <div className="space-y-3 text-body-s text-graphite">
                <p><span className="font-medium text-ink">Data:</span> {event.date}</p>
                <p><span className="font-medium text-ink">Local:</span> {event.city}</p>
                <p><span className="font-medium text-ink">Tipo:</span> {event.type}</p>
                <p><span className="font-medium text-ink">Organizador:</span> {event.organizer}</p>
                {event.audienceSize && (
                  <p><span className="font-medium text-ink">Audiência:</span> {event.audienceSize} pessoas</p>
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
              <Eyebrow className="mb-6 block">RELACIONADOS</Eyebrow>
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
            iniciativas alinhadas com loyalty, fintech ou inovação.
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
                    PRÓXIMO EVENTO
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
