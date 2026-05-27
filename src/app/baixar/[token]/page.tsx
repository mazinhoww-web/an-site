import Link from 'next/link';
import { Hairline } from '@/components/brand/Hairline';

export default function DownloadPage() {
  return (
    <main className="mx-auto max-w-container px-6 py-24 md:px-12 lg:px-16">
      <h1 className="font-heading text-h2">Download</h1>
      <p className="mt-4 text-body text-graphite">
        O download agora eh feito diretamente na pagina da skill.
        Clique no botao abaixo para ver as skills disponiveis.
      </p>
      <Hairline className="my-8" />
      <Link
        href="/skills"
        className="inline-flex items-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime"
      >
        VER SKILLS
      </Link>
    </main>
  );
}
