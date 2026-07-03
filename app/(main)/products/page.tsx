'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Search } from 'lucide-react';

const products = [
  { id: 1, name: "Blue-point BWA 200 Imaging Wheel Alignment", cat1: "Otomotif", cat2: "Wheel", sub: "Aligment", price: "12.000.000", rating: 5, sold: 120, stock: 15 },
  { id: 2, name: "Blue-point Pyramid2 Imaging Wheel Alignment", cat1: "Otomotif", cat2: "Wheel", sub: "Aligment", price: "6.000.000", rating: 5, sold: 90, stock: 10 },
  { id: 3, name: "Blue-point Swing-Arm Tire Changer", cat1: "Otomotif", cat2: "Tire", sub: "Changer", price: "8.500.000", rating: 5, sold: 75, stock: 8 },
  { id: 4, name: "Blue-point Tilt-Back Tire Changer", cat1: "Otomotif", cat2: "Tire", sub: "Changer", price: "9.200.000", rating: 4, sold: 60, stock: 5 },
  { id: 5, name: "Blue-point MWB 200 Wheel Balancer", cat1: "Otomotif", cat2: "Wheel", sub: "Balancer", price: "10.500.000", rating: 5, sold: 110, stock: 12 },
  { id: 6, name: "Blue-point 2D Wheel Balancer", cat1: "Otomotif", cat2: "Wheel", sub: "Balancer", price: "20.000.000", rating: 4, sold: 45, stock: 3 },
  { id: 7, name: "Blue-point 4T Clear-Floor Two-Post Lift - Wide", cat1: "Hidraulis", cat2: "Lift", sub: "4 Ton", price: "25.000.000", rating: 3, sold: 30, stock: 2 },
  { id: 8, name: "Blue-point 4T 2-Post Lift with E-Locking", cat1: "Hidraulis", cat2: "Lift", sub: "2 Ton", price: "24.000.000", rating: 4, sold: 55, stock: 4 },
  { id: 9, name: "Blue-point Brake Lathe", cat1: "Perlengkapan", cat2: "alat", sub: "Brake", price: "18.500.000", rating: 5, sold: 80, stock: 6 },
  { id: 10, name: "Blue-point Professional AC unit with Flushing Function", cat1: "Perlengkapan", cat2: "Fluid", sub: "Flushing", price: "29.500.000", rating: 4, sold: 40, stock: 3 },
  { id: 11, name: "Blue-point EV Battery Lifter", cat1: "Hidraulis", cat2: "Lift", sub: "Baterry", price: "14.000.000", rating: 4, sold: 25, stock: 5 },
  { id: 12, name: "Blue-point 12V Brake Fluid Changer", cat1: "Perlengkapan", cat2: "Fluid", sub: "Brake", price: "3.000.000", rating: 4, sold: 65, stock: 9 },
  { id: 13, name: "Blue-point Hidraulic Jack", cat1: "Hidraulis", cat2: "Jack", sub: "Manual", price: "8.800.000", rating: 5, sold: 95, stock: 12 },
  { id: 14, name: "Blue-point 20T Shop Press", cat1: "Hidraulis", cat2: "Press", sub: "20 Ton", price: "8.900.000", rating: 4, sold: 50, stock: 4 },
  { id: 15, name: "Blue-point Multifunction dent Pulling Machine", cat1: "Perlengkapan", cat2: "alat", sub: "Pulling", price: "12.000.000", rating: 3, sold: 35, stock: 7 },
];

export default function ProductsPage() {
  const [activeCat, setActiveCat] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [openCat, setOpenCat] = useState<string | null>(null);

  const categories = [
    { name: "Otomotif", subs: ["Wheel", "Tire"] },
    { name: "Hidraulis", subs: ["Lift", "Jack", "Press"] },
    { name: "Perlengkapan", subs: ["Brake", "Fluid", "alat"] }
  ];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCat === "All" || p.cat1 === activeCat || p.cat2 === activeCat || p.sub === activeCat;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-transparent text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 sticky top-[80px] bg-[#0a0a0a]/90 backdrop-blur-md z-[40] py-4 border-b border-white/5">
          <h1 className="text-4xl font-black tracking-tight">Katalog Produk</h1>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Cari produk spesifik..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#141414] border border-white/10 focus:border-purple-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          <aside className="w-full md:w-72 shrink-0">
            <div className="bg-[#141414]/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 sticky top-32">
              <h3 
  className={`font-bold mb-8 text-lg cursor-pointer transition ${activeCat === "All" ? "text-purple-400" : "text-white hover:text-purple-400"}`}
  onClick={() => {
    setActiveCat("All");
    setSearchTerm(""); // <--- TAMBAHKAN INI: Reset pencarian ke kosong
    setOpenCat(null);  // Opsional: Tutup semua kategori yang terbuka
  }}
>
  Semua Produk
</h3>
              {categories.map((cat) => (
                <div key={cat.name} className="mb-6">
                  <button onClick={() => { setOpenCat(openCat === cat.name ? null : cat.name); setActiveCat(cat.name); }} className="w-full flex justify-between items-center font-bold text-white hover:text-purple-400 transition">
                    {cat.name} <span>{openCat === cat.name ? '−' : '+'}</span>
                  </button>
                  <AnimatePresence>
                    {openCat === cat.name && (
                      <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pl-4 mt-3 space-y-3 overflow-hidden text-gray-400">
                        {cat.subs.map(sub => (
                          <li key={sub} onClick={() => setActiveCat(sub)} className="cursor-pointer hover:text-white transition text-sm">• {sub}</li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </aside>

          <section className="flex-grow">
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((p) => (
                  <motion.div 
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -8, boxShadow: "0px 10px 30px -10px rgba(168, 85, 247, 0.5)" }}
                    className="bg-[#141414] p-6 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 flex flex-col gap-4 shadow-xl"
                  >
                    <div className="w-full h-48 bg-[#1a1a1a] rounded-2xl overflow-hidden relative">
                        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider text-white border border-white/5">{p.cat2}</div>
                    </div>
                    <h3 className="font-bold text-lg text-white leading-tight">{p.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="text-yellow-500">{'★'.repeat(p.rating)}</span>
                      <span>({p.rating}.0) | {p.sold}+ Terjual</span>
                    </div>
                    <div className="text-xs font-medium text-green-500">Stok: {p.stock} Unit</div>
                    <div className="text-2xl font-black text-purple-400 mt-auto">Rp {p.price}</div>
                    <div className="flex gap-3 mt-2">
                      <button className="flex-1 py-3 text-sm border border-white/10 rounded-2xl hover:bg-white/5 transition-all">Detail →</button>
                      <button className="flex-1 py-3 text-sm bg-purple-600 rounded-2xl hover:bg-purple-700 transition-all font-bold shadow-lg shadow-purple-900/20">+ Penawaran</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
}