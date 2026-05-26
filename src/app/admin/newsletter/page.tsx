import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { db } from '@/db';
import { newsletterCampaigns } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { Label } from '@/components/brand/Label';

export const metadata: Metadata = { title: 'Newsletter' };

export default async function AdminNewsletterPage() {
  const campaigns = await db
    .select()
    .from(newsletterCampaigns)
    .orderBy(desc(newsletterCampaigns.createdAt));

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-h1 mb-8">Newsletter</h1>
        <Link
          href="/admin/newsletter/nova"
          className="inline-flex items-center gap-2 bg-ink px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime"
        >
          <Plus size={14} strokeWidth={1.5} />
          Nova Campanha
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="border border-hairline bg-paper p-8">
          <Label className="mb-2 block">SEM CAMPANHAS</Label>
          <p className="text-body-s text-smoke">
            Nenhuma campanha de newsletter. Crie a primeira.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-body-s">
            <thead>
              <tr>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Assunto
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Destinatários
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Status
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Enviado em
                </th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="font-mono">
                  <td className="py-3 border-t border-hairline">{c.subject}</td>
                  <td className="py-3 border-t border-hairline">
                    {c.recipientCount ?? 0}
                  </td>
                  <td className="py-3 border-t border-hairline">
                    <span
                      className={
                        c.status === 'sent' ? 'text-lime' : 'text-smoke'
                      }
                    >
                      {c.status === 'sent' ? 'enviado' : 'rascunho'}
                    </span>
                  </td>
                  <td className="py-3 border-t border-hairline whitespace-nowrap">
                    {c.sentAt
                      ? new Date(c.sentAt).toLocaleString('pt-BR')
                      : '-'}
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
