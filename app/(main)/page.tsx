'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSheetData } from '../hooks/useSheetData';

const words = ["Standar Dunia", "Kualitas Premium", "Daya Tahan Tinggi", "Brand Terpercaya"];

const features = [
  { title: "Produk Original", desc: "Produk kami terjamin 100% original dari brand terpercaya." },
  { title: "Harga Terjangkau", desc: "Penawaran harga terbaik dengan kualitas premium." },
  { title: "Layanan Cepat", desc: "Pengiriman kilat dengan layanan pelanggan 24/7." },
];

const categories = ["All Produk", "Alignment", "Lift", "Hand Tools"];
const products = [
  { id: 1, name: "Mesin Alignment X-200", cat: "Alignment" },
  { id: 2, name: "Lift Hidrolik Pro", cat: "Lift" },
  { id: 3, name: "Kunci Pas Industrial", cat: "Hand Tools" },
  { id: 4, name: "Balancer Digital", cat: "Alignment" },
  { id: 5, name: "Tyre Changer", cat: "Lift" },
];

const partners = [
  "PT Maju Jaya", "Global Logistik", "Otomotif Nusantara", 
  "Servis Prima", "Dealer Resmi A", "Teknik Bangun", "Solusi Otomotif"
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [activeCat, setActiveCat] = useState("All Produk");

  // Timer untuk teks berganti di Hero
  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % words.length), 3000);
    return () => clearInterval(timer);
  }, []);

  const filtered = activeCat === "All Produk" ? products : products.filter(p => p.cat === activeCat);

  return (
    <main className="pt-24 md:pt-32"> {/* Pastikan pt ini minimal setinggi header Anda */}
      
{/* Hero Section */}
<section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, amount: 0.2 }}
    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    className="flex flex-col items-center"
  >
    <div className="text-sm uppercase tracking-widest text-gray-400 mb-4 border border-gray-600 px-3 py-1 rounded">
      AUTHORIZED DISTRIBUTOR RESMI
    </div>
    
    <h1 className="text-6xl md:text-8xl font-bold mb-4">Temukan Solusi</h1>
    
    <AnimatePresence mode="wait">
      <motion.h1 
        key={words[index]}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-6xl md:text-8xl font-bold mb-6 animate-gradient-text"
      >
        {words[index]} Peralatan Anda
      </motion.h1>
    </AnimatePresence>

    <p className="text-gray-400 max-w-xl mb-8">
      Menyediakan automotive service equipment kelas dunia dan hand tools berstandar internasional untuk efisiensi maksimal.
    </p>
    
    <div className="flex gap-4">
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-purple-600 px-8 py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.7)] transition-all duration-300"
      >
        Lihat Produk
      </motion.button>
      <motion.button 
        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-4 rounded-xl font-bold border border-gray-500 hover:border-white transition-all duration-300"
      >
        Hubungi Kami
      </motion.button>
    </div>
  </motion.div>
