'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Wrench, FileText, Settings, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Kita terima isShow dan setIsShow sebagai props dari layout
export default function Sidebar({ isShow, setIsShow }: { isShow: boolean, setIsShow: (val: boolean) => void }) {
  return (
    <AnimatePresence mode="wait">
      {isShow && (
        <motion.aside
          initial={{ x: -250, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -250, opacity: 0 }}
          className="fixed z-50 h-screen w-64 bg-[#0a0a0f] border-r border-white/10 flex flex-col shadow-2xl"
        >
          <div className="h-20 flex items-center px-6 border-b border-white/5">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              ADMIN PANEL
            </h1>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
  <NavItem href="/admin/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
  {/* Berubah dari Maintenance menjadi Produk */}
  <NavItem href="/admin/products" icon={Wrench}>Katalog Produk</NavItem>
  {/* Anda bisa ganti Laporan PDF dengan Pesan Masuk jika perlu */}
  <NavItem href="/admin/messages" icon={FileText}>Pesan Masuk</NavItem>
  <NavItem href="/admin/settings" icon={Settings}>Pengaturan Teks</NavItem>
</nav>

          <button onClick={() => setIsShow(false)} className="p-4 text-gray-400 hover:text-white flex items-center gap-2 border-t border-white/5">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Tutup Menu</span>
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

function NavItem({ href, icon: Icon, children }: any) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{children}</span>
    </Link>
  )
}