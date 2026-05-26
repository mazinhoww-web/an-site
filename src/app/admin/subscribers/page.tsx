'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  getSubscribers,
  exportSubscribersCsv,
  softDeleteSubscriber,
} from '@/server-actions/admin/subscribers';

type Subscriber = {
  id: string;
  email: string;
  name: string | null;
  consentNewsletter: boolean | null;
  confirmed: boolean | null;
  source: string | null;
  createdAt: Date | null;
};

const FILTERS = [
  { label: 'Todos', value: '' },
  { label: 'Confirmados', value: 'confirmed' },
  { label: 'Não confirmados', value: 'unconfirmed' },
] as const;

export default function AdminSubscribersPage() {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isExporting, startExport] = useTransition();

  function loadSubscribers() {
    startTransition(async () => {
      const data = await getSubscribers(filter || undefined, search || undefined);
      setSubscribers(data as Subscriber[]);
    });
  }

  useEffect(() => {
    loadSubscribers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    loadSubscribers();
  }

  function handleExport() {
    startExport(async () => {
      const csv = await exportSubscribersCsv();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscribers_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  function handleDelete(id: string, email: string) {
    if (!confirm(`Apagar dados de "${email}"? (soft-delete LGPD)`)) return;
    startTransition(async () => {
      await softDeleteSubscriber(id);
      loadSubscribers();
    });
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-h1 mb-8">Subscribers</h1>
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="inline-flex items-center gap-2 border border-hairline px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-colors duration-200 hover:bg-ink hover:text-bone disabled:opacity-40"
        >
          {isExporting ? 'Exportando...' : 'Exportar CSV'}
        </button>
      </div>

      {/* Filter buttons */}
      <div className="mb-6 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.08em] transition-colors duration-200 ${
              filter === f.value
                ? 'bg-ink text-bone'
                : 'border border-hairline text-graphite hover:bg-ink hover:text-bone'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por email"
          className="flex-1 border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-ink px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime disabled:opacity-40"
        >
          Buscar
        </button>
      </form>

      {/* Table */}
      {isPending && subscribers.length === 0 ? (
        <p className="text-body-s text-smoke">Carregando...</p>
      ) : subscribers.length === 0 ? (
        <div className="border border-hairline bg-paper p-8">
          <p className="text-body-s text-smoke">Nenhum subscriber encontrado.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-body-s">
            <thead>
              <tr>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Email
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Nome
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Newsletter
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Confirmado
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Fonte
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Data
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} className="font-mono">
                  <td className="py-3 border-t border-hairline">{s.email}</td>
                  <td className="py-3 border-t border-hairline">{s.name ?? '-'}</td>
                  <td className="py-3 border-t border-hairline">
                    {s.consentNewsletter ? 'sim' : 'não'}
                  </td>
                  <td className="py-3 border-t border-hairline">
                    <span className={s.confirmed ? 'text-lime' : 'text-smoke'}>
                      {s.confirmed ? 'sim' : 'não'}
                    </span>
                  </td>
                  <td className="py-3 border-t border-hairline">{s.source ?? '-'}</td>
                  <td className="py-3 border-t border-hairline whitespace-nowrap">
                    {s.createdAt
                      ? new Date(s.createdAt).toLocaleDateString('pt-BR')
                      : '-'}
                  </td>
                  <td className="py-3 border-t border-hairline">
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id, s.email)}
                      className="font-mono text-[10px] uppercase tracking-[0.08em] text-smoke transition-colors hover:text-ink"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
