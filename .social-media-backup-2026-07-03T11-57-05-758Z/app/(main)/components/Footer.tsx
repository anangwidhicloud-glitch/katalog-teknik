'use client';
import { useSheetData } from '../../hooks/useSheetData';

export default function Footer() {
  // Mengambil data dari Google Sheets
  const { data: settings } = useSheetData('Settings');

  // Helper fungsi untuk mengambil nilai berdasarkan key
  const getVal = (key: string) => {
    const item = settings?.find((s: any) => s.key === key);
    return item ? item.value : null;
  };

  return (
    <>
      <footer className="bg-[#0a0a0f]/60 backdrop-blur-sm py-12 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Grid Menu Utama */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Kolom 1: Showroom Kita */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Showroom Kita</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Mitra terpercaya Anda dalam menyediakan peralatan otomotif hingga hand tools premium. Pilihan terbaik, layanan berkualitas.
              </p>
            </div>

            {/* Kolom 2: Akses Cepat */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Akses Cepat</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="hover:text-purple-400 transition cursor-pointer">Beranda</li>
                <li className="hover:text-purple-400 transition cursor-pointer">Produk</li>
                <li className="hover:text-purple-400 transition cursor-pointer">Layanan</li>
                <li className="hover:text-purple-400 transition cursor-pointer">Galeri</li>
                <li className="hover:text-purple-400 transition cursor-pointer">Kontak Kami</li>
              </ul>
            </div>

            {/* Kolom 3: Contact (DINAMIS) */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Contact</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
  {getVal('footer_phone') || "Nomor belum diisi di Sheet"}
</li>
<li className="flex items-center gap-2">
  {getVal('footer_email') || "Email belum diisi di Sheet"}
</li>
                <li className="flex items-start gap-2">
                  <span className="flex-1">{getVal('footer_address') || "Jl. Mayor Oking Citeureup, Puspanegara, Kec. Citeureup, Kabupaten Bogor, Jawa Barat 16810, Indonesia"}</span>
                </li>
              </ul>
            </div>

            {/* Kolom 4: Jam Buka */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Jam Buka</h3>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li className="flex justify-between"><span>Senin</span><span>09:00 ~ 16:30</span></li>
                <li className="flex justify-between"><span>Selasa</span><span>09:00 ~ 16:30</span></li>
                <li className="flex justify-between"><span>Rabu</span><span>09:00 ~ 16:30</span></li>
                <li className="flex justify-between"><span>Kamis</span><span>09:00 ~ 16:30</span></li>
                <li className="flex justify-between"><span>Jumat</span><span>09:00 ~ 16:30</span></li>
                <li className="flex justify-between"><span>Sabtu</span><span>09:00 ~ 15:00</span></li>
                <li className="flex justify-between text-red-400 font-medium"><span>Minggu</span><span>Libur</span></li>
              </ul>
            </div>
          </div>

          {/* Bagian Icon & Tulisan Media Sosial (DINAMIS) */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center justify-center space-y-4">
            <p className="text-gray-400 text-sm font-medium tracking-wide">Kunjungi Sosial Media Kami</p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              
              <a href={getVal('link_tiktok') || "#"} className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition text-sm">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.16 1.02.11 2.05.03 3.07.05v3.9c-1.2-.02-2.4-.3-3.46-.89-.25-.14-.49-.31-.72-.49-.11 1.76-.03 3.53-.02 5.29-.02 2.62-.77 5.24-2.58 7.15-1.92 2.11-4.94 3.01-7.72 2.4-3.41-.62-6.04-3.79-5.92-7.25.12-4.07 3.88-7.3 7.95-6.79.02 1.43-.01 2.86-.01 4.29-2.01-.43-4.22.46-4.87 2.45-.63 1.74.21 3.85 1.89 4.49 1.71.72 3.86-.16 4.31-1.98.13-.6.12-1.22.12-1.84V0z"/></svg>
                <span>TikTok</span>
              </a>

              <a href={getVal('link_fb') || "#"} className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition text-sm">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <span>Facebook</span>
              </a>

              <a href={getVal('link_yt') || "#"} className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition text-sm">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                <span>YouTube</span>
              </a>

              <a href={getVal('link_ig') || "#"} className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition text-sm">
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <div className="bg-transparent border-t border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>© 2026 Showroom Kita . All rights reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <span className="hover:text-purple-400 transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-purple-400 transition cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </>
  );
}