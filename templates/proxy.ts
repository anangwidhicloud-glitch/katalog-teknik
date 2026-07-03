import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSession,
} from './lib/admin-auth';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authSecret = process.env.ADMIN_AUTH_SECRET;

  const sessionToken = request.cookies.get(
    ADMIN_SESSION_COOKIE,
  )?.value;

  const session =
    authSecret && sessionToken
      ? verifyAdminSession(
          sessionToken,
          authSecret,
        )
      : null;

  if (pathname === '/admin-login') {
    if (session) {
      return NextResponse.redirect(
        new URL('/admin', request.url),
      );
    }

    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL(
      '/admin-login',
      request.url,
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin-login'],
};
