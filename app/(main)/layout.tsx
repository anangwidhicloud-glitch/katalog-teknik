import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ShootingStarField from "./components/ShootingStarField"; // 1. Impor komponen bintang Anda

export const metadata: Metadata = {
  title: "Showroom Katalog",
  description: "Katalog produk teknik profesional",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}