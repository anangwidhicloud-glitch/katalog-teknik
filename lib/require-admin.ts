import { and, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

import { db } from '@/db';
import { admins } from '@/db/schema';
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSession,
} from '@/lib/auth/admin-session';
import { env } from '@/lib/env';

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return false;
  }

  const session = verifyAdminSession(token, env.ADMIN_AUTH_SECRET);

  if (!session) {
    return false;
  }

  const email = session.sub.trim().toLowerCase();

  if (email === env.ADMIN_EMAIL.trim().toLowerCase()) {
    return true;
  }

  const [admin] = await db
    .select({ id: admins.id })
    .from(admins)
    .where(
      and(
        eq(admins.email, email),
        eq(admins.isActive, true),
      ),
    )
    .limit(1);

  return Boolean(admin);
}
