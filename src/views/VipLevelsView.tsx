import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { VIP_PLANS, VipPlan } from '../types/index.ts';
import confetti from 'canvas-confetti';
import {
  Crown,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Zap,
  ArrowLeft,
  Wallet
} from 'lucide-react';

export const VipLevelsView: React.FC = () => {
  const {
    currentUser,
    purchaseVipPlan,
    claimDailyVipIncome,
    setActiveTab,
    showToast
  } = useApp();

  const [selectedPlanForBuy, setSelectedPlanForBuy] = useState<VipPlan | null>(null);
  const [timeLeftStr, setTimeLeftStr] = useState<string>('');
  const [canClaimVipNow, setCanClaimVipNow] = useState<boolean>(true);

  // Compute live remaining cooldown timer for VIP daily income
  useEffect(() => {
    const updateCountdown = () => {
      if (!currentUser || !currentUser.vipLevel || currentUser.vipLevel < 1) {
        setCanClaimVipNow(false);
        setTimeLeftStr('');
        return;
      }

      const lastClaim = currentUser.lastVipIncomeClaimedAt || 0;
      const cooldownMs = 24 * 60 * 60 * 1000;
      const now = Date.now();
      const diff = now - lastClaim;

      if (diff >= cooldownMs || lastClaim === 0) {
        setCanClaimVipNow(true);
        setTimeLeftStr('এখন ক্লেইম করুন');
      } else {
        setCanClaimVipNow(false);
        const remMs = cooldownMs - diff;
        const hours = Math.floor(remMs / (1000 * 60 * 60));
        const minutes = Math.floor((remMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remMs % (1000 * 60)) / 1000);
        setTimeLeftStr(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const currentPlan = currentUser?.vipLevel
    ? VIP_PLANS.find(p => p.id === currentUser.vipLevel)
    : null;

  const handleClaim = () => {
    const res = claimDailyVipIncome();
    if (res.success) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleConfirmPurchase = () => {
    if (!selectedPlanForBuy) return;
    const res = purchaseVipPlan(selectedPlanForBuy.id);
    if (res.success) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
      setSelectedPlanForBuy(null);
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-[#FFFDF7]">
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 pt-5 pb-8 px-4 rounded-b-[2rem] shadow-lg text-white relative">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setActiveTab('home')}
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h1 className="font-black text-lg md:text-xl flex items-center justify-center gap-1.5 tracking-tight">
              <Crown className="w-5 h-5 text-yellow-200 fill-yellow-200" />
              VIP লেভেল ক্লাব
            </h1>
            <p className="text-amber-100 text-[11px] font-medium">
              পার্সেস করুন এবং প্রতিদিন ফিক্সড ইনকাম নিন
            </p>
          </div>
          <button
            onClick={() => setActiveTab('deposit')}
            className="px-2.5 py-1 rounded-xl bg-white/20 backdrop-blur-xs text-xs font-bold flex items-center gap-1 hover:bg-white/30 active:scale-95 transition-all"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>ডিপোজিট</span>
          </button>
        </div>

        {/* Current VIP Status Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-4.5 border border-yellow-500/40 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Crown className="w-5 h-5 fill-amber-300" />
              </div>
              <div>
                <span className="text-[10px] text-amber-300 font-bold tracking-wider uppercase">
                  আপনার বর্তমান VIP লেভেল
                </span>
                <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                  {currentPlan ? currentPlan.name + ' (' + currentPlan.title + ')' : 'সাধারণ মেম্বার (ফ্রি)'}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400">ব্যালেন্স</span>
              <p className="text-base font-black text-amber-400">
                ৳ {currentUser?.balance.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>

          {currentPlan ? (
            <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-800/80 rounded-xl p-2 border border-slate-700">
                  <span className="text-slate-400 text-[10px] block">দৈনিক নিশ্চিত আয়</span>
                  <span className="text-amber-400 font-extrabold text-sm">৳ {currentPlan.dailyIncome.toFixed(2)}</span>
                </div>
                <div className="bg-slate-800/80 rounded-xl p-2 border border-slate-700">
                  <span className="text-slate-400 text-[10px] block">মোট VIP আয়</span>
                  <span className="text-emerald-400 font-extrabold text-sm">৳ {(currentUser?.totalVipEarnings || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* VIP Daily Income Claim Button */}
              {canClaimVipNow ? (
                <button
                  onClick={handleClaim}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 animate-pulse active:scale-98 transition-transform cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>আজকের VIP আয় ৳ {currentPlan.dailyIncome.toFixed(2)} ক্লেইম করুন!</span>
                </button>
              ) : (
                <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Clock className="w-4 h-4 text-amber-400 animate-spin-slow" />
                    <span>পরবর্তী VIP আয় বাকি:</span>
                  </div>
                  <span className="font-mono font-extrabold text-amber-400 text-sm bg-slate-900 px-3 py-1 rounded-xl border border-slate-700">
                    {timeLeftStr}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
              <span className="text-[11px] text-amber-200/90">
                নিচে ৫টি VIP লেভেলের যেকোনো একটি কিনে প্রতিদিন আয় শুরু করুন
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 py-4 space-y-4 max-w-md mx-auto -mt-3">
        {/* Banner Explaining System */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-amber-950 shadow-xs">
          <Zap className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="leading-snug">
            <strong>VIP ইনকাম নিয়ম:</strong> যেকোনো VIP লেভেল পার্সেস করার পর প্রতি ২৪ ঘন্টা পর পর ১ ক্লিকে আপনার নির্ধারিত দৈনিক আয় একাউন্ট ব্যালেন্সে যোগ হবে!
          </p>
        </div>

        {/* 5 VIP Level Cards */}
        <div className="space-y-3.5">
          {VIP_PLANS.map((plan) => {
            const isCurrent = currentUser?.vipLevel === plan.id;
            const isLower = (currentUser?.vipLevel || 0) > plan.id;
            const canAfford = (currentUser?.balance || 0) >= plan.price;

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-3xl p-4 border transition-all shadow-sm relative overflow-hidden ${
                  isCurrent
                    ? 'border-amber-500 ring-2 ring-amber-400/40 bg-gradient-to-b from-amber-50/40 to-white'
                    : 'border-slate-200 hover:border-amber-300'
                }`}
              >
                {/* Header of Card */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${plan.colorGradient} flex items-center justify-center text-white shadow-md font-black text-sm`}>
                      <Crown className="w-5 h-5 fill-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-slate-900 text-base">
                          {plan.name}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${plan.badgeBg}`}>
                          {plan.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        মূল্য: <strong className="text-slate-900 font-extrabold">৳{plan.price}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold block">দৈনিক ইনকাম</span>
                    <span className="text-lg font-black text-emerald-600">
                      ৳{plan.dailyIncome}
                    </span>
                    <span className="text-[9px] text-slate-400 block">/প্রতিদিন</span>
                  </div>
                </div>

                {/* Features & Monthly Return */}
                <div className="bg-slate-50 rounded-2xl p-2.5 mb-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">৩০ দিনে মোট রিটার্ন</span>
                    <span className="font-extrabold text-slate-900 text-xs">৳{plan.monthlyReturn} টাকা</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">রিটার্ন পারসেন্টেজ</span>
                    <span className="font-extrabold text-amber-600 text-xs">+{Math.round((plan.dailyIncome * 30 / plan.price) * 100)}% লাভ</span>
                  </div>
                </div>

                <div className="space-y-1 mb-3.5">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Purchase Button */}
                {isCurrent ? (
                  <div className="w-full py-2.5 bg-amber-500/10 border border-amber-300 rounded-xl text-center text-xs font-bold text-amber-900 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    <span>আপনার বর্তমান সক্রিয় প্ল্যান</span>
                  </div>
                ) : isLower ? (
                  <div className="w-full py-2.5 bg-slate-100 rounded-xl text-center text-xs font-bold text-slate-500">
                    ইতিমধ্যে উচ্চতর লেভেলে আছেন
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedPlanForBuy(plan)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer ${
                      canAfford
                        ? 'bg-slate-900 hover:bg-black text-white shadow-md shadow-slate-900/10'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-900/10'
                    }`}
                  >
                    <span>
                      {canAfford ? `৳${plan.price} দিয়ে পার্সেস করুন` : `পার্সেস করুন (৳${plan.price})`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Security / Guarantee Badge */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 text-center space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-xs">
            ১০০% নিরাপদ ও নিশ্চিত দৈনিক পেমেন্ট
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            ভিআইপি সদস্যদের দৈনিক ইনকাম সরাসরি মেইন ব্যালেন্সে জমা হয় এবং নুন্যতম ৬০০ টাকা হলেই যেকোনো সময় বিকাশ, নগদ বা রকেটে উইথড্র দেওয়া যায়।
          </p>
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      {selectedPlanForBuy && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  VIP প্ল্যান নিশ্চিত করুন
                </h3>
              </div>
              <button
                onClick={() => setSelectedPlanForBuy(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">নির্বাচিত প্ল্যান:</span>
                <strong className="text-slate-900">{selectedPlanForBuy.name} ({selectedPlanForBuy.title})</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">প্ল্যান খরচ:</span>
                <strong className="text-red-600 font-extrabold">৳ {selectedPlanForBuy.price.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">প্রতিদিনের ইনকাম:</span>
                <strong className="text-emerald-600 font-extrabold">৳ {selectedPlanForBuy.dailyIncome.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">আপনার বর্তমান ব্যালেন্স:</span>
                <strong className="text-slate-900">৳ {(currentUser?.balance || 0).toFixed(2)}</strong>
              </div>
            </div>

            {(currentUser?.balance || 0) < selectedPlanForBuy.price ? (
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-2.5 flex items-start gap-2 text-xs text-red-900">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p>
                    আপনার ব্যালেন্সে পর্যাপ্ত টাকা নেই! এই প্ল্যানটি কিনতে আরও ৳{(selectedPlanForBuy.price - (currentUser?.balance || 0)).toFixed(2)} টাকা ডিপোজিট করুন।
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedPlanForBuy(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600"
                  >
                    বাতিল
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPlanForBuy(null);
                      setActiveTab('deposit');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-900/10 flex items-center justify-center gap-1.5"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>ডিপোজিট করুন</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setSelectedPlanForBuy(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  onClick={handleConfirmPurchase}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5 fill-slate-950" />
                  <span>এখনই নিশ্চিত করুন</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
