'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Crosshair,
  Handshake,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';

const values = [
  {
    icon: Crosshair,
    title: 'Presisi',
    description: 'Kami memperhatikan detail teknis agar rekomendasi dan implementasi sesuai kebutuhan nyata.',
  },
  {
    icon: Handshake,
    title: 'Kolaborasi',
    description: 'Komunikasi terbuka membantu kami membangun solusi bersama, bukan sekadar menawarkan produk.',
  },
  {
    icon: Lightbulb,
    title: 'Perbaikan Berkelanjutan',
    description: 'Kami terus mengevaluasi cara kerja dan pilihan teknologi untuk menghasilkan layanan yang lebih efektif.',
  },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="Tentang kami"
        title={<>Dedikasi pada <span className="gradient-text">presisi.</span></>}
        description="Kami membantu bisnis dan workshop menemukan peralatan yang relevan, memahami penerapannya, dan menjaga performanya untuk jangka panjang."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="site-chip"><BadgeCheck size={14} /> Kualitas terkurasi</span>
          <span className="site-chip"><ShieldCheck size={14} /> Layanan terpercaya</span>
        </div>
      </PageHero>

      <section className="section-block section-shell pt-0">
        <div className="about-manifesto">
          <div className="about-manifesto-label" data-aos="fade-right">01 / Manifesto</div>
          <p className="about-manifesto-copy" data-aos="blur-in">
            Kami percaya peralatan yang baik bukan hanya soal spesifikasi. Ia harus <span className="gradient-text">sesuai kebutuhan</span>, mudah dioperasikan, dan didukung oleh layanan yang bertanggung jawab.
          </p>
        </div>
      </section>

      <section className="section-block section-shell">
        <SectionHeading
          eyebrow="Nilai utama"
          title="Prinsip yang memandu setiap pekerjaan."
          description="Dari percakapan pertama hingga dukungan setelah instalasi, kami menjaga cara kerja yang konsisten dan profesional."
        />

        <div className="value-grid">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.article
                key={value.title}
                className="site-card value-card"
                data-aos="fade-up"
                data-aos-delay={String(index * 100)}
                whileHover={{ y: -8 }}
              >
                <div className="value-card-icon"><Icon size={23} /></div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="section-block section-shell">
        <div className="grid gap-18 lg:grid-cols-2 lg:items-center">
          <div className="site-card relative min-h-[480px] overflow-hidden" data-aos="fade-right">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,color-mix(in_srgb,var(--accent-cyan)_22%,transparent),transparent_35%),radial-gradient(circle_at_75%_70%,color-mix(in_srgb,var(--accent-violet)_25%,transparent),transparent_40%)]" />
            <div className="absolute inset-8 rounded-[24px] border border-[var(--border)]" />
            <div className="absolute left-1/2 top-1/2 grid h-56 w-56 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[var(--border-strong)] text-7xl font-black tracking-[-0.1em] text-[var(--text-primary)] shadow-[0_0_80px_color-mix(in_srgb,var(--accent-blue)_17%,transparent)]">
              MP
            </div>
            <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 backdrop-blur-xl">
              <span className="text-xs font-bold uppercase tracking-[.12em] text-[var(--text-muted)]">Precision in motion</span>
              <span className="h-2 w-2 rounded-full bg-[var(--success)] shadow-[0_0_14px_var(--success)]" />
            </div>
          </div>

          <div data-aos="fade-left">
            <SectionHeading
              eyebrow="Komitmen kami"
              title="Membangun hubungan melalui hasil kerja."
              description="Kami tidak berhenti ketika produk dikirim. Tim tetap hadir untuk membantu proses instalasi, penggunaan, dan pengembangan kebutuhan berikutnya."
            />
            <div className="mt-8 grid gap-4">
              {[
                'Rekomendasi berdasarkan kebutuhan, bukan sekadar tren.',
                'Informasi produk yang jelas dan mudah dipahami.',
                'Pendampingan teknis untuk implementasi yang lebih aman.',
                'Hubungan jangka panjang yang dibangun melalui kepercayaan.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm leading-7 text-[var(--text-secondary)]">
                  <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-lg border border-[var(--border-strong)] text-[var(--accent-blue)]"><BadgeCheck size={14} /></span>
                  {item}
                </div>
              ))}
            </div>
            <Link href="/contact" className="site-button site-button-primary mt-9">
              Kenali kebutuhan Anda <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-block section-shell">
        <div className="stats-grid">
          {[
            { value: '15+', label: 'Produk terkurasi' },
            { value: '4', label: 'Layanan utama' },
            { value: '100%', label: 'Fokus kualitas' },
            { value: 'Long-term', label: 'Orientasi kemitraan' },
          ].map((item, index) => (
            <div key={item.label} className="site-card stat-card" data-aos="zoom-in" data-aos-delay={String(index * 80)}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
