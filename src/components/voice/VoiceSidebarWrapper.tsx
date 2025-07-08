'use client';

import { useState, useCallback } from 'react';
import { VoiceSidebar } from './VoiceSidebar';
import { fetchVoices } from '@/lib/api';

interface Voice {
  id: string;
  title: string | null;
}

export default function VoiceSidebarWrapper({
  initialVoices,
  isPremium,
}: {
  initialVoices: Voice[];
  isPremium: boolean;
}) {
  const [voices, setVoices] = useState<Voice[]>(initialVoices);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/voice/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        let errorMessage = 'Не вдалося видалити запис';
        try {
          const data = await res.json();
          if (data?.message) errorMessage = data.message;
        } catch (_) {}
        throw new Error(errorMessage);
      }

      const updated = await fetchVoices();
      setVoices(updated);
    } catch (err: any) {
      console.error('Помилка при видаленні запису:', err);
    }
  }, []);

  return (
    <VoiceSidebar
      voices={voices}
      isPremium={isPremium}
      onDelete={handleDelete}
    />
  );
}
