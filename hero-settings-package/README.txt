PAKET INTEGRASI HERO BERANDA KE TAB SETTINGS
Proyek: katalog-teknik

Isi paket:
1. apply-hero-settings.mjs
   Script yang hanya mengubah app/(main)/page.tsx pada bagian tulisan hero.

2. Settings-Hero.csv
   Daftar key dan value baru yang perlu ditambahkan ke tab Settings.

LANGKAH PEMASANGAN

A. Tambahkan data ke Google Sheets
1. Buka tab Settings pada spreadsheet database katalog.
2. Buka file Settings-Hero.csv.
3. Salin baris data tanpa mengganti baris footer yang sudah ada.
4. Pastikan tidak ada key yang duplikat.

B. Terapkan perubahan kode
1. Salin apply-hero-settings.mjs ke folder utama proyek katalog-teknik,
   yaitu folder yang berisi package.json.
2. Buka Terminal pada folder proyek tersebut.
3. Jalankan:

   node apply-hero-settings.mjs

4. Jalankan proyek seperti biasa:

   npm run dev

5. Buka halaman admin Settings. Field hero baru akan tampil otomatis karena
   halaman admin membaca seluruh key dari tab Settings.

YANG DIUBAH
- Badge hero
- Judul utama hero
- Empat tulisan hero yang berganti-ganti
- Akhiran tulisan hero
- Deskripsi hero
- Teks dua tombol hero
- Kecepatan pergantian tulisan

YANG TIDAK DIUBAH
- Desain, className, warna, animasi, dan layout
- Bagian produk, fitur, partner, peta, serta formulir
- Hook useSheetData
- Halaman admin Settings
- Data footer yang sudah ada

CATATAN
- hero_rotation_speed menggunakan milidetik. Nilai 3000 berarti 3 detik.
- Nilai minimum yang dipakai kode adalah 1000 milidetik.
- Bila data Settings belum termuat, tulisan lama tetap dipakai sebagai fallback.
