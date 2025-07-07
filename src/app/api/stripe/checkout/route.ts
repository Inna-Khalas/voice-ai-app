import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user)
    return NextResponse.json({ message: 'User not found' }, { status: 404 });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Voice to Text Premium',
          },
          unit_amount: 500, // $5.00
        },
        quantity: 1,
      },
    ],
    metadata: {
      clerkId: userId,
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?cancelled=true`,
  });

  return NextResponse.json({ url: session.url });
}
