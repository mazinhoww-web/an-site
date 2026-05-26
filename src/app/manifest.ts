import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AN. Aurimar Nogueira',
    short_name: 'AN.',
    description: 'Onde estratégia vira sistema.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F4EF',
    theme_color: '#0A0A0A',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
