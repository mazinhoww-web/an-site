'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Badge, Button, Modal, useToast } from '@/mentormatch/design-system';
import { capacityOf, type MatchMentor } from './types';

interface Props {
  mentor: MatchMentor | null;
  onClose: () => void;
  alreadyRequested: boolean;
  onRequested: (mentorId: string) => void;
}

export function MentorProfileModal({ mentor, onClose, alreadyRequested, onRequested }: Props) {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  if (!mentor) return null;
  const cap = capacityOf(mentor);

  async function send() {
    if (!mentor) return;
    setSending(true);
    const res = await fetch('/api/mentormatch/connections', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ mentorId: mentor.id }),
    });
    setSending(false);
    if (res.ok) {
      toast({
        title: cap.full ? 'Voce entrou na lista de espera' : 'Solicitacao enviada',
        description: cap.full ? 'O mentor sera notificado quando abrir vaga.' : `${mentor.name ?? 'O mentor'} foi notificado.`,
        tone: 'success',
      });
      onRequested(mentor.id);
      onClose();
      return;
    }
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    toast({ title: data?.error ?? 'Nao foi possivel enviar', tone: 'danger' });
  }

  return (
    <Modal open={Boolean(mentor)} onClose={onClose}>
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--brand-soft)',
              color: 'var(--brand)',
              fontWeight: 700,
            }}
          >
            {mentor.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mentor.image} alt={mentor.name ?? 'Mentor'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              (mentor.name ?? '?').slice(0, 1).toUpperCase()
            )}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 className="mm-h2">{mentor.name ?? 'Mentor'}</h2>
            {mentor.headline && <p className="mm-body-small">{mentor.headline}</p>}
          </div>
          <Badge tone={cap.full ? 'danger' : 'success'}>{cap.full ? 'Lotado' : 'Disponivel'}</Badge>
        </div>

        {mentor.bio && (
          <div>
            <span className="mm-label">Sobre</span>
            <p className="mm-body" style={{ marginTop: 4 }}>
              {mentor.bio}
            </p>
          </div>
        )}

        {mentor.skills.length > 0 && (
          <div>
            <span className="mm-label">Especialidades</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {mentor.skills.map((s) => (
                <span key={s} className="mm-chip">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <span className="mm-label">Capacidade</span>
          <p className="mm-body-small" style={{ marginTop: 4 }}>
            {cap.used} de {cap.max} mentorados ativos
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose} disabled={sending}>
            Cancelar
          </Button>
          <Button onClick={send} disabled={sending || alreadyRequested}>
            {sending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Enviando...
              </>
            ) : alreadyRequested ? (
              'Solicitacao enviada'
            ) : cap.full ? (
              'Entrar na lista de espera'
            ) : (
              'Enviar solicitacao'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
