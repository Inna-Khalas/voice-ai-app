import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

import { prisma } from '@/lib/db';
import syncUser from '@/lib/syncUser';

export async function POST(req: Request) {
  const user = await syncUser();

  if (!user) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const voices = await prisma.voice.count({
    where: { userId: user.id },
  });

  if (!user.premium && voices >= 2) {
    return NextResponse.json(
      {
        message:
          'Ви вичерпали ліміт безкоштовних записів. Оновіть акаунт для продовження',
      },
      { status: 403 },
    );
  }

  const formData = await req.formData();
  const title = formData.get('title') as string;
  const file = formData.get('audio') as File;

  if (!title || !file) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${randomUUID()}-${file.name}`;
  const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

  await writeFile(filePath, buffer);

  const voice = await prisma.voice.create({
    data: {
      title,
      audioUrl: `/uploads/${fileName}`,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  return NextResponse.json({ message: 'Created', voice });
}
