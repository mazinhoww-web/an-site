import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';
export const alt = 'AN. Skills';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage({ params }: { params: { slug: string } }) {
  const name = params.slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

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
            AN. SKILLS
          </div>
          <div
            style={{
              fontSize: 16,
              color: '#0A0A0A',
              fontWeight: 600,
              letterSpacing: '0.08em',
              backgroundColor: '#CCFF00',
              padding: '4px 12px',
            }}
          >
            FREE
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 56,
            color: '#0A0A0A',
            fontWeight: 700,
            marginTop: 24,
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          {name}
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
