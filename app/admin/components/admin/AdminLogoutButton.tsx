'use client';

import { LoaderCircle, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
    } finally {
      router.replace('/');
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      title={compact ? 'Keluar' : undefined}
      aria-label="Keluar dari admin panel"
      className={`flex min-h-11 w-full items-center rounded-xl border border-red-400/10 bg-red-400/[0.045] text-red-300 transition hover:border-red-400/20 hover:bg-red-400/[0.09] hover:text-red-200 focus:outline-none focus:ring-4 focus:ring-red-400/10 disabled:cursor-not-allowed disabled:opacity-60 ${
        compact ? 'justify-center px-3' : 'gap-3 px-3.5'
      }`}
    >
      {isLoggingOut ? (
        <LoaderCircle className="h-[18px] w-[18px] shrink-0 animate-spin" />
      ) : (
        <LogOut className="h-[18px] w-[18px] shrink-0" />
      )}
      {!compact && (
        <span className="text-sm font-semibold">{isLoggingOut ? 'Keluar...' : 'Keluar'}</span>
      )}
    </button>
  );
}
