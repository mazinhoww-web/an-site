'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Input, MentorMatchThemeRoot, Reveal, ToastProvider, useToast } from '@/mentormatch/design-system';

type Item = { id: string; title: string; fileType: string; fileUrl: string };

interface Props {
  tenantId: string;
  brandColor?: string | null;
  theme?: 'light' | 'dark';
}

export function LibraryManager(props: Props) {
  return (
    <MentorMatchThemeRoot brand={props.brandColor} theme={props.theme} style={{ minHeight: '100%', padding: '8px 0 40px' }}>
      <ToastProvider>
        <Inner tenantId={props.tenantId} />
      </ToastProvider>
    </MentorMatchThemeRoot>
  );
}

function Inner({ tenantId }: { tenantId: string }) {
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/mentormatch/library?tenantId=${tenantId}`, { cache: 'no-store' });
    if (res.ok) setItems((await res.json()) as Item[]);
  }, [tenantId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function upload() {
    setError('');
    const file = fileRef.current?.files?.[0];
    if (!file || title.trim().length < 2) {
      setError('Informe um titulo e selecione um arquivo.');
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const up = await fetch('/api/mentormatch/upload', { method: 'POST', body: fd });
      if (!up.ok) {
        setError('Falha no upload.');
        return;
      }
      const { url, fileSize, fileType } = (await up.json()) as { url: string; fileSize: number; fileType: string };
      const res = await fetch(`/api/mentormatch/library?tenantId=${tenantId}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), fileUrl: url, fileType, fileSize }),
      });
      if (!res.ok) {
        setError('Falha ao salvar o material.');
        return;
      }
      setTitle('');
      if (fileRef.current) fileRef.current.value = '';
      toast({ title: 'Material adicionado', tone: 'success' });
      void load();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    await fetch(`/api/mentormatch/library?id=${id}`, { method: 'DELETE' }).catch(() => {});
    toast({ title: 'Material removido', tone: 'info' });
    void load();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
      <Reveal>
        <h1 className="mm-h1">Biblioteca</h1>
        <p className="mm-body-small">Materiais do programa.</p>
      </Reveal>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 10 }}>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titulo" style={{ maxWidth: 240 }} />
        <input ref={fileRef} type="file" className="mm-body-small" style={{ color: 'var(--text-secondary)' }} />
        <Button disabled={busy} onClick={() => void upload()}>
          {busy ? 'Enviando...' : 'Adicionar material'}
        </Button>
      </div>
      {error && (
        <p className="mm-field__error" role="alert">
          {error}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.length === 0 && (
          <p className="mm-body-small" style={{ color: 'var(--text-muted)' }}>
            Nenhum material.
          </p>
        )}
        {items.map((it) => (
          <div key={it.id} className="mm-card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
            <a href={it.fileUrl} target="_blank" rel="noreferrer" style={{ flex: 1, minWidth: 0, color: 'var(--text)' }}>
              <span className="mm-body-strong">{it.title}</span>{' '}
              <span className="mm-body-small mm-mono" style={{ color: 'var(--text-muted)' }}>
                {it.fileType}
              </span>
            </a>
            <Button variant="ghost" onClick={() => void remove(it.id)} style={{ height: 32, padding: '0 12px', fontSize: 13, color: 'var(--danger)' }}>
              Excluir
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
