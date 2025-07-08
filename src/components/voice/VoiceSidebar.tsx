'use client';

import { useMemo } from 'react';
import { Crown, Headphones, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface VoiceSidebarProps {
  voices: { id: string; title: string | null }[];
  isPremium: boolean;
  onDelete?: (id: string) => void;
}

export function VoiceSidebar({
  voices,
  isPremium,
  onDelete,
}: VoiceSidebarProps) {
  const mappingVoices = useMemo(() => {
    return voices.map((voice) => (
      <li
        key={voice.id}
        className="group flex items-center justify-between gap-2 px-4 py-2 rounded-lg transition hover:bg-white/10 border border-transparent hover:border-white/30"
      >
        <Link
          href={`/dashboard/voice/${voice.id}`}
          className="flex items-center gap-3 flex-1 overflow-hidden"
        >
          <Headphones className="w-5 h-5 text-white/70 flex-shrink-0" />
          <span className="truncate">{voice.title || 'Без назви'}</span>
        </Link>

        {isPremium && onDelete && (
          <button
            onClick={() => onDelete(voice.id)}
            className="opacity-0 group-hover:opacity-100 transition text-white/70 hover:text-red-500"
            title="Видалити"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </li>
    ));
  }, [voices, isPremium, onDelete]);

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
