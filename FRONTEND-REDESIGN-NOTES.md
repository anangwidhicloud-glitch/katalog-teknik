# Frontend Redesign — MP Katalog Teknik

## Fitur baru

- Redesign halaman Beranda, Produk, Layanan, Galeri, Tentang, Kontak, Header, dan Footer.
- Hero tetap membaca teks dinamis dari tab `Settings`:
  - `hero_badge`
  - `hero_title`
  - `hero_word_1` sampai `hero_word_4`
  - `hero_suffix`
  - `hero_description`
  - `hero_button_product`
  - `hero_button_contact`
  - `hero_rotation_speed`
- Animasi kilatan SVG yang bergerak dan membentuk huruf MP pada background.
- Sistem animasi scroll berbasis atribut `data-aos` tanpa dependency tambahan.
- Transisi halaman dan micro-interaction menggunakan Framer Motion.
- Dark mode dan light mode dengan penyimpanan pilihan di browser.
- Header responsif, indikator menu aktif, menu mobile, dan progress scroll.
- Katalog produk membaca data SheetDB dan memiliki pencarian, filter, serta modal detail.
- Galeri membaca tab `Gallery` dengan fallback apabila data belum tersedia.
- Kontak dan footer tetap membaca tab `Settings`.
- Dukungan `prefers-reduced-motion` untuk pengguna yang mengurangi animasi.

## Pengujian

Berhasil dijalankan:

```bash
npm run build
npx eslint "app/(main)" --max-warnings=0
```

## Instalasi

1. Salin `.env.local` dari proyek lama ke proyek ini.
2. Jalankan:

```bash
npm install
npm run dev
```

3. Buka `http://localhost:3000`.

Admin panel modern dan autentikasi dari versi sebelumnya tetap dipertahankan.
