# Revisi Halaman Produk — Kategori 3 Tingkat

Halaman `/products` telah diperbarui dengan panel kategori profesional di sisi kiri.

## Struktur kategori

Data dibaca langsung dari kolom spreadsheet:

1. `Kategori Utama`
2. `Kategori Kedua`
3. `Sub Kategori`

Setiap tingkat menampilkan jumlah produk yang sesuai.

## Fitur

- Sidebar kategori bertingkat dengan accordion.
- Filter sampai tingkat subkategori.
- Pilihan `Semua Produk`.
- Breadcrumb kategori aktif.
- Tombol reset filter.
- Pencarian tetap dapat digunakan bersama filter kategori.
- Jumlah hasil berubah otomatis.
- Sidebar sticky pada desktop.
- Drawer kategori pada tablet dan perangkat mobile.
- Animasi AOS pada panel dan toolbar.
- Animasi Framer Motion pada accordion, kartu, filter, dan drawer.
- Efek glow, scan light, hover, active state, dan garis hierarchy.
- Tetap mendukung dark mode dan light mode.
- Data, SheetDB, admin panel, halaman beranda, dan sistem login tidak diubah.

## File utama yang diperbarui

- `app/(main)/products/page.tsx`
- `app/(main)/globals.css`

## Pengujian

Berhasil dijalankan:

```bash
npx eslint "app/(main)/products/page.tsx" --max-warnings=0
npm run build
```

Build berhasil pada Next.js 16.2.9.
