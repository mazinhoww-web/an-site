'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Building2, ArrowUpRight } from 'lucide-react';
import { Label } from '@/components/brand/Label';
import { Hairline } from '@/components/brand/Hairline';
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
      {/* Hero */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Label withTab className="mb-4 block">EVENTOS</Label>
          <h1 className="font-heading text-display-m">Palestras, painéis e mesas</h1>
          <p className="mt-4 max-w-prose text-body-l text-graphite">
            Painéis, palestras, mentorias e mesas em que estive como representante de uma
            frente que defendo. Em ordem cronológica reversa.
          </p>
          <Hairline className="mt-8" />
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 md:px-12 lg:px-16">
        <div className="mx-auto max-w-container">
          <div className="flex flex-wrap gap-2">
            {ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setActiveFilter(role)}
                className={cn(
                  'px-4 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] transition-colors duration-150',
                  activeFilter === role
                    ? 'border border-lime bg-lime/10 text-lime'
                    : 'border border-hairline text-smoke hover:border-ink hover:text-ink',
                )}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Event list */}
      <section className="px-6 pb-20 pt-8 md:px-12 md:pb-32 lg:px-16">
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
