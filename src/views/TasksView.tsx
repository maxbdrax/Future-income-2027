import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Header } from '../components/Header.tsx';
import { GoogleAdBanner } from '../components/GoogleAdBanner.tsx';
import { TaskItem } from '../types/index.ts';
import confetti from 'canvas-confetti';
import {
  Youtube,
  Send,
  Globe,
  Star,
  Play,
  Gift,
  Clock,
  ExternalLink,
  X,
  Sparkles
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const { tasks, completeTask, claimDailyBonus, currentUser, settings, showToast } = useApp();
  const [filter, setFilter] = useState<'all' | 'youtube' | 'social' | 'web'>('all');
  const [activeTaskModal, setActiveTaskModal] = useState<TaskItem | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isTaskDone, setIsTaskDone] = useState<boolean>(false);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (!t.active) return false;
    if (filter === 'all') return true;
    if (filter === 'youtube') return t.type === 'youtube' || t.type === 'ads';
    if (filter === 'social') return t.type === 'telegram' || t.iconType === 'facebook';
    if (filter === 'web') return t.type === 'web' || t.type === 'review';
    return true;
  });

  const getTaskIcon = (iconType: string) => {
    switch (iconType) {
      case 'youtube':
        return <Youtube className="w-5 h-5 text-red-600" />;
      case 'telegram':
        return <Send className="w-5 h-5 text-sky-500" />;
      case 'star':
        return <Star className="w-5 h-5 text-amber-500 fill-amber-500" />;
      case 'play':
        return <Play className="w-5 h-5 text-rose-500 fill-rose-500" />;
      default:
        return <Globe className="w-5 h-5 text-emerald-600" />;
    }
  };

  const handleStartTask = (task: TaskItem) => {
    setActiveTaskModal(task);
    // Use demo duration of 10s if durationSec > 10 for friendly testing, or real duration
    const demoSec = Math.min(task.durationSec, 15);
    setCountdown(demoSec);
    setIsTimerRunning(true);
    setIsTaskDone(false);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          setIsTaskDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleClaimReward = () => {
    if (!activeTaskModal) return;
    const res = completeTask(activeTaskModal.id);
    if (res.success) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
      setActiveTaskModal(null);
    }
  };

  // Calculate 24h bonus cooldown state
  const lastBonusClaim = currentUser?.lastDailyBonusClaimedAt || 0;
  const cooldownPeriodMs = 24 * 60 * 60 * 1000;
  const isBonusOnCooldown = Date.now() - lastBonusClaim < cooldownPeriodMs;
  
  let remainingBonusStr = '';
  if (isBonusOnCooldown) {
    const remainingMs = cooldownPeriodMs - (Date.now() - lastBonusClaim);
    const hrs = Math.floor(remainingMs / (1000 * 60 * 60));
    const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    remainingBonusStr = `${hrs}h ${mins}m বাকি`;
  }

  const handleClaimDaily = () => {
    const res = claimDailyBonus();
    if (res.success) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="min-h-screen pb-32">
      <Header />

      <div className="px-4 py-4 space-y-4 max-w-md mx-auto">
        {/* Daily Bonus Card (Configurable amount & 24h cooldown) */}
        <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 rounded-3xl p-4 text-white shadow-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
              <Gift className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm md:text-base leading-tight">
                দৈনিক বোনাস সংগ্রহ করুন
              </h3>
              <p className="text-white/90 text-xs font-semibold">
                প্রতিদিন ফ্রি ৳ {(settings.dailyBonusAmount || 10).toFixed(2)} টাকা বোনাস!
              </p>
            </div>
          </div>

          <button
            onClick={handleClaimDaily}
            disabled={isBonusOnCooldown}
            className={`font-extrabold text-xs px-3.5 py-2.5 rounded-xl shadow-md transition-all shrink-0 ${
              isBonusOnCooldown
                ? 'bg-amber-200/80 text-amber-900 cursor-not-allowed opacity-80'
                : 'bg-white text-amber-900 active:scale-90 hover:bg-amber-50'
            }`}
          >
            {isBonusOnCooldown ? remainingBonusStr : 'ক্লেইম করুন'}
          </button>
        </div>

        {/* Task Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-amber-100/60 rounded-2xl overflow-x-auto text-xs font-bold text-slate-700">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              filter === 'all' ? 'bg-white text-amber-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            সব কাজ ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('youtube')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              filter === 'youtube' ? 'bg-white text-amber-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ভিডিও টাস্ক
          </button>
          <button
            onClick={() => setFilter('social')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              filter === 'social' ? 'bg-white text-amber-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            টেলিগ্রাম/সোশ্যাল
          </button>
          <button
            onClick={() => setFilter('web')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              filter === 'web' ? 'bg-white text-amber-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ওয়েব ও রিভিউ
          </button>
        </div>

        {/* Task List Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>আজকের উপলভ্য টাস্কসমূহ</span>
          </h3>
          <span className="text-xs text-slate-500 font-semibold">
            {filteredTasks.length} টি কাজ বাকি
          </span>
        </div>

        {/* Google AdSense Banner on Tasks List */}
        {settings.adsEnabled && (
          <GoogleAdBanner slotType="banner" className="mb-1" />
        )}

        {/* Tasks Grid / Cards */}
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-3xl p-4 border border-amber-100 shadow-sm flex flex-col justify-between gap-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
                  {getTaskIcon(task.iconType)}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                    {task.title}
                  </h4>
                  <p className="text-slate-600 text-xs mt-0.5 line-clamp-2">
                    {task.description}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-xs font-bold">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      + ৳ {task.reward.toFixed(2)}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {task.durationSec} সেকেন্ড
                    </span>
                    <span className="text-slate-400 font-normal">
                      • {task.completedCount} সম্পন্ন
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleStartTask(task)}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold py-2.5 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2 text-xs uppercase tracking-wider active:scale-98 transition-all"
              >
                <span>কাজ শুরু করুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Task Completion Modal */}
      {activeTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveTaskModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pt-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 mx-auto flex items-center justify-center mb-3">
                {getTaskIcon(activeTaskModal.iconType)}
              </div>

              <h3 className="font-extrabold text-slate-900 text-base">
                {activeTaskModal.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {activeTaskModal.description}
              </p>

              {/* Countdown circle */}
              <div className="my-4 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-amber-400 bg-amber-50 flex flex-col items-center justify-center shadow-inner">
                  {isTimerRunning ? (
                    <>
                      <span className="text-2xl font-black text-amber-700 font-mono">
                        {countdown}
                      </span>
                      <span className="text-[9px] text-amber-800 font-bold uppercase">
                        সেকেন্ড বাকি
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-black text-emerald-600">
                      সম্পন্ন!
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">
                  {isTimerRunning ? 'বিজ্ঞাপন দেখা শেষ হওয়া পর্যন্ত অপেক্ষা করুন...' : 'টাস্ক সফলভাবে শেষ হয়েছে! রিওয়ার্ড নিন।'}
                </p>
              </div>

              {/* Google AdSense Task Rewarded/Interstitial Ad */}
              {settings.adsEnabled && (
                <div className="mb-4 text-left">
                  <GoogleAdBanner slotType="reward" />
                </div>
              )}

              {/* Reward Button */}
              {isTaskDone ? (
                <button
                  onClick={handleClaimReward}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-900/20 active:scale-95 transition-all text-sm"
                >
                  ৳ {activeTaskModal.reward.toFixed(2)} টাকা জমা করুন
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-slate-200 text-slate-400 font-bold py-3.5 px-4 rounded-2xl text-sm cursor-not-allowed"
                >
                  টাইমার চলছে ({countdown}s)...
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
