import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Day0to1Progress from '@/models/Day0to1Progress';
import { day0to1Topics } from '@/data/day0to1Topics';
import type { Phase0Language } from '@/data/day0to1Topics';
import { rateLimit } from '@/lib/rateLimit';

const LANGUAGES: Phase0Language[] = ['cpp', 'java', 'python'];
const TRACKS = ['phase0', 'phase1'] as const;
type Track = (typeof TRACKS)[number];

const SELECT = 'track day0to1Language day0to1CompletedAt phase1StartedAt pledgeAcceptedAt';

/**
 * Graduation is per-language: finishing the C++ syllabus says nothing about
 * Python. Whenever a student changes language we re-derive the completion
 * stamp from the progress rows of the language they moved to, using the last
 * topic they ticked so the original date survives a round trip.
 */
async function graduationDateFor(userId: string, language: Phase0Language): Promise<Date | null> {
  const topicIds = day0to1Topics.filter((t) => t.language === language).map((t) => t.id);
  const done = await Day0to1Progress.find({
    userId,
    topicId: { $in: topicIds },
    completed: true,
  }).select('completedAt');

  if (done.length < topicIds.length) return null;

  const stamps = done.map((p) => p.completedAt?.getTime() ?? 0).filter(Boolean);
  return stamps.length ? new Date(Math.max(...stamps)) : new Date();
}

/**
 * The 90-day counter's anchor. Students who reached Phase 1 before this field
 * existed have no stamp, so fall back to the pledge date they were already
 * being counted from — otherwise their day number would reset to 1 on deploy.
 * Still null for anyone on Phase 0: the clock has not begun.
 */
function clockAnchor(user: {
  phase1StartedAt?: Date | null;
  track?: string | null;
  pledgeAcceptedAt?: Date | null;
}): Date | null {
  return user.phase1StartedAt ?? (user.track === 'phase1' ? user.pledgeAcceptedAt ?? null : null);
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id).select(SELECT);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Phase 0 counts are served from here so the 90-day dashboard can show a
    // progress card without pulling the 690-line topic list into its bundle.
    const language = user.day0to1Language ?? null;
    const topicIds = language
      ? day0to1Topics.filter((t) => t.language === language).map((t) => t.id)
      : [];
    const completedCount = topicIds.length
      ? await Day0to1Progress.countDocuments({
          userId: session.user.id,
          topicId: { $in: topicIds },
          completed: true,
        })
      : 0;

    return NextResponse.json({
      track: user.track ?? null,
      day0to1Language: language,
      day0to1CompletedAt: user.day0to1CompletedAt ?? null,
      phase1StartedAt: clockAnchor(user),
      totalTopics: topicIds.length,
      completedCount,
    });
  } catch (error: unknown) {
    console.error('Track fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const limit = await rateLimit(`track-post:${session.user.id}`, 10, 60_000);
    if (!limit.ok) {
      return NextResponse.json({ error: 'Too many requests. Try again shortly.' }, { status: 429 });
    }

    const body = (await req.json().catch(() => ({}))) as {
      track?: unknown;
      language?: unknown;
    };

    // Both fields are optional — the language switcher on the Phase 0 page
    // sends only a language, and the "advance" button sends only a track.
    const track = body.track ?? null;
    const language = body.language ?? null;

    if (track !== null && !TRACKS.includes(track as Track)) {
      return NextResponse.json({ error: 'track must be phase0 or phase1' }, { status: 400 });
    }
    if (language !== null && !LANGUAGES.includes(language as Phase0Language)) {
      return NextResponse.json(
        { error: 'language must be one of: cpp, java, python' },
        { status: 400 }
      );
    }
    if (track === null && language === null) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findById(session.user.id).select(SELECT);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (track === 'phase0' && !language && !user.day0to1Language) {
      return NextResponse.json(
        { error: 'Phase 0 requires a language choice (cpp, java, or python).' },
        { status: 400 }
      );
    }

    const update: Record<string, unknown> = {};
    if (track !== null) update.track = track;

    // Start the 90-day clock the first time this student enters Phase 1 —
    // whether from track selection or the "advance" button after finishing
    // Phase 0. Never overwritten, so the deadline cannot be reset by toggling.
    if (track === 'phase1' && !user.phase1StartedAt) {
      update.phase1StartedAt = new Date();
    }

    // Switching to phase1 keeps the language on record.
    if (language !== null && language !== user.day0to1Language) {
      update.day0to1Language = language;
      update.day0to1CompletedAt = await graduationDateFor(
        session.user.id,
        language as Phase0Language
      );
    }

    const updated = await User.findByIdAndUpdate(session.user.id, { $set: update }, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      track: updated.track,
      day0to1Language: updated.day0to1Language,
      day0to1CompletedAt: updated.day0to1CompletedAt,
      phase1StartedAt: clockAnchor(updated),
    });
  } catch (error: unknown) {
    console.error('Track update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
