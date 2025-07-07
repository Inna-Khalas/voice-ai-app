'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import PremiumModal from './PremiumModal';

interface Props {
  onUploadSuccess?: () => void;
}

export default function VoiceForm({ onUploadSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !title.trim()) {
      toast.error('Введіть назву та оберіть файл!');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('audio', file);

    const res = await fetch('api/voice/new', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.status === 403) {
      setShowPremiumModal(true);
      setLoading(false);
      return;
    }

    if (!res.ok) {
      toast.error(data.message || 'Помилка при завантаженні');
    } else {
      toast.success('Файл успішно завантажено!');
      setTitle('');
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onUploadSuccess?.();
    }
    setLoading(false);
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="enter name"
          className="w-full p-2 rounded-lg bg-white/20 text-white placeholder-white/70"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-white-800 text-white py-2 rounded hover:bg-gray-700 transition"
          >
            {file ? 'File selected: ' + file.name : 'Download audio file'}
          </button>
        </div>
        {!showPremiumModal && (
          <button
            type="submit"
            disabled={loading}
            className={`relative inline-flex items-center justify-center
      px-6 py-3 rounded-xl text-white font-medium
      bg-white/10 backdrop-blur-md
      hover:bg-white/20
      transition-all duration-300 ease-in-out
      disabled:opacity-50 disabled:cursor-not-allowed
      border border-white/20
      shadow-lg hover:shadow-xl
    `}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8h4z"
                  ></path>
                </svg>
                Loading...
              </span>
            ) : (
              'Create a record'
            )}
          </button>
        )}
      </form>
      {showPremiumModal && (
        <PremiumModal onClose={() => setShowPremiumModal(false)} />
      )}
    </>
  );
}
