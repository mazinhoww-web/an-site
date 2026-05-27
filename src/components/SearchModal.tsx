'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Box, Calendar } from 'lucide-react';
import { globalSearch } from '@/server-actions/search';

type Result = { type: 'skill' | 'evento'; title: string; slug: string; excerpt: string };

const TYPE_ICONS = {
  skill: Box,
  evento: Calendar,
} as const;

const TYPE_LABELS = {
  skill: 'SKILL',
  evento: 'EVENTO',
} as const;

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const open = useCallback(() => { setIsOpen(true); setQuery(''); setResults([]); }, []);
  const close = useCallback(() => { setIsOpen(false); setQuery(''); setResults([]); }, []);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); open(); }
      if (e.key === 'Escape' && isOpen) close();
    }
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [isOpen, open, close]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!query || query.length < 2) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const r = await globalSearch(query);
      setResults(r);
      setLoading(false);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  function navigate(slug: string) {
    close();
    router.push(slug);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/50 pt-[15vh]" onClick={close}>
      <div className="w-full max-w-lg border border-hairline bg-paper shadow-none" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-hairline px-4 py-3">
          <Search size={18} strokeWidth={1.5} className="text-smoke" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar skills, eventos..."
            className="flex-1 bg-transparent text-body text-ink outline-none placeholder:text-smoke/60"
          />
          <button type="button" onClick={close} className="text-smoke hover:text-ink">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          {loading && <p className="px-4 py-6 text-center text-body-s text-smoke">Buscando...</p>}
          {!loading && query.length >= 2 && results.length === 0 && (
            <p className="px-4 py-6 text-center text-body-s text-smoke">Nenhum resultado para &quot;{query}&quot;</p>
          )}
          {results.map((r, i) => {
            const Icon = TYPE_ICONS[r.type];
            return (
              <button
                key={`${r.slug}-${i}`}
                type="button"
                onClick={() => navigate(r.slug)}
                className="flex w-full items-start gap-3 border-b border-hairline px-4 py-3 text-left transition-colors hover:bg-bone"
              >
                <Icon size={16} strokeWidth={1.5} className="mt-0.5 flex-shrink-0 text-smoke" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] font-medium uppercase tracking-[0.08em] text-smoke">{TYPE_LABELS[r.type]}</span>
                  </div>
                  <p className="truncate text-body-s font-medium text-ink">{r.title}</p>
                  <p className="truncate text-body-s text-graphite">{r.excerpt}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-hairline px-4 py-2">
          <span className="font-mono text-[9px] font-medium uppercase tracking-[0.08em] text-smoke">
            {results.length > 0 ? `${results.length} resultados` : 'Cmd+K para buscar'}
          </span>
          <span className="font-mono text-[9px] font-medium uppercase tracking-[0.08em] text-smoke">ESC para fechar</span>
        </div>
      </div>
    </div>
  );
}
