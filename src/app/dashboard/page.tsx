'use client';

import { useEffect, useMemo, useState } from 'react';
import VoiceForm from '@/components/voice/VoiceForm';
import UpgradeButton from '@/components/voice/UpgradeButton';
import dynamic from 'next/dynamic';
import { fetchUserStatus } from '@/lib/api';

const UpgradeSuccessModal = dynamic(
  () => import('@/components/voice/UpgradeSuccessModal'),
  { ssr: false },
);

export default function DashboardPage() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStatus()
      .then(setIsPremium)
      .finally(() => setLoading(false));
  }, []);

  const upgradeButton = useMemo(() => {
    if (loading || isPremium) return null;

    return (
      <div className="mt-6">
        <UpgradeButton />
      </div>
    );
  }, [isPremium, loading]);

  return (
    <section className="p-6 m-6">
      <h1 className="text-3xl font-bold mb-6">New entry</h1>

      <VoiceForm  />

      {upgradeButton}

      <UpgradeSuccessModal />
    </section>
  );
}
