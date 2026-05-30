'use client';

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 10,
        padding: '16px 24px',
        borderTop: '1px solid var(--border)',
      }}
    >
      {children}
    </div>
  );
}
