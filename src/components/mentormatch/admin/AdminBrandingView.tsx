'use client';

import { AlertTriangle, Loader2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import {
  Button,
  MentorMatchThemeRoot,
  Reveal,
  ToastProvider,
  brandContrastPasses,
  useToast,
} from '@/mentormatch/design-system';

interface Props {
  slug: string;
  theme?: 'light' | 'dark';
  initial: { name: string; brandColor: string; logoUrl: string | null; maxMenteesPerMentor: number };
}

export function AdminBrandingView({ slug, theme = 'light', initial }: Props) {
  const [brand, setBrand] = useState(initial.brandColor);
  return (
    // O wrapper usa brand={brand} -> --brand atualiza ao vivo em todo o preview.
    <MentorMatchThemeRoot brand={brand} theme={theme} style={{ minHeight: '100%', padding: '8px 0 40px' }}>
      <ToastProvider>
        <Inner slug={slug} initial={initial} brand={brand} setBrand={setBrand} />
      </ToastProvider>
    </MentorMatchThemeRoot>
  );
}

function Inner({
  slug,
  initial,
  brand,
  setBrand,
}: {
  slug: string;
  initial: Props['initial'];
  brand: string;
  setBrand: (v: string) => void;
}) {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(initial.name);
  const [logo, setLogo] = useState(initial.logoUrl);
  const [maxMentees, setMaxMentees] = useState(initial.maxMenteesPerMentor);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const validHex = /^#[0-9a-fA-F]{6}$/.test(brand);
  const whiteOk = validHex ? brandContrastPasses(brand) : true;

  async function onFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/mentormatch/upload', { method: 'POST', body: fd });
    setUploading(false);
    if (!res.ok) {
      toast({ title: 'Falha no upload do logo', tone: 'danger' });
      return;
    }
    const data = (await res.json()) as { url: string };
    setLogo(data.url);
  }

  async function save() {
    if (!validHex) {
      toast({ title: 'Cor invalida', description: 'Use um hex #RRGGBB.', tone: 'danger' });
      return;
    }
    setSaving(true);
    const res = await fetch('/api/mentormatch/admin/settings', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slug, name, brandColor: brand, logoUrl: logo ?? '', maxMenteesPerMentor: maxMentees }),
    });
    setSaving(false);
    if (!res.ok) {
      const d = (await res.json().catch(() => null)) as { error?: string } | null;
      toast({ title: d?.error ?? 'Falha ao salvar', tone: 'danger' });
      return;
    }
    toast({ title: 'Identidade salva', description: 'O branding do tenant foi atualizado.', tone: 'success' });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Reveal>
        <h1 className="mm-h1">Identidade visual</h1>
        <p className="mm-body-small">Personalize a marca do programa. O preview atualiza em tempo real.</p>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <label className="mm-field">
            <span className="mm-label">Nome do programa</span>
            <input className="mm-input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <div className="mm-field">
            <span className="mm-label">Logo</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span
                style={{
                  width: 120,
                  height: 120,
                  flexShrink: 0,
                  borderRadius: 'var(--r-md)',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  color: 'var(--text-muted)',
                }}
              >
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <Upload size={28} />
                )}
              </span>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files?.[0];
                  if (f) void onFile(f);
                }}
                style={{
                  flex: 1,
                  cursor: 'pointer',
                  borderRadius: 'var(--r-md)',
                  border: '1px dashed var(--border-strong)',
                  background: 'var(--surface-2)',
                  padding: '18px 16px',
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                }}
              >
                <span className="mm-body-small">{uploading ? 'Enviando...' : 'Arraste um logo ou clique para enviar'}</span>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void onFile(f);
                }}
              />
            </div>
          </div>

          <div className="mm-field">
            <span className="mm-label">Cor da marca</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="color"
                value={validHex ? brand : '#4f46e5'}
                onChange={(e) => setBrand(e.target.value)}
                style={{ width: 48, height: 44, border: '1px solid var(--border-strong)', borderRadius: 'var(--r-sm)', background: 'none', cursor: 'pointer' }}
                aria-label="Selecionar cor da marca"
              />
              <input
                className="mm-input"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                style={{ maxWidth: 160, fontFamily: 'var(--mm-font-mono)' }}
              />
            </div>
            {!whiteOk && (
              <p className="mm-body-small" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--warning)', marginTop: 4 }}>
                <AlertTriangle size={14} />
                Contraste do branco abaixo de 4.5:1 — usaremos texto escuro sobre a marca.
              </p>
            )}
          </div>

          <label className="mm-field">
            <span className="mm-label">Vagas por mentor</span>
            <input
              className="mm-input"
              type="number"
              min={1}
              max={50}
              value={maxMentees}
              onChange={(e) => setMaxMentees(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
              style={{ maxWidth: 120 }}
            />
          </label>

          <div>
            <Button onClick={save} disabled={saving || !validHex}>
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
        </div>

        {/* Preview ao vivo */}
        <div>
          <span className="mm-label" style={{ display: 'block', marginBottom: 8 }}>
            Preview
          </span>
          <div className="mm-card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--brand)', color: 'var(--brand-contrast)' }}>
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt="" style={{ height: 22, width: 'auto' }} />
              ) : (
                <strong style={{ fontSize: 14 }}>{name || 'Programa'}</strong>
              )}
              <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.9 }}>Entrar</span>
            </div>
            {/* Body: sidebar + content */}
            <div style={{ display: 'flex', minHeight: 180 }}>
              <div style={{ width: 120, borderRight: '1px solid var(--border)', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, padding: '6px 8px', borderRadius: 'var(--r-sm)', background: 'var(--brand-soft)', color: 'var(--brand)' }}>
                  Painel
                </span>
                <span className="mm-body-small" style={{ padding: '6px 8px' }}>Mentores</span>
                <span className="mm-body-small" style={{ padding: '6px 8px' }}>Conexoes</span>
              </div>
              <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span className="mm-body-strong">{name || 'Programa de mentoria'}</span>
                <span
                  className="mm-btn mm-btn--primary"
                  style={{ alignSelf: 'flex-start', height: 36, padding: '0 16px', fontSize: 13 }}
                >
                  Acao primaria
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
