import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import VoiceSidebarWrapper from '@/components/voice/VoiceSidebarWrapper';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) return <div>Authentication error: no user</div>;
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
      <VoiceSidebarWrapper initialVoices={voices} isPremium={user.premium} />
      <div>{children}</div>
    </main>
  );
}
