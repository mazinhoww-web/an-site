import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Hairline } from '@/components/brand/Hairline';
import type { ImmersionSlug } from '@/content/imersoes/types';

type ImmersionCTAProps = {
  title: string;
  highlight: string;
  logo: string;
  body: string;
  slug: ImmersionSlug;
};

function renderTitle(title: string, highlight: string, logo: string) {
  const index = title.indexOf(highlight);
  if (index === -1) {
    return (
      <>
        {title}{' '}
        <Image
          src={logo}
          alt={highlight}
          width={160}
          height={40}
          className="immersion-logo"
          unoptimized
        />
      </>
    );
  }
  const before = title.slice(0, index);
  const after = title.slice(index + highlight.length);
  return (
    <>
      {before}
      <Image
        src={logo}
        alt={highlight}
        width={160}
        height={40}
        className="immersion-logo"
        unoptimized
      />
      {after}
    </>
  );
}

export function ImmersionCTA({ title, highlight, logo, body, slug }: ImmersionCTAProps) {
  return (
    <section className="px-6 py-16 md:px-12 md:py-24 lg:px-16">
      <div className="mx-auto max-w-container">
        <Hairline className="mb-12" />
        <h2 className="font-heading text-display-m max-w-[720px]">
          {renderTitle(title, highlight, logo)}
        </h2>
        <p className="mt-4 max-w-prose text-body text-graphite">{body}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={`/contato?assunto=imersao-${slug}`}
            className="inline-flex items-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime"
          >
            SOLICITAR PROPOSTA
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
          <Link
            href="/imersoes"
            className="inline-flex items-center gap-2 border border-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-all duration-200 hover:shadow-[inset_0_-2px_0_rgb(var(--color-lime))]"
          >
            VER TODAS AS IMERSÕES
          </Link>
        </div>
      </div>
    </section>
  );
}
