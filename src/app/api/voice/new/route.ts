import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import syncUser from '@/lib/syncUser';
import cloudinary from '@/lib/cloudinari';

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

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  const dataUri = `data:${file.type};base64,${base64}`;

  let uploadResult;
  try {
    uploadResult = await cloudinary.uploader.upload(dataUri, {
      resource_type: 'auto',
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Cloudinary upload failed', error: (error as Error).message },
      { status: 500 },
    );
  }

  const voice = await prisma.voice.create({
    data: {
      title,
      audioUrl: uploadResult.secure_url,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  return NextResponse.json({ message: 'Created', voice });
}
