import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Header } from '../components/Header.tsx';
import { GoogleAdBanner } from '../components/GoogleAdBanner.tsx';
import {
  Smartphone,
  Download,
  Users,
  History,
  PlayCircle,
  Briefcase,
  Disc3,
  PlusCircle,
  Sparkles,
  Volume2,
  Crown,
  ArrowRight
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { currentUser, settings, setActiveTab, setCurrentModal, showToast } = useApp();

  const handleInstallApp = () => {
    showToast('Future Income 2027 APK ডাউনলোড শুরু হচ্ছে...');
    setTimeout(() => {
      showToast('অ্যাপটি সফলভাবে ডাউনলোড হয়েছে! ওপেন করে ইনস্টল করুন।');
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Top Header with Profile, Balance and Withdraw/Deposit */}
      <Header />

      <div className="px-4 py-3 space-y-3.5 max-w-md mx-auto">
        {/* Notice Bar */}
        {settings.notice && (
          <div className="bg-amber-100/90 border border-amber-300/80 rounded-2xl p-2.5 flex items-center gap-2.5 text-xs text-amber-950 shadow-xs">
            <Volume2 className="w-4 h-4 text-amber-700 shrink-0 animate-bounce" />
            <div className="overflow-hidden whitespace-nowrap text-ellipsis flex-1">
              <span className="font-semibold text-amber-900">নোটিশ: </span>
              {settings.notice}
            </div>
          </div>
        )}

        {/* 1. App Install Card (Matches Screenshot 1 & 2) */}
        <div className="bg-gradient-to-r from-[#F43F5E] via-[#EF4444] to-[#E11D48] rounded-3xl p-4 text-white shadow-lg shadow-rose-900/10 flex items-center justify-between gap-3 border border-rose-300/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
              <Smartphone className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight tracking-tight">
                Future Income অ্যাপ ইনস্টল করুন
              </h3>
              <p className="text-white/85 text-xs font-medium">
                সহজে এবং দ্রুত কাজ করার জন্য
              </p>
            </div>
          </div>

          <button
            onClick={handleInstallApp}
            className="w-11 h-11 rounded-full bg-white text-[#E11D48] flex items-center justify-center shadow-md active:scale-90 transition-transform shrink-0"
            aria-label="Download app"
          >
            <Download className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* 1.5 VIP Level Income Club Banner */}
        <div
          onClick={() => setActiveTab('vip')}
          className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 rounded-3xl p-4 text-white shadow-lg shadow-amber-900/10 flex items-center justify-between gap-3 border border-yellow-300/40 cursor-pointer active:scale-98 transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
              <Crown className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-base leading-tight tracking-tight text-white">
                  VIP লেভেল ক্লাব
                </h3>
                <span className="bg-slate-950 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-black">
                  {currentUser?.vipLevel ? `VIP ${currentUser.vipLevel}` : '৳১০০ থেকে শুরু'}
                </span>
              </div>
              <p className="text-amber-100 text-xs font-medium mt-0.5">
                {currentUser?.vipLevel
                  ? 'প্রতিদিনের VIP আয় ৳ ক্লেইম করুন'
                  : 'প্রতিদিন ১০৳ থেকে ৩৮০৳ ফিক্সড ইনকাম'}
              </p>
            </div>
          </div>

          <div className="w-10 h-10 rounded-full bg-white text-amber-600 flex items-center justify-center shadow-md shrink-0">
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        {/* 2. Stat Cards Grid (Matches Screenshot 1 & 2) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Referrals */}
          <button
            onClick={() => setActiveTab('team')}
            className="bg-white rounded-3xl p-4 shadow-sm border border-amber-100/80 flex flex-col items-center justify-center text-center active:scale-98 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#E11D48] mb-1.5">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-600">রেফার</span>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              {currentUser?.totalReferrals || 0}
            </span>
          </button>

          {/* Card 2: Total Earnings */}
          <button
            onClick={() => setCurrentModal('income-history')}
            className="bg-white rounded-3xl p-4 shadow-sm border border-amber-100/80 flex flex-col items-center justify-center text-center active:scale-98 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-1.5 font-bold text-lg">
              ৳
            </div>
            <span className="text-xs font-semibold text-slate-600">মোট আয় (টাকা)</span>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              {currentUser?.totalEarnings.toFixed(2) || '0.00'}
            </span>
          </button>
        </div>

        {/* 3. "আপনার সকল ইনকাম ইতিহাস ✨" Gradient Button (Matches Screenshot 2) */}
        <button
          onClick={() => setCurrentModal('income-history')}
          className="w-full bg-gradient-to-r from-[#DC2626] via-[#EA580C] to-[#F59E0B] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-orange-900/10 flex items-center justify-center gap-2.5 active:scale-98 transition-transform text-sm md:text-base"
        >
          <History className="w-5 h-5" />
          <span>আপনার সকল ইনকাম ইতিহাস</span>
          <Sparkles className="w-4 h-4 text-amber-200" />
        </button>

        {/* 4. "কাজ শিখুন (ভিডিও)" Yellow Banner (Matches Screenshot 2) */}
        <button
          onClick={() => setCurrentModal('video-tutorial')}
          className="w-full bg-[#FEE227] hover:bg-[#FDD835] text-slate-900 font-bold p-3.5 rounded-2xl shadow-sm border border-amber-300 flex items-center gap-3 active:scale-98 transition-transform text-left"
        >
          <div className="w-11 h-11 rounded-full bg-[#E53935] text-white flex items-center justify-center shrink-0 shadow-sm">
            <PlayCircle className="w-6 h-6 fill-current text-white stroke-none" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm md:text-base leading-tight">
              কাজ শিখুন (ভিডিও)
            </h4>
            <p className="text-slate-800 text-xs font-medium">
              ভিডিও দেখুন এবং টাকা আয় করুন
            </p>
          </div>
        </button>

        {/* Google AdSense Banner on Home */}
        {settings.adsEnabled && (
          <GoogleAdBanner slotType="banner" className="my-1" />
        )}

        {/* 5. "আজকের জব শুরু করুন" Red Banner (Matches Screenshot 2) */}
        <button
          onClick={() => setActiveTab('tasks')}
          className="w-full bg-gradient-to-r from-[#B91C1C] to-[#DC2626] hover:from-[#991B1B] hover:to-[#B91C1C] text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-red-900/15 flex items-center justify-center gap-2 active:scale-98 transition-transform text-sm md:text-base"
        >
          <Briefcase className="w-5 h-5" />
          <span>আজকের জব শুরু করুন</span>
        </button>

        {/* 6. Extra Feature Row: Spin & Earn and Deposit Shortcut */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Spin Wheel */}
          <button
            onClick={() => setCurrentModal('spin')}
            className="bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-2xl p-3 shadow-md flex items-center gap-2.5 active:scale-98 transition-transform text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Disc3 className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">স্পিন করুন</p>
              <p className="text-[10px] text-pink-100">প্রতিদিন ফ্রি রিওয়ার্ড</p>
            </div>
          </button>

          {/* Deposit Money Option (Requested) */}
          <button
            onClick={() => setActiveTab('deposit')}
            className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-3 shadow-md flex items-center gap-2.5 active:scale-98 transition-transform text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">ডিপোজিট করুন</p>
              <p className="text-[10px] text-emerald-100">বিকাশ/নগদ/রকেট</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
