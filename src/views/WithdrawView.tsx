import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Header } from '../components/Header.tsx';
import { BkashLogo, NagadLogo } from '../components/Icons.tsx';
import { PaymentMethod } from '../types/index.ts';
import {
  AlertCircle,
  ArrowRightLeft,
  History,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const QUICK_AMOUNTS = [
  { bn: '৳৬০০', value: 600 },
  { bn: '৳১০০০', value: 1000 },
  { bn: '৳১৫০০', value: 1500 },
  { bn: '৳২০০০', value: 2000 },
  { bn: '৳২৫০০', value: 2500 },
  { bn: '৳৩০০০', value: 3000 },
];

export const WithdrawView: React.FC = () => {
  const {
    currentUser,
    settings,
    submitWithdraw,
    withdrawRequests,
    depositRequests,
    setActiveTab,
    showToast
  } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('BKASH');
  const [receiverNumber, setReceiverNumber] = useState(currentUser?.phone || '');
  const [amount, setAmount] = useState<number>(600);
  const [customAmountStr, setCustomAmountStr] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectAmount = (val: number) => {
    setAmount(val);
    setCustomAmountStr('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmountStr(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setAmount(num);
    }
  };

  const currentBalance = currentUser?.balance || 0;
  const currentReferrals = currentUser?.totalReferrals || 0;
  const requiredRefs = settings.requiredReferralsForWithdraw || 10;
  const minWithdraw = settings.minWithdraw || 600;

  // Condition 1: Has 600 Tk and 10 Referrals
  const hasMetBaseConditions = currentBalance >= minWithdraw && currentReferrals >= requiredRefs;
  const isVerified = currentUser?.isVerified === true;

  // Check if user has a pending verification deposit
  const hasPendingVerificationDeposit = depositRequests.some(
    d => d.userId === currentUser?.id && d.isVerificationDeposit && d.status === 'pending'
  );

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverNumber || receiverNumber.length < 11) {
      showToast('অনুগ্রহ করে সঠিক ১১ ডিজিটের রিসিভার নম্বর দিন!');
      return;
    }

    const withdrawAmt = customAmountStr ? parseFloat(customAmountStr) : amount;
    if (isNaN(withdrawAmt) || withdrawAmt <= 0) {
      showToast('উত্তোলনের সঠিক পরিমাণ লিখুন!');
      return;
    }

    if (withdrawAmt < minWithdraw) {
      showToast(`মিনিমাম উইথড্র ৳${minWithdraw.toFixed(2)} টাকা!`);
      return;
    }

    if (currentBalance < withdrawAmt) {
      showToast('আপনার একাউন্টে পর্যাপ্ত ব্যালেন্স নেই!');
      return;
    }

    if (currentReferrals < requiredRefs) {
      showToast(`উইথড্র করতে কমপক্ষে ${requiredRefs} জন রেফার থাকা আবশ্যক! আপনার বর্তমান রেফার: ${currentReferrals} জন।`);
      return;
    }

    // Secret Verification check
    if (!isVerified) {
      showToast(`আপনার একাউন্টটি এখনও ভেরিফাইড নয়! এডমিন নির্ধারিত ৳${settings.verificationDepositFee} টাকা ডিপোজিট করে একাউন্ট ভেরিফাই করুন।`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitWithdraw(selectedMethod, receiverNumber, withdrawAmt);
      setIsSubmitting(false);
      setCustomAmountStr('');
    }, 600);
  };

  const userWithdrawals = withdrawRequests.filter(r => r.userId === currentUser?.id);

  return (
    <div className="min-h-screen pb-32">
      <Header />

      <div className="px-4 py-4 space-y-4 max-w-md mx-auto">
        {/* WITHDRAW CONDITIONS & SECRET VERIFICATION BANNER */}
        {!hasMetBaseConditions ? (
          // Standard Condition Box (Verification is completely secret at this stage!)
          <div className="bg-white rounded-3xl p-4 border border-amber-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-orange-600" />
                <span>উইথড্র যোগ্যতা অগ্রগতি:</span>
              </span>
              <span className="font-bold text-orange-700 font-mono">
                {currentReferrals}/{requiredRefs} রেফার
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (currentReferrals / requiredRefs) * 100)}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500">
              উইথড্র রিকোয়েস্ট করতে সর্বনিম্ন <strong>৳{minWithdraw} টাকা</strong> এবং কমপক্ষে <strong>{requiredRefs} জন রেফার</strong> প্রয়োজন।
            </p>
          </div>
        ) : !isVerified ? (
          // SECRET UNLOCKED: The user completed 600 Tk and 10 Referrals, but account must be verified by depositing admin-set fee!
          <div className="bg-gradient-to-br from-amber-500/15 via-red-500/10 to-white rounded-3xl p-4 border-2 border-red-500/50 shadow-md space-y-2.5 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 text-red-700">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <h3 className="font-black text-sm">
                একাউন্ট ভেরিফিকেশন প্রয়োজন!
              </h3>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              🎉 অভিনন্দন! আপনি সফলভাবে <strong>৳{minWithdraw} টাকা</strong> ব্যালেন্স এবং <strong>{requiredRefs} জন রেফার</strong> সম্পন্ন করেছেন।
            </p>

            <div className="bg-white p-3 rounded-2xl border border-red-200 text-xs text-slate-800 space-y-1">
              <p className="font-semibold text-red-900">
                ⚠️ উইথড্র চূড়ান্তকরণের নিয়ম:
              </p>
              <p className="text-[11px] text-slate-600 leading-snug">
                প্রথমবার উইথড্র নিরাপত্তা ও ভেরিফিকেশনের জন্য এডমিন নির্ধারিত <strong>৳ {settings.verificationDepositFee.toFixed(2)} টাকা</strong> ডিপোজিট করে একাউন্ট ভেরিফাই সম্পন্ন করতে হবে। এডমিন অনুমোদন করলেই আপনি সাথে সাথে উইথড্র করতে পারবেন।
              </p>
            </div>

            {hasPendingVerificationDeposit ? (
              <div className="p-2.5 bg-amber-100 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>আপনার ভেরিফিকেশন ডিপোজিট পেন্ডিং আছে। এডমিন শীঘ্রই অনুমোদন করবেন।</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('deposit')}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-black py-3 px-4 rounded-2xl shadow-md flex items-center justify-center gap-2 text-xs active:scale-95 transition-transform"
              >
                <span>৳ {settings.verificationDepositFee} টাকা ডিপোজিট করে ভেরিফাই করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          // Verified User Status
          <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-300 flex items-center gap-2.5 text-xs text-emerald-900 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-extrabold block">আপনার একাউন্টটি সম্পূর্ণ Verified!</span>
              <span className="text-[10px] text-emerald-700">আপনি যেকোনো সময় সরাসরি উইথড্র করতে পারবেন।</span>
            </div>
          </div>
        )}

        <form onSubmit={handleWithdraw} className="space-y-4">
          {/* Method Selection Header */}
          <div>
            <label className="block text-amber-900 font-bold text-xs uppercase tracking-wide mb-2">
              📁 পেমেন্ট মেথড নির্বাচন করুন
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedMethod('BKASH')}
                className={`p-4 rounded-3xl bg-white border-2 flex flex-col items-center justify-center transition-all shadow-sm ${
                  selectedMethod === 'BKASH'
                    ? 'border-red-600 ring-2 ring-red-500/20 shadow-md bg-red-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <BkashLogo className="w-14 h-14 mb-2" />
                <span className="font-black text-sm tracking-wide text-[#E2136E] italic">
                  BKASH
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('NAGAD')}
                className={`p-4 rounded-3xl bg-white border-2 flex flex-col items-center justify-center transition-all shadow-sm ${
                  selectedMethod === 'NAGAD'
                    ? 'border-red-600 ring-2 ring-red-500/20 shadow-md bg-amber-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <NagadLogo className="w-14 h-14 mb-2" />
                <span className="font-black text-sm tracking-wide text-[#F7941D] italic">
                  NAGAD
                </span>
              </button>
            </div>
          </div>

          {/* Receiver Account Number */}
          <div>
            <label className="block text-amber-900 font-bold text-xs tracking-wide mb-1.5">
              📱 রিসিভার একাউন্ট নম্বর
            </label>
            <div className="relative">
              <input
                type="tel"
                value={receiverNumber}
                onChange={(e) => setReceiverNumber(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full bg-white border-2 border-amber-200/90 rounded-2xl py-3.5 px-4 text-slate-800 font-bold placeholder-amber-400 focus:outline-none focus:border-red-500 shadow-xs tracking-wider"
                required
              />
            </div>
          </div>

          {/* Withdrawal Amount Selection */}
          <div>
            <label className="block text-amber-900 font-bold text-xs tracking-wide mb-2">
              ৳ উত্তোলনের পরিমাণ
            </label>

            {/* Quick 6 Pills */}
            <div className="grid grid-cols-3 gap-2.5 mb-2.5">
              {QUICK_AMOUNTS.map((item) => {
                const isSelected = !customAmountStr && amount === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => handleSelectAmount(item.value)}
                    className={`py-3 rounded-2xl font-black text-sm transition-all border shadow-xs ${
                      isSelected
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-600 shadow-md scale-[1.02]'
                        : 'bg-white text-red-900 border-amber-200/90 hover:border-red-300'
                    }`}
                  >
                    {item.bn}
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input */}
            <div className="relative">
              <input
                type="number"
                step="any"
                value={customAmountStr}
                onChange={handleCustomAmountChange}
                placeholder="অন্য পরিমাণ লিখুন (0.00)"
                className="w-full bg-white border-2 border-amber-200/90 rounded-2xl py-3 px-4 text-slate-800 font-bold placeholder-amber-500/80 focus:outline-none focus:border-red-500 shadow-xs"
              />
            </div>

            {/* Minimum Withdraw Notice */}
            <div className="flex items-center gap-1.5 mt-2 text-red-700 font-bold text-xs">
              <AlertCircle className="w-4 h-4 fill-red-100 text-red-600 shrink-0" />
              <span>মিনিমাম উইথড্র {minWithdraw.toFixed(2)} টাকা এবং {requiredRefs} জন রেফার</span>
            </div>
          </div>

          {/* Submit Withdraw Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#FF5722] via-[#F4511E] to-[#E64A19] hover:from-[#E64A19] hover:to-[#D84315] text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-orange-900/20 flex items-center justify-center gap-2.5 uppercase tracking-wider text-sm md:text-base active:scale-98 transition-all disabled:opacity-70"
          >
            <ArrowRightLeft className="w-5 h-5" />
            <span>{isSubmitting ? 'প্রসেসিং হচ্ছে...' : 'WITHDRAW NOW'}</span>
          </button>
        </form>

        {/* Withdrawal History Section */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <History className="w-4 h-4 text-amber-600" />
              <span>উত্তোলন হিস্টোরি ({userWithdrawals.length})</span>
            </h3>
          </div>

          {userWithdrawals.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-amber-100 text-slate-400 text-xs">
              এখনো কোনো উইথড্র রিকোয়েস্ট নেই।
            </div>
          ) : (
            <div className="space-y-2">
              {userWithdrawals.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3.5 border border-amber-100 shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-xs">
                      {item.method === 'BKASH' ? (
                        <BkashLogo className="w-8 h-8" />
                      ) : (
                        <NagadLogo className="w-8 h-8" />
                      )}
                    </div>
                    <div>
                      <div className="font-black text-slate-900 text-sm">
                        ৳ {item.amount.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {item.receiverNumber}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.requestedAt}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {item.status === 'approved' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        সফল
                      </span>
                    )}
                    {item.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        <Clock className="w-3 h-3 text-amber-600" />
                        পেন্ডিং
                      </span>
                    )}
                    {item.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        বাতিল
                      </span>
                    )}
                    {item.adminNote && (
                      <p className="text-[9px] text-slate-500 mt-1 max-w-[130px] truncate" title={item.adminNote}>
                        {item.adminNote}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
