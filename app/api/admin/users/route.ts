import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCookie, ADMIN_COOKIE } from '@/lib/admin-auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Progress from '@/models/Progress';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await verifyAdminCookie(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const rawUsers = await User.find({}, '-password').sort({ createdAt: -1 }).lean();

  const userIds = rawUsers.map((u) => u._id as mongoose.Types.ObjectId);

  const progressStats = await Progress.aggregate([
    { $match: { userId: { $in: userIds }, completed: true } },
    {
      $group: {
        _id: '$userId',
        count: { $sum: 1 },
        lastActive: { $max: '$completedAt' },
      },
    },
  ]);

  const statsMap = new Map(
    progressStats.map((p) => [p._id.toString(), { count: p.count, lastActive: p.lastActive }])
  );

  const users = rawUsers.map((u) => {
    const id = (u._id as mongoose.Types.ObjectId).toString();
    const stats = statsMap.get(id);
    return {
      id,
      name: u.name,
      email: u.email,
      provider: u.provider,
      createdAt: u.createdAt,
      pledgeAcceptedAt: u.pledgeAcceptedAt,
      problemsSolved: stats?.count ?? 0,
      lastActive: stats?.lastActive ?? null,
    };
  });

  return NextResponse.json({ users });
}
