'use client';

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-400 text-white px-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl text-center space-y-6">
        <SignedIn>
          <div className="flex justify-end">
            <UserButton />
          </div>
          <h1 className="text-3xl font-bold">👋 Welcome to Voice to Text</h1>
          <p className="text-lg">Ready to create your first voice recording?</p>
          <Link
            href="/dashboard"
            className="inline-block mt-4 bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Go to Dashboard
          </Link>
        </SignedIn>

        <SignedOut>
          <h1 className="text-3xl font-bold">🎤 Voice to Text</h1>
          <p className="text-lg">Create and transcribe voice messages </p>
          <div className="flex flex-col gap-4 mt-6">
            <Link
              href="/sign-in"
              className="bg-white text-purple-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="text-white border border-white font-semibold px-6 py-3 rounded-lg hover:bg-white/20 transition"
            >
              Register
            </Link>
          </div>
        </SignedOut>
      </div>
    </main>
  );
}
