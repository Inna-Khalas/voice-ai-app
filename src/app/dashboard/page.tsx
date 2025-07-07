'use client';

import { useEffect, useState } from 'react';
import { VoiceSidebar } from '@/components/voice/VoiceSidebar';
import VoiceForm from '@/components/voice/VoiceForm';
import UpgradeButton from '@/components/voice/UpgradeButton';
import dynamic from 'next/dynamic';

const UpgradeSuccessModal = dynamic(
  () => import('@/components/voice/UpgradeSuccessModal'),
);

interface Voice {
  id: string;
  title: string | null;
}

export default function DashboardPage() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isPremium, setIsPremium] = useState(false);

  const fetchVoices = async () => {
    try {
      const res = await fetch('/api/voice/list');
      const data = await res.json();
      setVoices(data.voices);
    } catch (err) {
      console.error('Failed to fetch voices', err);
    }
  };

  const fetchUserStatus = async () => {
    try {
      const res = await fetch('/api/user');
      const data = await res.json();
      setIsPremium(data.isPremium);
    } catch (err) {
      console.error('Failed to fetch user status', err);
    }
  };

  useEffect(() => {
    fetchVoices();
    fetchUserStatus();
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
