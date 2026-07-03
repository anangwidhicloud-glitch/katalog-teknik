import type { Metadata } from 'next';
import './globals.css';
import AOSProvider from './components/AOSProvider';
import Footer from './components/Footer';
import Header from './components/Header';
import SiteBackground from './components/SiteBackground';
import { ThemeProvider } from './components/ThemeProvider';

export const metadata: Metadata = {
  title: {
    default: 'MP Katalog Teknik',
    template: '%s | MP Katalog Teknik',
  },
  description: 'Katalog peralatan otomotif, hidraulis, dan perlengkapan teknik profesional.',
};

const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem('mp-site-theme');
    var theme = saved === 'light' || saved === 'dark'
      ? saved
      : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.dataset.siteTheme = theme;
  } catch (_) {
    document.documentElement.dataset.siteTheme = 'dark';
  }
})();`;

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <AOSProvider />
      <SiteBackground />
      <Header />
      <div className="site-content">{children}</div>
      <Footer />
    </ThemeProvider>
  );
}
