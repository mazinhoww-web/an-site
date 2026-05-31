import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn('mm-input', invalid && 'mm-input--error', className)}
      {...props}
    />
  );
});

interface FieldProps {
  label: string;
  error?: string;
  children: (props: { id: string; invalid: boolean }) => React.ReactNode;
  className?: string;
}

/**
 * Field: label (12px uppercase) + controle + helper de erro.
 * Usa render-prop para ligar o id ao controle e propagar o estado de erro.
 */
export function Field({ label, error, children, className }: FieldProps) {
  const id = useId();
  return (
    <div className={cn('mm-field', className)}>
      <label htmlFor={id} className="mm-label">
        {label}
      </label>
      {children({ id, invalid: Boolean(error) })}
      {error && <span className="mm-field__error">{error}</span>}
    </div>
  );
}
