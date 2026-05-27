'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Building2, ArrowUpRight } from 'lucide-react';
import { Eyebrow } from '@/components/brand/Eyebrow';
import { Label } from '@/components/brand/Label';
import { Hairline } from '@/components/brand/Hairline';
import { LogoMarquee } from '@/components/LogoMarquee';
import { PageHero } from '@/components/PageHero';
import { cn } from '@/lib/utils';

const EVENTS = [
  {
    slug: 'summit-sicredi-2026',
    date: '21 MAI 2026',
    type: 'SUMMIT',
    role: 'PALESTRANTE',
    roleHighlight: true,
    title: 'Summit de Inovação Sicredi Central Centro-Norte',
    topic: 'Loyalty como ativo financeiro em cooperativas de crédito',
    description:
      'Participação como speaker no Summit de Inovação da Sicredi, com vídeo promocional gravado em parceria com LATAM Pass.',
    city: 'Cuiabá, MT',
    organizer: 'Sicredi',
    tags: ['Loyalty', 'Cooperativas', 'Inovação'],
    cover: '/photos/evento-sicredi-summit.jpg',
  },
  {
    slug: 'crmbonus-meet-2026',
    date: '14 MAI 2026',
    type: 'PAINEL',
    role: 'PAINELISTA',
    roleHighlight: false,
    title: 'CRMBonus Meet: Cenários Econômicos',
    topic: 'Cenários econômicos e os novos vetores de consumo',
    description:
      'Painel sobre cenários macroeconômicos e mudanças nos padrões de consumo, com participantes de LATAM Airlines, J.P. Morgan, CRMBonus e JUSPAY.',
    city: 'São Paulo, SP',
    organizer: 'CRMBonus',
    tags: ['Fintech', 'Consumo', 'Loyalty'],
    cover: '/photos/evento-crmbonus-meet.jpg',
  },
  {
    slug: 'embedded-credit-cubo-itau',
    date: '10 MAI 2026',
    type: 'PAINEL',
    role: 'PAINELISTA',
    roleHighlight: false,
    title: 'Painel Embedded Credit no Cubo Itaú',
    topic: 'Crédito embarcado e programas de fidelidade como originadores de valor',
    description:
      'Apresentação no evento GYRA+ sobre tendências de crédito embarcado e o papel de programas de fidelidade como originadores de valor financeiro.',
    city: 'São Paulo, SP',
    organizer: 'GYRA+',
    tags: ['Fintech', 'Crédito', 'Embedded Finance'],
    cover: '/photos/evento-gyra-cubo.jpg',
  },
  {
    slug: 'inclusao-produtiva-segundo-voo',
    date: '28 ABR 2026',
    type: 'MESA-REDONDA',
    role: 'MEDIADOR',
    roleHighlight: false,
    title: 'Inclusão Produtiva Segundo Voo',
    topic: 'Programas de inclusão via fidelidade e aviação',
    description:
      'Mesa redonda sobre modelos de inclusão produtiva via programas de fidelidade com foco em populações de baixa renda.',
    city: 'Brasília, DF',
    organizer: 'LATAM Airlines',
    tags: ['Inclusão', 'Loyalty', 'Social'],
    cover: null,
  },
] as const;

const ROLES = ['TODOS', 'PALESTRANTE', 'PAINELISTA', 'MEDIADOR', 'JURADO'] as const;

export default function EventosPage() {
  const [activeFilter, setActiveFilter] = useState('TODOS');

  const filtered = activeFilter === 'TODOS'
    ? EVENTS
    : EVENTS.filter((e) => e.role === activeFilter);

  return (
    <>
      <PageHero
        eyebrow="EVENTOS"
        title="Palestras, painéis e mesas"
        lead="Painéis, palestras, mentorias e mesas em que estive como representante de uma frente que defendo. Em ordem cronológica reversa."
      />

      <LogoMarquee />

      {/* Filters */}
      <section className="px-6 pt-12 md:px-12 lg:px-16">
        <div className="mx-auto max-w-container">
          <div className="flex flex-wrap gap-2">
            {ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setActiveFilter(role)}
                className={cn(
                  'px-4 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] transition-all duration-150',
                  activeFilter === role
                    ? 'border border-ink text-ink shadow-[inset_0_-2px_0_var(--color-lime)]'
                    : 'border border-hairline text-graphite hover:border-ink hover:text-ink',
                )}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Event list */}
      <section className="px-6 pb-16 pt-8 md:px-12 md:pb-24 lg:px-16">
        <div className="mx-auto max-w-container space-y-0">
          {filtered.length === 0 && (
            <p className="py-12 text-center text-body text-smoke">
              Nenhum evento com esse filtro.
            </p>
          )}
          {filtered.map((event, i) => (
            <div key={event.slug}>
              {i > 0 && <Hairline />}
              <Link
                href={`/eventos/${event.slug}`}
                className="group block py-8 md:py-10"
              >
                {event.cover && (
                  <div className="event-cover relative mb-6 aspect-[16/9] w-full overflow-hidden border border-hairline">
                    <Image
                      src={event.cover}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 1200px"
                    />
                  </div>
                )}
                <div className="grid gap-4 md:grid-cols-12 md:gap-8">
                  {/* Zone 1: Date + Role */}
                  <div className="md:col-span-2">
                    <p className="font-mono text-h3 font-bold">{event.date}</p>
                    <p className="mt-1 inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-ink">
                      {event.roleHighlight && <span className="text-lime leading-none">{'•'}</span>}
                      {event.role}
                    </p>
                  </div>

                  {/* Zone 2: Content */}
                  <div className="md:col-span-7">
                    <Label className="mb-2 block">{event.type}</Label>
                    <h3 className="font-heading text-h2 transition-colors duration-150 group-hover:text-ink">
                      {event.title}
                    </h3>
                    <p className="mt-1 text-body-s font-medium text-ink">{event.topic}</p>
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
