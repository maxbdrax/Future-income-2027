import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Header } from '../components/Header.tsx';
import { GoogleAdBanner } from '../components/GoogleAdBanner.tsx';
import { TaskItem } from '../types/index.ts';
import { parseVideoUrl } from '../utils/videoHelper.ts';
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
  Sparkles,
  CheckCircle2,
  PlayCircle,
  Eye,
  Check
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const { tasks, completeTask, claimDailyBonus, currentUser, settings } = useApp();
  const [filter, setFilter] = useState<'all' | 'youtube' | 'social' | 'web'>('all');
  const [activeTaskModal, setActiveTaskModal] = useState<TaskItem | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(15);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isTaskDone, setIsTaskDone] = useState<boolean>(false);
  const [targetVisited, setTargetVisited] = useState<boolean>(false);

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
    const duration = Math.max(10, task.durationSec || 15);
    setTotalDuration(duration);
    setCountdown(duration);
    setIsTimerRunning(true);
    setIsTaskDone(false);
    setTargetVisited(false);
  };

  useEffect(() => {
    if (!isTimerRunning) return;

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

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleClaimReward = () => {
    if (!activeTaskModal) return;
    const res = completeTask(activeTaskModal.id);
    if (res.success) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setActiveTaskModal(null);
    }
  };

  // Open target URL in a new tab/window and note visited
  const handleOpenTargetLink = (url: string) => {
    setTargetVisited(true);
    if (url && url !== '#' && url !== '/') {
      window.open(url, '_blank', 'noopener,noreferrer');
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

  const parsedVideo = activeTaskModal ? parseVideoUrl(activeTaskModal.targetUrl) : null;
  const progressPercent = totalDuration > 0 ? Math.min(100, Math.round(((totalDuration - countdown) / totalDuration) * 100)) : 100;

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

                  <div className="flex items-center gap-3 mt-2 text-xs font-bold flex-wrap">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      + ৳ {task.reward.toFixed(2)}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {task.durationSec} সেকেন্ড
                    </span>
                    <span className="text-slate-400 font-normal text-[11px]">
                      • {task.completedCount} সম্পন্ন
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleStartTask(task)}
                className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold py-2.5 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2 text-xs uppercase tracking-wider active:scale-98 transition-all"
              >
                {task.type === 'youtube' || task.type === 'ads' ? (
                  <>
                    <PlayCircle className="w-4 h-4 fill-white text-rose-600" />
                    <span>ভিডিও চালু ও কাজ শুরু করুন</span>
                  </>
                ) : (
                  <>
                    <span>কাজ শুরু করুন</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Task Completion & Video Player Modal */}
      {activeTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-5 shadow-2xl relative border border-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => {
                setActiveTaskModal(null);
                setIsTimerRunning(false);
              }}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 pr-8 mb-3 pb-2 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-200">
                {getTaskIcon(activeTaskModal.iconType)}
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight truncate">
                  {activeTaskModal.title}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    রিওয়ার্ড: ৳ {activeTaskModal.reward.toFixed(2)}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
                    <Clock className="w-3 h-3" />
                    {totalDuration} সেকেন্ড
                  </span>
                </div>
              </div>
            </div>

            {/* VIDEO PLAYER SECTION (Plays automatically in popup) */}
            {parsedVideo && parsedVideo.isPlayableVideo ? (
              <div className="space-y-2.5 mb-3">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-md border border-slate-800">
                  {parsedVideo.type === 'youtube' && parsedVideo.embedUrl ? (
                    <iframe
                      src={parsedVideo.embedUrl}
                      title={activeTaskModal.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : parsedVideo.type === 'direct' && parsedVideo.embedUrl ? (
                    <video
                      src={parsedVideo.embedUrl}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>

                {/* Direct Action Link button */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleOpenTargetLink(activeTaskModal.targetUrl)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-extrabold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-xs active:scale-95 transition-all"
                  >
                    <Youtube className="w-4 h-4 fill-white" />
                    <span>ইউটিউব অ্যাপ বা নতুন ট্যাবে ভিডিওটি দেখুন</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* TARGET URL / NON-VIDEO LINK SECTION */
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-3.5 mb-3 text-left space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    টার্গেট ওয়েবসাইট / লিংক:
                  </span>
                  {targetVisited && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> ভিজিট করা হয়েছে
                    </span>
                  )}
                </div>

                <div className="bg-white p-2 rounded-xl border border-amber-200/80 font-mono text-xs text-slate-700 truncate select-all">
                  {activeTaskModal.targetUrl}
                </div>

                <button
                  onClick={() => handleOpenTargetLink(activeTaskModal.targetUrl)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow-sm active:scale-95 transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>👉 টার্গেট লিংকে প্রবেশ করুন (ভিজিট করুন)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <p className="text-[11px] text-slate-500 leading-tight">
                  💡 লিংকে প্রবেশ করে নির্ধারিত সময় শেষ হওয়া পর্যন্ত অপেক্ষা করুন। সময় শেষে রিওয়ার্ড যোগ হবে।
                </p>
              </div>
            )}

            {/* LIVE COUNTDOWN & PROGRESS BAR */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 mb-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  {isTimerRunning ? 'অপেক্ষার সময়:' : 'স্ট্যাটাস:'}
                </span>
                {isTimerRunning ? (
                  <span className="font-mono font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-md text-sm animate-pulse">
                    {countdown} সেকেন্ড বাকি
                  </span>
                ) : (
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    সময় সমাপ্ত!
                  </span>
                )}
              </div>

              {/* Progress track */}
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                    isTaskDone
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                <span>{progressPercent}% সম্পূর্ণ</span>
                <span>{isTimerRunning ? 'ভিডিও/লিংক চলমান...' : 'এখন টাকা জমা করুন'}</span>
              </div>
            </div>

            {/* GOOGLE ADSENSE SPONSOR BANNER (Compact & clean, sits under video) */}
            {settings.adsEnabled && (
              <div className="mb-3 text-left">
                <GoogleAdBanner slotType="banner" compact={true} />
              </div>
            )}

            {/* CLAIM REWARD ACTION BUTTON */}
            {isTaskDone ? (
              <button
                onClick={handleClaimReward}
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-900/20 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 animate-bounce"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>৳ {activeTaskModal.reward.toFixed(2)} টাকা ব্যালেন্সে জমা করুন!</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-slate-150 text-slate-400 font-bold py-3.5 px-4 rounded-2xl text-xs sm:text-sm cursor-not-allowed border border-slate-200 bg-slate-100 flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4 animate-spin text-slate-400" />
                <span>টাইমার চলছে ({countdown}s বাকি)... অপেক্ষা করুন</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
