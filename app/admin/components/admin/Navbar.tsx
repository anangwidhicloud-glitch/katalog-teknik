'use client';

import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Menu,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const pageDetails: Record<string, { title: string; description: string }> = {
  '/admin': {
    title: 'Admin Panel',
    description: 'Pusat pengelolaan website',
  },
  '/admin/dashboard': {
    title: 'Dashboard',
    description: 'Pantau ringkasan katalog dan konten',
  },
  '/admin/products': {
    title: 'Katalog Produk',
    description: 'Kelola daftar produk dari Google Sheets',
  },
  '/admin/products/add': {
    title: 'Tambah Produk',
    description: 'Siapkan informasi produk baru',
  },
  '/admin/analytics': {
    title: 'Analytics',
    description: 'Grafik, komposisi, dan insight katalog',
  },
  '/admin/settings': {
    title: 'Konten Website',
    description: 'Ubah tulisan yang tampil pada halaman publik',
  },
  '/admin/social-media': {
    title: 'Sosial Media',
    description: 'Kelola tautan sosial media pada footer',
  },
  '/admin/accounts': {
    title: 'Keamanan Akun',
    description: 'Informasi sesi dan konfigurasi akses admin',
  },
};

function getPageDetails(pathname: string) {
  const exact = pageDetails[pathname];
  if (exact) return exact;

  const matchedKey = Object.keys(pageDetails)
    .sort((a, b) => b.length - a.length)
    .find((key) => pathname.startsWith(`${key}/`));

  return matchedKey ? pageDetails[matchedKey] : pageDetails['/admin'];
}

export default function Navbar({
  isCollapsed,
  onToggleCollapse,
  onOpenMobile,
}: {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobile: () => void;
}) {
  const pathname = usePathname();
  const details = getPageDetails(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#07101d]/78 backdrop-blur-2xl">
      <div className="flex min-h-[84px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobile}
            aria-label="Buka menu"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.045] text-slate-300 transition hover:border-white/15 hover:bg-white/[0.08] hover:text-white lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
            className="hidden h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-sky-300/20 hover:bg-sky-400/10 hover:text-sky-100 lg:grid"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
              {details.title}
            </h1>
            <p className="mt-0.5 hidden truncate text-xs text-slate-500 sm:block">
              {details.description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="hidden h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 text-xs font-semibold text-slate-300 transition hover:border-sky-300/20 hover:bg-sky-400/10 hover:text-sky-100 sm:inline-flex"
          >
            <ExternalLink className="h-4 w-4" />
            Lihat Website
          </Link>

          <div className="hidden items-center gap-2 rounded-xl border border-emerald-300/10 bg-emerald-400/[0.06] px-3 py-2 text-[11px] font-medium text-emerald-200 md:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Sistem aktif
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.035] p-1.5 pr-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-[0_8px_20px_rgba(14,165,233,0.24)]">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span className="hidden sm:block">
              <span className="block text-xs font-semibold text-slate-200">Administrator</span>
              <span className="block text-[10px] text-slate-600">Akses penuh</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
