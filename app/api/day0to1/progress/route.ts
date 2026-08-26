import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Day0to1Progress from '@/models/Day0to1Progress';
import User from '@/models/User';
import { day0to1Topics } from '@/data/day0to1Topics';
import { rateLimit } from '@/lib/rateLimit';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const limit = await rateLimit(`day0to1-get:${session.user.id}`, 30, 60_000);
    if (!limit.ok) {
      return NextResponse.json({ error: 'Too many requests. Try again shortly.' }, { status: 429 });
    }

    await dbConnect();
    const progress = await Day0to1Progress.find({ userId: session.user.id });
    return NextResponse.json({ progress });
  } catch (error: unknown) {
    console.error('Day0to1 progress fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const limit = await rateLimit(`day0to1-post:${session.user.id}`, 30, 60_000);
    if (!limit.ok) {
      return NextResponse.json({ error: 'Too many requests. Slow down.' }, { status: 429 });
    }

    const { topicId, completed } = await req.json();
    if (!topicId || typeof completed !== 'boolean') {
      return NextResponse.json({ error: 'topicId and completed (boolean) are required' }, { status: 400 });
    }

    // Validate topicId exists before touching the database.
    const topic = day0to1Topics.find((t) => t.id === topicId);
    if (!topic) {
      return NextResponse.json({ error: 'Invalid topic ID' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findById(session.user.id).select('track day0to1Language day0to1CompletedAt');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Phase 0 is open to every student regardless of the track they picked, so
    // the only requirement is a language on file. A student who never went
    // through track selection adopts the language of the first topic they tick.
    let language = user.day0to1Language;
    if (!language) {
      language = topic.language;
      await User.findByIdAndUpdate(session.user.id, { $set: { day0to1Language: language } });
    }

    const update: Record<string, unknown> = {
      completed,
      completedAt: completed ? new Date() : null,
    };

    const progress = await Day0to1Progress.findOneAndUpdate(
      { userId: session.user.id, topicId },
      { $set: update },
      { upsert: true, new: true }
    );

    // Check if all topics for the user's language are now complete → graduate!
    let graduated = false;

    if (completed && !user.day0to1CompletedAt) {
      const langTopics = day0to1Topics.filter((t) => t.language === language);
      const completedCount = await Day0to1Progress.countDocuments({
        userId: session.user.id,
        topicId: { $in: langTopics.map((t) => t.id) },
        completed: true,
      });

      if (completedCount >= langTopics.length) {
        await User.findByIdAndUpdate(session.user.id, {
          $set: { day0to1CompletedAt: new Date() },
        });
        graduated = true;
      }
    }

    // A student can revisit a completed topic. If they uncheck it, the
    // completion state must accurately reflect the remaining checklist —
    // but only when the topic belongs to the language they are graded on.
    if (!completed && user.day0to1CompletedAt && topic.language === language) {
      await User.findByIdAndUpdate(session.user.id, { $set: { day0to1CompletedAt: null } });
    }

    return NextResponse.json({ progress, graduated });
  } catch (error: unknown) {
    console.error('Day0to1 progress update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
