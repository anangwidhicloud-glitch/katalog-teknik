# Revisi Halaman Beranda

Perubahan hanya difokuskan pada halaman Beranda dan mesin animasi AOS.

## Perubahan

1. Animasi tulisan hero
   - Transisi kata dibuat lebih lembut dengan spring, blur, rotate, dan layout animation.
   - Posisi `Peralatan Anda` mengikuti lebar tulisan secara halus.
   - Tulisan panjang dapat membungkus secara aman sehingga tidak menabrak banner.

2. Banner hero
   - Kotak statistik yang sebelumnya berada di luar banner dihapus.
   - Informasi produk dan statistik kini berada di dalam panel.
   - Menggunakan gambar produk unggulan, orbit, glow, sweep light, dan animasi MP.
   - Tidak ada lagi kartu yang saling tumpang tindih.

3. Section Produk Kami
   - Menggantikan section `Peralatan untuk pekerjaan serius`.
   - Menampilkan produk terbaik/terlaris dari setiap kategori.
   - Filter kategori dapat diklik.
   - Produk diurutkan berdasarkan status Terlaris dan rating.
   - Tersedia fallback produk jika spreadsheet belum selesai dimuat.
   - Kartu memiliki animasi AOS, Framer Motion, glow, shine, hover, dan transisi filter.

4. Perbaikan AOS
   - AOSProvider kini mendeteksi elemen yang muncul setelah proses fetch.
   - Menggunakan MutationObserver agar kartu dinamis tidak tetap transparan/kosong.

## File yang diubah

- `app/(main)/page.tsx`
- `app/(main)/globals.css`
- `app/(main)/components/AOSProvider.tsx`

## Pengujian

Berhasil dijalankan:

```bash
npx eslint "app/(main)" --max-warnings=0
npm run build
```
