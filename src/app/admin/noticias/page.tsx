export const dynamic = "force-dynamic";
import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { db } from '@/db';
import { news } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { Label } from '@/components/brand/Label';
import { DeleteNewsButton } from './actions-buttons';

export const metadata: Metadata = { title: 'Notícias' };

export default async function AdminNoticiasPage() {
  const allNews = await db.select().from(news).orderBy(desc(news.createdAt));

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-h1 mb-8">Notícias</h1>
        <Link
          href="/admin/noticias/novo"
          className="inline-flex items-center gap-2 bg-ink px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime"
        >
          <Plus size={14} strokeWidth={1.5} />
          Nova Notícia
        </Link>
      </div>

      {allNews.length === 0 ? (
        <div className="border border-hairline bg-paper p-8">
          <Label className="mb-2 block">SEM DADOS</Label>
          <p className="text-body-s text-smoke">
            Nenhuma notícia cadastrada. Crie a primeira.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-body-s">
            <thead>
              <tr>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Título
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Status
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
              {allNews.map((n) => (
                <tr key={n.id} className="font-mono">
                  <td className="py-3 border-t border-hairline">{n.title}</td>
                  <td className="py-3 border-t border-hairline">
                    <span
                      className={
                        n.status === 'published' ? 'text-lime' : 'text-smoke'
                      }
                    >
                      {n.status === 'published' ? 'publicado' : 'rascunho'}
                    </span>
                  </td>
                  <td className="py-3 border-t border-hairline whitespace-nowrap">
                    {n.createdAt
                      ? new Date(n.createdAt).toLocaleDateString('pt-BR')
                      : '-'}
                  </td>
                  <td className="py-3 border-t border-hairline">
                    <DeleteNewsButton id={n.id} title={n.title} />
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
