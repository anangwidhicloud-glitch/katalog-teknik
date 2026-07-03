'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  Gauge,
  Headphones,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Wrench,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSheetData } from '../hooks/useSheetData';
import MPBackground from './components/MPBackground';
import SectionHeading from './components/SectionHeading';

type ProductRow = {
  No?: string;
  'Nama Produk'?: string;
  'Kategori Utama'?: string;
  'Kategori Kedua'?: string;
  'Sub Kategori'?: string;
  Harga?: string;
  Rating?: string;
  Foto_URL?: string;
  Terlaris?: string;
};

const fallbackProducts: ProductRow[] = [
  {
    No: '1',
    'Nama Produk': 'Blue-point BWA 200 Imaging Wheel Alignment',
    'Kategori Utama': 'Otomotif',
    'Kategori Kedua': 'Wheel',
    'Sub Kategori': 'Alignment',
    Harga: '12000000',
    Rating: '5',
    Foto_URL:
      'https://res.cloudinary.com/dwe145gm2/image/upload/v1782441578/01._Blue-point_BWA_200_Imaging_Wheel_Alignment_uuvxtv.png',
    Terlaris: 'True',
  },
  {
    No: '3',
    'Nama Produk': 'Blue-point Swing-Arm Tire Changer',
    'Kategori Utama': 'Otomotif',
    'Kategori Kedua': 'Tire',
    'Sub Kategori': 'Changer',
    Harga: '8500000',
    Rating: '5',
    Foto_URL:
      'https://res.cloudinary.com/dwe145gm2/image/upload/v1782441574/03._Blue-point_Swing-Arm_Tire_Changer_lqawlq.png',
    Terlaris: 'True',
  },
  {
    No: '7',
    'Nama Produk': 'Blue-point 4T Clear-Floor Two-Post Lift',
    'Kategori Utama': 'Hidraulis',
    'Kategori Kedua': 'Lift',
    'Sub Kategori': '4 Ton',
    Harga: '25000000',
    Rating: '5',
    Foto_URL:
      'https://res.cloudinary.com/dwe145gm2/image/upload/v1782441574/07._Blue-point_4T_Clear-Floor_Two-Post_Lift_-_Wide_fg9xom.png',
    Terlaris: 'True',
  },
  {
    No: '10',
    'Nama Produk': 'Blue-point Professional AC Unit',
    'Kategori Utama': 'Perlengkapan',
    'Kategori Kedua': 'Fluid',
    'Sub Kategori': 'Flushing',
    Harga: '29500000',
    Rating: '4',
    Foto_URL:
      'https://res.cloudinary.com/dwe145gm2/image/upload/v1782441575/10._Blue-point_Professional_AC_unit_with_Flushing_Function_mt6shq.png',
  },
];

const features = [
  {
    icon: PackageCheck,
    title: 'Produk Original',
    description: 'Peralatan terkurasi dari brand terpercaya untuk kebutuhan workshop profesional.',
  },
  {
    icon: Gauge,
    title: 'Performa Terukur',
    description: 'Solusi dipilih berdasarkan efisiensi, durabilitas, dan kesiapan operasional.',
  },
  {
    icon: Headphones,
    title: 'Dukungan Responsif',
    description: 'Pendampingan konsultasi, instalasi, dan layanan purna jual yang jelas.',
  },
];

const process = [
  { title: 'Konsultasi', description: 'Kami memahami kebutuhan teknis, ruang, dan target operasional Anda.' },
  { title: 'Rekomendasi', description: 'Tim menyusun pilihan produk dan konfigurasi yang paling relevan.' },
  { title: 'Instalasi', description: 'Pemasangan dilakukan dengan prosedur kerja yang aman dan terukur.' },
  { title: 'Pendampingan', description: 'Dukungan penggunaan dan perawatan menjaga investasi tetap optimal.' },
];

const partners = [
  'PT Maju Jaya',
  'Global Engineering',
  'Otomotif Nusantara',
  'Servis Prima',
  'Workshop Indonesia',
  'Teknik Bangun',
  'Solusi Otomotif',
];

function formatCurrency(value?: string) {
  const number = Number(String(value ?? '').replace(/[^0-9.-]/g, ''));
  if (!Number.isFinite(number)) return value || 'Hubungi kami';

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(number);
}

