'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    // Tidak perlu Header, Background, atau ShootingStar di sini, 
    // semuanya sudah ditangani secara otomatis oleh layout.tsx
    <div className="max-w-7xl mx-auto px-8">
      
      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-purple-400 font-bold tracking-widest uppercase text-sm mb-6">Tentang Kami</p>
          <h1 className="text-[12vw] md:text-[8vw] font-black tracking-tighter uppercase leading-[0.8] mb-12">
            Dedikasi <br /> Pada Presisi
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl font-light leading-relaxed">
            Kami adalah mitra teknis yang berfokus pada solusi industrial, memastikan setiap aset dan sistem operasional Anda bekerja dengan standar performa tertinggi.
          </p>
        </motion.div>
      </section>

      {/* Nilai Utama */}
      <section className="py-20">
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { icon: "🏆", title: "Standar Tinggi", desc: "Kami tidak hanya menyelesaikan pekerjaan—kami memastikan setiap hasil pengerjaan melampaui standar kualitas industri." },
            { icon: "🤝", title: "Kolaborasi", desc: "Kami bekerja berdampingan dengan tim Anda, mengutamakan transparansi dan komunikasi yang solutif." },
            { icon: "🔍", title: "Presisi & Inovasi", desc: "Didorong oleh rasa ingin tahu teknis, kami selalu mencari metode perbaikan dan instalasi yang paling efisien." }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, type: "spring", stiffness: 100 }}
              className="group p-8 border border-white/5 rounded-3xl hover:border-purple-500/50 transition-all duration-500 bg-[#141414]"
            >
              <div className="text-5xl mb-8">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 text-center">
        <div className="max-w-4xl mx-auto p-16 rounded-[3rem] bg-white/[0.03] border border-white/5">
          <h2 className="text-4xl font-bold mb-8">Siap bermitra dengan kami?</h2>
          <button className="bg-purple-600 hover:bg-purple-500 px-12 py-5 rounded-full font-bold transition-all">
            Hubungi Konsultan Kami
          </button>
        </div>
      </section>
    </div>
  );
}