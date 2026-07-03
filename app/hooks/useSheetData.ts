import { useState, useEffect } from 'react';

// Ganti dengan URL SheetDB milik Anda
const SHEETDB_URL = 'https://sheetdb.io/api/v1/1igtyf9vf5393';

/**
 * Hook untuk mengambil data dari Google Sheets via SheetDB
 * @param sheetName - (Opsional) Nama tab di Google Sheets
 */
export function useSheetData(sheetName?: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Membentuk URL: jika ada sheetName, tambahkan parameter ?sheet=...
        const url = sheetName ? `${SHEETDB_URL}?sheet=${sheetName}` : SHEETDB_URL;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Gagal mengambil data: ${response.statusText}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        console.error('Error fetching sheet data:', err);
        setError(err.message || 'Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sheetName]);

  return { data, loading, error };
}