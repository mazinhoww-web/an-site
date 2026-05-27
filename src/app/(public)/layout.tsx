import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { SearchModal } from '@/components/SearchModal';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="absolute left-[-9999px] top-2 z-[100] bg-ink px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone focus:left-2"
      >
        Pular para o conteudo principal
      </a>
      <Nav />
      <SearchModal />
      <main id="main" className="pt-14 md:pt-16">{children}</main>
      <Footer />
    </>
  );
}
