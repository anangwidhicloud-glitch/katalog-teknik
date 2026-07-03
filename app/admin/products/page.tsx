'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://sheetdb.io/api/v1/1igtyf9vf5393')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manajemen Produk</h1>
        <Link href="/admin/products/add" className="bg-purple-600 px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition-all">
          + Tambah Produk
        </Link>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-gray-400">Memuat data dari Google Sheets...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-xs uppercase">
                <tr>
                  <th className="p-4 text-gray-400">Foto</th>
                  <th className="p-4 text-gray-400">Nama Produk</th>
                  <th className="p-4 text-gray-400">Kategori</th>
                  <th className="p-4 text-gray-400">Harga</th>
                  <th className="p-4 text-gray-400">Rating</th>
                  <th className="p-4 text-gray-400">Terlaris</th>
                  <th className="p-4 text-gray-400 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any, index: number) => (
                  <tr key={index} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      {product['Foto_URL'] ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 relative">
                          <Image src={product['Foto_URL']} alt={product['Nama Produk']} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-800" />
                      )}
                    </td>
                    <td className="p-4 font-medium">{product['Nama Produk']}</td>
                    <td className="p-4 text-gray-400">{product['Kategori Utama']}</td>
                    <td className="p-4 text-purple-400">{product['Harga']}</td>
                    <td className="p-4 text-yellow-500">{product['Rating']} ★</td>
                    <td className="p-4">{product['Terlaris']}</td>
                    <td className="p-4 flex justify-center gap-3 mt-3">
                      <button className="text-blue-400 hover:text-blue-300">Edit</button>
                      <button className="text-red-400 hover:text-red-300">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}