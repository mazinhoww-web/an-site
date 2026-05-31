import { cn } from '@/lib/utils';

type BadgeTone = 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  /** exibe o dot 6px a esquerda. */
  dot?: boolean;
  className?: string;
}

export function Badge({ children, tone = 'info', dot = true, className }: BadgeProps) {
  return (
    <span className={cn('mm-badge', `mm-badge--${tone}`, className)}>
      {dot && <span className="mm-badge__dot" aria-hidden />}
      {children}
    </span>
  );
}
