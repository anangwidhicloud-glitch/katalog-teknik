import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ShootingStarField from "./components/ShootingStarField"; // 1. Impor komponen bintang Anda

export const metadata: Metadata = {
  title: "Showroom Katalog",
  description: "Katalog produk teknik profesional",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      {/* Tambahkan bg-[#0a0a0f] di body agar background gelap merata */}
      <body className="bg-[#0a0a0f] text-white">
        <Header />
        
        {/* ShootingStarField dipasang di sini agar muncul di semua halaman */}
        <ShootingStarField />
        
        {/* Tambahkan 'relative z-10' agar konten berada di atas background animasi */}
        <main className="min-h-screen pt-20 relative z-10">
          {children}
        </main>
        
        <Footer /> 
      </body>
    </html>
  );
}