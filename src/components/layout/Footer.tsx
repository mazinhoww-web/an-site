import type { ComponentType, SVGProps } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Mark } from '@/components/brand/Mark';
import { Label } from '@/components/brand/Label';
import { Hairline } from '@/components/brand/Hairline';

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return <Mail size={16} strokeWidth={1.5} {...props} />;
}

type ConnectLink = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  ariaLabel: string;
};

const CONNECT_LINKS: ConnectLink[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mazinho/',
    icon: LinkedinIcon,
    ariaLabel: 'LinkedIn de Aurimar Nogueira',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/mazinhoww-web',
    icon: GithubIcon,
    ariaLabel: 'Abrir GitHub em nova aba',
  },
  {
    label: 'Email',
    href: 'mailto:contato@aurimarnogueira.com.br',
    icon: MailIcon,
    ariaLabel: 'Enviar email',
  },
];

const SITE_LINKS = [
  { label: 'Sobre', href: '/sobre' },
  { label: 'Palestras', href: '/palestras' },
  { label: 'Eventos', href: '/eventos' },
  { label: 'Skills', href: '/skills' },
  { label: 'Contato', href: '/contato' },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bone">
      <Hairline />

      <div className="mx-auto max-w-container px-6 py-16 md:px-12 md:py-24 lg:px-16">
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {/* Conectar */}
          <div className="space-y-4">
            <Label withTab>CONECTAR</Label>
            <ul className="space-y-3">
              {CONNECT_LINKS.map((link) => {
                const Icon = link.icon;
                const isExternal = link.href.startsWith('http');
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      {...(isExternal && {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      })}
                      aria-label={link.ariaLabel}
                      className="flex items-center gap-3 text-body-s text-graphite transition-colors duration-150 hover:text-ink"
                    >
                      <Icon />
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Navegar */}
          <div className="space-y-4">
            <Label withTab>NAVEGAR</Label>
            <ul className="space-y-3">
              {SITE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-s text-graphite transition-colors duration-150 hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Localidade */}
          <div className="space-y-4">
            <Label withTab>LOCALIDADE</Label>
            <p className="text-body-s text-graphite">
              Cuiabá, MT, Brasil
            </p>
            <Label tone="default">
              LOYALTY {'×'} FINTECH {'×'} INNOVATION
            </Label>
          </div>
        </div>

        {/* Bottom bar */}
        <Hairline className="mb-8 mt-12" />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Mark size="sm" />
          <p className="text-body-s text-smoke">
            {'©'} {year} Aurimar Nogueira. Cuiabá, MT. Onde estratégia vira sistema.
          </p>
        </div>
      </div>
    </footer>
  );
}
