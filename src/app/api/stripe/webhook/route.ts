import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error('❌ Помилка верифікації Webhook:', err);
    return new NextResponse(`Webhook Error: ${(err as Error).message}`, {
      status: 400,
    });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const clerkId = session.metadata?.clerkId;

    if (clerkId) {
      try {
        await prisma.user.update({
          where: { clerkId },
          data: {
            premium: true,
          },
        });
      } catch (err) {
        console.error('❌ Помилка при оновленні користувача:', err);
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}
