import type { Metadata } from 'next';
import { Label } from '@/components/brand/Label';

export const metadata: Metadata = { title: 'Subscribers' };

export default function AdminSubscribersPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-h1">Subscribers</h1>
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 border border-hairline px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke"
        >
          EXPORTAR CSV
        </button>
      </div>

      <div className="mt-8 border border-hairline bg-paper p-8">
        <Label className="mb-2 block">SEM DADOS</Label>
        <p className="text-body-s text-smoke">
          Conecte o banco de dados para ver subscribers.
        </p>
      </div>
    </>
  );
}
