'use client';

import { Loader2, Search, Trash2, UserCheck, UserPlus, UserX } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  MentorMatchThemeRoot,
  Modal,
  Reveal,
  ToastProvider,
  useToast,
} from '@/mentormatch/design-system';

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: string | null;
  status: string;
}

interface Props {
  tenantId: string;
  brandColor?: string | null;
  theme?: 'light' | 'dark';
  initialUsers: AdminUser[];
}

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Admin',
  MENTOR: 'Mentor',
  MENTEE: 'Mentorado',
  SUPER_ADMIN: 'Super',
};

export function AdminUsersView(props: Props) {
  return (
    <MentorMatchThemeRoot brand={props.brandColor} theme={props.theme} style={{ minHeight: '100%', padding: '8px 0 40px' }}>
      <ToastProvider>
        <Inner {...props} />
      </ToastProvider>
    </MentorMatchThemeRoot>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'APPROVED') return <Badge tone="success">Ativo</Badge>;
  if (status === 'PENDING') return <Badge tone="warning">Pendente</Badge>;
  return (
    <span className="mm-badge" style={{ color: 'var(--text-muted)', background: 'var(--surface-2)' }}>
      <span className="mm-badge__dot" aria-hidden style={{ background: 'var(--text-muted)' }} />
      Inativo
    </span>
  );
}

function Inner({ tenantId, initialUsers }: Props) {
  const { toast } = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [toDelete, setToDelete] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function deleteUser(u: AdminUser) {
    setDeleting(true);
    const res = await fetch('/api/mentormatch/admin/users', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ userId: u.id, tenantId }),
    });
    setDeleting(false);
    if (!res.ok) {
      const d = (await res.json().catch(() => null)) as { error?: string } | null;
      toast({ title: d?.error ?? 'Falha ao excluir', tone: 'danger' });
      return;
    }
    setUsers((list) => list.filter((x) => x.id !== u.id));
    setToDelete(null);
    toast({ title: 'Usuario excluido', description: 'Dados removidos (LGPD).', tone: 'success' });
  }

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return users;
    return users.filter((u) => (u.name ?? '').toLowerCase().includes(t) || u.email.toLowerCase().includes(t));
  }, [users, q]);

  async function toggleStatus(u: AdminUser) {
    const next = u.status === 'APPROVED' ? 'SUSPENDED' : 'APPROVED';
    setBusy(u.id);
    const res = await fetch('/api/mentormatch/admin/users', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ userId: u.id, status: next }),
    });
    setBusy(null);
    if (!res.ok) {
      const d = (await res.json().catch(() => null)) as { error?: string } | null;
      toast({ title: d?.error ?? 'Falha ao atualizar', tone: 'danger' });
      return;
    }
    setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, status: next } : x)));
    toast({ title: next === 'APPROVED' ? 'Usuario ativado' : 'Usuario desativado', tone: 'success' });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Reveal>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h1 className="mm-h1">Usuarios</h1>
            <p className="mm-body-small">Gerencie os membros do programa.</p>
          </div>
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus size={16} />
            Convidar usuario
          </Button>
        </div>
      </Reveal>

      <div style={{ position: 'relative', maxWidth: 320 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-muted)' }} />
        <input
          className="mm-input"
          style={{ paddingLeft: 36 }}
          placeholder="Buscar por nome ou email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="mm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)' }}>
              {['Nome', 'Email', 'Papel', 'Status', 'Acoes'].map((h) => (
                <th
                  key={h}
                  className="mm-label"
                  style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-secondary)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }} className="mm-body-small">
                  Nenhum usuario encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="mm-row" style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px' }} className="mm-body">
                    {u.name ?? '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }} className="mm-body-small">
                    {u.email}
                  </td>
                  <td style={{ padding: '12px 16px' }} className="mm-body-small">
                    {u.role ? ROLE_LABEL[u.role] ?? u.role : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <StatusBadge status={u.status} />
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      type="button"
                      className="mm-icon-btn"
                      aria-label={u.status === 'APPROVED' ? 'Desativar' : 'Ativar'}
                      disabled={busy === u.id}
                      onClick={() => toggleStatus(u)}
                      style={{ color: u.status === 'APPROVED' ? 'var(--danger)' : 'var(--success)' }}
                    >
                      {busy === u.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : u.status === 'APPROVED' ? (
                        <UserX size={16} />
                      ) : (
                        <UserCheck size={16} />
                      )}
                    </button>
                    {u.role !== 'SUPER_ADMIN' && (
                      <button
                        type="button"
                        className="mm-icon-btn"
                        aria-label="Excluir usuario"
                        onClick={() => setToDelete(u)}
                        style={{ color: 'var(--danger)', marginLeft: 4 }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} tenantId={tenantId} />

      <Modal open={toDelete !== null} onClose={() => (deleting ? undefined : setToDelete(null))}>
        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 className="mm-h2">Excluir usuario</h2>
          <p className="mm-body" style={{ color: 'var(--text-secondary)' }}>
            Esta acao remove definitivamente {toDelete?.name ?? toDelete?.email} e seus
            dados (conexoes, fila, notificacoes). Nao pode ser desfeita.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="ghost" onClick={() => setToDelete(null)} disabled={deleting}>
              Cancelar
            </Button>
            <Button
              variant="secondary"
              onClick={() => toDelete && deleteUser(toDelete)}
              disabled={deleting}
              style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
            >
              {deleting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir definitivamente'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function InviteModal({ open, onClose, tenantId }: { open: boolean; onClose: () => void; tenantId: string }) {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'MENTEE' | 'MENTOR' | 'ADMIN'>('MENTEE');
  const [sending, setSending] = useState(false);

  async function send() {
    setSending(true);
    const res = await fetch('/api/mentormatch/invitations', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, role, tenantId }),
    });
    setSending(false);
    if (!res.ok) {
      const d = (await res.json().catch(() => null)) as { error?: string } | null;
      toast({ title: d?.error ?? 'Falha ao convidar', tone: 'danger' });
      return;
    }
    toast({ title: 'Convite enviado', description: email, tone: 'success' });
    setEmail('');
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 className="mm-h2">Convidar usuario</h2>
        <label className="mm-field">
          <span className="mm-label">Email</span>
          <input className="mm-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="mm-field">
          <span className="mm-label">Papel</span>
          <select className="mm-input" value={role} onChange={(e) => setRole(e.target.value as 'MENTEE' | 'MENTOR' | 'ADMIN')}>
            <option value="MENTEE">Mentorado</option>
            <option value="MENTOR">Mentor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button variant="ghost" onClick={onClose} disabled={sending}>
            Cancelar
          </Button>
          <Button onClick={send} disabled={sending || !email}>
            {sending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar convite'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
