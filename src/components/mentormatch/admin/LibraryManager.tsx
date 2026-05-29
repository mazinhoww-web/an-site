'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Item = { id: string; title: string; fileType: string; fileUrl: string };

export function LibraryManager({ tenantId }: { tenantId: string }) {
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
      void load();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    await fetch(`/api/mentormatch/library?id=${id}`, { method: 'DELETE' }).catch(() => {});
    void load();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titulo" className={input} />
        <input ref={fileRef} type="file" className="text-body-s" />
        <button type="button" disabled={busy} onClick={() => void upload()} className={btnPrimary}>
          {busy ? 'Enviando...' : 'Adicionar material'}
        </button>
      </div>
      {error && <p className="text-body-s text-error">{error}</p>}
      <ul className="space-y-2">
        {items.length === 0 && <li className="text-body-s text-graphite">Nenhum material.</li>}
        {items.map((it) => (
          <li key={it.id} className="flex items-center justify-between rounded border border-hairline bg-paper px-4 py-2">
            <a href={it.fileUrl} target="_blank" rel="noreferrer" className="text-body-s text-ink underline">
              {it.title} <span className="font-mono text-mono-meta text-graphite">{it.fileType}</span>
            </a>
            <button type="button" onClick={() => void remove(it.id)} className={btn}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const input = 'rounded border border-hairline bg-paper px-3 py-2 text-body text-ink outline-none focus:border-ink';
const btn = 'rounded border border-hairline px-3 py-1.5 text-body-s text-ink hover:border-ink';
const btnPrimary = 'rounded bg-ink px-4 py-2 text-body-s text-paper hover:bg-graphite disabled:opacity-60';
