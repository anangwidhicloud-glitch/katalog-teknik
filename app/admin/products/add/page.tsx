'use client'
export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Pengaturan Halaman Utama</h1>
      
      <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/10 space-y-6">
        <div>
          <label className="block text-gray-400 mb-2">Judul Hero Utama</label>
          <input 
            type="text" 
            className="w-full p-4 rounded-xl bg-[#0a0a0f] border border-white/10 text-white"
            defaultValue="Temukan Solusi"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-2">Deskripsi Hero</label>
          <textarea 
            rows={3}
            className="w-full p-4 rounded-xl bg-[#0a0a0f] border border-white/10 text-white"
            defaultValue="Menyediakan automotive service equipment kelas dunia..."
          />
        </div>
        <button className="bg-purple-600 px-8 py-3 rounded-xl font-bold hover:bg-purple-700">
          Simpan Perubahan
        </button>
      </div>
    </div>
  )
}