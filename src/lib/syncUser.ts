import { currentUser } from '@clerk/nextjs/server';
import { prisma } from './db';

export default async function syncUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const existing = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });
  if (existing) return existing;

  const newUser = await prisma.user.create({
    data: {
      email: clerkUser.emailAddresses[0].emailAddress,
      clerkId: clerkUser.id,
    },
  });
  return newUser;
}
