'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function TranscribeButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleTranscribe = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/voice/${id}/transcribe`, {
        method: 'POST',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Помилка при транскрипції');
      }
      toast.success('done!');
      location.reload();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Невідома помилка';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <button
        onClick={handleTranscribe}
        disabled={loading}
        className="flex items-center justify-center gap-2 px-5 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Recognized...
          </>
        ) : (
          'Recognize voice'
        )}
      </button>
    </motion.div>
  );
}
