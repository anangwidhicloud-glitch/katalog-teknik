'use client';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Hero */}
      <section className="pt-10 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <p className="text-purple-400 font-bold tracking-widest uppercase text-sm mb-4">
            Kontak Kami
          </p>
          <h1 className="text-5xl sm:text-6xl font-black leading-tight">
            Diskusikan Kebutuhan Teknis Anda
          </h1>
          <p className="text-gray-300 mt-4 max-w-2xl text-lg">
            Kami siap membantu konsultasi, penjadwalan, hingga rekomendasi layanan yang paling efisien untuk operasional Anda.
          </p>

          {/* Accent */}
          <div className="absolute -top-10 -right-6 w-48 h-48 rounded-full bg-purple-600/15 blur-2xl pointer-events-none" />
        </motion.div>
      </section>

      {/* Contact + Form */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Info */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="space-y-4"
            >
              <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="p-3 rounded-2xl bg-purple-600/15 text-purple-300 border border-purple-500/20">
                    <Mail className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold">Email</h3>
                    <p className="text-gray-400">anang.widhi.p@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="p-3 rounded-2xl bg-purple-600/15 text-purple-300 border border-purple-500/20">
                    <Phone className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold">Telepon</h3>
                    <p className="text-gray-400">085640100044</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <span className="p-3 rounded-2xl bg-purple-600/15 text-purple-300 border border-purple-500/20 mt-0.5">
                    <MapPin className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold">Alamat</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Jl. Mayor Oking Citeureup, Puspanegara, Kec. Citeureup, Kabupaten Bogor, Jawa Barat 16810, Indonesia
                    </p>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="pt-2"
              >
                <div className="text-gray-400 text-sm">
                  Tip: Cantumkan jenis aset/produk dan estimasi kebutuhan waktu agar kami bisa respons lebih cepat.
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.75 }}
              className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-bold">Kirim Pesan</h2>
                  <p className="text-gray-400 mt-2">
                    Isi form di bawah ini. Kami akan menghubungi Anda kembali.
                  </p>
                </div>
                <div className="hidden sm:block p-3 rounded-2xl border border-purple-500/20 bg-purple-600/10 text-purple-200">
                  <Send className="w-6 h-6" />
                </div>
              </div>

              <form className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm text-gray-200">Nama</span>
                  <input
                    className="mt-2 w-full p-4 rounded-xl bg-[#141414]/70 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    placeholder="John Doe"
                    name="name"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-200">Email</span>
                  <input
                    type="email"
                    className="mt-2 w-full p-4 rounded-xl bg-[#141414]/70 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    placeholder="john@example.com"
                    name="email"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-sm text-gray-200">Nomor Telepon (Opsional)</span>
                  <input
                    className="mt-2 w-full p-4 rounded-xl bg-[#141414]/70 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    placeholder="+62 812-3456-7890"
                    name="phone"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-sm text-gray-200">Pesan</span>
                  <textarea
                    rows={5}
                    className="mt-2 w-full p-4 rounded-xl bg-[#141414]/70 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                    placeholder="Ceritakan kebutuhan Anda..."
                    name="message"
                  />
                </label>

                <div className="sm:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold transition-all duration-300 text-white flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Kirim Pesan
                  </motion.button>

                  <div className="text-gray-400 text-xs sm:text-sm sm:pl-2">
                    Dengan mengirim, Anda setuju data digunakan untuk keperluan komunikasi.
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map (optional visual) */}
      <section className="mt-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02]"
        >
          <div className="p-5 sm:p-6 border-b border-white/10">
            <h3 className="text-2xl font-bold">Lokasi</h3>
            <p className="text-gray-400 mt-1 text-sm">
              Silakan gunakan peta sebagai referensi.
            </p>
          </div>
          <div className="h-[360px] sm:h-[420px]">
            <iframe
              className="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.836881774213!2d106.8785663749939!3d-6.425867993563943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69b83b3e10759f%3A0x89e0b8d5a8b7c7b7!2sGudang%20PT%20Indolakto!5e0!3m2!1sen!2sid!4v1716382000000!5m2!1sen!2sid"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </section>
    </div>
  );
}

