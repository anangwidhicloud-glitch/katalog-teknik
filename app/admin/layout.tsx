'use client'
import { useState } from 'react'
import Sidebar from './components/admin/Sidebar'
import Navbar from './components/admin/Navbar'

import AdminLogoutButton from './components/admin/AdminLogoutButton';
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isShow, setIsShow] = useState(true)

  return (
    // Tambahkan 'flex' agar sidebar dan konten utama berdampingan
    <div className="flex min-h-screen bg-[#0a0a0f] text-white">
      <Sidebar isShow={isShow} setIsShow={setIsShow} />
      
      {/* Container utama: Beri padding agar konten tidak menabrak sidebar */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isShow ? 'pl-64' : 'pl-0'}`}>
        <Navbar onToggle={() => setIsShow(!isShow)} />
        <main className="p-8">
          <AdminLogoutButton />
          {children}
        </main>
      </div>
    </div>
  )
}