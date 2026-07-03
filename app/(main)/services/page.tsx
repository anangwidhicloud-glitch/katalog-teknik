'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Shield, Clock, Wrench } from 'lucide-react';

const services = [
  { 
    title: "Layanan Konsultasi", 
    desc: "Tim ahli kami siap memberikan rekomendasi teknis yang efisien untuk kebutuhan operasional Anda.",
    icon: <Users className="w-8 h-8" />
  },
  { 
    title: "Instalasi & Setup", 
    desc: "Pemasangan unit profesional dengan pengujian ketat demi keamanan dan performa maksimal.",
    icon: <Shield className="w-8 h-8" />
  },
  { 
    title: "Perawatan Rutin", 
    desc: "Jadwal maintenance terjadwal untuk menjaga aset Anda tetap optimal dan minim hambatan.",
    icon: <Clock className="w-8 h-8" />
  },
  { 
    title: "Perbaikan Cepat", 
    desc: "Respon tanggap untuk setiap kendala teknis demi menjaga produktivitas kerja Anda.",
    icon: <Wrench className="w-8 h-8" />
  }
];

export default function ServicesPage() {
  return (
    // Tidak perlu lagi relative z-10 atau bg di sini, karena sudah diurus oleh layout.tsx
    <div className="max-w-7xl mx-auto px-6 py-10">
      
      {/* Hero Section */}
      <section className="min-h-[60vh] flex items-center justify-center pt-20">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-purple-400 font-bold tracking-widest uppercase text-sm mb-4">LAYANAN UNGGULAN</p>
            <h1 className="text-6xl md:text-7xl font-black leading-tight mb-6">
              Solusi Teknis Terintegrasi
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Kami memastikan setiap unit yang Anda miliki didukung oleh layanan purna jual yang profesional, transparan, dan terukur.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -12 }}
              className="group p-9 bg-[#141414] border border-white/5 hover:border-purple-500/50 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              <div className="mb-8 text-purple-400 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors">
                {service.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed">
                {service.desc}
              </p>

              <div className="mt-8 flex items-center gap-2 text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all">
                Pelajari Lebih Lanjut 
                <ArrowRight className="group-hover:translate-x-1 transition" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-28">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl font-bold mb-6">Siap Mendukung Operasional Anda?</h2>
          <p className="text-gray-400 text-lg mb-10">
            Hubungi tim kami untuk konsultasi gratis dan penawaran terbaik.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-purple-600 hover:bg-purple-500 px-10 py-5 rounded-full text-lg font-semibold transition flex items-center justify-center gap-3">
              Hubungi Sekarang <ArrowRight />
            </button>
            <button className="border border-white/30 hover:bg-white/5 px-10 py-5 rounded-full text-lg transition">
              Lihat Semua Layanan
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}