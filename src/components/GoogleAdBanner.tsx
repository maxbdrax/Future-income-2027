import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Sparkles, ShieldCheck, ExternalLink } from 'lucide-react';

interface GoogleAdBannerProps {
  slotType: 'banner' | 'reward';
  customSlotId?: string;
  className?: string;
  showCardBackground?: boolean;
  compact?: boolean;
}

export const GoogleAdBanner: React.FC<GoogleAdBannerProps> = ({
  slotType,
  customSlotId,
  className = '',
  showCardBackground = true,
  compact = false
}) => {
  const { settings } = useApp();
  const adRef = useRef<HTMLModElement | null>(null);
  const [adPushed, setAdPushed] = useState(false);
  const [adLoadError, setAdLoadError] = useState(false);

  const pubId = (settings.adsensePubId || 'ca-pub-3335603276700829').trim();
  const slotId = (
    customSlotId ||
    (slotType === 'reward' ? settings.adsenseRewardSlot : settings.adsenseBannerSlot) ||
    '9876543210'
  ).trim();

  useEffect(() => {
    if (!settings.adsEnabled || !pubId) return;

    // Small delay to allow DOM mounting
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          setAdPushed(true);
        }
      } catch (err) {
        // Adsbygoogle will throw if already pushed or blocked by client
        setAdLoadError(true);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [pubId, slotId, settings.adsEnabled]);

  if (!settings.adsEnabled || !pubId) {
    return null;
  }

  const isReward = slotType === 'reward';

  return (
    <div
      className={`relative overflow-hidden transition-all ${
        showCardBackground
          ? isReward
            ? 'bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-amber-500/30 rounded-2xl p-2.5 text-white shadow-md'
            : 'bg-white border border-amber-200/90 rounded-2xl p-2.5 text-slate-800 shadow-xs'
          : ''
      } ${className}`}
    >
      {/* Ad Header Badge */}
      <div className="flex items-center justify-between text-[10px] font-bold tracking-wider mb-1.5 px-0.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className={isReward ? 'text-amber-300' : 'text-slate-600 font-extrabold flex items-center gap-1'}>
            <Sparkles className="w-3 h-3 text-amber-500" />
            Google AdSense {isReward ? 'Rewarded Unit' : 'Display Unit'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="bg-amber-100 text-amber-900 border border-amber-300/80 px-1.5 py-0.5 rounded text-[8.5px] font-mono font-black">
            AD #{slotId.slice(-4) || 'LIVE'}
          </span>
          <span className="text-[8px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded flex items-center gap-0.5">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
            Active
          </span>
        </div>
      </div>

      {/* Real Google AdSense Injection Tag */}
      <div className="w-full overflow-hidden flex flex-col items-center justify-center">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '100%',
            minHeight: compact ? '50px' : isReward ? '90px' : '65px'
          }}
          data-ad-client={pubId}
          data-ad-slot={slotId}
          data-ad-format={compact ? 'horizontal' : isReward ? 'rectangle' : 'horizontal'}
          data-full-width-responsive="true"
        />

        {/* High-fidelity Fallback / Container Display */}
        {!compact ? (
          <div
            className={`w-full rounded-xl p-2 flex items-center justify-between gap-3 ${
              isReward
                ? 'bg-slate-800/80 border border-slate-700 text-white mt-1'
                : 'bg-gradient-to-r from-amber-50/60 to-orange-50/60 border border-dashed border-amber-200 mt-1'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                  isReward
                    ? 'bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-950 shadow-sm'
                    : 'bg-gradient-to-br from-amber-500 to-rose-500 text-white shadow-xs'
                }`}
              >
                AD
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className={`text-xs font-extrabold truncate ${isReward ? 'text-amber-200' : 'text-slate-800'}`}>
                    {isReward ? 'স্পন্সরড ইন্টারস্টিশিয়াল এড' : 'গুগল স্পন্সরড ব্যানার'}
                  </p>
                  <span className="text-[8px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 rounded font-bold">
                    Verified
                  </span>
                </div>
                <p className={`text-[10px] truncate ${isReward ? 'text-slate-300' : 'text-slate-500'}`}>
                  Client: {pubId.slice(0, 14)}... | Slot: {slotId}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span
                className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  isReward
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-amber-500 text-white'
                }`}
              >
                রেভিনিউ লাইভ
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full mt-1 flex items-center justify-between px-2 py-1 bg-amber-50/60 border border-dashed border-amber-200 rounded-lg text-[10px] text-slate-600">
            <span className="flex items-center gap-1 font-bold">
              <Sparkles className="w-3 h-3 text-amber-500" />
              গুগল এডসেন্স স্পন্সরড নেটওয়ার্ক
            </span>
            <span className="text-[9px] text-emerald-600 font-mono font-bold">
              Slot: {slotId}
            </span>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-1 flex items-center justify-between text-[8.5px] text-slate-400 px-1">
        <span>Google AdSense ID: {pubId}</span>
        <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
          ✓ মনিটাইজেশন সক্রিয়
        </span>
      </div>
    </div>
  );
};
