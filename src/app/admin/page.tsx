import type { Metadata } from 'next';
import { Label } from '@/components/brand/Label';

export const metadata: Metadata = { title: 'Dashboard' };

const METRICS = [
  { label: 'SUBSCRIBERS', value: '0', note: 'confirmados' },
  { label: 'DOWNLOADS', value: '0', note: 'total' },
  { label: 'MENSAGENS', value: '0', note: 'nao lidas' },
] as const;

export default function AdminDashboardPage() {
  return (
    <>
      <h1 className="font-heading text-h1">Dashboard</h1>

      {/* Metrics */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {METRICS.map((m) => (
          <div key={m.label} className="border border-hairline bg-paper p-6">
            <Label>{m.label}</Label>
            <p className="mt-2 font-mono text-display-m font-bold">{m.value}</p>
            <p className="mt-1 text-body-s text-smoke">{m.note}</p>
          </div>
        ))}
      </div>

      {/* Recent tables */}
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div>
          <Label withTab className="mb-4 block">ULTIMAS MENSAGENS</Label>
          <div className="border border-hairline bg-paper p-6">
            <p className="text-body-s text-smoke">Nenhuma mensagem ainda.</p>
            <p className="mt-2 text-body-s text-smoke">
              Conecte o banco de dados para ver dados reais.
            </p>
          </div>
        </div>
        <div>
          <Label withTab className="mb-4 block">ULTIMOS DOWNLOADS</Label>
          <div className="border border-hairline bg-paper p-6">
            <p className="text-body-s text-smoke">Nenhum download ainda.</p>
            <p className="mt-2 text-body-s text-smoke">
              Conecte o banco de dados para ver dados reais.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
