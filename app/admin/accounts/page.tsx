import { redirect } from 'next/navigation';

import { env } from '@/lib/env';
import { requireSuperAdmin } from '@/lib/require-super-admin';

import AccountsManager from './AccountsManager';

export const dynamic = 'force-dynamic';

export default async function AccountsPage() {
  const isSuperAdmin = await requireSuperAdmin();

  if (!isSuperAdmin) {
    redirect('/admin/dashboard');
  }

  return <AccountsManager superAdminEmail={env.ADMIN_EMAIL} />;
}
