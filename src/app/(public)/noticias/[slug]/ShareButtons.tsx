'use client';

import { Label } from '@/components/brand/Label';

type ShareButtonsProps = {
  title: string;
};

export function ShareButtons({ title }: ShareButtonsProps) {
  const url = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="flex items-center gap-4">
      <Label>COMPARTILHAR</Label>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no LinkedIn"
        className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-graphite transition-colors duration-150 hover:text-ink"
      >
        LinkedIn
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no X"
        className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-graphite transition-colors duration-150 hover:text-ink"
      >
        X
      </a>
      <button
        type="button"
        onClick={() => navigator.clipboard?.writeText(url)}
        className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-graphite transition-colors duration-150 hover:text-ink"
      >
        Copiar link
      </button>
    </div>
  );
}
