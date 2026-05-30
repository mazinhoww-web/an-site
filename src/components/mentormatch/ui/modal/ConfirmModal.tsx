'use client';

import { AlertCircle, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { Modal } from './Modal';
import { ModalFooter } from './ModalFooter';

type ConfirmVariant = 'danger' | 'success' | 'warning';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  variant: ConfirmVariant;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
}

const VARIANT_COLOR: Record<ConfirmVariant, string> = {
  danger: 'var(--red)',
  success: 'var(--green)',
  warning: 'var(--amber)',
};

function VariantIcon({ variant, color }: { variant: ConfirmVariant; color: string }) {
  if (variant === 'success') return <Check size={48} color={color} />;
  if (variant === 'warning') return <AlertCircle size={48} color={color} />;
  return <AlertTriangle size={48} color={color} />;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  variant,
  title,
  description,
  confirmLabel = 'Confirmar',
  loading = false,
}: ConfirmModalProps) {
  const color = VARIANT_COLOR[variant];
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div style={{ padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <VariantIcon variant={variant} color={color} />
        </div>
        <h2 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
          {title}
        </h2>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{description}</p>
      </div>
      <ModalFooter>
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-btn)',
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text)',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 'var(--radius-btn)',
            border: 'none',
            background: color,
            color: '#fff',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {confirmLabel}
        </button>
      </ModalFooter>
    </Modal>
  );
}