function getProductCategory(product: ProductRow) {
  return (
    product['Kategori Kedua']?.trim() ||
    product['Kategori Utama']?.trim() ||
    'Peralatan'
  );
}

function getProductRating(product: ProductRow) {
  const rating = Number(product.Rating);
  return Number.isFinite(rating) ? rating : 0;
}

function isBestSeller(product: ProductRow) {
  return String(product.Terlaris ?? '').trim().toLowerCase() === 'true';
}

function sortProducts(products: ProductRow[]) {
  return [...products].sort((left, right) => {
    const bestSellerDifference = Number(isBestSeller(right)) - Number(isBestSeller(left));
    if (bestSellerDifference !== 0) return bestSellerDifference;

    return getProductRating(right) - getProductRating(left);
  });
}

export default function Home() {
  const [wordIndex, setWordIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const { data: settings } = useSheetData('Settings');
  const { data: productRows, loading: productsLoading } = useSheetData();

  const content = useMemo(
    () =>
      Object.fromEntries(
        (settings as Array<{ key?: string; value?: string }>)
          .filter((item) => item.key)
          .map((item) => [item.key as string, item.value ?? '']),
      ),
    [settings],
  );

  const defaultWords = ['Standar Dunia', 'Kualitas Premium', 'Daya Tahan Tinggi', 'Brand Terpercaya'];
  const sheetWords = [
    content.hero_word_1,
    content.hero_word_2,
    content.hero_word_3,
    content.hero_word_4,
  ]
    .map((word) => word?.trim())
    .filter((word): word is string => Boolean(word));
  const words = sheetWords.length > 0 ? sheetWords : defaultWords;
  const rotationSpeed = Math.max(Number(content.hero_rotation_speed) || 3000, 1000);
  const currentWord = words[wordIndex % words.length];


  useEffect(() => {
    if (words.length <= 1) return;

    const timer = window.setInterval(
      () => setWordIndex((current) => (current + 1) % words.length),
      rotationSpeed,
    );

    return () => window.clearInterval(timer);
  }, [rotationSpeed, words.length]);

  const allProducts = useMemo(() => {
    const rows = productRows as ProductRow[];
    return rows.length > 0 ? rows : fallbackProducts;
  }, [productRows]);

  const bestSellerProducts = useMemo(
    () => sortProducts((productRows as ProductRow[]).filter(isBestSeller)),
    [productRows],
  );

  const productCategories = useMemo(() => {
    const categories = Array.from(
      new Set(bestSellerProducts.map(getProductCategory).filter(Boolean)),
    );

    return ['Semua', ...categories];
  }, [bestSellerProducts]);

  const resolvedActiveCategory = productCategories.includes(activeCategory)
    ? activeCategory
    : 'Semua';

  const visibleProducts = useMemo(() => {
    if (resolvedActiveCategory === 'Semua') return bestSellerProducts;

    return bestSellerProducts.filter(
      (product) => getProductCategory(product) === resolvedActiveCategory,
    );
  }, [resolvedActiveCategory, bestSellerProducts]);

  const heroProduct = bestSellerProducts[0] ?? allProducts[0] ?? fallbackProducts[0];
  const doubledPartners = [...partners, ...partners];

  return (
    <main>
      <section className="hero-section section-shell">
        <div className="hero-grid">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 32, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="site-eyebrow">{content.hero_badge || 'Authorized Distributor Resmi'}</div>
            <h1 className="hero-title">{content.hero_title || 'Temukan Solusi'}</h1>

            <motion.div className="hero-dynamic-row" layout aria-live="polite">
              <motion.div className="hero-dynamic-line" layout>
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={currentWord}
                    layout
                    initial={{ opacity: 0, y: 28, rotateX: -52, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -24, rotateX: 42, filter: 'blur(7px)' }}
                    transition={{
                      opacity: { duration: 0.32 },
                      filter: { duration: 0.38 },
                      layout: { type: 'spring', stiffness: 360, damping: 34 },
                      y: { type: 'spring', stiffness: 330, damping: 30 },
                      rotateX: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
                    }}
                    className="gradient-text hero-dynamic-word"
                  >
                    {currentWord}
                  </motion.span>
                </AnimatePresence>
                <motion.span
                  layout="position"
                  transition={{ type: 'spring', stiffness: 360, damping: 34 }}
                  className="hero-suffix"
                >
                  {content.hero_suffix || 'Peralatan Anda'}
                </motion.span>
              </motion.div>
            </motion.div>

            <p className="hero-description">
              {content.hero_description ||
                'Menyediakan automotive service equipment kelas dunia dan hand tools berstandar internasional untuk efisiensi maksimal.'}
            </p>

            <div className="hero-actions">
              <Link href="/products" className="site-button site-button-primary">
                {content.hero_button_product || 'Lihat Produk'} <ArrowRight size={17} />
              </Link>
              <Link href="/contact" className="site-button site-button-secondary">
                {content.hero_button_contact || 'Hubungi Kami'} <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className="hero-proof">
              {['Produk terkurasi', 'Konsultasi teknis', 'Layanan purna jual'].map((item) => (
                <div key={item} className="hero-proof-item">
                  <span className="hero-proof-dot" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="hero-visual hero-visual-clean"
            initial={{ opacity: 0, x: 42, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-visual-panel hero-visual-panel-clean">
              <div className="hero-visual-grid" />
              <MPBackground strong />

              <div className="hero-visual-topbar">
                <span className="hero-live-status">
                  <span className="hero-live-dot" /> Equipment intelligence
                </span>
                <span className="hero-visual-code">MP / 01</span>
              </div>

              <div className="hero-product-stage">
                <motion.div
                  className="hero-product-orbit"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                />
                <div className="hero-product-halo" />
                {heroProduct.Foto_URL ? (
                  <motion.div
                    className="hero-product-image-wrap"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Image
                      src={heroProduct.Foto_URL}
                      alt={heroProduct['Nama Produk'] || 'Produk unggulan'}
                      fill
                      priority
                      sizes="(max-width: 1040px) 72vw, 420px"
                      className="hero-product-image"
                    />
                  </motion.div>
                ) : (
                  <Wrench size={90} strokeWidth={0.9} className="hero-product-placeholder" />
                )}
              </div>

              <div className="hero-visual-footer-clean">
                <div className="hero-product-caption">
                  <span>Featured equipment</span>
                  <strong>{heroProduct['Nama Produk'] || 'Precision Equipment System'}</strong>
                </div>
                <div className="hero-metric-row">
                  <div className="hero-metric-item">
                    <strong>15+</strong>
                    <span>Produk pilihan</span>
                  </div>
                  <div className="hero-metric-separator" />
                  <div className="hero-metric-item">
                    <strong>{heroProduct.Rating || '4.9'}</strong>
                    <span>Quality rating</span>
                  </div>
                  <div className="hero-metric-separator" />
                  <div className="hero-metric-item">
                    <CheckCircle2 size={18} />
                    <span>Original</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-block section-shell">
        <SectionHeading
          eyebrow="Mengapa memilih kami"
          title="Lebih dari sekadar katalog produk."
          description="Kami membantu Anda menemukan peralatan yang sesuai, memahami spesifikasi, dan memastikan implementasinya berjalan lebih lancar."
        />

        <div className="feature-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="site-card feature-card"
                data-aos="fade-up"
                data-aos-delay={String(index * 90)}
              >
                <span className="feature-number">0{index + 1}</span>
                <div className="feature-icon"><Icon size={22} /></div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-block section-shell home-products-section">
        <div className="home-products-heading">
          <SectionHeading
            eyebrow="Produk unggulan"
            title="Produk Kami"
            description="Hanya produk yang pada database memiliki status Terlaris = True yang ditampilkan di bagian ini."
          />
          <Link href="/products" className="site-button site-button-secondary">
            Lihat seluruh katalog <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="home-product-toolbar" data-aos="fade-up" data-aos-delay="80">
          <div className="filter-list" role="tablist" aria-label="Kategori produk unggulan">
            {productCategories.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={resolvedActiveCategory === category}
                onClick={() => setActiveCategory(category)}
                className={`filter-button ${resolvedActiveCategory === category ? 'is-active' : ''}`}
              >
                {category === 'Semua' ? <Sparkles size={14} /> : <Tag size={14} />}
                {category}
              </button>
            ))}
          </div>
          <span className="home-product-count">
            <Zap size={14} /> {visibleProducts.length} produk terlaris
          </span>
        </div>

        <motion.div className="product-grid home-product-grid" layout>
          <AnimatePresence mode="popLayout">
            {visibleProducts.map((product, index) => (
              <motion.article
                layout
                key={`${resolvedActiveCategory}-${product.No ?? index}-${product['Nama Produk'] ?? 'produk'}`}
                className="site-card product-card home-product-card"
                data-aos="fade-up"
                data-aos-delay={String((index % 3) * 90)}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -9 }}
              >
                <div className="product-card-glow" />
                <div className="product-image-wrap">
                  <div className="product-badge-stack">
                    {isBestSeller(product) && (
                      <span className="site-chip product-badge product-badge-best">
                        <BadgeCheck size={13} /> Terlaris
                      </span>
                    )}
                    <span className="site-chip product-category-badge">
                      <Boxes size={13} /> {getProductCategory(product)}
                    </span>
                  </div>
                  {product.Foto_URL ? (
                    <Image
                      src={product.Foto_URL}
                      alt={product['Nama Produk'] || 'Produk teknik'}
                      fill
                      sizes="(max-width: 760px) 100vw, (max-width: 1040px) 50vw, 33vw"
                      className="product-image"
                    />
                  ) : (
                    <div className="product-image-placeholder"><Wrench size={46} strokeWidth={1.2} /></div>
                  )}
                  <div className="product-image-shine" />
                </div>
                <div className="product-card-content">
                  <div className="product-card-meta">
                    <span>{product['Sub Kategori'] || product['Kategori Utama'] || 'Professional Series'}</span>
                    <span className="product-rating">
                      <Star size={13} fill="currentColor" /> {product.Rating || '5.0'}
                    </span>
                  </div>
                  <h3 className="product-card-title">{product['Nama Produk'] || 'Produk Teknik Profesional'}</h3>
                  <div className="product-price">{formatCurrency(product.Harga)}</div>
                  <div className="product-card-actions">
                    <Link href="/products" className="site-button site-button-secondary">Detail</Link>
                    <Link href="/contact" className="site-button site-button-primary">Penawaran</Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {productsLoading && (
          <div className="home-products-loading" role="status">
            <span /> Memuat produk terlaris...
          </div>
        )}

        {!productsLoading && visibleProducts.length === 0 && (
          <div className="site-card home-products-empty" data-aos="fade-up">
            <div className="empty-state-icon"><BadgeCheck size={26} /></div>
            <h3>Belum ada produk berstatus Terlaris</h3>
            <p>
              Ubah kolom <strong>Terlaris</strong> menjadi <strong>True</strong> pada database
              untuk menampilkan produk di bagian ini.
            </p>
          </div>
        )}
      </section>

      <section className="section-block section-shell">
        <SectionHeading
          eyebrow="Alur kerja"
          title="Dari kebutuhan menjadi solusi."
          description="Proses sederhana dan transparan untuk membantu Anda memilih, memasang, dan menggunakan peralatan dengan percaya diri."
          align="center"
        />
        <div className="process-grid">
          {process.map((item, index) => (
            <article
              key={item.title}
              className="site-card process-card"
              data-aos="flip-up"
              data-aos-delay={String(index * 90)}
            >
              <span className="process-index">0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block section-shell">
        <div className="site-card p-7 sm:p-10" data-aos="blur-in">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Dipercaya berbagai sektor"
              title="Kolaborasi yang tumbuh dari kualitas."
              description="Kami terus membangun hubungan jangka panjang melalui produk yang relevan dan layanan yang dapat diandalkan."
            />
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--accent-blue)]">
              <BadgeCheck size={18} /> Trusted partner
            </div>
          </div>
          <div className="marquee-shell">
            <div className="marquee-track">
              {doubledPartners.map((partner, index) => (
                <div className="partner-pill" key={`${partner}-${index}`}>{partner}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-block section-shell">
        <div className="stats-grid">
          {[
            { value: '15+', label: 'Produk pilihan', icon: Boxes },
            { value: '4', label: 'Kategori utama', icon: Sparkles },
            { value: '100%', label: 'Fokus kualitas', icon: ShieldCheck },
            { value: 'Fast', label: 'Respon konsultasi', icon: Headphones },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="site-card stat-card" data-aos="zoom-in" data-aos-delay={String(index * 70)}>
                <Icon size={19} className="mx-auto mb-4 text-[var(--accent-blue)]" />
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
