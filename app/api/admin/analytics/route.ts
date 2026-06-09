import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCookie, ADMIN_COOKIE } from '@/lib/admin-auth';
import dbConnect from '@/lib/db';
import Progress from '@/models/Progress';
import User from '@/models/User';
import { problems } from '@/data/problems';

const phase1Ids = new Set(problems.filter((p) => p.phase === 1).map((p) => p.id));
const phase2Ids = new Set(problems.filter((p) => p.phase === 2).map((p) => p.id));

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await verifyAdminCookie(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const [topProblemsRaw, allCompletions, cohortRaw] = await Promise.all([
    Progress.aggregate([
      { $match: { completed: true } },
      { $group: { _id: '$problemId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    Progress.find({ completed: true }, 'problemId').lean(),
    User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            week: { $isoWeek: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
      { $limit: 16 },
    ]),
  ]);

  // Enrich top problems with names
  const problemNameMap = new Map(problems.map((p) => [p.id, p.name]));
  const topProblems = topProblemsRaw.map((p) => ({
    problemId: p._id as string,
    name: problemNameMap.get(p._id as string) ?? p._id,
    count: p.count as number,
  }));

  // Phase completion rates (unique users who completed at least one problem per phase)
  const phase1Completions = allCompletions.filter((c) => phase1Ids.has(c.problemId)).length;
  const phase2Completions = allCompletions.filter((c) => phase2Ids.has(c.problemId)).length;

  // Cohort labels
  const cohorts = cohortRaw.map((c) => ({
    label: `W${String(c._id.week).padStart(2, '0')} ${c._id.year}`,
    count: c.count as number,
  }));

  return NextResponse.json({
    topProblems,
    phase1Completions,
    phase2Completions,
    phase1Total: phase1Ids.size,
    phase2Total: phase2Ids.size,
    cohorts,
  });
}
