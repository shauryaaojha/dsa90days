import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
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
    const user = await User.findById(session.user.id).select('-password');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // ── Change password flow ──────────────────────────────────────────────────
    if (body.action === 'change-password') {
      const { oldPassword, newPassword } = body;

      if (!oldPassword || !newPassword) {
        return NextResponse.json({ error: 'Both old and new password are required' }, { status: 400 });
      }
      if (typeof newPassword !== 'string' || newPassword.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
      }

      await dbConnect();
      const user = await User.findById(session.user.id);
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
      if (!user.password) return NextResponse.json({ error: 'Google accounts cannot change password here' }, { status: 400 });

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }

      const hashed = await bcrypt.hash(newPassword, 12);
      user.password = hashed;
      await user.save();

      return NextResponse.json({ message: 'Password updated successfully' });
    }

    // ── Update name flow ──────────────────────────────────────────────────────
    const { name } = body;
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: { name: name.trim() } },
      { new: true }
    ).select('-password');

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
