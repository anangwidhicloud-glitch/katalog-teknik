// app/admin/dashboard/page.tsx
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/products/add" className="bg-purple-600 px-6 py-2 rounded-lg font-bold">
          + Tambah Produk
        </Link>
      </div>

      {/* Grid Menu Cepat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/products" className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/10 hover:border-purple-500 transition-all">
          <h2 className="text-xl font-bold mb-2">Manajemen Produk</h2>
          <p className="text-gray-400">Edit, tambah, atau hapus katalog produk.</p>
        </Link>
        <Link href="/admin/settings" className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/10 hover:border-purple-500 transition-all">
          <h2 className="text-xl font-bold mb-2">Pengaturan Konten</h2>
          <p className="text-gray-400">Ubah teks hero, daftar fitur, dan info kontak.</p>
        </Link>
      </div>
    </div>
  );
}