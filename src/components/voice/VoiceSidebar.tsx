'use client';

import { Crown, Headphones } from 'lucide-react';
import Link from 'next/link';

interface VoiceSidebarProps {
  voices: { id: string; title: string | null }[];
  isPremium: boolean;
}

export function VoiceSidebar({ voices, isPremium }: VoiceSidebarProps) {
  const mappingVoices = voices.map((voice) => (
    <li key={voice.id}>
      <Link
        href={`/dashboard/voice/${voice.id}`}
        className="flex items-center gap-3 px-4 py-2 rounded-lg transition hover:bg-white/20 border border-transparent hover:border-white/30"
      >
        {' '}
        <Headphones className="w-5 h-5 text-white/70" />
        <span className="truncate">{voice.title || 'Без назви'}</span>
      </Link>
    </li>
  ));

  return (
    <aside className="p-6 bg-white/10 backdrop-blur-lg text-white h-full border-r border-white/20 shadow-md">
      <h1 className="font-semibold text-xl mb-4 flex items-center gap-2">
        {isPremium && (
          <Crown className="w-5 h-5 text-yellow-300 animate-pulse" />
        )}
        My entries
      </h1>

      {voices.length === 0 ? (
        <p className="text-sm text-white/70">No entries yet</p>
      ) : (
        <ul className="space-y-3">{mappingVoices}</ul>
      )}
    </aside>
  );
}
