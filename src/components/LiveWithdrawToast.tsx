import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { AvatarSuit } from './Icons.tsx';
import { X } from 'lucide-react';

export const LiveWithdrawToast: React.FC = () => {
  const { liveNotifications } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed || liveNotifications.length === 0) return;

    const timer = setInterval(() => {
      // Fade out briefly
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % liveNotifications.length);
        setIsVisible(true);
      }, 400);
    }, 7000);

    return () => clearInterval(timer);
  }, [liveNotifications.length, isDismissed]);

  if (isDismissed || liveNotifications.length === 0) return null;

  const current = liveNotifications[currentIndex] || liveNotifications[0];

  return (
    <div
      className={`fixed bottom-20 left-4 right-4 max-w-md mx-auto z-30 transition-all duration-300 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
      }`}
    >
      <div className="bg-white rounded-2xl p-3 shadow-xl border-l-4 border-l-red-600 border border-slate-100 flex items-center justify-between gap-3 relative">
        {/* Left Avatar */}
        <div className="shrink-0">
          <AvatarSuit className="w-12 h-12 ring-2 ring-amber-300 shadow-sm" />
        </div>

        {/* Middle Text Details */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-sm truncate">
              {current.name}
            </h4>
          </div>

          <p className="text-xs text-slate-700 leading-tight">
            সফলভাবে <span className="font-bold text-emerald-600">৳{current.amount}</span> উত্তোলন করেছেন।
          </p>

          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-medium">
            <span className={current.method === 'বিকাশ' ? 'text-[#E2136E] font-bold' : 'text-[#F7941D] font-bold'}>
              {current.method}
            </span>
            <span>•</span>
            <span className="font-mono">{current.maskedPhone}</span>
          </div>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-semibold text-emerald-700">
              {current.timeText}
            </span>
          </div>
        </div>

        {/* Right Close Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-slate-600 p-1 self-start rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
