'use client';

import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type SettingRow = {
  key?: string;
  value?: string;
};

function SocialGlyph({
  kind,
}: {
  kind: 'tiktok' | 'facebook' | 'youtube' | 'instagram';
}) {
  if (kind === 'facebook') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.026 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.414c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97H15.83c-1.491 0-1.956.93-1.956 1.885v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.093 24 18.1 24 12.073z" />
      </svg>
    );
  }

  if (kind === 'youtube') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.15C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3 3 0 0 0 2.1 2.15c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.15c.5-1.88.5-5.8.5-5.8s0-3.92-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
      </svg>
    );
  }

  if (kind === 'instagram') {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.16 1.02 1.11 2.46 1.62 3.87 1.78v4.03a9.2 9.2 0 0 1-5.43-1.64c.01 2.91.01 5.82-.01 8.73-.16 3.48-3 6.47-6.47 6.78-3.47.45-6.93-1.58-8.24-4.82-1.6-3.82.28-8.54 4.12-10.1a8.18 8.18 0 0 1 4.61-.45v4.13c-1.42-.46-3.12-.06-4.03 1.16-1.13 1.4-.9 3.62.48 4.77 1.33 1.21 3.63 1.1 4.82-.25.41-.47.68-1.07.7-1.7.07-5.52-.02-11.03.04-16.56z" />
    </svg>
  );
}

const quickLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/products', label: 'Produk' },
  { href: '/services', label: 'Layanan' },
  { href: '/gallery', label: 'Galeri' },
  { href: '/contact', label: 'Kontak' },
];

export default function Footer() {
  const [settings, setSettings] = useState<SettingRow[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings', {
          method: 'GET',
          cache: 'no-store',
        });

        if (!response.ok) {
          return;
        }

        const result = await response.json();

        if (!cancelled && Array.isArray(result)) {
          setSettings(result);
        }
      } catch {
        // Footer tetap memakai nilai fallback jika database tidak tersedia.
      }
    };

    void loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  const settingsMap = useMemo(
    () =>
      Object.fromEntries(
        settings
          .filter(
            (item): item is Required<SettingRow> =>
              typeof item.key === 'string' && item.key.trim().length > 0,
          )
          .map((item) => [item.key, item.value ?? '']),
      ),
    [settings],
  );

  const socialLinks = [
    { label: 'TikTok', href: settingsMap.link_tiktok, kind: 'tiktok' as const },
    { label: 'Facebook', href: settingsMap.link_fb, kind: 'facebook' as const },
    { label: 'YouTube', href: settingsMap.link_youtube, kind: 'youtube' as const },
    { label: 'Instagram', href: settingsMap.link_instagram, kind: 'instagram' as const },
  ].filter((item) => item.href && item.href !== '#');

  const phone = settingsMap.footer_phone || '0856 4010 0044';
  const email = settingsMap.footer_email || 'anang.widhi.p@gmail.com';
  const address =
    settingsMap.footer_address ||
    'Jl. Mayor Oking Citeureup, Puspanegara, Kabupaten Bogor, Jawa Barat.';

  return (
    <footer className="site-footer">
      <div className="section-shell">
        <div className="footer-cta" data-aos="zoom-in">
          <div>
            <div className="site-eyebrow">Mari berkolaborasi</div>
            <h2>Butuh solusi peralatan yang tepat?</h2>
            <p>Diskusikan kebutuhan workshop dan operasional Anda bersama tim kami.</p>
          </div>

          <Link href="/contact" className="site-button site-button-primary">
            Mulai Konsultasi <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="footer-grid">
          <div className="footer-brand" data-aos="fade-up">
            <Link href="/" className="brand-mark">
              <span className="brand-symbol">MP</span>
              <span className="brand-copy">
                <strong>Katalog Teknik</strong>
                <small>Professional Equipment</small>
              </span>
            </Link>

            <p>
              Mitra penyedia peralatan otomotif, hidraulis, dan perlengkapan teknik dengan fokus
              pada kualitas, presisi, dan layanan purna jual.
            </p>

            <div className="footer-socials">
              {socialLinks.map(({ label, href, kind }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="footer-social-link"
                >
                  <SocialGlyph kind={kind} />
                </a>
              ))}
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="80">
            <h3 className="footer-title">Jelajahi</h3>
            <ul className="footer-links">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/admin">Admin Panel</Link>
              </li>
            </ul>
          </div>

          <div data-aos="fade-up" data-aos-delay="160">
            <h3 className="footer-title">Hubungi</h3>
            <ul className="footer-contact-list">
              <li>
                <Phone size={17} />
                <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone}</a>
              </li>
              <li>
                <Mail size={17} />
                <a href={`mailto:${email}`}>{email}</a>
              </li>
              <li>
                <MapPin size={18} />
                <span>{address}</span>
              </li>
            </ul>
          </div>

          <div data-aos="fade-up" data-aos-delay="240">
            <h3 className="footer-title">Jam Operasional</h3>
            <div className="footer-hours">
              <p>
                <span>Senin – Jumat</span>
                <strong>09.00 – 16.30</strong>
              </p>
              <p>
                <span>Sabtu</span>
                <strong>09.00 – 15.00</strong>
              </p>
              <p>
                <span>Minggu</span>
                <strong className="footer-closed">Libur</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MP Katalog Teknik. All rights reserved.</p>
          <div>
            <span>Built for precision</span>
            <span className="footer-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
}
