import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Notícias',
  description: 'Leituras recomendadas e updates de Aurimar Nogueira.',
};

const NEWS = [
  {
    slug: 'summit-sicredi-2026',
    date: '22 MAI 2026',
    title: 'Painel no Summit de Inovação Sicredi Central Centro-Norte',
    excerpt:
      'Participação como speaker no Summit de Inovação da Sicredi em 21-22 de maio, com vídeo promocional gravado em parceria com LATAM Pass.',
  },
  {
    slug: 'embedded-credit-cubo-itau',
    date: '11 MAI 2026',
    title: 'Painel Embedded Credit no Cubo Itaú',
    excerpt:
      'Apresentação no evento GYRA+ sobre tendências de crédito embarcado e o papel de programas de fidelidade como originadores de valor financeiro.',
  },
] as const;

export default function NoticiasPage() {
  return (
    <>
      <PageHero
        eyebrow="NOTÍCIAS"
        title="Leituras recomendadas e updates"
        lead="Artigos, participações em eventos e reflexões sobre loyalty, fintech e inovação."
      />

      {/* News list */}
      <section className="px-6 pb-16 md:px-12 md:pb-24 lg:px-16">
        <div className="mx-auto max-w-container">
          <div className="grid gap-6 md:grid-cols-2">
            {NEWS.map((item) => (
              <Link
                key={item.slug}
                href={`/noticias/${item.slug}`}
                className="group border border-hairline p-8 transition-colors duration-200 hover:border-ink"
              >
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                  {item.date}
                </p>
                <h3 className="mt-3 font-heading text-h3">{item.title}</h3>
                <p className="mt-3 text-body-s text-graphite">{item.excerpt}</p>
                <div className="mt-4 flex items-center gap-1 text-body-s text-ink">
                  Ler mais
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.5}
                    className="transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-lime"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
