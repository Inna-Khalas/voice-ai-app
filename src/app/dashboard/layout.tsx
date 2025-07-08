import { prisma } from '@/lib/db';
import syncUser from '@/lib/syncUser';
import VoiceSidebarWrapper from '@/components/voice/VoiceSidebarWrapper';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await syncUser();

  if (!user) {
    return <div>Authentication error: no user</div>;
  }

  const voices = await prisma.voice.findMany({
    where: { user: { clerkId: user.clerkId } },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true },
  });

  return (
    <main className="grid grid-cols-[260px_1fr] min-h-screen">
      <VoiceSidebarWrapper initialVoices={voices} isPremium={user.premium} />
      <div>{children}</div>
    </main>
  );
}
