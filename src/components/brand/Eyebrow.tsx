import { cn } from '@/lib/utils';

export function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] font-medium text-graphite', className)}>
      <span className="text-lime leading-none">{'•'}</span>
      <span>{children}</span>
    </span>
  );
}
