'use client';

import { Building2, CheckCircle2, Layers, Link2, Loader2, Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Badge,
  Button,
  MentorMatchThemeRoot,
  Modal,
  Reveal,
  Stagger,
  StaggerItem,
  ToastProvider,
  useToast,
} from '@/mentormatch/design-system';

interface TenantRow {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  planName: string | null;
  users: number;
  mentors: number;
  activeConnections: number;
}
interface PlanRow {
  id: string;
  name: string;
  active: boolean;
  features: string[];
  priceMonthly: number;
  maxUsers: number;
}
interface Props {
  metrics: { tenantsActive: number; usersTotal: number; matchesTotal: number; connectionsTotal: number };
  tenants: TenantRow[];
  plans: PlanRow[];
}

const FEATURES: [string, string][] = [
  ['custom_branding', 'Branding customizado'],
  ['csv_export', 'Export CSV'],
  ['analytics', 'Analytics avancado'],
  ['priority_support', 'Suporte prioritario'],
  ['unlimited_users', 'Usuarios ilimitados'],
];

type Tab = 'overview' | 'tenants' | 'plans';

export function SuperAdminView(props: Props) {
  // Super admin SEMPRE dark + Indigo (sem brand de tenant).
  return (
    <MentorMatchThemeRoot theme="dark" style={{ minHeight: '100vh' }}>
      <ToastProvider>
        <Inner {...props} />
      </ToastProvider>
    </MentorMatchThemeRoot>
  );
}

function Inner({ metrics, tenants: t0, plans: p0 }: Props) {
  const [tab, setTab] = useState<Tab>('overview');
  const [tenants, setTenants] = useState(t0);
  const [plans, setPlans] = useState(p0);
  const [createOpen, setCreateOpen] = useState(false);
  const { toast } = useToast();

  const nav: [Tab, string][] = [
    ['overview', 'Visao geral'],
    ['tenants', 'Tenants'],
    ['plans', 'Planos'],
  ];

  return (
    <div className="flex flex-col md:flex-row" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        className="md:w-60"
        style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)', padding: 20 }}
      >
        <div className="mm-h3" style={{ marginBottom: 20 }}>
          MentorMatch
          <span style={{ color: 'var(--brand)' }}> Super</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {nav.map(([id, label]) => {
            const on = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                style={{
                  textAlign: 'left',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '10px 12px',
                  borderRadius: 'var(--r-sm)',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: 'var(--mm-font-sans)',
                  background: on ? 'var(--brand-soft)' : 'transparent',
                  color: on ? 'var(--brand)' : 'var(--text-secondary)',
                }}
              >
                {label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '32px 24px', maxWidth: 1100 }}>
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <Reveal>
              <h1 className="mm-h1">Visao geral</h1>
              <p className="mm-body-small">Metricas agregadas da plataforma.</p>
            </Reveal>
            <Stagger className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              <Metric icon={Building2} label="Tenants ativos" value={metrics.tenantsActive} />
              <Metric icon={Users} label="Usuarios (total)" value={metrics.usersTotal} />
              <Metric icon={CheckCircle2} label="Matches aceitos" value={metrics.matchesTotal} />
              <Metric icon={Link2} label="Conexoes (total)" value={metrics.connectionsTotal} />
            </Stagger>

            <div>
              <h2 className="mm-h3" style={{ marginBottom: 12 }}>
                Tenants recentes
              </h2>
              <TenantTable rows={tenants.slice(0, 5)} onChange={setTenants} toast={toast} />
            </div>
          </div>
        )}

        {tab === 'tenants' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Reveal>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <h1 className="mm-h1">Tenants</h1>
                  <p className="mm-body-small">Gerencie as organizacoes da plataforma.</p>
                </div>
                <Button onClick={() => setCreateOpen(true)}>
                  <Plus size={16} />
                  Novo tenant
                </Button>
              </div>
            </Reveal>
            <TenantTable rows={tenants} onChange={setTenants} toast={toast} />
          </div>
        )}

        {tab === 'plans' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Reveal>
              <h1 className="mm-h1">Planos</h1>
              <p className="mm-body-small">Billing arquitetado; todos FREE por ora. Ative feature flags por plano.</p>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((p) => (
                <PlanCard key={p.id} plan={p} onChange={setPlans} toast={toast} />
              ))}
            </div>
          </div>
        )}
      </main>

      <CreateTenantModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        plans={plans}
        toast={toast}
      />
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <StaggerItem>
      <div className="mm-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Icon size={24} color="var(--brand)" />
        <div className="mm-h1" style={{ color: 'var(--text)', lineHeight: 1.1 }}>
          {value}
        </div>
        <div className="mm-body-small" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </div>
      </div>
    </StaggerItem>
  );
}

type ToastFn = ReturnType<typeof useToast>['toast'];

