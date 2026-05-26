export const dynamic = "force-dynamic";
import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { db } from '@/db';
import { events } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { Label } from '@/components/brand/Label';
import { DeleteEventButton } from './actions-buttons';

export const metadata: Metadata = { title: 'Eventos' };

export default async function AdminEventosPage() {
  const allEvents = await db.select().from(events).orderBy(desc(events.createdAt));

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-h1 mb-8">Eventos</h1>
        <Link
          href="/admin/eventos/novo"
          className="inline-flex items-center gap-2 bg-ink px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime"
        >
          <Plus size={14} strokeWidth={1.5} />
          Novo Evento
        </Link>
      </div>

      {allEvents.length === 0 ? (
        <div className="border border-hairline bg-paper p-8">
          <Label className="mb-2 block">SEM DADOS</Label>
          <p className="text-body-s text-smoke">
            Nenhum evento cadastrado. Crie o primeiro.
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
                  Tipo
                </th>
                <th className="text-left font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke pb-3">
                  Role
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
              {allEvents.map((ev) => (
                <tr key={ev.id} className="font-mono">
                  <td className="py-3 border-t border-hairline">{ev.title}</td>
                  <td className="py-3 border-t border-hairline">{ev.eventType}</td>
                  <td className="py-3 border-t border-hairline">{ev.role}</td>
                  <td className="py-3 border-t border-hairline whitespace-nowrap">
                    {ev.eventDate
                      ? new Date(ev.eventDate).toLocaleDateString('pt-BR')
                      : '-'}
                  </td>
                  <td className="py-3 border-t border-hairline">
                    <DeleteEventButton id={ev.id} title={ev.title} />
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
