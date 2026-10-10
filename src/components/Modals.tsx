import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import confetti from 'canvas-confetti';
import {
  X,
  Disc3,
  Trophy,
  PlaySquare,
  Headphones,
  History,
  Hourglass,
  ExternalLink,
  MessageCircle,
  Phone,
  Sparkles,
  CheckCircle2,
  Clock,
  Youtube
} from 'lucide-react';

export const Modals: React.FC = () => {
  const {
    currentModal,
    setCurrentModal,
    currentUser,
    settings,
    spinWheelReward,
    users,
    withdrawRequests,
    depositRequests,
    taskHistory,
    showToast
  } = useApp();

  // Spin wheel state
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinRotation, setSpinRotation] = useState(0);

  // Video ad state
  const [adCountdown, setAdCountdown] = useState(15);
  const [adWatched, setAdWatched] = useState(false);
  const [isAdPlaying, setIsAdPlaying] = useState(false);

  if (!currentModal) return null;

  const closeModal = () => {
    setCurrentModal(null);
  };

  // Spin Wheel logic
  const spinPrizes = [5, 10, 25, 50, 2, 100, 15, 20];
  const handleSpin = () => {
    if (isSpinning) return;
    if ((currentUser?.dailySpinsRemaining ?? 0) <= 0) {
      showToast('আজকের সব স্পিন শেষ! আগামীকাল আবার আসুন।');
      return;
    }

    setIsSpinning(true);
    // Pick random prize
    const randomIndex = Math.floor(Math.random() * spinPrizes.length);
    const prize = spinPrizes[randomIndex];
    const degreesPerSegment = 360 / spinPrizes.length;
    const extraRotations = 5 * 360; // 5 full spins
    const targetDegree = spinRotation + extraRotations + (360 - randomIndex * degreesPerSegment);

    setSpinRotation(targetDegree);

    setTimeout(() => {
      setIsSpinning(false);
      spinWheelReward(prize);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 3800);
  };

  // Video Ad logic
  const handleStartWatchAd = () => {
    setIsAdPlaying(true);
    setAdCountdown(15);
    setAdWatched(false);

    const timer = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsAdPlaying(false);
          setAdWatched(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleClaimAdReward = () => {
    spinWheelReward(5.00); // ৳5 for ad
    confetti({ particleCount: 50, spread: 60 });
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative border border-amber-100 max-h-[85vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. Spin & Earn Modal */}
        {currentModal === 'spin' && (
          <div className="text-center pt-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Disc3 className="w-6 h-6 text-pink-600 animate-spin-slow" />
              <h3 className="font-extrabold text-slate-900 text-lg">
                স্পিন করুন এবং জিতুন!
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-4">
              আজকে বাকি স্পিন: <span className="font-bold text-pink-600">{currentUser?.dailySpinsRemaining ?? 0} টি</span>
            </p>

            {/* Wheel graphic */}
            <div className="relative w-56 h-56 mx-auto my-4 flex items-center justify-center">
              {/* Pointer indicator */}
              <div className="absolute -top-3 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-red-600 filter drop-shadow-md"></div>

              {/* Rotating Wheel */}
              <div
                className="w-full h-full rounded-full border-4 border-amber-400 shadow-xl overflow-hidden relative transition-transform ease-out"
                style={{
                  transform: `rotate(${spinRotation}deg)`,
                  transitionDuration: isSpinning ? '3.8s' : '0s',
                  background: 'conic-gradient(#f43f5e 0% 12.5%, #fb923c 12.5% 25%, #facc15 25% 37.5%, #4ade80 37.5% 50%, #38bdf8 50% 62.5%, #818cf8 62.5% 75%, #c084fc 75% 87.5%, #f472b6 87.5% 100%)'
                }}
              >
                {/* Center cap */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-amber-300 z-10">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Spin CTA Button */}
            <button
              onClick={handleSpin}
              disabled={isSpinning || (currentUser?.dailySpinsRemaining ?? 0) <= 0}
              className="w-full mt-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-black py-3.5 px-4 rounded-2xl shadow-lg shadow-pink-900/20 active:scale-95 transition-all text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {isSpinning ? 'ঘুরছে...' : 'SPIN NOW'}
            </button>
          </div>
        )}

        {/* 2. Video Ads Modal */}
        {currentModal === 'video-ads' && (
          <div className="text-center pt-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <PlaySquare className="w-6 h-6 text-red-600" />
              <h3 className="font-extrabold text-slate-900 text-lg">
                ভিডিও বিজ্ঞাপন দেখুন
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-4">
              ১৫ সেকেন্ড বিজ্ঞাপন দেখে সরাসরি ব্যালেন্সে ৳ ৫.০০ টাকা যোগ করুন!
            </p>

            <div className="w-full h-40 bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white relative overflow-hidden my-3">
              {isAdPlaying ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin"></div>
                  <span className="font-mono font-bold text-sm text-amber-300">
                    বিজ্ঞাপন চলছে... {adCountdown}s
                  </span>
                </div>
              ) : adWatched ? (
                <div className="flex flex-col items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-12 h-12" />
                  <span className="font-bold text-sm">বিজ্ঞাপন দেখা সম্পন্ন!</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Youtube className="w-12 h-12 text-red-500" />
                  <span className="text-xs font-semibold">বিজ্ঞাপন দেখতে নিচে চাপুন</span>
                </div>
              )}
            </div>

            {adWatched ? (
              <button
                onClick={handleClaimAdReward}
                className="w-full mt-3 bg-emerald-600 text-white font-black py-3.5 rounded-2xl shadow-md text-sm active:scale-95 transition-all"
              >
                ৳ ৫.০০ টাকা রিওয়ার্ড নিন
              </button>
            ) : (
              <button
                onClick={handleStartWatchAd}
                disabled={isAdPlaying}
                className="w-full mt-3 bg-red-600 text-white font-black py-3.5 rounded-2xl shadow-md text-sm active:scale-95 transition-all disabled:opacity-50"
              >
                {isAdPlaying ? `অপেক্ষা করুন (${adCountdown}s)...` : 'বিজ্ঞাপন চালু করুন'}
              </button>
            )}
          </div>
        )}

        {/* 3. Leaderboard Modal */}
        {currentModal === 'leaderboard' && (
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-6 h-6 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-base">
                টপ আর্নার লিডারবোর্ড
              </h3>
            </div>

            <div className="space-y-2">
              {[
                { rank: 1, name: 'ফাহিম মাহমুদ', amount: '৳ ২৮,৪৫০', ref: '৩৪২ জন' },
                { rank: 2, name: 'রিয়াদুল ইসলাম', amount: '৳ ২৪,৩০০', ref: '২৯৮ জন' },
                { rank: 3, name: 'শরিফুল আকন্দ', amount: '৳ ১৯,৮০০', ref: '২৫৫ জন' },
                { rank: 4, name: 'তানভীর আহমেদ', amount: '৳ ১৬,২০০', ref: '২১০ জন' },
                { rank: 5, name: 'MD Rakib Akon (You)', amount: `৳ ${(currentUser?.balance ?? 120) + (currentUser?.totalEarnings ?? 0)}`, ref: `${currentUser?.totalReferrals ?? 0} জন` }
              ].map((item) => (
                <div
                  key={item.rank}
                  className={`p-3 rounded-2xl flex items-center justify-between text-xs border ${
                    item.rank === 1
                      ? 'bg-amber-50 border-amber-300 font-bold'
                      : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                        item.rank === 1
                          ? 'bg-amber-400 text-amber-950'
                          : item.rank === 2
                          ? 'bg-slate-300 text-slate-800'
                          : item.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.rank}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <span className="text-[10px] text-slate-500">রেফার: {item.ref}</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-emerald-700">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Support Group Modal */}
        {currentModal === 'support' && (
          <div className="text-center pt-2">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 mx-auto flex items-center justify-center mb-3">
              <Headphones className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Future Income 2027 হেল্প ও সাপোর্ট
            </h3>
            <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
              যেকোনো ধরণের সমস্যা, পেমেন্ট সংক্রান্ত তথ্য বা সহযোগিতার জন্য আমাদের সাথে সরাসরি যুক্ত হোন।
            </p>

            <div className="space-y-2.5">
              <a
                href={settings.supportTelegram}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#0088cc] text-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm text-xs active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>টেলিগ্রাম অফিসিয়াল গ্রুপে জয়েন করুন</span>
              </a>

              <a
                href={`tel:${settings.supportPhone}`}
                className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm text-xs active:scale-95 transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>হেল্পলাইন: {settings.supportPhone}</span>
              </a>
            </div>
          </div>
        )}

        {/* 5. Income History Modal */}
        {currentModal === 'income-history' && (
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-6 h-6 text-amber-600" />
              <h3 className="font-extrabold text-slate-900 text-base">
                আপনার সকল ইনকাম ইতিহাস
              </h3>
            </div>

            <div className="space-y-2">
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                <span className="text-xs text-amber-900 font-medium">মোট উপার্জিত ব্যালেন্স:</span>
                <p className="text-xl font-black text-amber-950 mt-0.5">
                  ৳ {currentUser?.totalEarnings.toFixed(2) || '0.00'}
                </p>
              </div>

              <div className="text-xs font-bold text-slate-800 pt-2 mb-1">
                সাম্প্রতিক টাস্ক রেকর্ডসমূহ:
              </div>

              {taskHistory.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-4">কোনো টাস্ক সম্পন্ন করার রেকর্ড নেই</p>
              ) : (
                taskHistory.slice(0, 10).map((th) => (
                  <div key={th.id} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{th.taskTitle}</p>
                      <span className="text-[10px] text-slate-400">{th.completedAt}</span>
                    </div>
                    <span className="text-emerald-600 font-extrabold">+ ৳ {th.reward.toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 6. Pending Status Modal */}
        {currentModal === 'pending-status' && (
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <Hourglass className="w-6 h-6 text-purple-600" />
              <h3 className="font-extrabold text-slate-900 text-base">
                পেন্ডিং স্ট্যাটাস
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-1.5">পেন্ডিং উইথড্র রিকোয়েস্ট:</h4>
                {withdrawRequests.filter(w => w.userId === currentUser?.id && w.status === 'pending').length === 0 ? (
                  <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl text-center">কোনো পেন্ডিং উইথড্র নেই</p>
                ) : (
                  withdrawRequests.filter(w => w.userId === currentUser?.id && w.status === 'pending').map(w => (
                    <div key={w.id} className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs flex justify-between">
                      <div>
                        <span className="font-bold text-slate-800">৳ {w.amount} ({w.method})</span>
                        <p className="text-[10px] text-slate-500 font-mono">{w.receiverNumber}</p>
                      </div>
                      <span className="text-amber-800 font-bold">যাচাই হচ্ছে</span>
                    </div>
                  ))
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-1.5">পেন্ডিং ডিপোজিট রিকোয়েস্ট:</h4>
                {depositRequests.filter(d => d.userId === currentUser?.id && d.status === 'pending').length === 0 ? (
                  <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl text-center">কোনো পেন্ডিং ডিপোজিট নেই</p>
                ) : (
                  depositRequests.filter(d => d.userId === currentUser?.id && d.status === 'pending').map(d => (
                    <div key={d.id} className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs flex justify-between">
                      <div>
                        <span className="font-bold text-slate-800">৳ {d.amount} ({d.method})</span>
                        <p className="text-[10px] text-slate-500 font-mono">TrxID: {d.trxId}</p>
                      </div>
                      <span className="text-amber-800 font-bold">এডমিন যাচাই করছেন</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* 7. Video Tutorial Modal */}
        {currentModal === 'video-tutorial' && (
          <div className="text-center pt-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-3">
              <Youtube className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              কীভাবে কাজ করে টাকা আয় করবেন?
            </h3>
            <p className="text-xs text-slate-600 mt-2 mb-4 leading-relaxed">
              ১. প্রথমে Tasks অপশনে যান এবং উপলভ্য কাজটি সিলেক্ট করুন। <br/>
              ২. নির্ধারিত সময় (১৫-৬০ সেকেন্ড) অপেক্ষা করে নির্দেশনা মেনে কাজটি সম্পূর্ণ করুন। <br/>
              ৩. সাথে সাথে আপনার একাউন্টে টাকা যোগ হবে। <br/>
              ৪. মিনিমাম ৬০০ টাকা হলেই সরাসরি বিকাশ বা নগদে উইথড্র করে পেমেন্ট নিন!
            </p>
            <button
              onClick={closeModal}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-2xl text-xs active:scale-95 transition-all"
            >
              বুঝেছি, কাজ শুরু করি
            </button>
          </div>
        )}

        {/* 8. Notification list modal */}
        {currentModal === 'notifications' && (
          <div className="pt-2">
            <h3 className="font-extrabold text-slate-900 text-base mb-3">
              নোটিফিকেশন ও আপডেট
            </h3>
            <div className="space-y-2">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs">
                <span className="font-bold text-amber-900">স্বাগতম অফার!</span>
                <p className="text-slate-600 mt-0.5">নতুন একাউন্ট খোলায় আপনাকে ৳ ৫০.০০ টাকা বোনাস দেওয়া হয়েছে।</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-900">রেফারেল বোনাস বৃদ্ধি</span>
                <p className="text-slate-600 mt-0.5">প্রতি সফল রেফারে এখন পাবেন নিশ্চিত ৳ ৭০.০০ টাকা বোনাস!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
