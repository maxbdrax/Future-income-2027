import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { TaskItem, PaymentMethod, VIP_PLANS } from '../types/index.ts';
import { GoogleAdBanner } from '../components/GoogleAdBanner.tsx';
import confetti from 'canvas-confetti';
import {
  ShieldAlert,
  Users,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Save,
  Settings,
  Briefcase,
  Search,
  RefreshCcw,
  Sliders,
  X,
  CreditCard,
  Code2,
  Crown,
  Flame,
  Radio,
  Zap,
  HelpCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    setIsAdminOpen,
    users,
    tasks,
    withdrawRequests,
    depositRequests,
    settings,
    approveWithdraw,
    rejectWithdraw,
    approveDeposit,
    rejectDeposit,
    addTask,
    deleteTask,
    updateSettings,
    adjustUserBalance,
    toggleUserStatus,
    verifyUserAccount,
    setUserVipLevel,
    resetToDefaults,
    showToast,
    isFirebaseSyncing
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'deposits' | 'withdraws' | 'tasks' | 'users' | 'numbers' | 'adsense' | 'vip' | 'settings'>('overview');

  // AdSense Settings form states
  const [editAdsensePub, setEditAdsensePub] = useState(settings.adsensePubId || 'ca-pub-3335603276700829');
  const [editAdsenseBannerSlot, setEditAdsenseBannerSlot] = useState(settings.adsenseBannerSlot || '9876543210');
  const [editAdsenseRewardSlot, setEditAdsenseRewardSlot] = useState(settings.adsenseRewardSlot || '1234567890');
  const [editAdsEnabled, setEditAdsEnabled] = useState(settings.adsEnabled ?? true);
  const [editCustomAdCode, setEditCustomAdCode] = useState(settings.customAdCode || '');

  useEffect(() => {
    if (settings.adsensePubId) setEditAdsensePub(settings.adsensePubId);
    if (settings.adsenseBannerSlot) setEditAdsenseBannerSlot(settings.adsenseBannerSlot);
    if (settings.adsenseRewardSlot) setEditAdsenseRewardSlot(settings.adsenseRewardSlot);
    if (settings.adsEnabled !== undefined) setEditAdsEnabled(settings.adsEnabled);
    if (settings.customAdCode !== undefined) setEditCustomAdCode(settings.customAdCode);
  }, [settings]);

  // VIP assignment manual modal/state
  const [selectedUserForVip, setSelectedUserForVip] = useState<string | null>(null);
  const [selectedVipLevelToSet, setSelectedVipLevelToSet] = useState<number>(1);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskReward, setNewTaskReward] = useState('10');
  const [newTaskDuration, setNewTaskDuration] = useState('30');
  const [newTaskType, setNewTaskType] = useState<'youtube' | 'web' | 'telegram' | 'review'>('youtube');
  const [newTaskUrl, setNewTaskUrl] = useState('');

  // Settings form states
  const [editBkash, setEditBkash] = useState(settings.bkashNumber);
  const [editBkashType, setEditBkashType] = useState(settings.bkashType);
  const [editNagad, setEditNagad] = useState(settings.nagadNumber);
  const [editNagadType, setEditNagadType] = useState(settings.nagadType);
  const [editRocket, setEditRocket] = useState(settings.rocketNumber);
  const [editRocketType, setEditRocketType] = useState(settings.rocketType);
  const [editMinWithdraw, setEditMinWithdraw] = useState(String(settings.minWithdraw));
  const [editReferBonus, setEditReferBonus] = useState(String(settings.referBonus));
  const [editDailyBonus, setEditDailyBonus] = useState(String(settings.dailyBonusAmount || 10));
  const [editRequiredRefs, setEditRequiredRefs] = useState(String(settings.requiredReferralsForWithdraw || 10));
  const [editVerificationFee, setEditVerificationFee] = useState(String(settings.verificationDepositFee || 300));
  const [editAdminPin, setEditAdminPin] = useState(settings.adminSecretPin || 'admin7788');
  const [editNotice, setEditNotice] = useState(settings.notice);
  const [editTelegram, setEditTelegram] = useState(settings.supportTelegram);

  // User search & balance modal
  const [userSearch, setUserSearch] = useState('');
  const [selectedUserForBalance, setSelectedUserForBalance] = useState<string | null>(null);
  const [balanceDelta, setBalanceDelta] = useState('100');

  // Stats
  const pendingDeposits = depositRequests.filter(d => d.status === 'pending');
  const pendingWithdraws = withdrawRequests.filter(w => w.status === 'pending');
  const totalApprovedPaid = withdrawRequests
    .filter(w => w.status === 'approved')
    .reduce((sum, w) => sum + w.amount, 0);
  const totalApprovedDeposited = depositRequests
    .filter(d => d.status === 'approved')
    .reduce((sum, d) => sum + d.amount, 0);

  const vipUsersCount = users.filter(u => (u.vipLevel || 0) > 0).length;

  const handleSaveAdsenseSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      adsensePubId: editAdsensePub.trim(),
      adsenseBannerSlot: editAdsenseBannerSlot.trim(),
      adsenseRewardSlot: editAdsenseRewardSlot.trim(),
      adsEnabled: editAdsEnabled,
      customAdCode: editCustomAdCode.trim()
    });
    showToast('গুগল এডসেন্স ও বিজ্ঞাপন সেটিংস সংরক্ষিত হয়েছে!');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) {
      showToast('টাস্কের নাম লিখুন!');
      return;
    }
    addTask({
      title: newTaskTitle,
      description: newTaskDesc || 'নির্দেশনা অনুযায়ী কাজটি সম্পন্ন করুন।',
      reward: parseFloat(newTaskReward) || 10,
      durationSec: parseInt(newTaskDuration) || 30,
      type: newTaskType,
      targetUrl: newTaskUrl || '#',
      iconType: newTaskType === 'youtube' ? 'youtube' : newTaskType === 'telegram' ? 'telegram' : 'globe',
      active: true
    });
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskUrl('');
  };

  const handleSavePaymentNumbers = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      bkashNumber: editBkash,
      bkashType: editBkashType,
      nagadNumber: editNagad,
      nagadType: editNagadType,
      rocketNumber: editRocket,
      rocketType: editRocketType
    });
  };

  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      minWithdraw: parseFloat(editMinWithdraw) || 600,
      referBonus: parseFloat(editReferBonus) || 70,
      dailyBonusAmount: parseFloat(editDailyBonus) || 10,
      requiredReferralsForWithdraw: parseInt(editRequiredRefs) || 10,
      verificationDepositFee: parseFloat(editVerificationFee) || 300,
      adminSecretPin: editAdminPin.trim() || 'admin7788',
      notice: editNotice,
      supportTelegram: editTelegram
    });
  };

  const handleApplyBalance = (userId: string, isAdd: boolean) => {
    const delta = parseFloat(balanceDelta);
    if (isNaN(delta) || delta <= 0) {
      showToast('সঠিক টাকার পরিমাণ লিখুন');
      return;
    }
    adjustUserBalance(userId, isAdd ? delta : -delta, isAdd ? 'এডমিন ডিপোজিট/বোনাস' : 'এডমিন কর্তন');
    setSelectedUserForBalance(null);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.phone.includes(userSearch) ||
    u.id.includes(userSearch)
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col overflow-hidden text-slate-800">
      {/* Top Admin Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm md:text-base leading-tight text-white flex items-center gap-2">
              Future Income 2027 অ্যাডমিন প্যানেল
              <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded-full font-mono">
                CONTROL MASTER
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">ডিপোজিট, উইথড্র ও টাস্ক খুব সহজে নিয়ন্ত্রণ করুন</p>
          </div>
        </div>

        <button
          onClick={() => setIsAdminOpen(false)}
          className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="Close admin"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Admin Navigation Pills */}
      <div className="bg-slate-800 border-b border-slate-700 px-3 py-2 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
        <button
          onClick={() => setActiveAdminTab('overview')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeAdminTab === 'overview' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          ড্যাশবোর্ড
        </button>
        <button
          onClick={() => setActiveAdminTab('deposits')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeAdminTab === 'deposits' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          <span>ডিপোজিট রিকোয়েস্ট</span>
          {pendingDeposits.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
              {pendingDeposits.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveAdminTab('withdraws')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeAdminTab === 'withdraws' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          <span>উইথড্র রিকোয়েস্ট</span>
          {pendingWithdraws.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
              {pendingWithdraws.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveAdminTab('tasks')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeAdminTab === 'tasks' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          টাস্ক ম্যানেজমেন্ট ({tasks.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('numbers')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeAdminTab === 'numbers' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          পেমেন্ট নাম্বার
        </button>
        <button
          onClick={() => setActiveAdminTab('users')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeAdminTab === 'users' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          ইউজার কন্ট্রোল ({users.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('vip')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeAdminTab === 'vip' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-sm' : 'text-amber-300 hover:bg-slate-700'
          }`}
        >
          <Crown className="w-3.5 h-3.5 fill-current" />
          <span>👑 VIP ক্লাব ({vipUsersCount})</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('adsense')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeAdminTab === 'adsense' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-amber-300 hover:bg-slate-700'
          }`}
        >
          <span>⭐ গুগল এডসেন্স</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('settings')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
            activeAdminTab === 'settings' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          সেটিংস
        </button>
      </div>

      {/* Admin Body Area */}
      <div className="flex-1 overflow-y-auto bg-slate-100 p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">

          {/* TAB 1: OVERVIEW */}
          {activeAdminTab === 'overview' && (
            <div className="space-y-4">
              {/* Firebase Firestore Realtime & VIP Hero Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-950 rounded-3xl p-5 text-white shadow-lg border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1.5 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>🔥 Firebase Firestore লাইভ ক্লাউড ডাটাবেস সিঙ্ক সক্রিয়</span>
                  </div>
                  <h3 className="font-extrabold text-base md:text-lg flex items-center justify-center md:justify-start gap-2">
                    <span>সকল ডিভাইসে রিয়েল-টাইম ডাটা সিঙ্ক ও VIP ক্লাব</span>
                    <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-[10px] px-2 py-0.5 rounded-md font-bold">VIP 1-5 লাইভ</span>
                  </h3>
                  <p className="text-xs text-amber-100/80 max-w-xl leading-relaxed">
                    মোবাইল, ট্যাবলেট বা কম্পিউটার—যেকোনো ডিভাইস থেকে ইউজার রেজিস্ট্রেশন, ব্যালেন্স, ডিপোজিট, উইথড্র এবং VIP দৈনিক ইনকাম ফায়ারবেস ক্লাউডে তাৎক্ষণিকভাবে সিঙ্ক হচ্ছে।
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
                  <button
                    onClick={() => setActiveAdminTab('vip')}
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 active:scale-95 text-slate-950 font-black py-3 px-5 rounded-2xl shadow-md flex items-center justify-center gap-2 text-xs transition-all cursor-pointer"
                  >
                    <Crown className="w-4 h-4 fill-slate-950" />
                    <span>VIP মেম্বার তালিকা ({vipUsersCount})</span>
                  </button>

                  <button
                    onClick={() => showToast('🔥 Firebase Firestore সফলভাবে কানেক্টেড ও লাইভ রয়েছে!')}
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-2xl text-xs border border-white/20 transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span>Firebase স্টেটাস চেক</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-xs font-bold">মোট ইউজার</span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{users.length}</div>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-xs font-bold">পেন্ডিং ডিপোজিট</span>
                    <ArrowDownCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-emerald-600">
                    {pendingDeposits.length}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-xs font-bold">পেন্ডিং উইথড্র</span>
                    <ArrowUpCircle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-amber-600">
                    {pendingWithdraws.length}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-xs font-bold">মোট উইথড্র পরিশোধ</span>
                    <Wallet className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-xl font-black text-red-700">
                    ৳ {totalApprovedPaid.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Quick Action Queue Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pending Deposits Box */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <ArrowDownCircle className="w-4 h-4 text-emerald-600" />
                      <span>ডিপোজিট রিকোয়েস্ট ({pendingDeposits.length})</span>
                    </h3>
                    <button
                      onClick={() => setActiveAdminTab('deposits')}
                      className="text-xs text-emerald-700 font-bold hover:underline"
                    >
                      সব দেখুন
                    </button>
                  </div>

                  {pendingDeposits.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">কোনো পেন্ডিং ডিপোজিট নেই ✅</p>
                  ) : (
                    <div className="space-y-2">
                      {pendingDeposits.slice(0, 3).map((dep) => (
                        <div key={dep.id} className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="font-bold text-slate-900">৳ {dep.amount} ({dep.method})</span>
                            <p className="text-[11px] text-slate-600 font-mono">From: {dep.senderNumber} | Trx: {dep.trxId}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => approveDeposit(dep.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg font-bold text-[11px]"
                            >
                              অনুমোদন
                            </button>
                            <button
                              onClick={() => rejectDeposit(dep.id)}
                              className="bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 px-2 py-1 rounded-lg text-[11px]"
                            >
                              বাতিল
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pending Withdraws Box */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <ArrowUpCircle className="w-4 h-4 text-amber-600" />
                      <span>উইথড্র রিকোয়েস্ট ({pendingWithdraws.length})</span>
                    </h3>
                    <button
                      onClick={() => setActiveAdminTab('withdraws')}
                      className="text-xs text-amber-700 font-bold hover:underline"
                    >
                      সব দেখুন
                    </button>
                  </div>

                  {pendingWithdraws.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">কোনো পেন্ডিং উইথড্র নেই ✅</p>
                  ) : (
                    <div className="space-y-2">
                      {pendingWithdraws.slice(0, 3).map((w) => (
                        <div key={w.id} className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100 flex items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="font-bold text-slate-900">৳ {w.amount} ({w.method})</span>
                            <p className="text-[11px] text-slate-600 font-mono">To: {w.receiverNumber} ({w.userName})</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => approveWithdraw(w.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg font-bold text-[11px]"
                            >
                              পে করুন
                            </button>
                            <button
                              onClick={() => rejectWithdraw(w.id)}
                              className="bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 px-2 py-1 rounded-lg text-[11px]"
                            >
                              রিফান্ড
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEPOSIT REQUESTS MANAGEMENT */}
          {activeAdminTab === 'deposits' && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    সকল ডিপোজিট রিকোয়েস্ট ({depositRequests.length})
                  </h3>
                  <p className="text-xs text-slate-500">অনুমোদন দিলে সাথে সাথে ইউজারের একাউন্টে ব্যালেন্স যোগ হবে</p>
                </div>
              </div>

              {depositRequests.length === 0 ? (
                <p className="text-center text-slate-400 py-8 text-xs">কোনো ডিপোজিট রিকোয়েস্ট নেই</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {depositRequests.map((dep) => (
                    <div key={dep.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-base">৳ {dep.amount.toFixed(2)}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                            {dep.method}
                          </span>
                          {dep.isVerificationDeposit && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-300">
                              🔒 ভেরিফিকেশন ডিপোজিট
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            dep.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            dep.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {dep.status === 'approved' ? 'অনুমোদিত' : dep.status === 'pending' ? 'পেন্ডিং' : 'বাতিল'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1 font-mono">
                          ইউজার: <strong>{dep.userName}</strong> | প্রেরক নম্বর: <strong>{dep.senderNumber}</strong>
                        </div>
                        <div className="text-xs text-amber-900 font-mono font-bold mt-0.5">
                          TrxID: {dep.trxId}
                        </div>
                        <div className="text-[10px] text-slate-400">{dep.requestedAt}</div>
                      </div>

                      {dep.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => approveDeposit(dep.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 px-3.5 rounded-xl shadow-xs flex items-center gap-1 active:scale-95 transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>অনুমোদন ও ব্যালেন্স যোগ</span>
                          </button>
                          <button
                            onClick={() => rejectDeposit(dep.id)}
                            className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs py-2 px-3 rounded-xl active:scale-95 transition-all"
                          >
                            বাতিল
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WITHDRAW REQUESTS MANAGEMENT */}
          {activeAdminTab === 'withdraws' && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  সকল উইথড্র রিকোয়েস্ট ({withdrawRequests.length})
                </h3>
                <p className="text-xs text-slate-500">পেমেন্ট পাঠানোর পর অনুমোদন করুন, ভুল হলে বাতিল করলে টাকা রিফান্ড হবে</p>
              </div>

              {withdrawRequests.length === 0 ? (
                <p className="text-center text-slate-400 py-8 text-xs">কোনো উইথড্র রিকোয়েস্ট নেই</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {withdrawRequests.map((w) => (
                    <div key={w.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-base">৳ {w.amount.toFixed(2)}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                            {w.method}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            w.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            w.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {w.status === 'approved' ? 'সফলভাবে পেইড' : w.status === 'pending' ? 'পেন্ডিং' : 'বাতিল'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1 font-mono">
                          গ্রাহক: <strong>{w.userName}</strong> | রিসিভার নম্বর: <strong className="text-red-600">{w.receiverNumber}</strong>
                        </div>
                        <div className="text-[10px] text-slate-400">{w.requestedAt}</div>
                      </div>

                      {w.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => approveWithdraw(w.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 px-3.5 rounded-xl shadow-xs flex items-center gap-1 active:scale-95 transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>অনুমোদন (পেইড)</span>
                          </button>
                          <button
                            onClick={() => rejectWithdraw(w.id)}
                            className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs py-2 px-3 rounded-xl active:scale-95 transition-all"
                          >
                            বাতিল ও রিফান্ড
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TASKS MANAGEMENT */}
          {activeAdminTab === 'tasks' && (
            <div className="space-y-4">
              {/* Add New Task Form */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
                <h3 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>নতুন টাস্ক তৈরি করুন</span>
                </h3>

                <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">টাস্কের নাম</label>
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="যেমন: টেলিগ্রাম চ্যানেলে জয়েন করুন"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">রিওয়ার্ড (টাকা ৳)</label>
                    <input
                      type="number"
                      step="any"
                      value={newTaskReward}
                      onChange={(e) => setNewTaskReward(e.target.value)}
                      placeholder="যেমন: ১৫"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">অপেক্ষার সময় (সেকেন্ড)</label>
                    <input
                      type="number"
                      value={newTaskDuration}
                      onChange={(e) => setNewTaskDuration(e.target.value)}
                      placeholder="যেমন: ৩০"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                    <select
                      value={newTaskType}
                      onChange={(e) => setNewTaskType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                    >
                      <option value="youtube">YouTube Video</option>
                      <option value="telegram">Telegram / Social</option>
                      <option value="web">Web Visit</option>
                      <option value="review">App Review</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">টার্গেট লিংক (URL)</label>
                    <input
                      type="text"
                      value={newTaskUrl}
                      onChange={(e) => setNewTaskUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>টাস্ক প্রকাশ করুন</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Tasks List */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
                <h3 className="font-extrabold text-slate-900 text-sm mb-3">
                  বর্তমান টাস্ক তালিকা ({tasks.length})
                </h3>

                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{task.title}</span>
                          <span className="text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                            ৳ {task.reward.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          সময়: {task.durationSec} সেকেন্ড | সম্পন্ন: {task.completedCount} বার
                        </div>
                      </div>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PAYMENT NUMBERS (BKASH/NAGAD/ROCKET) */}
          {activeAdminTab === 'numbers' && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
              <div className="mb-4">
                <h3 className="font-extrabold text-slate-900 text-base">
                  পেমেন্ট নাম্বার সেটিংস
                </h3>
                <p className="text-xs text-slate-500">ইউজাররা ডিপোজিট করার সময় এই নম্বরগুলো দেখতে পাবে</p>
              </div>

              <form onSubmit={handleSavePaymentNumbers} className="space-y-4 text-xs">
                {/* bKash */}
                <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-200 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#E2136E] mb-1">বিকাশ (bKash) মোবাইল নম্বর</label>
                    <input
                      type="text"
                      value={editBkash}
                      onChange={(e) => setEditBkash(e.target.value)}
                      className="w-full bg-white border border-pink-200 rounded-xl p-2.5 font-bold font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">একাউন্ট টাইপ</label>
                    <input
                      type="text"
                      value={editBkashType}
                      onChange={(e) => setEditBkashType(e.target.value)}
                      placeholder="Personal / Merchant"
                      className="w-full bg-white border border-pink-200 rounded-xl p-2.5 font-medium"
                    />
                  </div>
                </div>

                {/* Nagad */}
                <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#F7941D] mb-1">নগদ (Nagad) মোবাইল নম্বর</label>
                    <input
                      type="text"
                      value={editNagad}
                      onChange={(e) => setEditNagad(e.target.value)}
                      className="w-full bg-white border border-amber-200 rounded-xl p-2.5 font-bold font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">একাউন্ট টাইপ</label>
                    <input
                      type="text"
                      value={editNagadType}
                      onChange={(e) => setEditNagadType(e.target.value)}
                      placeholder="Personal / Merchant"
                      className="w-full bg-white border border-amber-200 rounded-xl p-2.5 font-medium"
                    />
                  </div>
                </div>

                {/* Rocket */}
                <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#8C3494] mb-1">রকেট (Rocket) মোবাইল নম্বর</label>
                    <input
                      type="text"
                      value={editRocket}
                      onChange={(e) => setEditRocket(e.target.value)}
                      className="w-full bg-white border border-purple-200 rounded-xl p-2.5 font-bold font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">একাউন্ট টাইপ</label>
                    <input
                      type="text"
                      value={editRocketType}
                      onChange={(e) => setEditRocketType(e.target.value)}
                      placeholder="Personal / Merchant"
                      className="w-full bg-white border border-purple-200 rounded-xl p-2.5 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all text-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>পেমেন্ট নাম্বারসমূহ সেভ করুন</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: USERS CONTROL */}
          {activeAdminTab === 'users' && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    ইউজার ম্যানেজমেন্ট ও ব্যালেন্স কন্ট্রোল
                  </h3>
                  <p className="text-xs text-slate-500">যেকোনো ইউজারের ব্যালেন্স সরাসরি বাড়াতে বা কমাতে পারেন</p>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="নাম বা ফোন দিয়ে খুঁজুন..."
                    className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium w-full md:w-60 focus:outline-none"
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className="divide-y divide-slate-100 overflow-x-auto text-xs">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{u.name}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                          ID: {u.id}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {u.status === 'active' ? 'সক্রিয়' : 'স্থগিত'}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          u.isVerified ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {u.isVerified ? '✓ Verified' : 'Unverified'}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                          (u.vipLevel || 0) > 0 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {(u.vipLevel || 0) > 0 ? `👑 VIP ${u.vipLevel}` : 'ফ্রি মেম্বার'}
                        </span>
                      </div>
                      <div className="text-slate-500 font-mono mt-0.5">
                        ফোন: {u.phone} | রেফার: {u.totalReferrals}/{settings.requiredReferralsForWithdraw || 10} জন
                        {u.balance >= settings.minWithdraw && u.totalReferrals >= (settings.requiredReferralsForWithdraw || 10) && (
                          <span className="text-amber-800 font-bold ml-1.5 bg-amber-100 px-1.5 py-0.2 rounded text-[9px]">
                            ★ উইথড্র যোগ্য
                          </span>
                        )}
                      </div>
                      <div className="text-emerald-700 font-extrabold mt-0.5">
                        বর্তমান ব্যালেন্স: ৳ {u.balance.toFixed(2)} | VIP আয়: ৳ {(u.totalVipEarnings || 0).toFixed(2)}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Quick VIP level dropdown */}
                      <select
                        value={u.vipLevel || 0}
                        onChange={(e) => {
                          const lvl = Number(e.target.value);
                          setUserVipLevel(u.id, lvl);
                        }}
                        className="bg-amber-50 border border-amber-300 text-amber-950 font-bold px-2 py-1.5 rounded-xl text-xs"
                        title="VIP লেভেল পরিবর্তন"
                      >
                        <option value={0}>Free (০)</option>
                        <option value={1}>VIP 1 (৳১০/দিন)</option>
                        <option value={2}>VIP 2 (৳৩৫/দিন)</option>
                        <option value={3}>VIP 3 (৳৬৫/দিন)</option>
                        <option value={4}>VIP 4 (৳১৪০/দিন)</option>
                        <option value={5}>VIP 5 (৳৩৮০/দিন)</option>
                      </select>

                      <button
                        onClick={() => verifyUserAccount(u.id, !u.isVerified)}
                        className={`font-bold px-2.5 py-1.5 rounded-xl transition-colors ${
                          u.isVerified
                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {u.isVerified ? 'ভেরিফাই বাতিল' : 'ভেরিফাই করুন'}
                      </button>

                      <button
                        onClick={() => setSelectedUserForBalance(selectedUserForBalance === u.id ? null : u.id)}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-2.5 py-1.5 rounded-xl transition-colors"
                      >
                        ব্যালেন্স (+/-)
                      </button>

                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`font-bold px-2.5 py-1.5 rounded-xl transition-colors ${
                          u.status === 'active'
                            ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                      >
                        {u.status === 'active' ? 'ব্যান' : 'আনব্যান'}
                      </button>
                    </div>

                    {/* Balance adjust drawer */}
                    {selectedUserForBalance === u.id && (
                      <div className="w-full bg-amber-50 p-3 rounded-2xl border border-amber-200 flex items-center gap-2 mt-2">
                        <span className="font-bold text-slate-700">পরিমাণ (৳):</span>
                        <input
                          type="number"
                          value={balanceDelta}
                          onChange={(e) => setBalanceDelta(e.target.value)}
                          className="w-24 bg-white border border-amber-300 rounded-lg p-1.5 font-bold"
                        />
                        <button
                          onClick={() => handleApplyBalance(u.id, true)}
                          className="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg active:scale-95"
                        >
                          + যোগ করুন
                        </button>
                        <button
                          onClick={() => handleApplyBalance(u.id, false)}
                          className="bg-rose-600 text-white font-bold px-3 py-1.5 rounded-lg active:scale-95"
                        >
                          - কর্তন করুন
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: GOOGLE ADSENSE & ADS */}
          {activeAdminTab === 'adsense' && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>গুগল এডসেন্স (Google AdSense) ও বিজ্ঞাপন মনিটাইজেশন</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    ব্যবহারকারীরা যখন টাস্ক সম্পন্ন করবে তখন বিজ্ঞাপন প্রদর্শিত হবে এবং আপনার এডসেন্সে নিশ্চিত ইনকাম যুক্ত হবে।
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900">
                  <span>AdSense Status:</span>
                  <span className={editAdsEnabled ? 'text-emerald-700' : 'text-slate-500'}>
                    {editAdsEnabled ? '● সক্রিয় (Active)' : '○ নিষ্ক্রিয়'}
                  </span>
                </div>
              </div>

              {/* Ad Revenue Mechanism Card */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/80 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-amber-950 flex items-center gap-2">
                  <span className="text-base">💡</span>
                  <span>টাস্ক বিজ্ঞাপন থেকে কীভাবে আপনার আয় তৈরি হবে?</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                  <li>ব্যবহারকারী যখন টাস্কের <strong>কাজ করুন</strong> চাপবে, তখন আপনার এডসেন্স ব্যানার বা ইন্টারস্টিশিয়াল অ্যাড লোড হবে।</li>
                  <li>বিজ্ঞাপন চলাকালীন কাউন্টডাউন টাইমার সক্রিয় থাকবে, যার ফলে হাই ভিউয়েবিলিটি (High Viewability) রেট থাকবে।</li>
                  <li>ইউজার প্রতি বিজ্ঞাপনে টাস্ক রিওয়ার্ড পাবে (৳ টাকা), আর আপনার গুগল এডসেন্স ড্যাশবোর্ডে ডলার ($) যোগ হবে।</li>
                  <li>তাছাড়া Adsterra বা Monetag এর মতো পপ-আন্ডার / ডিরেক্ট লিঙ্ক স্ক্রিপ্টও নিচে বসাতে পারবেন।</li>
                </ul>
              </div>

              <form onSubmit={handleSaveAdsenseSettings} className="space-y-4 text-xs">
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <input
                    type="checkbox"
                    id="ads_toggle"
                    checked={editAdsEnabled}
                    onChange={(e) => setEditAdsEnabled(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                  />
                  <label htmlFor="ads_toggle" className="font-bold text-slate-800 cursor-pointer select-none">
                    টাস্ক ও ড্যাশবোর্ডে বিজ্ঞাপন সক্রিয় রাখুন (Enable Ads for Tasks & Home)
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Google AdSense Publisher ID (Client ID)
                    </label>
                    <input
                      type="text"
                      value={editAdsensePub}
                      onChange={(e) => setEditAdsensePub(e.target.value)}
                      placeholder="ca-pub-1234567890123456"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold text-slate-800"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      আপনার গুগল এডসেন্স একাউন্ট থেকে প্রাপ্ত ca-pub-XXXXXXXXXXXXXXXX দিন
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Banner Ad Slot ID (ব্যানার অ্যাড স্লট)
                    </label>
                    <input
                      type="text"
                      value={editAdsenseBannerSlot}
                      onChange={(e) => setEditAdsenseBannerSlot(e.target.value)}
                      placeholder="9876543210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold text-slate-800"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      হোমপেজ ও টাস্ক তালিকার জন্য ডিসপ্লে অ্যাড স্লট আইডি
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Rewarded / Interstitial Ad Slot ID (টাস্ক অ্যাড স্লট)
                    </label>
                    <input
                      type="text"
                      value={editAdsenseRewardSlot}
                      onChange={(e) => setEditAdsenseRewardSlot(e.target.value)}
                      placeholder="1234567890"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold text-slate-800"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      টাস্ক কাউন্টডাউন চলাকালীন প্রদর্শিত হওয়ার জন্য স্লট আইডি
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      অ্যাডসেন্স কোড স্টেটাস
                    </label>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-emerald-700 flex items-center justify-between">
                      <span>✓ Firebase Live & Tag Ready</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-sans font-bold">লাইভ সিঙ্ক</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Firebase ডাটাবেসে সেভ হবে এবং সব ডিভাইসে সাথে সাথে কার্যকর হবে
                    </span>
                  </div>
                </div>

                {/* Step-by-Step AdSense Guide Box */}
                <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 space-y-3 border border-slate-800">
                  <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
                    <HelpCircle className="w-4 h-4" />
                    <span>গুগল এডসেন্স থেকে Publisher ID ও Slot ID খুঁজে পাওয়ার নির্দেশিকা:</span>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-300 leading-relaxed font-sans">
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                      <p className="font-bold text-amber-300">১. Publisher ID (ca-pub-XXXXXXXXXXXXXXXX) কোথায় পাবেন?</p>
                      <p className="text-slate-300 mt-0.5">
                        • আপনার Google AdSense একাউন্টে লগইন করুন (adsense.google.com)<br/>
                        • বাম পাশের মেনু থেকে <strong>Account</strong> ➔ <strong>Settings</strong> ➔ <strong>Account information</strong> এ যান<br/>
                        • সেখানে <strong>Publisher ID</strong> দেখতে পাবেন, যা দেখতে এমন: <code className="text-emerald-400 font-mono bg-black/40 px-1.5 py-0.5 rounded">pub-1234567890123456</code><br/>
                        • বক্সে লেখার সময় আগে <code className="text-emerald-400 font-mono bg-black/40 px-1 py-0.5 rounded">ca-</code> সহ লিখবেন (যেমন: <code className="text-emerald-400 font-mono bg-black/40 px-1.5 py-0.5 rounded">ca-pub-1234567890123456</code>)।
                      </p>
                    </div>

                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                      <p className="font-bold text-cyan-300">২. Banner ও Rewarded Ad Slot ID (স্লট নাম্বার) কোথায় পাবেন?</p>
                      <p className="text-slate-300 mt-0.5">
                        • এডসেন্স মেনু থেকে <strong>Ads</strong> ➔ <strong>By ad unit</strong> এ ক্লিক করুন<br/>
                        • নতুন অ্যাড ইউনিট তৈরি করতে <strong>Display ads</strong> অথবা <strong>In-feed ads</strong> সিলেক্ট করে নাম দিন এবং <strong>Create</strong> চাপুন<br/>
                        • অ্যাড তৈরি হলে একটি কোড দেখাবে। সেই কোডের ভিতরে <code className="text-cyan-400 font-mono bg-black/40 px-1.5 py-0.5 rounded">data-ad-slot="9876543210"</code> লেখা দেখতে পাবেন<br/>
                        • ঐ উদ্ধৃতি চিহ্নের ভেতরের ১০ বা ১১ সংখ্যার নাম্বারটিই হলো আপনার <strong>Ad Slot ID</strong>!
                      </p>
                    </div>

                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                      <p className="font-bold text-purple-300">৩. কাস্টম অ্যাড কোড (Adsterra, Monetag বা Direct Link):</p>
                      <p className="text-slate-300 mt-0.5">
                        • গুগল এডসেন্স এপ্রুভ না থাকলে আপনি <strong className="text-white">Adsterra</strong> বা <strong className="text-white">Monetag</strong> থেকে ব্যানার বা পপ আন্ডার ট্যাগ কোড এনে নিচের কাস্টম কোড বক্সে সরাসরি বসাতে পারেন।
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    কাস্টম অ্যাড স্ক্রিপ্ট (Adsterra, Monetag, PropellerAds বা ডিরেক্ট ট্যাগ কোড)
                  </label>
                  <textarea
                    rows={4}
                    value={editCustomAdCode}
                    onChange={(e) => setEditCustomAdCode(e.target.value)}
                    placeholder="<!-- Paste your Ad tag HTML/JS code here -->"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-xs text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    ঐচ্ছিক: অন্য যেকোনো বিজ্ঞাপন নেটওয়ার্কের হেড ট্যাগ বা পপ কোড এখানে পেস্ট করতে পারেন
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-sm transition-all text-xs cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>এডসেন্স সেটিংস সেভ করুন (Save to Firebase)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditAdsensePub('ca-pub-3335603276700829');
                      setEditCustomAdCode('<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3335603276700829" crossorigin="anonymous"></script>');
                      showToast('আপনার Google AdSense আইডি সেট করা হয়েছে!');
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all text-xs cursor-pointer border border-slate-300"
                  >
                    <span>ডিফল্ট আইডি ca-pub-3335603276700829 বসান</span>
                  </button>
                </div>

                {/* Live AdSense Unit Previews */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-slate-800 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>লাইভ বিজ্ঞাপন প্রিভিউ (Live Preview)</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 mb-1">ব্যানার অ্যাড (Display Banner):</p>
                      <GoogleAdBanner slotType="banner" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 mb-1">টাস্ক রিওয়ার্ডেড অ্যাড (Rewarded Unit):</p>
                      <GoogleAdBanner slotType="reward" />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB: VIP LEVEL MANAGEMENT */}
          {activeAdminTab === 'vip' && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span>VIP লেভেল ইনভেস্টমেন্ট ও দৈনিক ইনকাম ব্যবস্থাপনা</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    ইউজারদের VIP লেভেল ১ থেকে ৫ পর্যন্ত প্যাকেজসমূহ, দৈনিক ইনকাম হার এবং সদস্য তালিকা
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 fill-amber-700" />
                    <span>মোট VIP সদস্য: {vipUsersCount} জন</span>
                  </span>
                </div>
              </div>

              {/* 5 VIP Plans Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {VIP_PLANS.map((plan) => {
                  const membersCount = users.filter(u => u.vipLevel === plan.id).length;
                  return (
                    <div
                      key={plan.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2.5 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-8 h-8 rounded-xl bg-gradient-to-br ${plan.colorGradient} text-white flex items-center justify-center font-black text-xs shadow-xs`}>
                            {plan.id}
                          </span>
                          <div>
                            <h4 className="font-black text-slate-900 text-xs">{plan.name}</h4>
                            <span className="text-[10px] text-slate-500">{plan.title}</span>
                          </div>
                        </div>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                          {membersCount} সদস্য
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded-xl border border-slate-200/80">
                        <div>
                          <span className="text-[10px] text-slate-400 block">প্যাকেজ মূল্য</span>
                          <span className="font-extrabold text-slate-900">৳{plan.price}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">দৈনিক নিশ্চিত আয়</span>
                          <span className="font-extrabold text-emerald-600">৳{plan.dailyIncome}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-600 flex justify-between">
                        <span>৩০ দিনে মোট রিটার্ন:</span>
                        <strong className="text-amber-800 font-extrabold">৳{plan.monthlyReturn} টাকা</strong>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Manual VIP Assignment tool */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 space-y-3">
                <h4 className="font-extrabold text-xs text-amber-950 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>এডমিন থেকে সরাসরি ইউজারের VIP লেভেল পরিবর্তন করুন:</span>
                </h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedUserForVip || ''}
                    onChange={(e) => setSelectedUserForVip(e.target.value || null)}
                    className="flex-1 bg-white border border-amber-300 rounded-xl p-2.5 text-xs font-medium"
                  >
                    <option value="">-- ইউজার নির্বাচন করুন --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.phone}) - বর্তমান: {u.vipLevel ? `VIP ${u.vipLevel}` : 'Free'}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedVipLevelToSet}
                    onChange={(e) => setSelectedVipLevelToSet(Number(e.target.value))}
                    className="w-full sm:w-44 bg-white border border-amber-300 rounded-xl p-2.5 text-xs font-bold"
                  >
                    <option value={0}>সাধারণ (ফ্রি মেম্বার)</option>
                    <option value={1}>VIP 1 (দৈনিক ৳১০)</option>
                    <option value={2}>VIP 2 (দৈনিক ৳৩৫)</option>
                    <option value={3}>VIP 3 (দৈনিক ৳৬৫)</option>
                    <option value={4}>VIP 4 (দৈনিক ৳১৪০)</option>
                    <option value={5}>VIP 5 (দৈনিক ৳৩৮০)</option>
                  </select>

                  <button
                    onClick={() => {
                      if (!selectedUserForVip) {
                        showToast('অনুগ্রহ করে একজন ইউজার নির্বাচন করুন!');
                        return;
                      }
                      setUserVipLevel(selectedUserForVip, selectedVipLevelToSet);
                      confetti({ particleCount: 50, spread: 60 });
                    }}
                    className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Crown className="w-4 h-4 fill-white" />
                    <span>VIP লেভেল নির্ধারণ করুন</span>
                  </button>
                </div>
              </div>

              {/* VIP Members Table */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-600" />
                  <span>বর্তমান সক্রিয় VIP সদস্য তালিকা ({vipUsersCount})</span>
                </h4>

                {vipUsersCount === 0 ? (
                  <div className="p-8 bg-slate-50 rounded-2xl text-center text-slate-400 text-xs border border-dashed border-slate-200">
                    এখনও কোনো ইউজার VIP প্ল্যান ক্রয় করেননি।
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 overflow-x-auto text-xs">
                    {users.filter(u => (u.vipLevel || 0) > 0).map((u) => {
                      const uPlan = VIP_PLANS.find(p => p.id === u.vipLevel);
                      return (
                        <div key={u.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{u.name}</span>
                              <span className="text-[10px] font-mono text-slate-500">({u.phone})</span>
                              <span className="bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                                <Crown className="w-3 h-3 fill-slate-950" />
                                <span>{uPlan?.name || `VIP ${u.vipLevel}`}</span>
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              দৈনিক আয়: <strong className="text-emerald-600">৳{uPlan?.dailyIncome || 0}</strong> | মোট VIP ইনকাম: <strong className="text-slate-800">৳{(u.totalVipEarnings || 0).toFixed(2)}</strong>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">
                              ব্যালেন্স: ৳{u.balance.toFixed(2)}
                            </span>
                            <button
                              onClick={() => setUserVipLevel(u.id, 0)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg text-xs font-bold transition-colors"
                              title="ভিআইপি বাতিল করুন"
                            >
                              ভিআইপি বাতিল
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: GENERAL SETTINGS */}
          {activeAdminTab === 'settings' && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  সাধারণ অ্যাপ সেটিংস
                </h3>
                <p className="text-xs text-slate-500">মিনিমাম উইথড্র, রেফারেল বোনাস এবং নোটিশ বার্তা পরিবর্তন করুন</p>
              </div>

              <form onSubmit={handleSaveGeneralSettings} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">মিনিমাম উইথড্র (টাকা ৳)</label>
                    <input
                      type="number"
                      value={editMinWithdraw}
                      onChange={(e) => setEditMinWithdraw(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">প্রতি রেফারেল বোনাস (টাকা ৳)</label>
                    <input
                      type="number"
                      value={editReferBonus}
                      onChange={(e) => setEditReferBonus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">দৈনিক বোনাস ক্লেইম পরিমাণ (টাকা ৳)</label>
                    <input
                      type="number"
                      value={editDailyBonus}
                      onChange={(e) => setEditDailyBonus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">উইথড্রর জন্য প্রয়োজনীয় রেফার সংখ্যা (জন)</label>
                    <input
                      type="number"
                      value={editRequiredRefs}
                      onChange={(e) => setEditRequiredRefs(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">একাউন্ট ভেরিফিকেশন ডিপোজিট ফি (টাকা ৳)</label>
                    <input
                      type="number"
                      value={editVerificationFee}
                      onChange={(e) => setEditVerificationFee(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-red-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">এডমিন সিক্রেট পাসওয়ার্ড / পিন</label>
                    <input
                      type="text"
                      value={editAdminPin}
                      onChange={(e) => setEditAdminPin(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold font-mono text-purple-700"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">টেলিগ্রাম সাপোর্ট গ্রুপ লিঙ্ক</label>
                  <input
                    type="text"
                    value={editTelegram}
                    onChange={(e) => setEditTelegram(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">হোমপেজ স্ক্রল নোটিশ টেক্সট</label>
                  <textarea
                    rows={3}
                    value={editNotice}
                    onChange={(e) => setEditNotice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-sm active:scale-95 transition-all text-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>সেটিংস সেভ করুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={resetToDefaults}
                    className="bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all text-xs"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    <span>ফ্যাক্টরি রিসেট</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
