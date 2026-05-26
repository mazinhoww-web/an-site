import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Label } from '@/components/brand/Label';
import { cn } from '@/lib/utils';

type SkillCardProps = {
  slug: string;
  name: string;
  description: string;
  category: string;
  downloads: number;
  badge?: string;
  featured?: boolean;
  className?: string;
};

export function SkillCard({
  slug,
  name,
  description,
  category,
  downloads,
  badge = 'FREE',
  featured = false,
  className,
}: SkillCardProps) {
  return (
    <Link
      href={`/skills/${slug}`}
      className={cn(
        'group relative flex flex-col border p-6 transition-colors duration-200 hover:border-lime',
        featured ? 'border-lime/40' : 'border-hairline',
        className,
      )}
    >
      {badge && (
        <span className="absolute right-4 top-4 bg-lime px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-ink">
          {badge}
        </span>
      )}
      <Label className="mb-3">{category}</Label>
      <h3 className="font-heading text-h3">{name}</h3>
      <p className="mt-2 flex-1 text-body-s text-graphite line-clamp-2">{description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
          {downloads.toLocaleString('pt-BR')} downloads
        </span>
        <ArrowUpRight
          size={16}
          strokeWidth={1.5}
          className="text-graphite transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-lime"
        />
      </div>
    </Link>
  );
}
