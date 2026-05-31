'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUp, Bell, BookOpen, Check, Info, UserPlus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { EASE, MentorMatchThemeRoot } from '@/mentormatch/design-system';
import { useNotifications } from '@/hooks/mentormatch/use-notifications';
import type { MMNotificationType } from '@/types/mentormatch';

const ICON: Record<MMNotificationType, typeof Bell> = {
  CONNECTION_REQUEST: UserPlus,
  CONNECTION_ACCEPTED: Check,
  CONNECTION_REJECTED: X,
  WAITLIST_PROMOTED: ArrowUp,
  NEW_MATERIAL: BookOpen,
  ACCOUNT_APPROVED: Check,
  SYSTEM: Info,
};

const TONE_VAR: Record<MMNotificationType, string> = {
  CONNECTION_REQUEST: '--brand',
  CONNECTION_ACCEPTED: '--success',
  CONNECTION_REJECTED: '--danger',
  WAITLIST_PROMOTED: '--warning',
  NEW_MATERIAL: '--info',
  ACCOUNT_APPROVED: '--success',
  SYSTEM: '--text-muted',
};

const URGENT = new Set<MMNotificationType>(['CONNECTION_REQUEST', 'WAITLIST_PROMOTED']);

function relTime(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'agora';
  const m = Math.floor(s / 60);
  if (m < 60) return `ha ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `ha ${h}h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'ontem' : `ha ${d}d`;
}

interface NotificationsBellProps {
  brandColor?: string | null;
  theme?: 'light' | 'dark';
}

export function NotificationsBell({ brandColor, theme = 'light' }: NotificationsBellProps) {
  const { items, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const prevUnread = useRef(unreadCount);
  const reduced = useReducedMotion();

  // Pulso unico ao chegar nova notificacao (respeita reduced-motion).
  useEffect(() => {
    if (unreadCount > prevUnread.current && !reduced) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 500);
      prevUnread.current = unreadCount;
      return () => clearTimeout(t);
    }
    prevUnread.current = unreadCount;
  }, [unreadCount, reduced]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const hasUrgent = items.some((n) => !n.read && URGENT.has(n.type));

  return (
    <MentorMatchThemeRoot brand={brandColor} theme={theme} style={{ display: 'inline-flex', background: 'transparent' }}>
      <div ref={ref} style={{ position: 'relative' }}>
        <motion.button
          type="button"
          className="mm-icon-btn"
          aria-label="Notificacoes"
          onClick={() => setOpen((v) => !v)}
          animate={pulse ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.4, ease: EASE.emphasis }}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                minWidth: 16,
                height: 16,
                padding: '0 4px',
                borderRadius: 'var(--r-pill)',
                background: hasUrgent ? 'var(--danger)' : 'var(--brand)',
                color: '#fff',
                fontSize: 10,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: EASE.standard }}
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: 340,
                zIndex: 50,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)',
                boxShadow: 'var(--shadow-md)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <span className="mm-label">Notificacoes</span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => void markAllRead()}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand)', fontSize: 12, fontWeight: 600 }}
                  >
                    Marcar todas
                  </button>
                )}
              </div>

              <div style={{ maxHeight: 384, overflowY: 'auto' }}>
                {items.length === 0 ? (
                  <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Bell size={28} style={{ marginBottom: 8 }} />
                    <p className="mm-body-strong" style={{ fontSize: 14 }}>
                      Tudo em dia
                    </p>
                    <p className="mm-body-small">Sem notificacoes novas.</p>
                  </div>
                ) : (
                  items.map((n) => {
                    const Icon = ICON[n.type] ?? Info;
                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          if (!n.read) void markRead(n.id);
                        }}
                        style={{
                          display: 'flex',
                          gap: 10,
                          width: '100%',
                          textAlign: 'left',
                          padding: '12px 14px',
                          border: 'none',
                          borderBottom: '1px solid var(--border)',
                          cursor: 'pointer',
                          background: n.read ? 'transparent' : 'var(--brand-soft)',
                        }}
                      >
                        <Icon size={16} style={{ color: `var(${TONE_VAR[n.type] ?? '--text-muted'})`, marginTop: 2, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                            <span className="mm-body-strong" style={{ fontSize: 13 }}>
                              {n.title}
                            </span>
                            <span className="mm-body-small" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>
                              {relTime(n.createdAt)}
                            </span>
                          </div>
                          <p className="mm-body-small" style={{ fontSize: 12.5 }}>
                            {n.message}
                          </p>
                        </div>
                        {!n.read && (
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand)', flexShrink: 0, marginTop: 6 }} />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MentorMatchThemeRoot>
  );
}
