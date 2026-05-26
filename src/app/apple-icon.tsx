import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: '#F5F4EF',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 800,
          color: '#0A0A0A',
          letterSpacing: '-0.02em',
        }}
      >
        AN<span style={{ color: '#CCFF00' }}>.</span>
      </div>
    ),
    { ...size },
  );
}
