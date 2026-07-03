# Revisi Produk Kami

Bagian **Produk Kami** pada halaman Beranda sekarang hanya menampilkan
produk yang pada database memiliki:

```text
Terlaris = True
```

Ketentuan:
- Nilai dibaca tanpa membedakan huruf besar/kecil, jadi `True`, `TRUE`, dan `true` dikenali.
- Produk dengan nilai kosong, `False`, atau nilai lain tidak ditampilkan.
- Filter kategori hanya dibuat dari produk yang berstatus `True`.
- Semua produk berstatus `True` dapat tampil, bukan hanya satu produk per kategori.
- Jika tidak ada produk `True`, muncul pesan bahwa belum ada produk terlaris.
- Bagian lain pada halaman tidak diubah.

File utama yang diperbarui:
- `app/(main)/page.tsx`
- `app/(main)/globals.css`

Pengujian:
- `npm run build` berhasil pada Next.js 16.2.9.
