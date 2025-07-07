'use client';

import { useEffect, useState } from 'react';
import { VoiceSidebar } from '@/components/voice/VoiceSidebar';
import VoiceForm from '@/components/voice/VoiceForm';
import UpgradeButton from '@/components/voice/UpgradeButton';
import { fetchUserStatus, fetchVoices } from '@/lib/api';
import dynamic from 'next/dynamic';

const UpgradeSuccessModal = dynamic(
  () => import('@/components/voice/UpgradeSuccessModal'),
  { ssr: false },
);

interface Voice {
  id: string;
  title: string | null;
}

export default function DashboardPage() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    fetchVoices()
      .then(setVoices)
      .catch((err) => console.error(err));
    fetchUserStatus()
      .then(setIsPremium)
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="grid grid-cols-[260px_1fr] min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-400 text-white">
      <VoiceSidebar voices={voices} isPremium={isPremium} />

      <section className="p-6 m-6">
        <h1 className="text-3xl font-bold mb-6">New entry</h1>

        <VoiceForm onUploadSuccess={fetchVoices} />

        {!isPremium && (
          <div className="mt-6">
            <UpgradeButton />
          </div>
        )}

        <UpgradeSuccessModal />
      </section>
    </main>
  );
}
