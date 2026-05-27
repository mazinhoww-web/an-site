import { Eyebrow } from '@/components/brand/Eyebrow';
import { Hairline } from '@/components/brand/Hairline';

type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  children?: React.ReactNode;
};

export function PageHero({ eyebrow, title, lead, children }: PageHeroProps) {
  return (
    <header className="px-6 pt-12 pb-10 md:px-12 md:pt-20 md:pb-14 lg:px-16">
      <div className="mx-auto max-w-container">
        <div className="space-y-4 md:space-y-6">
          <Eyebrow className="block">{eyebrow}</Eyebrow>
          <h1 className="font-heading text-display-m">{title}</h1>
          {lead && (
            <p className="max-w-prose text-body-l text-graphite">{lead}</p>
          )}
          {children}
        </div>
        <Hairline className="mt-8" />
      </div>
    </header>
  );
}
