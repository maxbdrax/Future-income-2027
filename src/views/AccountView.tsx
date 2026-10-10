import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { AvatarSuit } from '../components/Icons.tsx';
import { VIP_PLANS } from '../types/index.ts';
import {
  Wallet,
  Users,
  Briefcase,
  ArrowRightLeft,
  Trophy,
  Disc3,
  PlaySquare,
  Headphones,
  Home,
  PlusCircle,
  ShieldCheck,
  History,
  LogOut,
  Crown,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const {
    currentUser,
    setActiveTab,
    setCurrentModal,
    withdrawRequests,
    depositRequests,
    taskHistory,
    logout
  } = useApp();

  const [activeHistoryTab, setActiveHistoryTab] = useState<'withdraw' | 'deposit' | 'tasks'>('withdraw');

  const myWithdraws = withdrawRequests.filter(w => w.userId === currentUser?.id);
  const myDeposits = depositRequests.filter(d => d.userId === currentUser?.id);
  const myTasks = taskHistory.filter(t => t.userId === currentUser?.id);
  const userVipPlan = currentUser?.vipLevel ? VIP_PLANS.find(p => p.id === currentUser.vipLevel) : null;

  return (
    <div className="min-h-screen pb-32 pt-4 px-4 max-w-md mx-auto space-y-5">
      {/* User Header Profile */}
      <div className="flex items-center justify-between bg-white rounded-3xl p-4 shadow-sm border border-amber-100">
        <div className="flex items-center gap-3">
          <AvatarSuit className="w-14 h-14 ring-2 ring-amber-300" />
          <div>
            <h2 className="font-extrabold text-slate-900 text-base">
              {currentUser?.name || 'MD Rakib Akon'}
            </h2>
            <p className="text-slate-500 font-mono text-xs">
              {currentUser?.phone}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-full border border-amber-300">
                ID: {currentUser?.id || '2161000'}
              </span>
              <button
                onClick={() => setActiveTab('vip')}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  userVipPlan ? 'bg-slate-900 text-amber-400 border border-amber-400' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Crown className="w-3 h-3 fill-current" />
                <span>{userVipPlan ? userVipPlan.name : 'VIP কিনুন'}</span>
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="text-slate-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-colors"
          title="Logout"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* 1. ACCOUNT SUMMARY (Matches Screenshot 7 & 8) */}
      <div>
        <h3 className="font-extrabold text-[#800000] text-sm uppercase tracking-wider mb-2.5">
          ACCOUNT SUMMARY
        </h3>

        {/* Top 2 Cards */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Main Balance */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-amber-100/70 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-[#E53935] mb-2">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-tight">
              MAIN BALANCE
            </span>
            <span className="text-2xl font-black text-[#D32F2F] tracking-tight mt-0.5">
              ৳ {currentUser?.balance.toFixed(2) || '120.00'}
            </span>
          </div>

          {/* Total Referrals */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-amber-100/70 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-[#E53935] mb-2">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-tight">
              TOTAL REFERRALS
            </span>
            <span className="text-2xl font-black text-[#D32F2F] tracking-tight mt-0.5">
              {currentUser?.totalReferrals || 0}
            </span>
          </div>
        </div>

        {/* Wide Earnings Card */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-amber-100/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 font-bold text-xl">
              ৳
            </div>
            <div>
              <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-tight block">
                TOTAL EARNINGS
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">
                (Tasks + Referrals)
              </span>
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-700 tracking-tight">
            ৳ {currentUser?.totalEarnings.toFixed(2) || '0.00'}
          </span>
        </div>
      </div>

      {/* 2. ACCOUNT SERVICES (Matches Screenshot 7 & 8) */}
      <div>
        <h3 className="font-extrabold text-[#800000] text-sm uppercase tracking-wider mb-2.5">
          ACCOUNT SERVICES
        </h3>

        <div className="grid grid-cols-4 gap-2.5">
          {/* Service 1: Tasks */}
          <button
            onClick={() => setActiveTab('tasks')}
            className="bg-white rounded-2xl p-3 shadow-xs border border-amber-100/70 flex flex-col items-center justify-center text-center active:scale-95 transition-transform group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-1.5 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#800000]">Tasks</span>
          </button>

          {/* Service 2: Withdraw */}
          <button
            onClick={() => setActiveTab('withdraw')}
            className="bg-white rounded-2xl p-3 shadow-xs border border-amber-100/70 flex flex-col items-center justify-center text-center active:scale-95 transition-transform group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#EA580C] mb-1.5 group-hover:scale-105 transition-transform">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#800000]">Withdraw</span>
          </button>

          {/* Service 3: My Team */}
          <button
            onClick={() => setActiveTab('team')}
            className="bg-white rounded-2xl p-3 shadow-xs border border-amber-100/70 flex flex-col items-center justify-center text-center active:scale-95 transition-transform group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-[#E11D48] mb-1.5 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#800000]">My Team</span>
          </button>

          {/* Service 4: Rank */}
          <button
            onClick={() => setCurrentModal('leaderboard')}
            className="bg-white rounded-2xl p-3 shadow-xs border border-amber-100/70 flex flex-col items-center justify-center text-center active:scale-95 transition-transform group"
          >
            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-amber-500 mb-1.5 group-hover:scale-105 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#800000]">Rank</span>
          </button>

          {/* Service 5: Spin */}
          <button
            onClick={() => setCurrentModal('spin')}
            className="bg-white rounded-2xl p-3 shadow-xs border border-amber-100/70 flex flex-col items-center justify-center text-center active:scale-95 transition-transform group"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 mb-1.5 group-hover:scale-105 transition-transform">
              <Disc3 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#800000]">Spin</span>
          </button>

          {/* Service 6: Video Ads */}
          <button
            onClick={() => setCurrentModal('video-ads')}
            className="bg-white rounded-2xl p-3 shadow-xs border border-amber-100/70 flex flex-col items-center justify-center text-center active:scale-95 transition-transform group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 mb-1.5 group-hover:scale-105 transition-transform">
              <PlaySquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#800000]">Video Ads</span>
          </button>

          {/* Service 7: Support */}
          <button
            onClick={() => setCurrentModal('support')}
            className="bg-white rounded-2xl p-3 shadow-xs border border-amber-100/70 flex flex-col items-center justify-center text-center active:scale-95 transition-transform group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-1.5 group-hover:scale-105 transition-transform">
              <Headphones className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#800000]">Support</span>
          </button>

          {/* Service 8: Home */}
          <button
            onClick={() => setActiveTab('home')}
            className="bg-white rounded-2xl p-3 shadow-xs border border-amber-100/70 flex flex-col items-center justify-center text-center active:scale-95 transition-transform group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-1.5 group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#800000]">Home</span>
          </button>
        </div>

        {/* Extra Action: Deposit button */}
        <div className="mt-3 space-y-2">
          <button
            onClick={() => setActiveTab('deposit')}
            className="w-full bg-emerald-600 text-white rounded-2xl p-3 flex items-center justify-center gap-2 shadow-sm font-bold text-xs active:scale-95 transition-transform cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>টাকা ডিপোজিট করুন</span>
          </button>

          {/* VIP Level Membership Card */}
          <div
            onClick={() => setActiveTab('vip')}
            className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 p-4 rounded-2xl border border-yellow-300 shadow-md flex items-center justify-between gap-3 cursor-pointer active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                <Crown className="w-5 h-5 fill-amber-400" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-slate-950 text-xs font-black">
                  <span>👑 VIP লেভেল ক্লাব</span>
                  <span className="bg-slate-950 text-amber-300 text-[9px] px-2 py-0.2 rounded-full font-bold">
                    {userVipPlan ? userVipPlan.name : '৳১০০ থেকে শুরু'}
                  </span>
                </div>
                <p className="text-[11px] text-amber-950 font-medium leading-tight">
                  {userVipPlan ? `দৈনিক আয় ৳${userVipPlan.dailyIncome} ক্লেইম করুন` : 'প্রতিদিন ১০৳ থেকে ৩৮০৳ ফিক্সড আয় করুন'}
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-950 text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. HISTORY & RECORDS */}
      <div>
        <h3 className="font-extrabold text-[#800000] text-sm uppercase tracking-wider mb-2.5">
          HISTORY & RECORDS
        </h3>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setActiveHistoryTab('withdraw')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeHistoryTab === 'withdraw'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-600'
            }`}
          >
            উত্তোলন ({myWithdraws.length})
          </button>
          <button
            onClick={() => setActiveHistoryTab('deposit')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeHistoryTab === 'deposit'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-600'
            }`}
          >
            ডিপোজিট ({myDeposits.length})
          </button>
          <button
            onClick={() => setActiveHistoryTab('tasks')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              activeHistoryTab === 'tasks'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-600'
            }`}
          >
            টাস্ক হিস্টোরি ({myTasks.length})
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl p-4 border border-amber-100 shadow-sm min-h-[160px]">
          {activeHistoryTab === 'withdraw' && (
            <div>
              {myWithdraws.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-6">কোনো উইথড্র হিস্টোরি নেই</p>
              ) : (
                <div className="space-y-2">
                  {myWithdraws.map((w) => (
                    <div key={w.id} className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">৳ {w.amount.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-500 ml-2 font-mono">({w.method})</span>
                        <p className="text-[10px] text-slate-400">{w.requestedAt}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        w.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        w.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {w.status === 'approved' ? 'সফল' : w.status === 'pending' ? 'পেন্ডিং' : 'বাতিল'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeHistoryTab === 'deposit' && (
            <div>
              {myDeposits.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-6">কোনো ডিপোজিট হিস্টোরি নেই</p>
              ) : (
                <div className="space-y-2">
                  {myDeposits.map((d) => (
                    <div key={d.id} className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">৳ {d.amount.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-500 ml-2 font-mono">({d.method} - {d.trxId})</span>
                        <p className="text-[10px] text-slate-400">{d.requestedAt}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        d.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        d.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {d.status === 'approved' ? 'অনুমোদিত' : d.status === 'pending' ? 'পেন্ডিং' : 'বাতিল'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeHistoryTab === 'tasks' && (
            <div>
              {myTasks.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-6">আজকে কোনো কাজ সম্পন্ন করা হয়নি</p>
              ) : (
                <div className="space-y-2">
                  {myTasks.map((t) => (
                    <div key={t.id} className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{t.taskTitle}</span>
                        <p className="text-[10px] text-slate-400">{t.completedAt}</p>
                      </div>
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        + ৳ {t.reward.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
