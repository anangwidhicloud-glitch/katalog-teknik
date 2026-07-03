'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';

// 1. KOMPONEN BINTANG (Gunakan ini di setiap halaman)
const ShootingStar = () => {
  // Generate stable random values only once.
  const [seed] = useState(() => {
    const left = Math.random() * 100;
    const top = Math.random() * 50;
    const repeatDelay = Math.random() * 5;
    const animationDuration = `${Math.random() * 2 + 2}s`;
    return { left, top, repeatDelay, animationDuration };
  });

  return (
    <motion.div
      className="absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_10px_#fff]"
      initial={{ opacity: 0, x: -50, y: -50 }}
      animate={{ opacity: [0, 1, 0], x: 400, y: 400 }}
      transition={{ repeat: Infinity, repeatDelay: seed.repeatDelay }}
      style={{
        left: `${seed.left}%`,
        top: `${seed.top}%`,
        animationDuration: seed.animationDuration,
      }}
    />
  );
};


export default function BasePage({ title, children }: { title: string, children: React.ReactNode }) {
  // Avoid setState-in-effect lint errors: render directly (component is client).
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="bg-[#0a0a0f] text-white min-h-screen relative overflow-hidden">
      <Header />

      {/* Background Universal */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#4c1d95_0%,#0a0a0f_70%)]" />
        {mounted && Array.from({ length: 8 }).map((_, i) => <ShootingStar key={i} />)}
      </div>

      {/* Konten Halaman */}
      <div className="relative z-10">
        {children}
      </div>
    </main>
  );
}