import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';
export const alt = 'AN. Eventos';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const EVENTS: Record<string, { title: string; role: string }> = {
  'summit-sicredi-2026': { title: 'Summit de Inovacao Sicredi Central Centro-Norte', role: 'PALESTRANTE' },
  'embedded-credit-cubo-itau': { title: 'Painel Embedded Credit no Cubo Itau', role: 'PAINELISTA' },
  'inclusao-produtiva-segundo-voo': { title: 'Inclusao Produtiva Segundo Voo', role: 'MEDIADOR' },
};

export default function OGImage({ params }: { params: { slug: string } }) {
  const event = EVENTS[params.slug];
  const title = event?.title ?? 'Evento';
  const role = event?.role ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          width: '100%',
          height: '100%',
          backgroundColor: '#F5F4EF',
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div
            style={{
              fontSize: 20,
              color: '#8A8A8A',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
            }}
          >
            AN. EVENTOS
          </div>
          {role && (
            <div
              style={{
                fontSize: 16,
                color: '#CCFF00',
                fontWeight: 600,
                letterSpacing: '0.08em',
                backgroundColor: '#0A0A0A',
                padding: '4px 12px',
              }}
            >
              {role}
            </div>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 52,
            color: '#0A0A0A',
            fontWeight: 700,
            marginTop: 24,
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 40,
            width: 48,
            height: 3,
            backgroundColor: '#CCFF00',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
