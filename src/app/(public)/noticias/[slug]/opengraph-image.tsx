import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';
export const alt = 'AN. Noticias';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const NEWS_TITLES: Record<string, string> = {
  'summit-sicredi-2026': 'Painel no Summit de Inovacao Sicredi Central Centro-Norte',
  'embedded-credit-cubo-itau': 'Painel Embedded Credit no Cubo Itau',
};

export default function OGImage({ params }: { params: { slug: string } }) {
  const title = NEWS_TITLES[params.slug] ?? 'Noticia';

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
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            color: '#8A8A8A',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
          }}
        >
          AN. NOTICIAS
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 56,
            color: '#0A0A0A',
            fontWeight: 700,
            marginTop: 24,
            lineHeight: 1.2,
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
