import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { AvatarSuit } from './Icons.tsx';
import { SecretAdminModal } from './SecretAdminModal.tsx';
import { Bell, Wallet, PlusCircle, ArrowRight } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, setIsSidebarOpen, setActiveTab, setCurrentModal } = useApp();
  const [clickCount, setClickCount] = React.useState(0);
  const [isSecretOpen, setIsSecretOpen] = React.useState(false);

  const handleSecretClick = () => {
    const next = clickCount + 1;
    if (next >= 5) {
      setClickCount(0);
      setIsSecretOpen(true);
    } else {
      setClickCount(next);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#FFDE00] via-[#FDB813] to-[#F59E0B] pt-4 pb-6 px-4 rounded-b-[2rem] shadow-md relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        {/* Left: Hamburger & User Welcome */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 text-[#8B0000] hover:text-black transition-colors focus:outline-none"
            aria-label="Open navigation menu"
          >
            <div className="flex flex-col gap-1.5 w-6">
              <span className="h-0.5 w-6 bg-[#8B0000] rounded-full"></span>
              <span className="h-0.5 w-4 bg-[#8B0000] rounded-full"></span>
              <span className="h-0.5 w-5 bg-[#8B0000] rounded-full"></span>
            </div>
          </button>

          <div onClick={handleSecretClick} className="cursor-pointer select-none">
            <div className="flex items-center gap-1.5">
              <h2 className="text-[#800000] font-extrabold text-base md:text-lg leading-tight tracking-tight">
                Hi, {currentUser?.name || 'MD Rakib Akon'}
              </h2>
              {currentUser?.vipLevel ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('vip');
                  }}
                  className="bg-slate-900 text-amber-400 font-black text-[9px] px-2 py-0.5 rounded-full border border-amber-400/60 shadow-xs flex items-center gap-0.5"
                >
                  <span>👑 VIP {currentUser.vipLevel}</span>
                </button>
              ) : null}
            </div>
            <p className="text-[#991B1B] text-xs font-semibold">
              Welcome to Future Income 2027!
            </p>
          </div>
        </div>

        {/* Right: VIP, Bell & Avatar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('vip')}
            className="px-2.5 py-1.5 rounded-2xl bg-slate-900/90 text-amber-300 font-extrabold text-xs shadow-md border border-amber-400/40 flex items-center gap-1 active:scale-95 transition-transform"
            aria-label="VIP Club"
            title="VIP লেভেল ক্লাব"
          >
            <span>👑 VIP</span>
          </button>

          <button
            onClick={() => setCurrentModal('notifications')}
            className="w-9 h-9 rounded-full bg-[#FFF8E7] flex items-center justify-center text-[#B91C1C] shadow-sm relative active:scale-95 transition-transform"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 fill-current" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white"></span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className="focus:outline-none active:scale-95 transition-transform"
            aria-label="Account profile"
          >
            <AvatarSuit className="w-10 h-10" />
          </button>
        </div>
      </div>

      <SecretAdminModal
        isOpen={isSecretOpen}
        onClose={() => setIsSecretOpen(false)}
      />

      {/* Big Red Balance Card (Matching Screenshot 1 & 5) */}
      <div className="bg-gradient-to-br from-[#E2242B] to-[#B91118] rounded-3xl p-5 text-center text-white shadow-xl shadow-red-900/20 mb-3 border border-red-400/20 relative overflow-hidden">
        {/* Subtle background glow circle */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

        <p className="text-white/85 text-xs font-medium tracking-wide mb-1">
          Total Balance (Taka)
        </p>
        <div className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-sm">
          <span className="font-sans">৳ </span>
          <span>{currentUser?.balance.toFixed(2) ?? '120.00'}</span>
        </div>
      </div>

      {/* Action Buttons: Withdraw & Deposit (Extra Deposit Option explicitly requested!) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Withdraw Money Card */}
        <button
          onClick={() => setActiveTab('withdraw')}
          className="bg-white/95 hover:bg-white text-[#991B1B] rounded-2xl py-3 px-3.5 flex items-center justify-between shadow-sm border border-amber-200/60 active:scale-[0.98] transition-all group"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs md:text-sm text-slate-800 group-hover:text-red-700">
              Withdraw
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Deposit Money Card (Extra feature added as requested) */}
        <button
          onClick={() => setActiveTab('deposit')}
          className="bg-white/95 hover:bg-white text-emerald-700 rounded-2xl py-3 px-3.5 flex items-center justify-between shadow-sm border border-emerald-200/60 active:scale-[0.98] transition-all group"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <PlusCircle className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs md:text-sm text-slate-800 group-hover:text-emerald-700">
              Deposit
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
