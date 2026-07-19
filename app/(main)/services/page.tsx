'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Headphones,
  Settings2,
  ShieldCheck,
  Users,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';

const services = [
  {
    title: 'Konsultasi Teknis',
    description:
      'Analisis kebutuhan, ruang kerja, kapasitas, dan target operasional untuk menentukan solusi yang tepat.',
    icon: Users,
  },
  {
    title: 'Instalasi & Setup',
    description:
      'Pemasangan unit, penyesuaian posisi, pengujian fungsi, dan pengecekan keamanan sebelum digunakan.',
    icon: Settings2,
  },
  {
    title: 'Perawatan Berkala',
    description:
      'Perawatan terjadwal untuk menjaga akurasi, daya tahan, serta mencegah gangguan operasional.',
    icon: Clock3,
  },
  {
    title: 'Dukungan & Perbaikan',
    description:
      'Respons teknis untuk membantu identifikasi kendala, perbaikan, dan pemulihan fungsi peralatan.',
    icon: Wrench,
  },
];

const workflow = [
  {
    title: 'Pemetaan kebutuhan',
    text: 'Kami mempelajari kondisi lapangan dan kebutuhan utama operasional.',
  },
  {
    title: 'Rancangan solusi',
    text: 'Rekomendasi disusun berdasarkan fungsi, anggaran, dan skala penggunaan.',
  },
  { title: 'Pelaksanaan', text: 'Instalasi dan pengujian dilakukan dengan alur kerja yang jelas.' },
  {
    title: 'Serah terima',
    text: 'Tim memberikan panduan penggunaan, pengecekan, dan langkah perawatan.',
  },
];

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Layanan profesional"
        title={
          <>
            Dukungan teknis yang <span className="gradient-text">menyeluruh.</span>
          </>
        }
        description="Kami mendampingi proses dari konsultasi hingga purna jual agar setiap peralatan dapat digunakan secara aman, efektif, dan konsisten."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="site-chip">
            <ShieldCheck size={14} /> Prosedur terukur
          </span>
          <span className="site-chip">
            <Headphones size={14} /> Dukungan responsif
          </span>
          <span className="site-chip">
            <CheckCircle2 size={14} /> Fokus hasil
          </span>
        </div>
      </PageHero>

      <section className="section-block section-shell pt-0">
        <SectionHeading
          eyebrow="Cakupan layanan"
          title="Satu partner untuk berbagai kebutuhan teknis."
          description="Layanan dirancang untuk membantu pengambilan keputusan, implementasi, dan keberlanjutan operasional peralatan Anda."
        />

        <div className="service-grid">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                className="site-card service-card"
                data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}
                data-aos-delay={String((index % 2) * 80)}
                whileHover={{ y: -8 }}
              >
                <span className="service-card-index">0{index + 1}</span>
                <div className="service-card-icon">
                  <Icon size={24} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link href="/contact" className="site-button site-button-ghost mt-7">
                  Diskusikan layanan <ArrowRight size={16} />
                </Link>
                <div className="service-card-glow" />
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="section-block section-shell">
        <div className="grid gap-14 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <div data-aos="fade-right">
            <SectionHeading
              eyebrow="Cara kami bekerja"
              title="Terstruktur, transparan, dan mudah dipahami."
              description="Setiap tahap memiliki tujuan yang jelas sehingga Anda dapat mengikuti proses dan mengambil keputusan dengan lebih percaya diri."
            />
            <Link href="/contact" className="site-button site-button-primary mt-8">
              Jadwalkan konsultasi <ArrowRight size={17} />
            </Link>
          </div>

          <div className="timeline">
            {workflow.map((item, index) => (
              <div
                key={item.title}
                className="timeline-item"
                data-aos="fade-up"
                data-aos-delay={String(index * 80)}
              >
                <div className="timeline-dot">0{index + 1}</div>
                <div className="timeline-copy">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block section-shell">
        <div className="site-card overflow-hidden p-8 sm:p-12" data-aos="zoom-in">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="site-eyebrow">Technical support</div>
              <h2 className="section-title max-w-3xl">
                Pastikan investasi peralatan Anda bekerja maksimal.
              </h2>
              <p className="section-description max-w-2xl">
                Konsultasikan kebutuhan instalasi, perawatan, atau kendala teknis bersama tim kami.
              </p>
            </div>
            <Link href="/contact" className="site-button site-button-primary">
              Hubungi Tim Kami <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
