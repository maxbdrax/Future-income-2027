import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { HomeView } from './views/HomeView.tsx';
import { WithdrawView } from './views/WithdrawView.tsx';
import { DepositView } from './views/DepositView.tsx';
import { TasksView } from './views/TasksView.tsx';
import { ReferTeamView } from './views/ReferTeamView.tsx';
import { AccountView } from './views/AccountView.tsx';
import { VipLevelsView } from './views/VipLevelsView.tsx';
import { AuthViews } from './views/AuthViews.tsx';
import { AdminDashboard } from './views/AdminDashboard.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { SidebarDrawer } from './components/SidebarDrawer.tsx';
import { LiveWithdrawToast } from './components/LiveWithdrawToast.tsx';
import { FloatingSupport } from './components/FloatingSupport.tsx';
import { Modals } from './components/Modals.tsx';
import { SecretAdminModal } from './components/SecretAdminModal.tsx';
import { Check } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    currentUser,
    activeTab,
    isAdminOpen,
    toastMessage
  } = useApp();

  // User requested: "এই পেজ টা জানো সার্চ করলে এটাই জানো আসে এবং এখান থেকে জানো রেজিস্ট্রেশন অথবা লগইন অফসনে যেতে পারে"
  const [authMode, setAuthMode] = useState<'landing' | 'register' | 'login'>('landing');
  const [isSecretAdminOpen, setIsSecretAdminOpen] = useState(false);
  const [secretDesktopClicks, setSecretDesktopClicks] = useState(0);

  const handleSecretDesktopTrigger = () => {
    const next = secretDesktopClicks + 1;
    if (next >= 5) {
      setSecretDesktopClicks(0);
      setIsSecretAdminOpen(true);
    } else {
      setSecretDesktopClicks(next);
    }
  };

  // If not logged in, show Auth screens with Landing Page as default
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center">
        <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl">
          <AuthViews authMode={authMode} setAuthMode={setAuthMode} />
          {isAdminOpen && <AdminDashboard />}
          <Modals />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start text-slate-800 font-sans selection:bg-amber-500 selection:text-white">
      {/* Desktop helper bar (No visible admin button; clicking logo 5 times prompts secret pin) */}
      <header className="hidden lg:flex w-full bg-slate-900 border-b border-slate-800 py-2.5 px-6 items-center justify-between text-xs text-slate-300">
        <div
          onClick={handleSecretDesktopTrigger}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-extrabold text-white">Future Income 2027</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">টাস্ক ইনকাম ও মোবাইল ডিপোজিট সফটওয়্যার</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate-400">
            লগিন ইউজার: <strong className="text-amber-300">{currentUser.name}</strong> (৳{currentUser.balance.toFixed(2)})
          </span>
        </div>
      </header>

      {/* Mobile App Canvas Container (matches phone screen perfectly) */}
      <main className="w-full max-w-md bg-[#FFFDF7] min-h-screen relative shadow-2xl flex flex-col justify-between">
        {/* Active Tab View */}
        <div className="flex-1 w-full">
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'tasks' && <TasksView />}
          {activeTab === 'vip' && <VipLevelsView />}
          {activeTab === 'team' && <ReferTeamView />}
          {activeTab === 'withdraw' && <WithdrawView />}
          {activeTab === 'deposit' && <DepositView />}
          {activeTab === 'account' && <AccountView />}
        </div>

        {/* Global Floating Elements */}
        <BottomNav />
        <SidebarDrawer />
        <LiveWithdrawToast />
        <FloatingSupport />
        <Modals />

        {/* Secret Admin Access Modal & Admin Dashboard */}
        <SecretAdminModal
          isOpen={isSecretAdminOpen}
          onClose={() => setIsSecretAdminOpen(false)}
        />
        {isAdminOpen && <AdminDashboard />}

        {/* Global Toast Alert */}
        {toastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-slate-100 flex-1 leading-snug">
              {toastMessage}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
