'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock3, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { useSheetData } from '../../hooks/useSheetData';
import PageHero from '../components/PageHero';

export default function ContactPage() {
  const { data: settings } = useSheetData('Settings');
  const [submitted, setSubmitted] = useState(false);

  const content = useMemo(
    () =>
      Object.fromEntries(
        (settings as Array<{ key?: string; value?: string }>)
          .filter((item) => item.key)
          .map((item) => [item.key as string, item.value ?? '']),
      ),
    [settings],
  );

  const phone = content.footer_phone || '0856 4010 0044';
  const email = content.footer_email || 'anang.widhi.p@gmail.com';
  const address =
    content.footer_address ||
    'Jl. Mayor Oking Citeureup, Puspanegara, Kabupaten Bogor, Jawa Barat 16810.';
  const defaultMapUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.836881774213!2d106.8785663749939!3d-6.425867993563943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69b83b3e10759f%3A0x89e0b8d5a8b7c7b7!2sGudang%20PT%20Indolakto!5e0!3m2!1sen!2sid!4v1716382000000!5m2!1sen!2sid';

  const savedMapUrl = content.map_url?.trim() || '';

  const mapUrl = savedMapUrl.startsWith('https://www.google.com/maps/embed')
    ? savedMapUrl
    : defaultMapUrl;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main>
      <PageHero
        eyebrow="Kontak kami"
        title={
          <>
            Mari diskusikan kebutuhan <span className="gradient-text">teknis Anda.</span>
          </>
        }
        description="Ceritakan kebutuhan produk, instalasi, atau layanan yang sedang Anda rencanakan. Tim kami akan membantu menyiapkan langkah selanjutnya."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="site-chip">
            <Clock3 size={14} /> Respon pada jam kerja
          </span>
          <span className="site-chip">
            <MessageCircle size={14} /> Konsultasi awal
          </span>
        </div>
      </PageHero>

      <section className="section-block section-shell pt-0">
        <div className="contact-layout">
          <div className="contact-stack">
            <motion.div
              className="site-card contact-info-card"
              data-aos="fade-right"
              whileHover={{ x: 4 }}
            >
              <div className="contact-icon">
                <Mail size={20} />
              </div>
              <div>
                <h3>Email</h3>
                <a href={`mailto:${email}`}>{email}</a>
              </div>
            </motion.div>

            <motion.div
              className="site-card contact-info-card"
              data-aos="fade-right"
              data-aos-delay="80"
              whileHover={{ x: 4 }}
            >
              <div className="contact-icon">
                <Phone size={20} />
              </div>
              <div>
                <h3>Telepon</h3>
                <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone}</a>
              </div>
            </motion.div>

            <motion.div
              className="site-card contact-info-card"
              data-aos="fade-right"
              data-aos-delay="160"
              whileHover={{ x: 4 }}
            >
              <div className="contact-icon">
                <MapPin size={20} />
              </div>
              <div>
                <h3>Alamat</h3>
                <p>{address}</p>
              </div>
            </motion.div>

            <div className="site-card p-6" data-aos="fade-up" data-aos-delay="220">
              <h3 className="text-sm font-bold">
                Informasi yang membantu kami merespons lebih cepat
              </h3>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-[var(--text-secondary)]">
                {[
                  'Jenis peralatan atau layanan yang dibutuhkan.',
                  'Kondisi lokasi dan ruang pemasangan.',
                  'Estimasi waktu implementasi yang diharapkan.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-1 shrink-0 text-[var(--success)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <motion.div className="site-card contact-form" data-aos="fade-left">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="site-eyebrow">Kirim pesan</div>
                <h2 className="text-3xl font-black tracking-[-0.04em]">
                  Ceritakan kebutuhan Anda.
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                  Lengkapi form berikut. Data hanya digunakan untuk komunikasi terkait permintaan
                  Anda.
                </p>
              </div>
              <span className="contact-icon hidden sm:grid">
                <Send size={20} />
              </span>
            </div>

            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="name">Nama</label>
                <input
                  id="name"
                  name="name"
                  required
                  className="site-input"
                  placeholder="Nama lengkap"
                />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="site-input"
                  placeholder="nama@email.com"
                />
              </div>
              <div className="form-field form-field-full">
                <label htmlFor="phone">Nomor telepon</label>
                <input id="phone" name="phone" className="site-input" placeholder="+62 ..." />
              </div>
              <div className="form-field form-field-full">
                <label htmlFor="message">Pesan</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="site-input resize-none"
                  placeholder="Jelaskan produk, layanan, atau kebutuhan teknis Anda..."
                />
              </div>
              <div className="form-field-full flex flex-col gap-4 sm:flex-row sm:items-center">
                <button type="submit" className="site-button site-button-primary">
                  Kirim Pesan <Send size={17} />
                </button>
                <span className="text-xs leading-5 text-[var(--text-muted)]">
                  Kami akan menghubungi Anda kembali pada jam operasional.
                </span>
              </div>
            </form>

            {submitted && (
              <div className="form-success" role="status">
                <CheckCircle2 size={17} /> Pesan sudah dicatat pada tampilan. Hubungkan form ke
                layanan email/API untuk pengiriman otomatis.
              </div>
            )}
          </motion.div>
        </div>

        <div className="site-card map-card" data-aos="fade-up">
          <iframe
            src={mapUrl}
            title="Lokasi MP Katalog Teknik"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  );
}
