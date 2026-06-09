import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCookie, ADMIN_COOKIE } from '@/lib/admin-auth';
import dbConnect from '@/lib/db';
import Quote from '@/models/Quote';

async function checkAuth(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  return verifyAdminCookie(token);
}

export async function GET(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const quotes = await Quote.find({}).sort({ dayIndex: 1 }).lean();
  return NextResponse.json({ quotes });
}

export async function POST(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const body = await request.json();
  const { dayIndex, text, translation, meaning, source } = body;

  if (!dayIndex || !text || !meaning || !source) {
    return NextResponse.json({ error: 'dayIndex, text, meaning, and source are required' }, { status: 400 });
  }

  const quote = await Quote.create({ dayIndex, text, translation, meaning, source });
  return NextResponse.json({ quote }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const body = await request.json();
  const { id, dayIndex, text, translation, meaning, source } = body;

  if (!id) {
    return NextResponse.json({ error: 'Quote id is required' }, { status: 400 });
  }

  const quote = await Quote.findByIdAndUpdate(
    id,
    { dayIndex, text, translation, meaning, source },
    { new: true, runValidators: true }
  );

  if (!quote) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
  }

  return NextResponse.json({ quote });
}

export async function DELETE(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Quote id is required' }, { status: 400 });
  }

  await Quote.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
