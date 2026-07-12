import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { verifyPassword } from '@/lib/auth/password';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSession,
} from '@/lib/auth/admin-session';

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
    typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  const validEmail = email === env.ADMIN_EMAIL.toLowerCase();
  const validPassword = await verifyPassword(password, env.ADMIN_PASSWORD_HASH);

  if (!validEmail || !validPassword) {
    await delay(650);

    return NextResponse.json(
      { message: 'Email atau password salah.' },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSession(env.ADMIN_EMAIL, env.ADMIN_AUTH_SECRET),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE,
  });

  return response;
}
