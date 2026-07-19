export const siteContentTabs = [
  {
    id: 'header',
    label: 'Header & Menu',
    description: 'Nama website, menu navigasi, tombol kontak, dan tampilan menu mobile.',
  },
  {
    id: 'home',
    label: 'Beranda',
    description: 'Hero, produk unggulan, keunggulan, proses, dan statistik.',
  },
  {
    id: 'products',
    label: 'Produk',
    description: 'Judul halaman, deskripsi, filter, kartu, pagination, dan detail produk.',
  },
  {
    id: 'services',
    label: 'Layanan',
    description: 'Judul, daftar layanan, alur kerja, dan ajakan konsultasi.',
  },
  {
    id: 'gallery',
    label: 'Galeri',
    description: 'Judul halaman, filter, statistik, dan tulisan modal.',
  },
  {
    id: 'about',
    label: 'Tentang',
    description: 'Profil perusahaan, nilai, manifesto, komitmen, dan statistik.',
  },
  {
    id: 'contact',
    label: 'Kontak',
    description: 'Judul halaman, informasi kontak, form, peta, dan tombol WhatsApp.',
  },
  {
    id: 'footer',
    label: 'Footer',
    description:
      'Ajakan konsultasi, profil singkat, navigasi, media sosial, jam operasional, dan hak cipta.',
  },
  {
    id: 'general',
    label: 'Umum',
    description: 'Nama situs, metadata, dan tulisan umum yang digunakan pada website.',
  },
] as const;

export type SiteContentTabId = (typeof siteContentTabs)[number]['id'];

export function getSiteContentTab(key: string): SiteContentTabId {
  if (key.startsWith('header_') || key.startsWith('nav_')) {
    return 'header';
  }

  if (key.startsWith('home_') || key.startsWith('hero_')) {
    return 'home';
  }

  if (key.startsWith('products_')) {
    return 'products';
  }

  if (key.startsWith('services_')) {
    return 'services';
  }

  if (key.startsWith('gallery_')) {
    return 'gallery';
  }

  if (key.startsWith('about_')) {
    return 'about';
  }

  if (key.startsWith('contact_') || key.startsWith('whatsapp_') || key === 'map_url') {
    return 'contact';
  }

  if (key.startsWith('footer_') || key.startsWith('link_')) {
    return 'footer';
  }

  if (key.startsWith('general_')) {
    return 'general';
  }

  return 'general';
}
