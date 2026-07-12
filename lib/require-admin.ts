import { cookies } from 'next/headers';

import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSession,
} from './auth/admin-session';

export async function isAdminAuthenticated() {
  const authSecret =
    process.env.ADMIN_AUTH_SECRET;

  if (!authSecret) {
    return false;
  }

  const cookieStore = await cookies();

  const token = cookieStore.get(
    ADMIN_SESSION_COOKIE,
  )?.value;

  if (!token) {
    return false;
  }

  const session = verifyAdminSession(
    token,
    authSecret,
  );

  return Boolean(session);
}