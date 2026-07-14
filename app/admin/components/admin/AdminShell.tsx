'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AdminShell({
  children,
  isSuperAdmin,
}: Readonly<{
  children: React.ReactNode;
  isSuperAdmin: boolean;
}>) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="admin-shell min-h-screen overflow-x-hidden bg-[#07101d] text-slate-100">
      <div aria-hidden="true" className="admin-ambient admin-ambient-one" />
      <div aria-hidden="true" className="admin-ambient admin-ambient-two" />
      <div aria-hidden="true" className="admin-grid-pattern" />

      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        isSuperAdmin={isSuperAdmin}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div
        className={`relative z-10 min-h-screen transition-[padding] duration-300 ease-out ${
          isCollapsed ? 'lg:pl-[92px]' : 'lg:pl-[280px]'
        }`}
      >
        <Navbar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((current) => !current)}
          onOpenMobile={() => setIsMobileOpen(true)}
        />

        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-[1600px] px-4 pb-10 pt-5 sm:px-6 sm:pb-12 sm:pt-7 lg:px-8"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
