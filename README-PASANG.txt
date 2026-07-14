SUPER ADMIN ENV + CRUD ADMIN BIASA
Branch: katalog-web

1. Copy semua file/folder di paket ini ke root project.
   Pilih replace saat diminta.

2. Buat tabel admins dengan salah satu cara:

   Cara utama:
   npm run db:push

   Alternatif:
   Jalankan isi migration-data/create-admins.sql di Neon SQL Editor.

3. Restart project:
   npm run dev

4. Login memakai super admin dari .env.local.

5. Buka:
   /admin/accounts

6. Tambahkan admin biasa dari halaman tersebut.

HASIL:
- Super admin tetap menggunakan ADMIN_EMAIL dan ADMIN_PASSWORD_HASH dari ENV.
- Admin biasa tersimpan di tabel admins pada NeonDB.
- Super admin bisa tambah, lihat, edit, aktif/nonaktif, dan hapus admin biasa.
- Menu /admin/accounts disembunyikan dari admin biasa.
- Admin biasa yang membuka /admin/accounts langsung diarahkan ke /admin/dashboard.
- API CRUD akun hanya menerima sesi super admin.
- Admin biasa yang dinonaktifkan atau dihapus tidak bisa menggunakan API admin lagi.

Tidak perlu menambahkan variabel ENV baru.
