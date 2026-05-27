import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock, Users, Mic } from 'lucide-react';
import { Eyebrow } from '@/components/brand/Eyebrow';
import { Label } from '@/components/brand/Label';
import { Hairline } from '@/components/brand/Hairline';
import { SectionHead } from '@/components/ui/SectionHead';
import { getAllPalestras, getPalestraBySlug, getRelatedPalestras } from '@/lib/palestras';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const palestras = await getAllPalestras();
  return palestras.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const palestra = await getPalestraBySlug(slug);
  if (!palestra) return { title: 'Palestra nao encontrada' };

  return {
    title: palestra.titulo,
    description: palestra.lead,
    openGraph: {
      title: palestra.titulo,
      description: palestra.lead,
      images: palestra.fotos[0] ? [{ url: palestra.fotos[0].src }] : [],
    },
  };
}

export default async function PalestraDetailPage({ params }: Props) {
  const { slug } = await params;
  const palestra = await getPalestraBySlug(slug);
  if (!palestra) notFound();

  const related = await getRelatedPalestras(slug, palestra.pilar);
  const heroFoto = palestra.fotos[0];
  const extraFotos = palestra.fotos.slice(1);

  return (
    <>
      {/* Hero */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Link
            href="/palestras"
            className="group mb-8 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-graphite transition-colors hover:text-ink"
          >
            <ArrowLeft size={14} strokeWidth={1.5} className="transition-transform duration-200 group-hover:-translate-x-1" />
            TODAS AS PALESTRAS
          </Link>
          <Eyebrow className="mb-4 block">{palestra.pilar.toUpperCase()}</Eyebrow>
          <h1 className="max-w-3xl font-heading text-display-m">{palestra.titulo}</h1>
          <p className="mt-4 max-w-prose text-body-l text-graphite">{palestra.lead}</p>
          <Hairline className="mt-8" />
        </div>
      </section>

      {/* Hero image */}
      {heroFoto && (
        <section className="px-6 md:px-12 lg:px-16">
          <div className="mx-auto max-w-container">
            <div className="relative aspect-[16/10] w-full overflow-hidden border border-hairline">
              <Image
                src={heroFoto.src}
                alt={heroFoto.alt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
            {heroFoto.caption && (
              <p className="mt-3 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                {heroFoto.caption}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Content: 2 columns */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto grid max-w-container gap-12 md:grid-cols-12">
          {/* Main: modules */}
          <div className="md:col-span-8">
            <SectionHead eyebrow="CONTEUDO" title="O que essa palestra cobre." />
            <div className="space-y-10">
              {palestra.modulos.map((modulo) => (
                <div key={modulo.numero} className="border-l-2 border-lime pl-6">
                  <Label tone="ink" className="mb-2 block">
                    MODULO {modulo.numero}
                  </Label>
                  <h3 className="font-heading text-h3">{modulo.titulo}</h3>
                  <p className="mt-2 max-w-prose text-body text-graphite">{modulo.descricao}</p>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div className="mt-16 border-l-2 border-lime pl-6">
              <blockquote className="max-w-prose font-heading text-h2 italic text-ink">
                &ldquo;{palestra.quote}&rdquo;
              </blockquote>
              <p className="mt-3 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                Aurimar Nogueira
              </p>
            </div>

            {/* Extra photos */}
            {extraFotos.length > 0 && (
              <div className="mt-16 space-y-6">
                {extraFotos.map((foto) => (
                  <div key={foto.src}>
                    <div className="relative aspect-[16/10] w-full overflow-hidden border border-hairline">
                      <Image
                        src={foto.src}
                        alt={foto.alt}
                        fill
                        loading="lazy"
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                    </div>
                    {foto.caption && (
                      <p className="mt-3 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                        {foto.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: ficha tecnica */}
          <div className="md:col-span-4">
            <div className="sticky top-20 space-y-6 border border-hairline p-6">
              <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink">
                Ficha tecnica
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock size={16} strokeWidth={1.5} className="mt-0.5 flex-shrink-0 text-smoke" />
                  <div>
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">DURACAO</p>
                    <p className="mt-0.5 text-body-s text-ink">{palestra.duracao}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mic size={16} strokeWidth={1.5} className="mt-0.5 flex-shrink-0 text-smoke" />
                  <div>
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">FORMATO</p>
                    <p className="mt-0.5 text-body-s text-ink">{palestra.formato}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users size={16} strokeWidth={1.5} className="mt-0.5 flex-shrink-0 text-smoke" />
                  <div>
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">PUBLICO-ALVO</p>
                    <ul className="mt-1 space-y-1">
                      {palestra.publico.map((p) => (
                        <li key={p} className="text-body-s text-graphite">{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <Hairline />

              <Link
                href="/contato"
                className="inline-flex w-full items-center justify-center gap-2 bg-ink px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime"
              >
                CONTRATAR PALESTRA
                <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
          <div className="mx-auto max-w-container">
            <SectionHead eyebrow="RELACIONADAS" title="Outras palestras." />
            <div className="grid gap-6 md:grid-cols-2">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/palestras/${rel.slug}`}
                  className="group border border-hairline p-8 transition-colors duration-200 hover:border-ink"
                >
                  <Label className="mb-2 block">{rel.pilar.toUpperCase()}</Label>
                  <h3 className="font-heading text-h3 transition-colors duration-150 group-hover:text-ink">
                    {rel.titulo}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-body-s text-graphite">{rel.lead}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Hairline className="mb-12" />
          <h2 className="font-heading text-display-m">Quer levar essa palestra para o seu evento?</h2>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime"
            >
              FALAR COMIGO
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
            <Link
              href="/palestras"
              className="inline-flex items-center gap-2 border border-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-all duration-200 hover:shadow-[inset_0_-2px_0_var(--color-lime)]"
            >
              VER TODAS
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
