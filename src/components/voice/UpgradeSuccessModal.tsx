'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function UpgradeSuccessModal() {
  const [show, setShow] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShow(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setShow(false);
    router.replace('/dashboard');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-sm shadow-2xl border border-gray-200">
        <h2 className="text-xl font-bold text-green-600 mb-3">
          Payment was successful! 🎉
        </h2>
        <p className="mb-4">
          Your account has been updated to <strong>Premium</strong>. Now you can
          create an unlimited number of entries.
        </p>
        <button
          onClick={handleClose}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
