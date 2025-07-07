import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { FormData } from 'undici';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  console.log('[DEBUG] Розпізнавання голосу запущено для ID:', params.id);

  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });

  const voice = await prisma.voice.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!voice || voice.user.clerkId !== userId) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), 'public', voice.audioUrl);
  console.log('[DEBUG] Шлях до файлу:', filePath);

  const fileBuffer = await fs.readFile(filePath);

  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer]), 'audio.mp3');
  formData.append('model', 'whisper-1');

  const openaiRes = await fetch(
    'https://api.openai.com/v1/audio/transcriptions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData as any,
    },
  );

  const data = await openaiRes.json();
  console.log('[DEBUG] Відповідь OpenAI:', data);

  const text = data.text;

  if (!text) {
    return NextResponse.json(
      { message: 'Transcription failed' },
      { status: 500 },
    );
  }

  const updated = await prisma.voice.update({
    where: { id: voice.id },
    data: { text },
  });

  return NextResponse.json({ message: 'OK', voice: updated });
}
