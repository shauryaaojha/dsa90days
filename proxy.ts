import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

const ADMIN_COOKIE = 'dsa_admin';

async function getExpectedAdminToken(): Promise<string> {
  const secret = process.env.NEXTAUTH_SECRET ?? '';
  const password = process.env.ADMIN_PASSWORD ?? '';
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode('dsa-admin:' + password));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const proxy = auth(async (request) => {
  const { pathname } = request.nextUrl;

  // Admin login page and API — always allow through
  if (pathname.startsWith('/admin/login') || pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  // Admin routes — cookie-based auth, no NextAuth session required
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const expected = await getExpectedAdminToken();
    if (!token || token !== expected) {
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // All other matched routes — require NextAuth session
  if (!request.auth) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!api/auth|api/register|login|register|_next/static|_next/image|favicon.ico).*)',
  ],
};
