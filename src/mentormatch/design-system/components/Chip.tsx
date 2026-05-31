import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChipProps {
  children: React.ReactNode;
  selected?: boolean;
  /** torna o chip clicavel (toggle de skill). */
  onSelect?: () => void;
  /** exibe o x de remocao e dispara onRemove. */
  onRemove?: () => void;
  className?: string;
}

export function Chip({ children, selected, onSelect, onRemove, className }: ChipProps) {
  const classes = cn('mm-chip', selected && 'mm-chip--selected', className);
  const content = (
    <>
      {children}
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          aria-label="Remover"
          className="mm-chip__x"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }
          }}
        >
          <X size={14} />
        </span>
      )}
    </>
  );

  if (onSelect) {
    return (
      <button type="button" className={classes} aria-pressed={selected} onClick={onSelect}>
        {content}
      </button>
    );
  }
  return <span className={classes}>{content}</span>;
}
