import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE = 'dsa_admin';

async function getExpectedToken(): Promise<string> {
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage =
    pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
  const isAdminApi =
    pathname.startsWith('/api/admin') && pathname !== '/api/admin/login';

  if (isAdminPage || isAdminApi) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const expected = await getExpectedToken();

    if (!token || token !== expected) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
