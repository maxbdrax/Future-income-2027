import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Briefcase, Crown, Home, Wallet, UserCog } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FF5722] text-white shadow-2xl border-t border-orange-600/30">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 relative px-1">
        {/* Tab 1: TASKS */}
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center justify-center h-full transition-transform active:scale-95 ${
            activeTab === 'tasks' ? 'text-amber-200 font-bold' : 'text-white/90 hover:text-white'
          }`}
        >
          <Briefcase className="w-5 h-5 mb-0.5 stroke-[2.2]" />
          <span className="text-[10px] tracking-wider uppercase font-semibold">
            TASKS
          </span>
        </button>

        {/* Tab 2: VIP CLUB */}
        <button
          onClick={() => setActiveTab('vip')}
          className={`flex flex-col items-center justify-center h-full transition-transform active:scale-95 ${
            activeTab === 'vip' ? 'text-amber-200 font-bold' : 'text-white/90 hover:text-white'
          }`}
        >
          <Crown className="w-5 h-5 mb-0.5 stroke-[2.2] fill-current" />
          <span className="text-[10px] tracking-wider uppercase font-semibold">
            VIP CLUB
          </span>
        </button>

        {/* Tab 3: Elevated Center HOME */}
        <div className="flex flex-col items-center justify-center relative -top-3">
          {/* Arched winged background wrapper */}
          <div className="relative">
            {/* Wing decoration shape */}
            <div className="absolute -inset-1.5 bg-[#FFF8E7]/30 rounded-full blur-[1px] pointer-events-none"></div>

            <button
              onClick={() => setActiveTab('home')}
              className={`w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg transition-transform active:scale-90 border-4 border-[#FF5722] ${
                activeTab === 'home'
                  ? 'bg-white text-[#FF5722]'
                  : 'bg-[#FFF8E7] text-[#FF5722] hover:bg-white'
              }`}
              aria-label="Home"
            >
              <Home className="w-6 h-6 fill-[#FF5722] stroke-[#FF5722]" />
            </button>
          </div>
          <span className="text-[10px] font-extrabold tracking-wider uppercase text-white mt-0.5">
            HOME
          </span>
        </div>

        {/* Tab 4: WITHDRAW */}
        <button
          onClick={() => setActiveTab('withdraw')}
          className={`flex flex-col items-center justify-center h-full transition-transform active:scale-95 ${
            activeTab === 'withdraw' ? 'text-amber-200 font-bold' : 'text-white/90 hover:text-white'
          }`}
        >
          <Wallet className="w-5 h-5 mb-0.5 stroke-[2.2]" />
          <span className="text-[10px] tracking-wider uppercase font-semibold">
            WITHDRAW
          </span>
        </button>

        {/* Tab 5: ACCOUNT */}
        <button
          onClick={() => setActiveTab('account')}
          className={`flex flex-col items-center justify-center h-full transition-transform active:scale-95 ${
            activeTab === 'account' ? 'text-amber-200 font-bold' : 'text-white/90 hover:text-white'
          }`}
        >
          <UserCog className="w-5 h-5 mb-0.5 stroke-[2.2]" />
          <span className="text-[10px] tracking-wider uppercase font-semibold">
            ACCOUNT
          </span>
        </button>
      </div>
    </div>
  );
};
