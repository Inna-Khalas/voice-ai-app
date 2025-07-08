import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { FormData } from 'undici';
import { Blob } from 'buffer'; // Не забудь импорт, если Node < 18

export async function POST(req: NextRequest, { params }: any) {
  const { id } = params;

  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });

  const voice = await prisma.voice.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!voice || voice.user.clerkId !== userId) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  try {
    const fileRes = await fetch(voice.audioUrl);
    if (!fileRes.ok) {
      return NextResponse.json(
        { message: 'Cloudinary download failed' },
        { status: 500 },
      );
    }

    const arrayBuffer = await fileRes.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' }); // важно: тип файла

    const formData = new FormData();
    formData.append('file', blob, 'audio.mp3');
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

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      console.error('OpenAI error:', err);
      return NextResponse.json(
        { message: 'OpenAI error', error: err },
        { status: 500 },
      );
    }

    const data = await openaiRes.json();

    if (!data.text) {
      return NextResponse.json(
        { message: 'No text in response' },
        { status: 500 },
      );
    }

    const updated = await prisma.voice.update({
      where: { id },
      data: { text: data.text },
    });

    return NextResponse.json({ message: 'OK', voice: updated });
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      { message: 'Internal error', error: err.message },
      { status: 500 },
    );
  }
}
