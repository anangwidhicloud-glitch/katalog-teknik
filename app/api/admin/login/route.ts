import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/db';
import { admins } from '@/db/schema';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSession,
} from '@/lib/auth/admin-session';
import { verifyPassword } from '@/lib/auth/password';
import { env } from '@/lib/env';

export const runtime = 'nodejs';

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json(
      { message: 'Format request tidak valid.' },
      { status: 400 },
    );
  }

  const email =
    typeof body.email === 'string'
      ? body.email.trim().toLowerCase()
      : '';
  const password =
    typeof body.password === 'string'
      ? body.password
      : '';

  try {
    const superAdminEmail = env.ADMIN_EMAIL.trim().toLowerCase();
    const isSuperAdminEmail = email === superAdminEmail;

    const [regularAdmin] = isSuperAdminEmail
      ? []
      : await db
          .select({
            id: admins.id,
            email: admins.email,
            passwordHash: admins.passwordHash,
          })
          .from(admins)
          .where(
            and(
              eq(admins.email, email),
              eq(admins.isActive, true),
            ),
          )
          .limit(1);

    const passwordHash = isSuperAdminEmail
      ? env.ADMIN_PASSWORD_HASH
      : regularAdmin?.passwordHash ?? env.ADMIN_PASSWORD_HASH;

    const validPassword = await verifyPassword(password, passwordHash);
    const validAccount = isSuperAdminEmail || Boolean(regularAdmin);

    if (!validAccount || !validPassword) {
      await delay(650);
      return NextResponse.json(
        { message: 'Email atau password salah.' },
        { status: 401 },
      );
    }

    if (regularAdmin) {
      await db
        .update(admins)
        .set({
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(admins.id, regularAdmin.id));
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: createAdminSession(email, env.ADMIN_AUTH_SECRET),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ADMIN_SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error('Gagal login admin:', error);

    return NextResponse.json(
      { message: 'Login gagal. Silakan coba kembali.' },
      { status: 500 },
    );
  }
}
