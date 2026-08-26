// Shared sliding-ish (fixed-window) rate limiter backed by MongoDB, so the
// counter survives cold starts and is shared across every serverless instance.
// Keyed by an arbitrary string (IP, email, "ip:purpose", ...).

import dbConnect from '@/lib/db';
import RateLimitModel from '@/models/RateLimit';

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
}

export interface RateLimitOptions {
  /**
   * What to do when the datastore itself is unreachable.
   *
   * Default is fail-open: a Mongo hiccup should not lock 2,400 students out of
   * registration. Endpoints where an unlimited retry budget is the bigger risk
   * than a false lockout pass `failClosed: true` and are refused instead.
   *
   * No caller opts in today — the `/admin` login route was the only one, and it
   * is gone. Kept because any future secret-guessing endpoint wants it.
   */
  failClosed?: boolean;
}

/**
 * @param key      unique bucket key
 * @param limit    max attempts allowed within the window
 * @param windowMs window length in milliseconds
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  options: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const resetAt = windowStart + windowMs;
  const retryAfterSec = Math.max(1, Math.ceil((resetAt - now) / 1000));

  try {
    await dbConnect();

    // One atomic upsert: no read-then-write window for concurrent requests to
    // slip through. `count` is the value *after* this request is counted.
    const bucket = await RateLimitModel.findOneAndUpdate(
      { _id: `${key}:${windowStart}` },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(resetAt) } },
      { upsert: true, returnDocument: 'after' }
    ).lean();

    const count = bucket?.count ?? 1;
    if (count > limit) {
      return { ok: false, remaining: 0, retryAfterSec };
    }
    return { ok: true, remaining: Math.max(0, limit - count), retryAfterSec: 0 };
  } catch (err) {
    console.error('Rate limit check failed:', err);
    if (options.failClosed) {
      return { ok: false, remaining: 0, retryAfterSec };
    }
    return { ok: true, remaining: limit - 1, retryAfterSec: 0 };
  }
}

/**
 * Best-effort client IP.
 *
 * `x-forwarded-for` is append-only, so its LEFTMOST entry is whatever the
 * client chose to send — using it means anyone can mint a fresh rate-limit
 * bucket per request. Vercel sets `x-vercel-forwarded-for` itself and a client
 * cannot forge it, so prefer that; otherwise take the rightmost hop, which is
 * the address our own edge actually observed.
 */
export function clientIp(req: { headers: { get(name: string): string | null } }): string {
  const vercel = req.headers.get('x-vercel-forwarded-for');
  if (vercel) return vercel.split(',')[0].trim();

  const real = req.headers.get('x-real-ip');
  if (real) return real.trim();

  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const hops = xff.split(',').map((h) => h.trim()).filter(Boolean);
    if (hops.length) return hops[hops.length - 1];
  }

  return 'unknown';
}
