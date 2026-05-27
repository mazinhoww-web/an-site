'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { starSkill } from '@/server-actions/skills';
import { cn } from '@/lib/utils';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

type Props = {
  slug: string;
  initialStars: number;
  compact?: boolean;
  className?: string;
};

export function StarButton({ slug, initialStars, compact = false, className }: Props) {
  const [starred, setStarred] = useState(false);
  const [count, setCount] = useState(initialStars);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStarred(!!getCookie(`an_starred_${slug}`));
  }, [slug]);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (starred || loading) return;
    setLoading(true);
    try {
      const result = await starSkill(slug);
      setCount(result.stars);
      if (!result.already) setStarred(true);
    } finally {
      setLoading(false);
    }
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={starred || loading}
        className={cn(
          'inline-flex items-center gap-1 font-mono text-[10px] font-medium uppercase tracking-[0.08em] transition-colors',
          starred ? 'text-lime' : 'text-smoke hover:text-lime',
          className,
        )}
      >
        <Star size={12} strokeWidth={1.5} className={starred ? 'fill-lime' : ''} />
        {count}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={starred || loading}
      className={cn(
        'inline-flex w-full items-center justify-center gap-2 border px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] transition-colors duration-200',
        starred
          ? 'border-lime bg-lime text-ink'
          : 'border-lime bg-ink text-lime hover:bg-lime hover:text-ink',
        className,
      )}
    >
      <Star size={16} strokeWidth={1.5} className={starred ? 'fill-ink' : ''} />
      {starred ? `Favoritado (${count})` : `Favoritar (${count})`}
    </button>
  );
}
