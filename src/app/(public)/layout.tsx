import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { SearchModal } from '@/components/SearchModal';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <SearchModal />
      <main className="pt-14 md:pt-16">{children}</main>
      <Footer />
    </>
  );
}
