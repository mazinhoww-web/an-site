'use client';

import { useState } from 'react';
import { useNotifications } from '@/hooks/mentormatch/use-notifications';

export function NotificationsBell() {
  const { items, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded border border-hairline bg-paper px-3 py-1.5 text-body-s text-ink hover:border-ink"
        aria-label="Notificacoes"
      >
        Notificacoes
        {unreadCount > 0 && (
          <span className="ml-2 rounded bg-ink px-1.5 py-0.5 text-mono-meta text-paper">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded border border-hairline bg-paper shadow-sm">
          <div className="flex items-center justify-between border-b border-hairline px-3 py-2">
            <span className="font-mono text-mono-meta uppercase tracking-wide text-graphite">Notificacoes</span>
            {unreadCount > 0 && (
              <button type="button" onClick={() => void markAllRead()} className="text-body-s text-ink underline">
                Marcar todas
              </button>
            )}
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <li className="px-3 py-6 text-center text-body-s text-graphite">Nenhuma notificacao.</li>
            ) : (
              items.map((n) => (
                <li
                  key={n.id}
                  className={`border-b border-hairline px-3 py-2 ${n.read ? 'opacity-60' : ''}`}
                >
                  <button type="button" onClick={() => void markRead(n.id)} className="block w-full text-left">
                    <span className="block text-body-s font-medium text-ink">{n.title}</span>
                    <span className="block text-body-s text-graphite">{n.message}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