function TenantTable({
  rows,
  onChange,
  toast,
}: {
  rows: TenantRow[];
  onChange: React.Dispatch<React.SetStateAction<TenantRow[]>>;
  toast: ToastFn;
}) {
  const [busy, setBusy] = useState<string | null>(null);

  async function setActive(id: string, active: boolean) {
    setBusy(id);
    const res = await fetch('/api/mentormatch/admin/tenants', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, active }),
    });
    setBusy(null);
    if (!res.ok) {
      toast({ title: 'Falha ao atualizar tenant', tone: 'danger' });
      return;
    }
    onChange((list) => list.map((t) => (t.id === id ? { ...t, active } : t)));
    toast({ title: active ? 'Tenant reativado' : 'Tenant suspenso', tone: 'success' });
  }

  if (rows.length === 0) {
    return <p className="mm-body-small" style={{ color: 'var(--text-muted)' }}>Nenhum tenant.</p>;
  }

  return (
    <div className="mm-card" style={{ padding: 0, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--surface-2)' }}>
            {['Tenant', 'Plano', 'Usuarios', 'Status', 'Acoes'].map((h) => (
              <th key={h} className="mm-label" style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-secondary)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id} className="mm-row" style={{ borderTop: '1px solid var(--border)' }}>
              <td style={{ padding: '12px 16px' }}>
                <div className="mm-body-strong">{t.name}</div>
                <div className="mm-body-small mm-mono" style={{ color: 'var(--text-muted)' }}>/{t.slug}</div>
              </td>
              <td style={{ padding: '12px 16px' }} className="mm-body-small">
                {t.planName ?? '—'}
              </td>
              <td style={{ padding: '12px 16px' }} className="mm-body-small">
                {t.users}
              </td>
              <td style={{ padding: '12px 16px' }}>
                {t.active ? <Badge tone="success">Ativo</Badge> : <Badge tone="warning">Suspenso</Badge>}
              </td>
              <td style={{ padding: '12px 16px' }}>
                <button
                  type="button"
                  className="mm-btn mm-btn--ghost"
                  style={{ height: 32, padding: '0 12px', fontSize: 13, color: t.active ? 'var(--warning)' : 'var(--success)' }}
                  disabled={busy === t.id}
                  onClick={() => setActive(t.id, !t.active)}
                >
                  {busy === t.id ? <Loader2 size={14} className="animate-spin" /> : t.active ? 'Suspender' : 'Reativar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlanCard({
  plan,
  onChange,
  toast,
}: {
  plan: PlanRow;
  onChange: React.Dispatch<React.SetStateAction<PlanRow[]>>;
  toast: ToastFn;
}) {
  const [busy, setBusy] = useState(false);

  async function patch(payload: { active?: boolean; features?: string[] }) {
    setBusy(true);
    const res = await fetch('/api/mentormatch/admin/plans', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: plan.id, ...payload }),
    });
    setBusy(false);
    if (!res.ok) {
      toast({ title: 'Falha ao salvar plano', tone: 'danger' });
      return;
    }
    onChange((list) => list.map((p) => (p.id === plan.id ? { ...p, ...payload } : p)));
  }

  function toggleFeature(key: string) {
    const has = plan.features.includes(key);
    const next = has ? plan.features.filter((f) => f !== key) : [...plan.features, key];
    void patch({ features: next });
  }

  return (
    <div className="mm-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="mm-h3">{plan.name}</div>
          <div className="mm-body-small">
            {plan.priceMonthly === 0 ? 'FREE' : `R$ ${plan.priceMonthly}/mes`} · {plan.maxUsers} usuarios
          </div>
        </div>
        {plan.active ? <Badge tone="success">Ativo</Badge> : <Badge tone="warning">Inativo</Badge>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {FEATURES.map(([key, label]) => {
          const on = plan.features.includes(key);
          return (
            <button
              key={key}
              type="button"
              disabled={busy}
              onClick={() => toggleFeature(key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
                border: '1px solid var(--border)',
                background: 'transparent',
                borderRadius: 'var(--r-sm)',
                padding: '8px 10px',
                cursor: 'pointer',
              }}
            >
              <span className="mm-body-small" style={{ color: 'var(--text)' }}>
                {label}
              </span>
              <span
                aria-hidden
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 'var(--r-pill)',
                  background: on ? 'var(--brand)' : 'var(--surface-2)',
                  position: 'relative',
                  transition: 'background 0.15s',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: on ? 18 : 2,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: '#fff',
                    transition: 'left 0.15s',
                  }}
                />
              </span>
            </button>
          );
        })}
      </div>

      <Button variant="secondary" disabled={busy} onClick={() => patch({ active: !plan.active })} style={{ width: '100%' }}>
        {busy ? <Loader2 size={16} className="animate-spin" /> : plan.active ? 'Desativar plano' : 'Ativar plano'}
      </Button>
    </div>
  );
}

function CreateTenantModal({
  open,
  onClose,
  plans,
  toast,
}: {
  open: boolean;
  onClose: () => void;
  plans: PlanRow[];
  toast: ToastFn;
}) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [brandColor, setBrandColor] = useState('#4f46e5');
  const [planId, setPlanId] = useState(plans[0]?.id ?? '');
  const [saving, setSaving] = useState(false);

  async function create() {
    setSaving(true);
    const res = await fetch('/api/mentormatch/admin/tenants', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, slug, brandColor, planId }),
    });
    setSaving(false);
    if (!res.ok) {
      const d = (await res.json().catch(() => null)) as { error?: string } | null;
      toast({ title: d?.error ?? 'Falha ao criar tenant', tone: 'danger' });
      return;
    }
    toast({ title: 'Tenant criado', description: `/${slug}`, tone: 'success' });
    onClose();
    setName('');
    setSlug('');
    router.refresh();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 className="mm-h2">Novo tenant</h2>
        <label className="mm-field">
          <span className="mm-label">Nome</span>
          <input className="mm-input" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="mm-field">
          <span className="mm-label">Slug</span>
          <input className="mm-input mm-mono" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="ex: acme" />
        </label>
        <div className="mm-field">
          <span className="mm-label">Cor da marca</span>
          <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} style={{ width: 48, height: 44, border: '1px solid var(--border-strong)', borderRadius: 'var(--r-sm)', background: 'none', cursor: 'pointer' }} />
        </div>
        <label className="mm-field">
          <span className="mm-label">Plano</span>
          <select className="mm-input" value={planId} onChange={(e) => setPlanId(e.target.value)}>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={create} disabled={saving || !name || !slug || !planId}>
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Criando...
              </>
            ) : (
              'Criar tenant'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
