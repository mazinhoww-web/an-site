import { tokens } from '@/lib/tokens';

const colorEntries = Object.entries(tokens.colors) as [string, string][];

const typographyScale = [
  { name: 'display-xl', class: 'text-display-xl font-heading', sample: 'Onde estrategia vira sistema.' },
  { name: 'display-l', class: 'text-display-l font-heading', sample: 'Estrategia em escala' },
  { name: 'display-m', class: 'text-display-m font-heading', sample: 'Produto, parceria, execucao' },
  { name: 'h1', class: 'text-h1 font-heading', sample: 'Titulo de secao principal' },
  { name: 'h2', class: 'text-h2 font-heading', sample: 'Subsecao com hierarquia' },
  { name: 'h3', class: 'text-h3 font-heading', sample: 'Entrada de lista ou card' },
  { name: 'body-l', class: 'text-body-l font-sans', sample: 'Paragrafo de destaque com leitura confortavel em telas grandes.' },
  { name: 'body', class: 'text-body font-sans', sample: 'Texto padrao do site. Legivel, direto, sem ruido visual.' },
  { name: 'body-s', class: 'text-body-s font-sans', sample: 'Texto auxiliar, notas de rodape, descricoes curtas.' },
  { name: 'caption', class: 'text-caption font-sans uppercase', sample: 'LABEL OU EYEBROW' },
  { name: 'mono', class: 'text-mono font-mono', sample: 'R$ 70.000.000.000 em ativos' },
  { name: 'mono-meta', class: 'text-mono-meta font-mono uppercase', sample: '2024 / LOYALTY / LATAM PASS' },
] as const;

const fontWeights = [
  { family: 'Space Grotesk', class: 'font-heading', weights: [
    { value: 500, label: 'Medium 500' },
    { value: 600, label: 'SemiBold 600' },
    { value: 700, label: 'Bold 700' },
  ]},
  { family: 'Inter', class: 'font-sans', weights: [
    { value: 400, label: 'Regular 400' },
    { value: 500, label: 'Medium 500' },
  ]},
  { family: 'JetBrains Mono', class: 'font-mono', weights: [
    { value: 400, label: 'Regular 400' },
    { value: 500, label: 'Medium 500' },
  ]},
] as const;

export default function TokensPage() {
  return (
    <div className="mx-auto max-w-container px-6 py-16 md:px-12 lg:px-16">
      {/* Header */}
      <header className="mb-20">
        <h1 className="text-display-l font-heading">
          AN<span className="text-lime">.</span> Design Tokens
        </h1>
        <p className="mt-4 text-body-l text-graphite">
          Validacao visual dos tokens de cor, tipografia, motion e espacamento.
        </p>
      </header>

      {/* Paleta de cores */}
      <section className="mb-20">
        <h2 className="text-h2 font-heading mb-8">Paleta de cores</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {colorEntries.map(([name, hex]) => (
            <div key={name} className="border rounded-sm p-4">
              <div
                className="mb-3 h-16 w-full rounded-sm border"
                style={{ backgroundColor: hex }}
              />
              <p className="text-body-s font-medium">{name}</p>
              <p className="text-mono-meta font-mono uppercase text-smoke">{hex}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Escala tipografica */}
      <section className="mb-20">
        <h2 className="text-h2 font-heading mb-8">Escala tipografica</h2>
        <div className="space-y-8">
          {typographyScale.map(({ name, class: cls, sample }) => (
            <div key={name} className="border-b pb-6">
              <p className="text-mono-meta font-mono uppercase text-smoke mb-2">{name}</p>
              <p className={cls}>{sample}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pesos de fonte */}
      <section className="mb-20">
        <h2 className="text-h2 font-heading mb-8">Pesos de fonte</h2>
        <div className="space-y-10">
          {fontWeights.map(({ family, class: cls, weights }) => (
            <div key={family}>
              <p className="text-caption font-sans uppercase text-smoke mb-4">{family}</p>
              <div className="space-y-2">
                {weights.map(({ value, label }) => (
                  <p key={value} className={`text-h1 ${cls}`} style={{ fontWeight: value }}>
                    {label}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Descritor */}
      <section className="mb-20">
        <h2 className="text-h2 font-heading mb-8">Descritor</h2>
        <p className="text-mono-meta font-mono uppercase tracking-wide text-smoke">
          LOYALTY {'×'} FINTECH {'×'} INNOVATION
        </p>
      </section>

      {/* Hairline */}
      <section className="mb-20">
        <h2 className="text-h2 font-heading mb-8">Hairline (divisor)</h2>
        <div className="h-px w-full bg-hairline" />
        <p className="mt-4 text-body-s text-smoke">1px, cor hairline (#E5E3DC). Sem sombra, sem gradiente.</p>
      </section>

      {/* Focus ring */}
      <section className="mb-20">
        <h2 className="text-h2 font-heading mb-8">Focus ring</h2>
        <p className="text-body-s text-graphite mb-4">Use Tab para navegar ate o botao abaixo.</p>
        <button
          type="button"
          className="border bg-ink px-6 py-3 text-caption font-sans uppercase text-bone transition-colors hover:bg-lime hover:text-ink"
        >
          EXEMPLO DE BOTAO
        </button>
      </section>

      {/* Selection */}
      <section className="mb-20">
        <h2 className="text-h2 font-heading mb-8">Selection</h2>
        <p className="text-body text-graphite">
          Selecione este texto para ver o highlight lime aplicado via ::selection.
          O background fica lime (#CCFF00) e o texto fica ink (#0A0A0A).
        </p>
      </section>

      {/* Motion tokens */}
      <section className="mb-20">
        <h2 className="text-h2 font-heading mb-8">Motion tokens</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Object.entries(tokens.motion.duration).map(([name, value]) => (
            <div key={name} className="border rounded-sm p-4">
              <p className="text-body-s font-medium">{name}</p>
              <p className="text-mono font-mono text-smoke">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-mono font-mono text-smoke">
          easing: {tokens.motion.easing.quint}
        </p>
      </section>

      {/* Animacoes */}
      <section className="mb-20">
        <h2 className="text-h2 font-heading mb-8">Animacoes CSS</h2>
        <div className="flex flex-wrap gap-6">
          <div className="animate-fade-in border rounded-sm p-6">
            <p className="text-body-s">fade-in</p>
          </div>
          <div className="animate-slide-up border rounded-sm p-6">
            <p className="text-body-s">slide-up</p>
          </div>
          <div className="animate-scale-in border rounded-sm p-6">
            <p className="text-body-s">scale-in</p>
          </div>
          <div className="flex items-center gap-2 border rounded-sm p-6">
            <span className="inline-block h-3 w-3 rounded-full bg-lime animate-pulse-lime" />
            <p className="text-body-s">pulse-lime</p>
          </div>
        </div>
      </section>

      {/* Spacing */}
      <section className="mb-20">
        <h2 className="text-h2 font-heading mb-8">Espacamento (base 8px)</h2>
        <div className="flex flex-wrap items-end gap-3">
          {tokens.spacing.scale.map((px) => (
            <div key={px} className="flex flex-col items-center gap-1">
              <div
                className="bg-lime"
                style={{ width: Math.min(px, 64), height: Math.min(px, 64) }}
              />
              <p className="text-mono-meta font-mono text-smoke">{px}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
