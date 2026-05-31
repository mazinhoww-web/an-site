import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  /** ativa cor semantica conforme proximidade do limite. */
  semantic?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function Progress({ value, max = 100, semantic, className, ...aria }: ProgressProps) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  let fillMod = '';
  if (semantic) {
    if (pct >= 100) fillMod = 'mm-progress__fill--danger';
    else if (pct >= 80) fillMod = 'mm-progress__fill--warning';
  }
  return (
    <div
      className={cn('mm-progress', className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={aria['aria-label']}
    >
      <div
        className={cn('mm-progress__fill', fillMod)}
        style={{ width: `${pct}%` } as CSSProperties}
      />
    </div>
  );
}
