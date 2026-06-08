import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Progress from '@/models/Progress';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const progress = await Progress.find({ userId: session.user.id });

    return NextResponse.json({ progress });
  } catch (error: unknown) {
    console.error('Progress fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { problemId, completed, notes } = await req.json();

    if (!problemId) {
      return NextResponse.json(
        { error: 'Problem ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const update: Record<string, unknown> = {};
    if (typeof completed === 'boolean') {
      update.completed = completed;
      update.completedAt = completed ? new Date() : null;
    }
    if (typeof notes === 'string') {
      update.notes = notes;
    }

    const progress = await Progress.findOneAndUpdate(
      { userId: session.user.id, problemId },
      { $set: update },
      { upsert: true, new: true }
    );

    return NextResponse.json({ progress });
  } catch (error: unknown) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
