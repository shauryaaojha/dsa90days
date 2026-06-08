import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id).select('pledgeAcceptedAt');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ pledgeAcceptedAt: user.pledgeAcceptedAt ?? null });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Only set once — pledge date never resets
    if (!user.pledgeAcceptedAt) {
      user.pledgeAcceptedAt = new Date();
      await user.save();
    }

    return NextResponse.json({ pledgeAcceptedAt: user.pledgeAcceptedAt });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
