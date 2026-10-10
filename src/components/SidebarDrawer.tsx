import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { AvatarSuit } from './Icons.tsx';
import {
  Home,
  CheckSquare,
  History,
  Trophy,
  Hourglass,
  Disc3,
  Gamepad2,
  Users,
  Headphones,
  PlusCircle,
  ShieldAlert,
  LogOut,
  X,
  Crown,
  ShieldCheck,
  FileText
} from 'lucide-react';

export const SidebarDrawer: React.FC = () => {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    currentUser,
    setActiveTab,
    setCurrentModal,
    setIsAdminOpen,
    logout
  } = useApp();

  if (!isSidebarOpen) return null;

  const handleNav = (tabOrModal: string) => {
    setIsSidebarOpen(false);
    if (tabOrModal === 'home' || tabOrModal === 'tasks' || tabOrModal === 'vip' || tabOrModal === 'team' || tabOrModal === 'withdraw' || tabOrModal === 'account' || tabOrModal === 'deposit') {
      setActiveTab(tabOrModal as any);
    } else if (tabOrModal === 'admin') {
      setIsAdminOpen(true);
    } else {
      setCurrentModal(tabOrModal);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Dark backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Drawer content (Left side) */}
      <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
        {/* Close Button on top right */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>

        {/* User Profile Card (Matching Screenshot 4) */}
        <div className="m-4 p-5 bg-amber-50/70 rounded-3xl border border-amber-200/60 flex flex-col items-center text-center">
          <div className="relative mb-2">
            <AvatarSuit className="w-20 h-20 shadow-md ring-4 ring-amber-300" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">
            {currentUser?.name || 'MD Rakib Akon'}
          </h3>
          <span className="inline-block mt-1 px-3 py-0.5 bg-amber-100 text-amber-900 text-xs font-bold rounded-full border border-amber-300">
            ID: {currentUser?.id || '2161000'}
          </span>
        </div>

        {/* Menu Items (Matching Screenshot 4) */}
        <div className="flex-1 px-4 space-y-1 pb-6">
          {/* 1. Home */}
          <button
            onClick={() => handleNav('home')}
            className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-sm shrink-0">
              <Home className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">Home</span>
          </button>

          {/* VIP Level Club (Special Golden) */}
          <button
            onClick={() => handleNav('vip')}
            className="w-full flex items-center gap-3.5 p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 transition-colors text-left border border-amber-200"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-slate-950 shadow-sm shrink-0">
              <Crown className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <span className="font-extrabold text-amber-950 text-sm block">👑 VIP লেভেল ক্লাব</span>
              <span className="text-[11px] text-amber-700 font-semibold">প্রতিদিন নিশ্চিত আয়</span>
            </div>
          </button>

          {/* 2. Today Task */}
          <button
            onClick={() => handleNav('tasks')}
            className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-sm shrink-0">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">Today Task</span>
          </button>

          {/* 3. Income History */}
          <button
            onClick={() => handleNav('income-history')}
            className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-sm shrink-0">
              <History className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">Income History</span>
          </button>

          {/* 4. Leaderboard */}
          <button
            onClick={() => handleNav('leaderboard')}
            className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-white shadow-sm shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">Leaderboard</span>
          </button>

          {/* 5. Pending Status */}
          <button
            onClick={() => handleNav('pending-status')}
            className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Hourglass className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">Pending Status</span>
          </button>

          {/* 6. Spin & Earn */}
          <button
            onClick={() => handleNav('spin')}
            className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Disc3 className="w-5 h-5 animate-spin-slow" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">Spin & Earn</span>
          </button>

          {/* 7. Earn Games */}
          <button
            onClick={() => handleNav('games')}
            className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">Earn Games</span>
          </button>

          {/* 8. My Team */}
          <button
            onClick={() => handleNav('team')}
            className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">My Team</span>
          </button>

          {/* 9. Support Group */}
          <button
            onClick={() => handleNav('support')}
            className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">Support Group</span>
          </button>

          {/* Extra: Deposit Money (User requested) */}
          <button
            onClick={() => handleNav('deposit')}
            className="w-full flex items-center gap-3.5 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-emerald-900 text-sm">ডিপোজিট করুন</span>
              <span className="text-[11px] text-emerald-700">বিকাশ / নগদ / রকেট</span>
            </div>
          </button>

          {/* Privacy Policy (Google AdSense requirement) */}
          <button
            onClick={() => handleNav('privacy-policy')}
            className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-slate-800 text-sm block">প্রাইভেসি পলিসি</span>
              <span className="text-[10px] text-slate-400">Google Policy Compliant</span>
            </div>
          </button>

          {/* Terms of Service */}
          <button
            onClick={() => handleNav('terms')}
            className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shadow-xs shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">শর্তাবলী ও নীতিমালা</span>
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-3.5 p-3 rounded-2xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm">লগআউট (Logout)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
