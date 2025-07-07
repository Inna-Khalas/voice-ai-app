import { NextResponse } from 'next/server';
import syncUser from '@/lib/syncUser';

export async function GET() {
  const user = await syncUser();

  if (!user) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json({ isPremium: user.premium });
}
