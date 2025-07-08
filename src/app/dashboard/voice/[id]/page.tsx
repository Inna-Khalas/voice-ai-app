import { TranscribeButton } from '@/components/voice/Button';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function Page({ params }: any) {
  const { userId } = await auth();
  if (!userId) return notFound();

  const { id } = params;
  const voice = await prisma.voice.findUnique({
    where: { id: id },
    include: { user: true },
  });

  if (!voice || voice.user.clerkId !== userId) return notFound();

  return (
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
        Your browser does not support audio playback.
      </audio>

      <div>
        <h2 className="font-semibold text-lg mb-2">Transcription:</h2>
        <p className="text-gray-200 whitespace-pre-wrap">
          {voice.text || <i>There is no transcription yet.</i>}
        </p>
      </div>

      <TranscribeButton id={voice.id} />
    </section>
  );
}
