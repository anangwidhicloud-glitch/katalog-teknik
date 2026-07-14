import './admin.css';

import { requireSuperAdmin } from '@/lib/require-super-admin';

import AdminShell from './components/admin/AdminShell';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isSuperAdmin = await requireSuperAdmin();

  return (
    <AdminShell isSuperAdmin={isSuperAdmin}>
      {children}
    </AdminShell>
  );
}
