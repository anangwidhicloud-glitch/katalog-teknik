import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';

const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem('mp-site-theme');

    var theme =
      saved === 'light' || saved === 'dark'
        ? saved
        : window.matchMedia(
            '(prefers-color-scheme: light)'
          ).matches
          ? 'light'
          : 'dark';

    document.documentElement.dataset.siteTheme =
      theme;
  } catch (_) {
    document.documentElement.dataset.siteTheme =
      'dark';
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: themeScript,
          }}
        />

        {children}
        <Analytics />
      </body>
    </html>
  );
}