</section>

      {/* 2. Three Boxes Section */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {features.map((f, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ 
  duration: 0.9, 
  delay: i * 0.15, 
  ease: [0.22, 1, 0.36, 1] // Kurva Easing "Out-Quart" yang sangat lembut
}}
            whileHover={{ y: -10, borderColor: "#9333ea" }}
            className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/5 hover:shadow-[0_0_30px_rgba(147,51,234,0.3)] transition-all cursor-pointer"
          >
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </section>

{/* 3. Product Catalog Section */}
<section className="max-w-6xl mx-auto px-6 pb-20">
  
  {/* Wrapper animasi untuk Judul & Filter agar muncul dari bawah */}
  <motion.div
    initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: false, amount: 0.2 }}
  transition={{ 
    duration: 0.9, // Kita samakan durasinya dengan kotak keunggulan
    ease: [0.22, 1, 0.36, 1] 
  }}
  >
    <h2 className="text-3xl font-bold text-center mb-10">Produk Kami</h2>
    
    {/* Filter Buttons */}
    <div className="flex justify-center gap-4 mb-10">
      {categories.map(cat => (
        <button 
          key={cat}
          onClick={() => setActiveCat(cat)}
          className={`px-4 py-2 rounded-full text-sm transition-all ${
            activeCat === cat ? "bg-purple-600" : "bg-[#1a1a1a] hover:bg-gray-800"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  </motion.div>

  {/* Product Grid dengan Efek Transisi */}
  <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-8">
  <AnimatePresence mode="popLayout">
    {filtered.map((product, i) => (
      <motion.div 
        key={product.id}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -10 }}
        className="bg-[#1a1a1a] p-5 rounded-3xl border border-white/10 hover:border-purple-500 transition-all duration-300 flex flex-col gap-3"
      >
        {/* Foto Produk */}
        <div className="w-full h-48 bg-gray-800 rounded-2xl overflow-hidden relative">
          <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-white">
            {product.cat}
          </div>
        </div>

        {/* Info Produk */}
        <h3 className="font-bold text-lg text-white">{product.name}</h3>
        
        {/* Rating & Penjualan */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="text-yellow-500">★★★★★</span>
          <span>(4.9)</span>
          <span className="text-gray-600">|</span>
          <span>120+ Terjual</span>
        </div>

        {/* Stok */}
        <div className="text-xs font-medium text-green-500">Stok: 15 Unit</div>

        {/* Harga */}
        <div className="text-xl font-bold text-purple-400">Rp 15.000.000</div>

        {/* Tombol Aksi */}
        <div className="flex gap-2 mt-2">
          <button className="flex-1 py-2 text-sm border border-white/20 rounded-xl hover:bg-white/5 transition-all">
            Detail →
          </button>
          <button className="flex-1 py-2 text-sm bg-purple-600 rounded-xl hover:bg-purple-700 transition-all font-bold">
            + Penawaran
          </button>
        </div>
      </motion.div>
    ))}
  </AnimatePresence>
</motion.div>
</section>

{/* Section Trusted Partners dengan Animasi AOS */}
{/* Section Trusted Partners dengan Animasi AOS */}
<section className="py-20 overflow-hidden">
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, amount: 0.2 }}
    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    className="text-center mb-12"
  >
    <h2 className="text-3xl font-bold">Trusted Partners & Customers</h2>
    <p className="text-gray-400 mt-2">Dukungan dari berbagai pihak terpercaya</p>
  </motion.div>

  {/* Slider Area (Tetap berjalan otomatis) */}
  <div className="relative flex overflow-hidden">
    <motion.div
      className="flex gap-16 whitespace-nowrap"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ ease: "linear", duration: 20, repeat: Infinity }}
    >
      {[...partners, ...partners].map((partner, i) => (
        <div key={i} className="flex items-center justify-center min-w-[200px] h-20 bg-[#1a1a1a] rounded-2xl border border-white/5 font-bold text-gray-500 hover:text-white transition-colors">
          {partner}
        </div>
      ))}
    </motion.div>
  </div>
</section>
<section className="bg-transparent py-20 px-6">
  <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
    
    {/* Kiri: Peta */}
    <div className="flex flex-col h-full">
      <h2 className="text-3xl font-bold text-white mb-4">Temukan Kami</h2>
      <p className="text-gray-400 mb-8">Hubungi kami atau kunjungi Service Center kami untuk informasi produk selengkapnya.</p>
      
      {/* Container peta dengan tinggi tetap agar bisa diukur oleh sisi form */}
      <div className="w-full h-[475px] rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-[#1a1a1a]">
        <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.836881774213!2d106.8785663749939!3d-6.425867993563943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69b83b3e10759f%3A0x89e0b8d5a8b7c7b7!2sGudang%20PT%20Indolakto!5e0!3m2!1sen!2sid!4v1716382000000!5m2!1sen!2sid"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
      </div>
    </div>

    {/* Kanan: Kirim Pesan (Sudah disesuaikan agar sejajar bawah) */}
    <div className="flex flex-col h-full">
      <h2 className="text-3xl font-bold text-white mb-4">Kirim Pesan Kepada Kami</h2>
      <p className="text-gray-400 mb-8">Punya pertanyaan? Isi formulir di bawah ini dan kami akan segera menghubungi Anda kembali.</p>
      
      {/* flex-grow memastikan form mengisi ruang tersisa */}
      <form className="flex flex-col flex-grow space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Your Name <span className="text-red-500">*</span></label>
          <input type="text" placeholder="John Doe" className="w-full p-4 rounded-lg bg-[#1a1a1a] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Alamat Email <span className="text-red-500">*</span></label>
          <input type="email" placeholder="john@example.com" className="w-full p-4 rounded-lg bg-[#1a1a1a] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Nomor Telpon (Optional)</label>
          <input type="text" placeholder="+62 812-3456-7890" className="w-full p-4 rounded-lg bg-[#1a1a1a] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500" />
        </div>
        <div className="flex-grow">
          <label className="block text-sm font-medium text-white mb-2">Pesan Kamu <span className="text-red-500">*</span></label>
          <textarea rows={4} placeholder="Tell us what you're looking for..." className="w-full p-4 rounded-lg bg-[#1a1a1a] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 h-full"></textarea>
        </div>
        
        {/* Tombol akan selalu berada di bawah karena mt-auto */}
        <button type="submit" className="w-full py-4 bg-[#7e22ce] hover:bg-[#6b21a8] text-white font-bold rounded-lg transition-all duration-300 mt-auto">
          Kirim Pesan
        </button>
      </form>
    </div>
  </div>
</section>
    </main>
  );
}