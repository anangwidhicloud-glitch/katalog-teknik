'use client';
import { useState, useEffect } from 'react';
import { useSheetData } from '@/hooks/useSheetData';

export default function SettingsPage() {
  const { data: settings, loading } = useSheetData('Settings');
  const [formState, setFormState] = useState<any>({});

  // Sinkronisasi data sheet ke state form setelah data dimuat
  useEffect(() => {
    if (settings.length > 0) {
      const initialMap = settings.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      setFormState(initialMap);
    }
  }, [settings]);

  const handleChange = (key: string, value: string) => {
    setFormState({ ...formState, [key]: value });
  };

  const handleSave = async (key: string) => {
    // Ganti dengan URL SheetDB Anda
    const SHEETDB_URL = 'https://sheetdb.io/api/v1/1igtyf9vf5393';
    
    try {
      await fetch(`${SHEETDB_URL}/key/${key}?sheet=Settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: formState[key] }),
      });
      alert(`Berhasil update ${key}!`);
    } catch (error) {
      alert('Gagal update data');
    }
  };

  if (loading) return <div className="p-8 text-white">Loading Settings...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 text-white space-y-8">
      <h1 className="text-3xl font-bold">Pengaturan Teks Website</h1>
      
      <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/10 space-y-6">
        {settings.map((s: any) => (
          <div key={s.key} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-gray-400 mb-2 capitalize">{s.key.replace('_', ' ')}</label>
              <input
                type="text"
                value={formState[s.key] || ''}
                onChange={(e) => handleChange(s.key, e.target.value)}
                className="w-full p-4 rounded-xl bg-[#0a0a0f] border border-white/10 text-white focus:border-purple-500 outline-none"
              />
            </div>
            <button
              onClick={() => handleSave(s.key)}
              className="bg-purple-600 px-6 py-4 rounded-xl font-bold hover:bg-purple-700 transition"
            >
              Simpan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}