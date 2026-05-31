import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  /** CTA secondary com orientacao de proximo passo. */
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('mm-empty', className)}>
      <span className="mm-empty__icon" aria-hidden>
        {icon}
      </span>
      <h3 className="mm-h3">{title}</h3>
      <p className="mm-body" style={{ color: 'var(--text-secondary)', maxWidth: 420 }}>
        {description}
      </p>
      {action && (
        <Button variant="secondary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
