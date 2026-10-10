import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Headphones } from 'lucide-react';

export const FloatingSupport: React.FC = () => {
  const { setCurrentModal } = useApp();

  return (
    <button
      onClick={() => setCurrentModal('support')}
      className="fixed bottom-24 right-4 z-30 w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF5722] to-[#FF8A65] text-white flex items-center justify-center shadow-xl shadow-orange-600/30 hover:scale-105 active:scale-95 transition-transform border-2 border-white"
      aria-label="Customer Support"
      title="সাপোর্ট গ্রুপ"
    >
      <Headphones className="w-6 h-6 stroke-[2.2]" />
    </button>
  );
};
