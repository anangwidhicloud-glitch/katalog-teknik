'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/');
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      aria-label="Keluar dari halaman admin dan kembali ke beranda"
      className="fixed right-4 top-4 z-[100] inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 shadow-lg backdrop-blur-md transition hover:border-red-400/50 hover:bg-red-500/20 hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 md:right-6 md:top-6"
    >
      <LogOut size={18} aria-hidden="true" />
      <span>Keluar</span>
    </button>
  );
}
