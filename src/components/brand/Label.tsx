import { cn } from '@/lib/utils';

type LabelProps = {
  children: React.ReactNode;
  tone?: 'default' | 'ink' | 'lime';
  withTab?: boolean;
  as?: 'span' | 'p' | 'div';
  className?: string;
};

const toneMap = {
  default: 'text-smoke',
  ink: 'text-ink',
  lime: 'text-lime',
} as const;

export function Label({
  children,
  tone = 'default',
  withTab = false,
  as: Tag = 'span',
  className,
}: LabelProps) {
  return (
    <Tag
      className={cn(
        'inline-flex items-center font-mono font-medium uppercase text-[10px] md:text-[11px] tracking-[0.08em]',
        toneMap[tone],
        className,
      )}
    >
      {withTab && (
        <span className="mr-2 inline-block h-[3px] w-[3px] flex-shrink-0 bg-lime" />
      )}
      {children}
    </Tag>
  );
}
