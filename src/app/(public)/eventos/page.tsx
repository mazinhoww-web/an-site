import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Building2, ArrowUpRight } from 'lucide-react';
import { Label } from '@/components/brand/Label';
import { Hairline } from '@/components/brand/Hairline';

export const metadata: Metadata = {
  title: 'Eventos',
  description: 'Paineis, palestras e mesas em que Aurimar participou.',
};

const EVENTS = [
  {
    slug: 'summit-sicredi-2026',
    date: '21 MAI 2026',
    type: 'SUMMIT',
    role: 'PALESTRANTE',
    roleHighlight: true,
    title: 'Summit de Inovacao Sicredi Central Centro-Norte',
    topic: 'Loyalty como ativo financeiro em cooperativas de credito',
    description:
      'Participacao como speaker no Summit de Inovacao da Sicredi, com video promocional gravado em parceria com LATAM Pass.',
    city: 'Cuiaba, MT',
    organizer: 'Sicredi',
    tags: ['Loyalty', 'Cooperativas', 'Inovacao'],
  },
  {
    slug: 'embedded-credit-cubo-itau',
    date: '10 MAI 2026',
    type: 'PAINEL',
    role: 'PAINELISTA',
    roleHighlight: false,
    title: 'Painel Embedded Credit no Cubo Itau',
    topic: 'Credito embarcado e programas de fidelidade como originadores de valor',
    description:
      'Apresentacao no evento GYRA+ sobre tendencias de credito embarcado e o papel de programas de fidelidade como originadores de valor financeiro.',
    city: 'Sao Paulo, SP',
    organizer: 'GYRA+',
    tags: ['Fintech', 'Credito', 'Embedded Finance'],
  },
  {
    slug: 'inclusao-produtiva-segundo-voo',
    date: '28 ABR 2026',
    type: 'MESA-REDONDA',
    role: 'MEDIADOR',
    roleHighlight: false,
    title: 'Inclusao Produtiva Segundo Voo',
    topic: 'Programas de inclusao via fidelidade e aviacao',
    description:
      'Mesa redonda sobre modelos de inclusao produtiva via programas de fidelidade com foco em populacoes de baixa renda.',
    city: 'Brasilia, DF',
    organizer: 'LATAM Airlines',
    tags: ['Inclusao', 'Loyalty', 'Social'],
  },
] as const;

export default function EventosPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Label withTab className="mb-4 block">EVENTOS</Label>
          <h1 className="font-heading text-display-m">Palestras, paineis e mesas</h1>
          <p className="mt-4 max-w-prose text-body-l text-graphite">
            Paineis, palestras, mentorias e mesas em que estive como representante de uma
            frente que defendo. Em ordem cronologica reversa.
          </p>
          <Hairline className="mt-8" />
        </div>
      </section>

      {/* Event list */}
      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-container space-y-0">
          {EVENTS.map((event, i) => (
            <div key={event.slug}>
              {i > 0 && <Hairline className="my-0" />}
              <Link
                href={`/eventos/${event.slug}`}
                className="group block py-8 md:py-10"
              >
                <div className="grid gap-4 md:grid-cols-12 md:gap-8">
                  {/* Zone 1: Date + Role */}
                  <div className="md:col-span-2">
                    <p className="font-mono text-h3 font-bold">{event.date}</p>
                    <p
                      className={`mt-1 font-mono text-[10px] font-medium uppercase tracking-[0.08em] ${
                        event.roleHighlight ? 'text-lime' : 'text-ink'
                      }`}
                    >
                      {event.role}
                    </p>
                  </div>

                  {/* Zone 2: Content */}
                  <div className="md:col-span-7">
                    <Label className="mb-2 block">{event.type}</Label>
                    <h3 className="font-heading text-h2 transition-colors duration-150 group-hover:text-ink">
                      {event.title}
                    </h3>
                    <p className="mt-1 text-body-s text-lime">{event.topic}</p>
                    <p className="mt-3 text-body-s text-graphite">{event.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Zone 3: Meta */}
                  <div className="flex flex-row gap-4 md:col-span-3 md:flex-col md:items-end md:gap-2">
                    <span className="flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                      <MapPin size={14} strokeWidth={1.5} />
                      {event.city}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                      <Building2 size={14} strokeWidth={1.5} />
                      {event.organizer}
                    </span>
                    <ArrowUpRight
                      size={20}
                      strokeWidth={1.5}
                      className="hidden text-graphite transition-all duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-lime md:block"
                    />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
