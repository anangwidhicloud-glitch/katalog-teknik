'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 w-full z-[100] transition-all duration-300 flex justify-center"
    >
      <div
        className={`w-full flex justify-between items-center px-6 py-5 transition-all duration-300 ${
          isScrolled
            ? 'max-w-5xl mx-auto rounded-full bg-[#1a1a1a]/95 backdrop-blur-lg mt-4 border border-white/10 shadow-2xl'
            : 'max-w-full bg-transparent border-none'
        }`}
      >
        {/* Logo */}
        <div className="text-white font-black text-2xl tracking-tighter">MP</div>

        {/* Menu */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-200">
          <Link href="/" className="hover:text-purple-400 transition">
            Beranda
          </Link>
          <Link href="/products" className="hover:text-purple-400 transition">
            Produk
          </Link>
          <Link href="/services" className="hover:text-purple-400 transition">
            Layanan
          </Link>
          <Link href="/gallery" className="hover:text-purple-400 transition">
            Galeri
          </Link>
          <Link href="/about" className="hover:text-purple-400 transition">
            Tentang
          </Link>
          <Link href="/admin" className="hover:text-purple-400 transition">
            Admin
          </Link>
        </nav>

        {/* Button */}
        <button
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all"
          onClick={() => (window.location.href = '/contact')}
        >
          Kontak Kami
        </button>
      </div>
    </motion.header>
  );
}

