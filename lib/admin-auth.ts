export const ADMIN_COOKIE = 'dsa_admin';
export const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

export async function getExpectedAdminToken(): Promise<string> {
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

export async function verifyAdminCookie(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const expected = await getExpectedAdminToken();
  return value === expected;
}
