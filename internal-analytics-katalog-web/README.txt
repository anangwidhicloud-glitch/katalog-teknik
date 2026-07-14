ANALYTICS INTERNAL KATALOG

1. Extract seluruh isi folder ini ke root project (sejajar package.json).
2. Jalankan INSTALL-INTERNAL-ANALYTICS.bat.
3. Buka Neon Console > SQL Editor.
4. Jalankan database/ensure-site-analytics-table.sql.
5. Jalankan npm run dev.
6. Kunjungi halaman publik beberapa kali.
7. Buka /admin/analytics.

Fitur:
- Page views
- Pengunjung unik berbasis session browser
- Pengunjung hari ini
- Tren 7/14/30 hari
- Halaman teratas
- Referrer
- Jenis perangkat
- Halaman admin dan API tidak direkam

Catatan:
Ini analytics internal milik aplikasi dan berbeda dari dashboard Vercel Web Analytics.
Tidak memerlukan VERCEL_TOKEN dan tidak membaca API privat Vercel.
