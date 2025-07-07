import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const voices = await prisma.voice.findMany({
    where: { user: { clerkId: userId } },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true },
  });

  return NextResponse.json({ voices });
}
