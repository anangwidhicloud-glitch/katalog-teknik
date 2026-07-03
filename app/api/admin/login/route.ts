import { NextResponse } from 'next/server';

import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSession,
  secureCompare,
} from '../../../../lib/admin-auth';

export const runtime = 'nodejs';

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

function delay(milliseconds: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, milliseconds),
  );
}

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json(
      {
        message: 'Format permintaan tidak valid.',
      },
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

  const configuredEmail = process.env.ADMIN_EMAIL
    ?.trim()
    .toLowerCase();

  const configuredPassword =
    process.env.ADMIN_PASSWORD;

  const authSecret = process.env.ADMIN_AUTH_SECRET;

  if (
    !configuredEmail ||
    !configuredPassword ||
    !authSecret
  ) {
    console.error(
      'ADMIN_EMAIL, ADMIN_PASSWORD, atau ADMIN_AUTH_SECRET belum dikonfigurasi.',
    );

    return NextResponse.json(
      {
        message:
          'Konfigurasi login admin belum lengkap.',
      },
      { status: 500 },
    );
  }

  const validEmail = secureCompare(
    email,
    configuredEmail,
  );

  const validPassword = secureCompare(
    password,
    configuredPassword,
  );

  if (!validEmail || !validPassword) {
    await delay(650);

    return NextResponse.json(
      {
        message: 'Email atau kata sandi salah.',
      },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSession(
      configuredEmail,
      authSecret,
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE,
  });

  return response;
}
