'use client';

import { useCallback, useEffect, useState } from 'react';
import type { MMNotificationType } from '@/types/mentormatch';

export type MmNotification = {
  id: string;
  type: MMNotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

const POLL_MS = 30_000;

// Polls the MentorMatch notifications API (R10/R20). No websockets — 30s polling.
export function useNotifications() {
  const [items, setItems] = useState<MmNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/mentormatch/notifications', { cache: 'no-store' });
      if (!res.ok) return;
      setItems((await res.json()) as MmNotification[]);
    } catch {
      // best-effort; keep last known list
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const id = setInterval(() => void refresh(), POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  const markRead = useCallback(
    async (id: string) => {
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      await fetch('/api/mentormatch/notifications', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id }),
      }).catch(() => {});
    },
    [],
  );

  const markAllRead = useCallback(async () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetch('/api/mentormatch/notifications', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ all: true }),
    }).catch(() => {});
  }, []);

  const unreadCount = items.reduce((n, i) => (i.read ? n : n + 1), 0);

  return { items, unreadCount, loading, markRead, markAllRead, refresh };
}
