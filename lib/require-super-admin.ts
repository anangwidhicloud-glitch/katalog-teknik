import { cookies } from 'next/headers';

import { ADMIN_SESSION_COOKIE, verifyAdminSession } from '@/lib/auth/admin-session';
import { env } from '@/lib/env';

export async function requireSuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return false;
  }

  const session = verifyAdminSession(token, env.ADMIN_AUTH_SECRET);

  if (!session) {
    return false;
  }

  return session.sub.trim().toLowerCase() === env.ADMIN_EMAIL.trim().toLowerCase();
}
