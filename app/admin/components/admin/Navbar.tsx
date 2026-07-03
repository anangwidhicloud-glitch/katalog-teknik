'use client'
import { Menu, Bell, User } from 'lucide-react'

export default function Navbar({ onToggle }: { onToggle: () => void }) {
  return (
    <header className="h-20 bg-[#0a0a0f]/80 border-b border-white/5 flex items-center justify-between px-8">
      <button onClick={onToggle} className="text-gray-400 hover:text-white">
        <Menu className="w-6 h-6" />
      </button>
      <div className="flex items-center gap-4">
        <Bell className="w-5 h-5" />
        <User className="w-5 h-5" />
      </div>
    </header>
  )
}