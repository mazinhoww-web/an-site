import { Eyebrow } from '@/components/brand/Eyebrow';
import { Hairline } from '@/components/brand/Hairline';
import type { ResultMetric } from '@/content/imersoes/types';

type ResultsGridProps = {
  results: ResultMetric[];
};

export function ResultsGrid({ results }: ResultsGridProps) {
  return (
    <section className="px-6 py-16 md:px-12 md:py-24 lg:px-16">
      <div className="mx-auto max-w-container">
        <Eyebrow className="mb-8 block">
          RESULTADOS REAIS DE QUEM JÁ ADOTOU
        </Eyebrow>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {results.map((metric) => (
            <div
              key={metric.label}
              className="border border-hairline p-6 transition-colors duration-200 hover:border-ink"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-smoke">
                {metric.label}
              </p>
              <p className="mt-2 font-heading text-h1 font-bold">
                {metric.value}
              </p>
              <p className="mt-2 text-body-s text-graphite">
                {metric.description}
              </p>
            </div>
          ))}
        </div>

        <Hairline className="mt-12 md:mt-16" />
      </div>
    </section>
  );
}
