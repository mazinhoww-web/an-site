'use client';

import { useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  motion,
  useScroll,
  useSpring,
  useReducedMotion,
  AnimatePresence,
} from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Mark } from '@/components/brand/Mark';
import { ThemeToggle } from '@/components/ThemeToggle';

const NAV_ITEMS = [
  { label: 'Sobre', href: '/sobre' },
  { label: 'Trajetória', href: '/trajetoria' },
  { label: 'Eventos', href: '/eventos' },
  { label: 'Skills', href: '/skills' },
  { label: 'Contato', href: '/contato' },
] as const;

export function Nav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) closeMenu();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeMenu]);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-[2px] bg-lime"
        style={{ scaleX, transformOrigin: 'left' }}
      />

      {/* Nav bar */}
      <nav
        aria-label="Navegação principal"
        className="fixed left-0 right-0 top-0 z-40 border-b border-hairline bg-bone/95 pt-[2px] backdrop-blur-sm"
      >
        <div className="mx-auto flex h-14 max-w-container items-center justify-between px-6 md:h-16 md:px-12 lg:px-16">
          <Mark size="sm" asLink />

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative pb-1 font-sans text-body-s transition-colors duration-150',
                    active ? 'text-ink' : 'text-graphite hover:text-ink',
                  )}
                >
                  {item.label}
                  {/* Lime square indicator (active) */}
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 bg-lime" />
                  )}
                  {/* Hover underline */}
                  {!active && (
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-lime transition-all duration-200 group-hover:w-full" />
                  )}
                </Link>
              );
            })}
            <ThemeToggle />
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden"
            onClick={() => setIsOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={isOpen}
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-bone"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: '100%' }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: '100%' }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {/* Mobile header */}
            <div className="flex h-14 items-center justify-between px-6">
              <Mark size="sm" asLink />
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Fechar menu"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Mobile links */}
            <div className="flex flex-1 flex-col items-center justify-center gap-8">
              <ThemeToggle />
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative font-heading text-h2',
                      active ? 'text-ink' : 'text-graphite',
                    )}
                  >
                    <span className="flex items-center gap-3">
                      {active && (
                        <span className="h-1 w-1 bg-lime" />
                      )}
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
