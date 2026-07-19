'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Boxes,
  ExternalLink,
  Handshake,
  Image as ImageIcon,
  LayoutDashboard,
  PanelTop,
  Share2,
  ShieldCheck,
  Wrench,
  X,
  DatabaseBackup,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentType } from 'react';

import AdminLogoutButton from './AdminLogoutButton';

type SidebarProps = {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  isSuperAdmin: boolean;
  onCloseMobile: () => void;
};

type NavigationItem = {
  href: string;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string; size?: number }>;
  superAdminOnly?: boolean;
};

const navigation: NavigationItem[] = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    description: 'Ringkasan aktivitas',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/products',
    label: 'Katalog Produk',
    description: 'Kelola data produk',
    icon: Boxes,
  },
  {
    href: '/admin/gallery',
    label: 'Galeri',
    description: 'Kelola foto galeri',
    icon: ImageIcon,
  },
  {
    href: '/admin/partners',
    label: 'Logo Mitra',
    description: 'Kelola logo partner',
    icon: Handshake,
  },
  {
    href: '/admin/analytics',
    label: 'Analytics',
    description: 'Grafik dan insight katalog',
    icon: BarChart3,
  },
  {
    href: '/admin/settings',
    label: 'Konten Website',
    description: 'Atur tulisan halaman',
    icon: PanelTop,
  },
  {
    href: '/admin/social-media',
    label: 'Sosial Media',
    description: 'Tautan pada footer',
    icon: Share2,
  },
  {
    href: '/admin/backup',
    label: 'Backup & Restore',
    description: 'Cadangkan data website',
    icon: DatabaseBackup,
  },
  {
    href: '/admin/accounts',
    label: 'Keamanan Akun',
    description: 'Kelola akun admin',
    icon: ShieldCheck,
    superAdminOnly: true,
  },
];

function isItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarContent({
  isCollapsed,
  isSuperAdmin,
  onNavigate,
}: {
  isCollapsed: boolean;
  isSuperAdmin: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const visibleNavigation = navigation.filter((item) => !item.superAdminOnly || isSuperAdmin);

  return (
    <div className="flex h-full flex-col">
      <div
        className={`flex h-[84px] items-center border-b border-white/[0.07] ${
          isCollapsed ? 'justify-center px-3' : 'px-5'
        }`}
      >
        <Link
          href="/admin/dashboard"
          onClick={onNavigate}
          className="group flex min-w-0 items-center gap-3"
          aria-label="Dashboard Katalog Teknik"
        >
          <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl border border-sky-300/20 bg-gradient-to-br from-blue-500/25 to-cyan-400/10 text-sky-100 shadow-[0_10px_35px_rgba(14,165,233,0.13)]">
            <span className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
            <Wrench className="relative h-5 w-5" />
          </span>

          {!isCollapsed && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold tracking-[0.16em] text-white">
                KATALOG TEKNIK
              </span>
              <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                Administration Center
              </span>
            </span>
          )}
        </Link>
      </div>

      <div
        className={`admin-scrollbar flex-1 overflow-y-auto py-5 ${isCollapsed ? 'px-3' : 'px-4'}`}
      >
        {!isCollapsed && (
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Menu Utama
          </p>
        )}

        <nav className="space-y-1.5" aria-label="Navigasi admin">
          {visibleNavigation.map((item) => {
            const active = isItemActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                title={isCollapsed ? item.label : undefined}
                className={`group relative flex min-h-[54px] items-center rounded-2xl transition-all duration-200 ${
                  isCollapsed ? 'justify-center px-3' : 'gap-3 px-3.5'
                } ${
                  active
                    ? 'bg-gradient-to-r from-blue-500/18 to-cyan-400/[0.08] text-white shadow-[inset_0_0_0_1px_rgba(125,211,252,0.15)]'
                    : 'text-slate-400 hover:bg-white/[0.045] hover:text-slate-100'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="admin-active-nav"
                    className="absolute left-0 h-7 w-1 rounded-r-full bg-gradient-to-b from-blue-400 to-cyan-300 shadow-[0_0_18px_rgba(56,189,248,0.65)]"
                    transition={{
                      type: 'spring',
                      stiffness: 440,
                      damping: 36,
                    }}
                  />
                )}

                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition ${
                    active
                      ? 'bg-sky-400/12 text-sky-200'
                      : 'text-slate-500 group-hover:bg-white/5 group-hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-[19px] w-[19px]" />
                </span>

                {!isCollapsed && (
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{item.label}</span>
                    <span className="mt-0.5 block truncate text-[11px] text-slate-600 group-hover:text-slate-500">
                      {item.description}
                    </span>
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={`border-t border-white/[0.07] py-4 ${isCollapsed ? 'px-3' : 'px-4'}`}>
        <Link
          href="/"
          onClick={onNavigate}
          title={isCollapsed ? 'Lihat Website' : undefined}
          className={`mb-2 flex min-h-11 items-center rounded-xl text-slate-400 transition hover:bg-white/[0.05] hover:text-white ${
            isCollapsed ? 'justify-center px-3' : 'gap-3 px-3.5'
          }`}
        >
          <ExternalLink className="h-[18px] w-[18px] shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Lihat Website</span>}
        </Link>

        <AdminLogoutButton compact={isCollapsed} />
      </div>
    </div>
  );
}

export default function Sidebar({
  isCollapsed,
  isMobileOpen,
  isSuperAdmin,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-white/[0.08] bg-[#08111f]/95 shadow-[20px_0_70px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-[width] duration-300 lg:block ${
          isCollapsed ? 'w-[92px]' : 'w-[280px]'
        }`}
      >
        <SidebarContent isCollapsed={isCollapsed} isSuperAdmin={isSuperAdmin} />
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Tutup menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-40 bg-[#020611]/75 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 w-[286px] border-r border-white/[0.08] bg-[#08111f] shadow-2xl lg:hidden"
            >
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Tutup navigasi"
                className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <SidebarContent
                isCollapsed={false}
                isSuperAdmin={isSuperAdmin}
                onNavigate={onCloseMobile}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
