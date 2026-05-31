import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** aplica hover de elevacao (card clicavel). */
  interactive?: boolean;
  /** estado selecionado (borda + fundo brand-soft). */
  selected?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { interactive, selected, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'mm-card',
        interactive && 'mm-card--interactive',
        selected && 'mm-card--selected',
        className,
      )}
      {...props}
    />
  );
});
