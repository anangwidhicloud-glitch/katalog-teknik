# Revisi Produk dan Analytics Admin

## 1. Accordion kategori diperbaiki

- Tombol panah pada Kategori Utama sekarang benar-benar dapat membuka dan menutup daftar di bawahnya.
- Kategori yang sedang aktif tetap dapat ditutup tanpa menghapus filter.
- Accordion Kategori Kedua juga menggunakan perilaku yang sama.
- Memilih kategori kembali akan membuka cabangnya secara otomatis.

## 2. Kartu produk lebih ringkas dan siap untuk katalog besar

- Ukuran gambar, judul, harga, tombol, badge, dan jarak antarelemen diperkecil.
- Desktop menampilkan hingga tiga kartu per baris.
- Tablet menampilkan tiga atau dua kartu sesuai lebar layar.
- Mobile kecil menampilkan satu kartu.
- Pagination ditambahkan dengan pilihan 12, 24, atau 48 produk per halaman.
- Terdapat nomor halaman, tombol sebelumnya/berikutnya, dan informasi rentang produk.
- Pencarian dan perubahan kategori otomatis kembali ke halaman pertama.

## 3. Analytics Admin

Halaman baru:

`/admin/analytics`

Fitur:
- KPI total produk.
- Jumlah dan persentase produk terlaris.
- Rata-rata harga.
- Rata-rata rating.
- Grafik distribusi Kategori Utama.
- Grafik Kategori Kedua teratas.
- Grafik komposisi produk terlaris.
- Grafik sebaran rating.
- Insight otomatis kategori dan subkategori dominan.
- Export ringkasan analytics ke CSV.
- Animasi Framer Motion dan Chart.js.
- Menu Analytics ditambahkan ke sidebar dan dashboard.
- Vercel Web Analytics diaktifkan melalui root layout untuk pelacakan saat deploy.

Catatan:
- Grafik dalam Admin Analytics menggunakan data katalog nyata dari spreadsheet.
- Statistik traffic/kunjungan Vercel tetap dilihat melalui dashboard Vercel, kecuali nantinya ditambahkan API Vercel dengan token dan project ID.

## File utama yang diperbarui

- `app/(main)/products/page.tsx`
- `app/(main)/globals.css`
- `app/admin/analytics/page.tsx`
- `app/admin/components/admin/Sidebar.tsx`
- `app/admin/components/admin/Navbar.tsx`
- `app/admin/dashboard/page.tsx`
- `app/layout.tsx`

## Pengujian

Berhasil dijalankan:

```bash
npx eslint "app/(main)/products/page.tsx" "app/admin/analytics/page.tsx" "app/admin/components/admin/Sidebar.tsx" "app/admin/components/admin/Navbar.tsx" "app/admin/dashboard/page.tsx" "app/layout.tsx" --max-warnings=0
npm run build
```

Build berhasil pada Next.js 16.2.9.
