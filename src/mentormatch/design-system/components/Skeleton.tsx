import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  /** raio do componente alvo; default --r-sm. */
  radius?: string;
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ width = '100%', height = 16, radius, className, style }: SkeletonProps) {
  return (
    <div
      className={cn('mm-skeleton', className)}
      style={{ width, height, borderRadius: radius ?? 'var(--r-sm)', ...style }}
    />
  );
}
