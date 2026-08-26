import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Durable rate-limit buckets.
 *
 * The previous limiter was an in-process Map, which on a serverless platform
 * gives every instance its own empty counter and loses everything on a cold
 * start — so "3 attempts per 10 minutes" was really "3 per instance, resetting
 * whenever the platform felt like it". Buckets live in Mongo instead so every
 * instance counts against the same total.
 *
 * `_id` is `${key}:${windowStart}` (a fixed window), which makes the whole
 * check a single upsert with no read-then-write race. Expired buckets are
 * reaped by the TTL index rather than an interval timer that never fires on
 * serverless anyway.
 */
// Document<string> — the _id here is our own `${key}:${windowStart}` string,
// not a generated ObjectId.
export interface IRateLimit extends Document<string> {
  _id: string;
  count: number;
  expiresAt: Date;
}

const RateLimitSchema = new Schema<IRateLimit>(
  {
    _id: { type: String, required: true },
    count: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
  },
  { versionKey: false }
);

// TTL — Mongo drops the bucket once its window has passed.
RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RateLimit: Model<IRateLimit> =
  mongoose.models.RateLimit || mongoose.model<IRateLimit>('RateLimit', RateLimitSchema);

export default RateLimit;
