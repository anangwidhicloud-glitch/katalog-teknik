import { ArrowLeft, Construction, Database, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
  return (
    <div className="space-y-6">
      <section className="admin-panel rounded-[26px] px-6 py-7 sm:px-8">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-amber-300/10 bg-amber-400/[0.06] text-amber-200">
            <Construction className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">Tambah Produk</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Tampilan katalog saat ini membaca produk dari SheetDB. Form penambahan otomatis belum dihubungkan agar struktur data yang sudah berjalan tidak berubah tanpa persetujuan.
            </p>
          </div>
        </div>
      </section>

      <section className="admin-panel mx-auto max-w-3xl rounded-[24px] p-6 sm:p-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-sky-300/10 bg-sky-400/[0.055] text-sky-200">
            <FileSpreadsheet className="h-7 w-7" />
          </span>
          <h3 className="mt-6 text-xl font-semibold text-white">Tambahkan melalui spreadsheet</h3>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Untuk sementara, produk baru tetap ditambahkan pada sheet produk dengan kolom yang sama: nama, kategori, harga, rating, foto, dan status terlaris.
          </p>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-left">
            <Database className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
            <p className="text-xs leading-6 text-slate-500">
              Halaman ini sengaja tidak melakukan POST ke SheetDB untuk mencegah perubahan perilaku aplikasi di luar permintaan desain ulang.
            </p>
          </div>

          <Link
            href="/admin/products"
            className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.04] px-5 text-sm font-semibold text-slate-200 transition hover:border-sky-300/15 hover:bg-sky-400/[0.07] hover:text-sky-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke katalog
          </Link>
        </div>
      </section>
    </div>
  );
}
