'use client';

import { toast } from 'sonner';

export default function UpgradeButton() {
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
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleUpgrade}
        className=" hover:bg-white text-white hover:text-black font-bold px-5 py-3 rounded-full shadow-lg transition-all"
      >
        Get Premium
      </button>
    </div>
  );
}
