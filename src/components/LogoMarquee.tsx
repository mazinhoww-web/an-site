import Image from 'next/image';

const logos = [
  { src: '/logos/parceiros/latam.svg', alt: 'LATAM Airlines' },
  { src: '/logos/parceiros/99.svg', alt: '99' },
  { src: '/logos/parceiros/cerc.svg', alt: 'CERC' },
  { src: '/logos/parceiros/crdc.svg', alt: 'CRDC' },
  { src: '/logos/parceiros/juspay.svg', alt: 'JUSPAY' },
  { src: '/logos/parceiros/sicredi.svg', alt: 'Sicredi' },
  { src: '/logos/parceiros/gyra-plus.svg', alt: 'GYRA+' },
  { src: '/logos/parceiros/impact-hub.svg', alt: 'Impact Hub' },
] as const;

export function LogoMarquee() {
  const items = [...logos, ...logos];

  return (
    <section
      className="logo-marquee"
      aria-label="Empresas e marcas com as quais Aurimar atuou ou apresentou"
    >
      <div className="logo-marquee__caption">
        <span>PARCEIROS</span>
        <span aria-hidden="true">{'·'}</span>
        <span>EVENTOS</span>
        <span aria-hidden="true">{'·'}</span>
        <span>PALESTRAS</span>
      </div>

      <div className="logo-marquee__viewport">
        <ul className="logo-marquee__track">
          {items.map((logo, i) => (
            <li
              key={`${logo.alt}-${i}`}
              className="logo-marquee__item"
              aria-hidden={i >= logos.length || undefined}
            >
              <Image
                src={logo.src}
                alt={i < logos.length ? logo.alt : ''}
                width={120}
                height={40}
                unoptimized
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
