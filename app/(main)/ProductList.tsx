'use client';
import { motion } from 'framer-motion';

const dummyProducts = [
  { id: 1, nama: "Mesin Alignment X-200", kategori: "Alignment", harga: "Rp 15.000.000" },
  { id: 2, nama: "Lift Hidrolik Pro", kategori: "Lift", harga: "Rp 25.000.000" },
  { id: 3, nama: "Kunci Pas Industrial", kategori: "Hand Tools", harga: "Rp 500.000" },
];

export default function ProductList() {
  return (
    <section className="max-w-6xl mx-auto p-10">
      <h2 className="text-3xl font-bold text-white mb-8">Katalog Produk</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {dummyProducts.map((product) => (
          <motion.div 
            key={product.id}
            whileHover={{ y: -10, scale: 1.02 }}
            className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/10 hover:border-purple-500 transition-all duration-300"
          >
            {/* Box gambar dummy */}
            <div className="w-full h-48 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl mb-6 flex items-center justify-center text-gray-500">
              Foto Produk
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{product.nama}</h3>
            <p className="text-purple-400 font-bold mb-1">{product.harga}</p>
            <span className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full">{product.kategori}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}