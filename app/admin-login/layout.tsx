import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login Admin | Katalog Teknik',
  description:
    'Halaman masuk untuk pengelolaan Katalog Teknik.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
