'use client';

import { X } from 'lucide-react';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  id?: string;
}

export function ModalHeader({ title, onClose, id }: ModalHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '20px 24px',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <h2
        id={id}
        style={{ margin: 0, fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)' }}
      >
        {title}
      </h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
      >
        <X size={18} />
      </button>
    </div>
  );
}
