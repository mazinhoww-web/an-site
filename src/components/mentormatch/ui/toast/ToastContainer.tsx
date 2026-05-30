'use client';

import { AlertTriangle, Check, Info, X } from 'lucide-react';
import type { ToastItem, ToastVariant } from './toast-context';

const VARIANT_COLOR: Record<ToastVariant, string> = {
  success: 'var(--green)',
  error: 'var(--red)',
  warning: 'var(--amber)',
  info: 'var(--accent)',
};

function VariantIcon({ variant }: { variant: ToastVariant }) {
  const color = VARIANT_COLOR[variant];
  const props = { size: 16, color };
  if (variant === 'success') return <Check {...props} />;
  if (variant === 'error') return <X {...props} />;
  if (variant === 'warning') return <AlertTriangle {...props} />;
  return <Info {...props} />;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: 8,
      }}
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            position: 'relative',
            minWidth: 260,
            maxWidth: 360,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 14px',
            background: 'var(--bg-elevated)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderLeft: `3px solid ${VARIANT_COLOR[t.variant]}`,
            borderRadius: 'var(--radius-btn)',
            boxShadow: 'var(--shadow-md)',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            overflow: 'hidden',
            animation: 'mm-toast-in 0.3s ease',
          }}
        >
          <VariantIcon variant={t.variant} />
          <span style={{ flex: 1 }}>{t.message}</span>
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            aria-label="Fechar notificacao"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
            }}
          >
            <X size={14} />
          </button>
          <span
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              height: 2,
              width: '100%',
              transformOrigin: 'left',
              background: VARIANT_COLOR[t.variant],
              animation: 'mm-toast-drain 4.2s linear forwards',
            }}
          />
        </div>
      ))}
    </div>
  );
}
