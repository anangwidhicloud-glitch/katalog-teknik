import type { Metadata } from 'next';

import './globals.css';

import AOSProvider from './components/AOSProvider';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Footer from './components/Footer';
import Header from './components/Header';
import HiddenAdminAccess from './components/HiddenAdminAccess';
import SiteBackground from './components/SiteBackground';
import { ThemeProvider } from './components/ThemeProvider';
import InternalAnalyticsTracker from "./components/InternalAnalyticsTracker";
import { Suspense } from 'react';
export const metadata: Metadata = {
  title: {
    default: 'MP Katalog Teknik',
    template: '%s | MP Katalog Teknik',
  },
  description:
    'Katalog peralatan otomotif, hidraulis, dan perlengkapan teknik profesional.',
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AOSProvider />
      <SiteBackground />
      <Header />
      <HiddenAdminAccess />
<Suspense fallback={null}>
  <InternalAnalyticsTracker />
</Suspense>
      <div className="site-content">
        {children}
      </div>

      <Footer />
      <FloatingWhatsApp />
    </ThemeProvider>
  );
}
