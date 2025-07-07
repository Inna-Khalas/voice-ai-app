'use client';

import { toast } from 'sonner';

export default function PremiumModal({ onClose }: { onClose: () => void }) {
  const handleUpgrade = async () => {
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
      });

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || 'Помилка створення сесії');
      }
    } catch (error) {
      toast.error('Щось пішло не так');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-xl max-w-sm shadow-2xl">
        <h2 className="text-xl font-bold text-red-600 mb-3">Ліміт досягнуто</h2>
        <p className="mb-4">
          Ви використали всі безкоштовні записи. Отримайте
          <strong>Premium</strong>, щоб створювати необмежену кількість записів.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleUpgrade}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md w-full"
          >
            Отримати Premium
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md w-full"
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
}
