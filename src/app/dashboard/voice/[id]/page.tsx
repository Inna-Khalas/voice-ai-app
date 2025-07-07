import { TranscribeButton } from '@/components/voice/Button';
import { VoiceSidebar } from '@/components/voice/VoiceSidebar';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: {
    id: string;
  };
}

export default async function Page({ params }: Props) {
  const { userId } = await auth();
  if (!userId) return notFound();

  const voice = await prisma.voice.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!voice || voice.user.clerkId !== userId) return notFound();

  const voices = await prisma.voice.findMany({
    where: { user: { clerkId: userId } },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true },
  });

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { premium: true },
  });

  if (!user) return notFound();

  return (
    <main className="grid grid-cols-[260px_1fr] min-h-screen">
      <VoiceSidebar voices={voices} isPremium={user.premium} />

      <section className="p-6 space-y-6">
        <Link
          href="/dashboard"
          className="inline-block text-sm text-white hover:text-blue-400 transition"
        >
          ← Return to Dashboard
        </Link>

        <h1 className="text-2xl font-bold">{voice.title}</h1>

        <audio controls className="w-full rounded">
          <source src={voice.audioUrl} type="audio/mpeg" />
          Your browser does not support audio playback.{' '}
        </audio>

        <div>
          <h2 className="font-semibold text-lg mb-2">Transcription:</h2>
          <p className="text-gray-200 whitespace-pre-wrap">
            {voice.text || <i>There is no transcription yet.</i>}
          </p>
        </div>

        <TranscribeButton id={voice.id} />
      </section>
    </main>
  );
}
