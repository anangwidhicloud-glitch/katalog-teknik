// components/admin/Table.tsx
export default function DashboardTable() {
  return (
    <div className="bg-[#141414] rounded-3xl border border-white/5 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-white/5 text-gray-400 text-sm">
          <tr>
            <th className="p-6">Nama Mesin</th>
            <th className="p-6">Status</th>
            <th className="p-6">Terakhir Maintenance</th>
            <th className="p-6">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {/* Contoh baris data */}
          <tr className="hover:bg-white/5 transition">
            <td className="p-6 font-medium">Genset Utama 01</td>
            <td className="p-6">
              <span className="text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-xs">
                Aktif
              </span>
            </td>
            <td className="p-6 text-gray-400">2026-06-15</td>
            <td className="p-6 text-purple-400 hover:underline cursor-pointer">Detail</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
