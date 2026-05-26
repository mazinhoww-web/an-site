import { Eyebrow } from '@/components/brand/Eyebrow';
import { Hairline } from '@/components/brand/Hairline';
import { cn } from '@/lib/utils';

type SectionHeadProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHead({ eyebrow, title, subtitle, className }: SectionHeadProps) {
  return (
    <div className={cn('mb-12 md:mb-16', className)}>
      <Eyebrow className="mb-4 block">
        {eyebrow}
      </Eyebrow>
      <h2 className="font-heading text-display-m">{title}</h2>
      {subtitle && (
        <p className="mt-4 max-w-prose text-body-l text-graphite">{subtitle}</p>
      )}
      <Hairline className="mt-8" />
    </div>
  );
}
