'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

type GalleryCategory = 'All' | 'Wheel' | 'Tire' | 'Lift' | 'Tools' | 'Accessories';

type GalleryItem = {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, 'All'>;
  location: string;
};

const categories: { key: GalleryCategory; label: string }[] = [
  { key: 'All', label: 'All' },
  { key: 'Wheel', label: 'Wheel' },
  { key: 'Tire', label: 'Tire' },
  { key: 'Lift', label: 'Lift' },
  { key: 'Tools', label: 'Hand Tools' },
  { key: 'Accessories', label: 'Accessories' },
];

const items: GalleryItem[] = [
  { id: 'g1', title: 'Imaging Wheel Alignment', category: 'Wheel', location: 'Workshop 01' },
  { id: 'g2', title: 'Wheel Balancer Pro', category: 'Wheel', location: 'Workshop 02' },
  { id: 'g3', title: 'Tire Changer Advanced', category: 'Tire', location: 'Workshop 03' },
  { id: 'g4', title: 'Brake Lathe Setup', category: 'Accessories', location: 'Service Bay A' },
  { id: 'g5', title: '2-Post Lift E-Locking', category: 'Lift', location: 'Service Bay B' },
  { id: 'g6', title: '4 Ton Clear-Floor Lift', category: 'Lift', location: 'Service Bay C' },
  { id: 'g7', title: 'EV Battery Lifter', category: 'Accessories', location: 'EV Zone' },
  { id: 'g8', title: 'Industrial Hand Tools', category: 'Tools', location: 'Tool Room' },
  { id: 'g9', title: 'Brake Fluid Changer', category: 'Accessories', location: 'Service Bay D' },
  { id: 'g10', title: 'Shop Press 20 Ton', category: 'Tools', location: 'Workshop 04' },
];

function useScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('opacity-100', 'translate-y-0'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.classList.add('opacity-100', 'translate-y-0');
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.15 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function GalleryCard({ item, index }: { item: GalleryItem; index: number }) {
  const hue = (index * 37) % 360;

  return (
    <motion.article
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#141414] opacity-0 translate-y-5 transition-all duration-700"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.7, delay: Math.min(index * 0.03, 0.25) }}
      data-reveal
    >
      <div className="relative h-56 sm:h-64">
        <div
          className="absolute inset-0"
          style={{
            background:
              `radial-gradient(circle at 20% 10%, hsla(${hue}, 90%, 70%, 0.28), transparent 35%),` +
              `radial-gradient(circle at 80% 50%, hsla(${(hue + 40) % 360}, 90%, 60%, 0.22), transparent 45%),` +
              `linear-gradient(135deg, rgba(147,51,234,0.18), rgba(0,0,0,0.55))`,
          }}
        />

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-purple-500/20 blur-2xl" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-fuchsia-500/15 blur-2xl" />
        </div>

        <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] uppercase tracking-widest border border-white/10 bg-black/30 backdrop-blur-md text-white/80">
          {item.category}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-bold leading-tight text-white group-hover:text-purple-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{item.location}</p>
            </div>

            <div className="shrink-0 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-3">
              <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_18px_rgba(167, 139, 250, 0.9)]" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">Tap for detail</p>
          <div className="text-purple-400 text-sm font-bold opacity-90 group-hover:opacity-100 transition-opacity">
            View →
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function GalleryPage() {
  useScrollReveal();

  const [active, setActive] = useState<GalleryCategory>('All');

  const filtered = useMemo(() => {
    if (active === 'All') return items;
    return items.filter((x) => x.category === active);
  }, [active]);

  return (
    <main className="min-h-screen pt-32 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <section className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-[#141414]/40 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_18px_rgba(167, 139, 250, 0.9)]" />
              <p className="text-[11px] uppercase tracking-widest text-gray-300 font-bold">GALERI WORKSHOP & SETUP</p>
            </div>
            <h1 className="mt-6 text-4xl sm:text-6xl font-black tracking-tighter">Projects yang Kami Kerjakan</h1>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
              Tampilan modern dengan animasi halus. Setiap kartu menampilkan kategori dan lokasi.
            </p>
          </motion.div>

          <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
        </section>

        {/* Filter */}
        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((c) => {
              const isActive = c.key === active;
              return (
                <button
                  key={c.key}
                  onClick={() => setActive(c.key)}
                  className={
                    'px-4 py-2 rounded-full text-sm border transition-all ' +
                    (isActive
                      ? 'bg-purple-600 border-purple-500/40 text-white shadow-[0_0_22px_rgba(147,51,234,0.35)]'
                      : 'bg-[#141414]/30 border-white/10 text-gray-200 hover:bg-[#141414]/60 hover:border-purple-500/30')
                  }
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Grid */}
        <section className="mt-12">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-400 py-16">Tidak ada data untuk kategori ini.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filtered.map((item, idx) => (
                <GalleryCard key={item.id} item={item} index={idx} />
              ))}
            </div>
          )}
        </section>

        {/* Stats strip */}
        <section className="mt-16">
          <div className="rounded-[2.5rem] border border-white/10 bg-[#141414]/40 backdrop-blur-md p-6 sm:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center" data-reveal>
                <div className="text-4xl font-black text-purple-400">10+</div>
                <div className="text-gray-400 mt-2">Setup/Project</div>
              </div>
              <div className="text-center" data-reveal>
                <div className="text-4xl font-black">4</div>
                <div className="text-gray-400 mt-2">Kategori Utama</div>
              </div>
              <div className="text-center" data-reveal>
                <div className="text-4xl font-black">Real</div>
                <div className="text-gray-400 mt-2">Workshop-ready</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

