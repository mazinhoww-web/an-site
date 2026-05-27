'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Label } from '@/components/brand/Label';
import { Hairline } from '@/components/brand/Hairline';
import { PageHero } from '@/components/PageHero';
import { cn } from '@/lib/utils';
import type { Palestra } from '@/types/palestra';

const PILARES = [
  'Todos',
  'Fidelizacao',
  'Servicos Financeiros',
  'Inovacao',
  'Agro e Startups',
  'Intraempreendedorismo',
  'IA Executivos',
] as const;

export default function PalestrasPage() {
  const [palestras, setPalestras] = useState<Palestra[]>([]);
  const [activeFilter, setActiveFilter] = useState('Todos');

  useEffect(() => {
    fetch('/api/palestras')
      .then((res) => res.json())
      .then((data: Palestra[]) => setPalestras(data));
  }, []);

  const filtered = activeFilter === 'Todos'
    ? palestras
    : palestras.filter((p) => p.pilar === activeFilter);

  return (
    <>
      <PageHero
        eyebrow="PALESTRAS"
        title={<>Conteudos que levo para o{' '}<span className="bg-lime px-1.5">palco</span></>}
        lead="Palestras, workshops e paineis sobre loyalty, fintech, inovacao corporativa e IA aplicada. Formatos adaptaveis para eventos de 30 a 3.000 pessoas."
      />

      {/* Filters */}
      <section className="px-6 pt-4 md:px-12 lg:px-16">
        <div className="mx-auto max-w-container">
          <div className="flex flex-wrap gap-2">
            {PILARES.map((pilar) => (
              <button
                key={pilar}
                type="button"
                onClick={() => setActiveFilter(pilar)}
                className={cn(
                  'px-4 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] transition-all duration-150',
                  activeFilter === pilar
                    ? 'border border-ink text-ink shadow-[inset_0_-2px_0_var(--color-lime)]'
                    : 'border border-hairline text-graphite hover:border-ink hover:text-ink',
                )}
              >
                {pilar}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 pb-16 pt-8 md:px-12 md:pb-24 lg:px-16">
        <div className="mx-auto max-w-container">
          {filtered.length === 0 && palestras.length > 0 && (
            <p className="py-12 text-center text-body text-smoke">
              Nenhuma palestra nesse pilar.
            </p>
          )}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((palestra, i) => (
              <Link
                key={palestra.slug}
                href={`/palestras/${palestra.slug}`}
                className="group border border-hairline transition-colors duration-200 hover:border-ink"
              >
                {palestra.fotos[0] && (
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={palestra.fotos[0].src}
                      alt={palestra.fotos[0].alt}
                      fill
                      loading={i < 3 ? 'eager' : 'lazy'}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  <Label className="mb-2 block">{palestra.pilar.toUpperCase()}</Label>
                  <h3 className="font-heading text-h3 transition-colors duration-150 group-hover:text-ink">
                    {palestra.titulo}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-body-s text-graphite">{palestra.lead}</p>
                  <span className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-ink">
                    Ver detalhes
                    <ArrowRight size={12} strokeWidth={1.5} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto max-w-container">
          <Hairline className="mb-12" />
          <h2 className="font-heading text-display-m">Quer uma palestra sob medida?</h2>
          <p className="mt-4 max-w-prose text-body text-graphite">
            Adapto o conteudo para o contexto do seu evento. Duracao, profundidade e exemplos ajustados ao perfil da audiencia.
          </p>
          <div className="mt-8">
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime"
            >
              FALAR COMIGO
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
