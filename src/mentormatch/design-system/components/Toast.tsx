'use client';

import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { createContext, useCallback, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

type ToastTone = 'success' | 'warning' | 'danger' | 'info';

interface ToastInput {
  title: string;
  description?: string;
  tone?: ToastTone;
}

interface ToastItem extends ToastInput {
  id: string;
  tone: ToastTone;
}

const ToastContext = createContext<{ toast: (t: ToastInput) => void }>({ toast: () => {} });

const ICON = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
  info: Info,
} as const;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, tone = 'info' }: ToastInput) => {
      const id = crypto.randomUUID();
      setItems((prev) => [...prev, { id, title, description, tone }]);
      setTimeout(() => dismiss(id), 4500);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="mm-toast-viewport" role="status" aria-live="polite">
        {items.map((t) => {
          const Icon = ICON[t.tone];
          return (
            <div key={t.id} className={cn('mm-toast', `mm-toast--${t.tone}`)}>
              <Icon size={18} style={{ color: `var(--${t.tone === 'danger' ? 'danger' : t.tone})`, flexShrink: 0, marginTop: 1 }} />
              <div style={{ flex: 1 }}>
                <div className="mm-body-strong" style={{ fontSize: 14 }}>
                  {t.title}
                </div>
                {t.description && (
                  <div className="mm-body-small" style={{ marginTop: 2 }}>
                    {t.description}
                  </div>
                )}
              </div>
              <button
                type="button"
                className="mm-icon-btn"
                style={{ width: 24, height: 24 }}
                aria-label="Fechar"
                onClick={() => dismiss(t.id)}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
