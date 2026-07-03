'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Images, MapPin, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useSheetData } from '../../hooks/useSheetData';
import PageHero from '../components/PageHero';

type GalleryRow = {
  id?: string;
  title?: string;
  category?: string;
  location?: string;
  image_url?: string;
};

const fallbackItems: GalleryRow[] = [
  { id: 'g1', title: 'Imaging Wheel Alignment', category: 'Wheel', location: 'Workshop 01' },
  { id: 'g2', title: 'Wheel Balancer Professional', category: 'Wheel', location: 'Workshop 02' },
  { id: 'g3', title: 'Tire Changer Setup', category: 'Tire', location: 'Workshop 03' },
  { id: 'g4', title: 'Two-Post Lift Installation', category: 'Lift', location: 'Service Bay A' },
  { id: 'g5', title: 'Brake Fluid Service', category: 'Fluid', location: 'Service Bay B' },
  { id: 'g6', title: 'Industrial Hand Tools', category: 'Tools', location: 'Tool Room' },
];

export default function GalleryPage() {
  const { data, error } = useSheetData('Gallery');
  const rows = (data as GalleryRow[]).length > 0 ? (data as GalleryRow[]) : fallbackItems;
  const [category, setCategory] = useState('Semua');

  const categories = useMemo(() => {
    const unique = new Set(rows.map((item) => item.category?.trim()).filter((item): item is string => Boolean(item)));
    return ['Semua', ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [rows]);

  const filtered = category === 'Semua' ? rows : rows.filter((item) => item.category === category);

  return (
    <main>
      <PageHero
        eyebrow="Galeri proyek"
        title={<>Lihat bagaimana solusi kami <span className="gradient-text">bekerja nyata.</span></>}
        description="Dokumentasi produk, instalasi, dan konfigurasi workshop yang menunjukkan detail, skala, dan kualitas implementasi."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="site-chip"><Images size={14} /> {rows.length} dokumentasi</span>
          <span className="site-chip"><Sparkles size={14} /> Workshop-ready</span>
        </div>
      </PageHero>

      <section className="section-shell pb-28">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center" data-aos="fade-up">
          <div className="filter-list">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`filter-button ${category === item ? 'is-active' : ''}`}
              >
                {item}
              </button>
            ))}
          </div>
          <span className="text-xs font-bold uppercase tracking-[.12em] text-[var(--text-muted)]">{filtered.length} item</span>
        </div>

        {error && data.length === 0 && (
          <p className="mt-5 text-sm text-[var(--text-muted)]">Galeri online belum dapat dimuat. Dokumentasi contoh ditampilkan.</p>
        )}

        <motion.div layout className="gallery-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
              <motion.article
                layout
                key={`${item.id ?? index}-${item.title ?? 'gallery'}`}
                initial={{ opacity: 0, scale: .94, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: .94 }}
                transition={{ duration: .38, ease: [0.22, 1, 0.36, 1] }}
                className="site-card gallery-card"
                whileHover={{ y: -6 }}
              >
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title || 'Dokumentasi workshop'}
                    fill
                    sizes="(max-width: 760px) 100vw, (max-width: 1040px) 50vw, 66vw"
                    className="gallery-image"
                  />
                ) : (
                  <div className="gallery-gradient-placeholder" />
                )}

                <div className="gallery-card-overlay">
                  <div className="flex items-start justify-between gap-3">
                    <span className="site-chip border-white/20 bg-black/20 text-white/80">{item.category || 'Workshop'}</span>
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-black/20 text-white backdrop-blur-md">
                      <ArrowUpRight size={17} />
                    </span>
                  </div>
                  <div>
                    <h2 className="gallery-card-title">{item.title || 'Workshop Project'}</h2>
                    <p className="gallery-card-location"><MapPin size={13} className="mr-1 inline" /> {item.location || 'Workshop Area'}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="stats-grid mt-14">
          {[
            { value: `${rows.length}+`, label: 'Dokumentasi' },
            { value: `${Math.max(categories.length - 1, 1)}`, label: 'Kategori proyek' },
            { value: 'Real', label: 'Workshop setup' },
            { value: 'Ready', label: 'Operational use' },
          ].map((item, index) => (
            <div key={item.label} className="site-card stat-card" data-aos="zoom-in" data-aos-delay={String(index * 70)}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
