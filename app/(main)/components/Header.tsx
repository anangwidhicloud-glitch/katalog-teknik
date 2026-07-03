'use client';

import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { href: '/', label: 'Beranda' },
  { href: '/products', label: 'Produk' },
  { href: '/services', label: 'Layanan' },
  { href: '/gallery', label: 'Galeri' },
  { href: '/about', label: 'Tentang' },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.35 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <>
      <motion.div className="site-scroll-progress" style={{ scaleX: progress }} />
      <header className="site-header">
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={`site-header-inner ${isScrolled ? 'is-scrolled' : ''}`}
        >
          <Link href="/" className="brand-mark" aria-label="MP Katalog Teknik">
            <span className="brand-symbol">
              <span className="brand-electric-line" />
              MP
            </span>
            <span className="brand-copy">
              <strong>Katalog Teknik</strong>
              <small>Professional Equipment</small>
            </span>
          </Link>

          <nav className="site-nav" aria-label="Navigasi utama">
            {navItems.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} className={`site-nav-link ${active ? 'is-active' : ''}`}>
                  {item.label}
                  {active && <motion.span layoutId="nav-active" className="site-nav-active" />}
                </Link>
              );
            })}
          </nav>

          <div className="site-header-actions">
            <ThemeToggle compact />
            <Link href="/contact" className="site-button site-button-primary site-header-cta">
              Kontak
              <ArrowUpRight size={16} />
            </Link>
            <button
              type="button"
              className="mobile-menu-button"
              onClick={() => setMenuOpen((current) => !current)}
              aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </motion.div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.nav
              initial={{ y: -24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28 }}
              className="mobile-menu-panel"
            >
              <div className="mobile-menu-heading">Navigasi</div>
              {navItems.map((item, index) => {
                const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Link href={item.href} onClick={() => setMenuOpen(false)} className={`mobile-menu-link ${active ? 'is-active' : ''}`}>
                      <span>0{index + 1}</span>
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="site-button site-button-primary mt-4 w-full justify-center">
                Hubungi Kami <ArrowUpRight size={17} />
              </Link>
              <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4">
                <span className="text-sm text-[var(--text-muted)]">Tampilan</span>
                <ThemeToggle />
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
