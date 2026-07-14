import { cookies } from 'next/headers';

import { env } from './env';
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from './auth/admin-session';

export async function requireSuperAdmin() {
  const cookieStore = await cookies();

  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return false;

  const session = verifyAdminSession(token, env.ADMIN_AUTH_SECRET);
  if (!session) return false;

  return session.sub === env.ADMIN_EMAIL;
}
