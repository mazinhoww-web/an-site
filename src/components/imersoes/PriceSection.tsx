import { Eyebrow } from '@/components/brand/Eyebrow';
import { Hairline } from '@/components/brand/Hairline';
import type { PriceTier } from '@/content/imersoes/types';

type PriceSectionProps = {
  prices: PriceTier[];
  disclaimer: string;
};

export function PriceSection({ prices, disclaimer }: PriceSectionProps) {
  return (
    <section className="px-6 py-16 md:px-12 md:py-24 lg:px-16">
      <div className="mx-auto max-w-container">
        <Eyebrow className="mb-8 block">VALORES</Eyebrow>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {prices.map((tier) => (
            <div
              key={tier.label}
              className="border border-hairline p-6 transition-colors duration-200 hover:border-ink"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-smoke">
                {tier.label}
              </p>
              <p className="mt-3 font-heading text-h1 font-bold">
                {tier.price}
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-smoke">
                {tier.note}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-smoke">
          {disclaimer}
        </p>

        <Hairline className="mt-12 md:mt-16" />
      </div>
    </section>
  );
}
