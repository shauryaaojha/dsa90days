import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCookie, ADMIN_COOKIE } from '@/lib/admin-auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Progress from '@/models/Progress';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await verifyAdminCookie(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [totalUsers, pledgedUsers, totalCompletions, activeUserIds] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ pledgeAcceptedAt: { $ne: null } }),
    Progress.countDocuments({ completed: true }),
    Progress.distinct('userId', {
      completed: true,
      completedAt: { $gte: sevenDaysAgo },
    }),
  ]);

  return NextResponse.json({
    stats: {
      totalUsers,
      pledgedUsers,
      activeUsers7d: activeUserIds.length,
      totalCompletions,
    },
  });
}
