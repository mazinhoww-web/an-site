import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

type ImmersionHubCardProps = {
  slug: string;
  title: string;
  subtitle: string;
  descriptor: string;
  highlightWord: string;
  logo: string;
  duration: string;
};

function renderTitle(title: string, highlightWord: string, logo: string) {
  const index = title.indexOf(highlightWord);
  if (index === -1) return title;
  const before = title.slice(0, index);
  const after = title.slice(index + highlightWord.length);
  return (
    <>
      {before}
      <Image
        src={logo}
        alt={highlightWord}
        width={120}
        height={28}
        className="immersion-logo"
        unoptimized
      />
      {after}
    </>
  );
}

export function ImmersionHubCard({
  slug,
  title,
  subtitle,
  descriptor,
  highlightWord,
  logo,
  duration,
}: ImmersionHubCardProps) {
  return (
    <Link
      href={`/imersoes/${slug}`}
      className="group relative block border border-hairline p-8 transition-colors duration-200 hover:border-ink"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-graphite">
        {descriptor}
      </p>
      <h2 className="mt-3 font-heading text-h2">
        {renderTitle(title, highlightWord, logo)}
      </h2>
      <p className="mt-3 text-graphite">{subtitle}</p>
      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.08em] text-smoke">
        {duration}
      </p>
      <ArrowRight
        size={20}
        strokeWidth={1.5}
        className="absolute bottom-8 right-8 text-graphite transition-colors duration-200 group-hover:text-ink"
        aria-hidden
      />
    </Link>
  );
}
