import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = params;

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const voice = await prisma.voice.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!voice || voice.user.clerkId !== userId) {
    return NextResponse.json(
      { message: 'Запис не знайдено або відсутні права' },
      { status: 404 },
    );
  }

  await prisma.voice.delete({
    where: { id },
  });

  return NextResponse.json({ message: 'Запис видалено' }, { status: 200 });
}
