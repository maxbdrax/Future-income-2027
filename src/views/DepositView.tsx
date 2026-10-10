import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Header } from '../components/Header.tsx';
import { BkashLogo, NagadLogo, RocketLogo } from '../components/Icons.tsx';
import { PaymentMethod } from '../types/index.ts';
import { Copy, Check, PlusCircle, CheckCircle2, Clock, XCircle, ShieldCheck } from 'lucide-react';

const DEPOSIT_PRESETS = [100, 300, 500, 1000, 2000, 5000];

export const DepositView: React.FC = () => {
  const { currentUser, settings, submitDeposit, depositRequests, showToast } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('BKASH');
  const [senderNumber, setSenderNumber] = useState(currentUser?.phone || '');
  const [trxId, setTrxId] = useState('');
  const [amount, setAmount] = useState<number>(500);
  const [customAmountStr, setCustomAmountStr] = useState<string>('500');
  const [isVerificationDeposit, setIsVerificationDeposit] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine active admin account number
  const activeNumber =
    selectedMethod === 'BKASH'
      ? settings.bkashNumber
      : selectedMethod === 'NAGAD'
      ? settings.nagadNumber
      : settings.rocketNumber;

  const activeType =
    selectedMethod === 'BKASH'
      ? settings.bkashType
      : selectedMethod === 'NAGAD'
      ? settings.nagadType
      : settings.rocketType;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(activeNumber);
    setCopied(true);
    showToast(`নম্বর (${activeNumber}) কপি করা হয়েছে!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setCustomAmountStr(String(val));
    setIsVerificationDeposit(false);
  };

  const handleSetVerificationDeposit = () => {
    setIsVerificationDeposit(true);
    setAmount(settings.verificationDepositFee);
    setCustomAmountStr(String(settings.verificationDepositFee));
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = parseFloat(customAmountStr) || amount;

    if (finalAmount <= 0) {
      showToast('সঠিক টাকার পরিমাণ দিন!');
      return;
    }
    if (!senderNumber || senderNumber.length < 11) {
      showToast('যে নম্বর থেকে টাকা পাঠিয়েছেন সেই সঠিক মোবাইল নম্বর দিন!');
      return;
    }
    if (!trxId || trxId.trim().length < 6) {
      showToast('টাকা পাঠানোর পর বিকাশ/নগদের TrxID প্রদান করুন!');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitDeposit(selectedMethod, senderNumber, trxId, finalAmount, isVerificationDeposit);
      setIsSubmitting(false);
      setTrxId('');
    }, 600);
  };

  const userDeposits = depositRequests.filter(d => d.userId === currentUser?.id);

  return (
    <div className="min-h-screen pb-32">
      <Header />

      <div className="px-4 py-4 space-y-4 max-w-md mx-auto">
        {/* Method Selector */}
        <div>
          <label className="block text-slate-800 font-bold text-xs uppercase tracking-wide mb-2">
            পেমেন্ট মাধ্যম সিলেক্ট করুন
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedMethod('BKASH')}
              className={`p-3 rounded-2xl bg-white border-2 flex flex-col items-center justify-center transition-all ${
                selectedMethod === 'BKASH'
                  ? 'border-[#E2136E] ring-2 ring-pink-500/20 shadow-md bg-pink-50/20'
                  : 'border-slate-200'
              }`}
            >
              <BkashLogo className="w-10 h-10 mb-1" />
              <span className="font-extrabold text-xs text-[#E2136E]">বিকাশ</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('NAGAD')}
              className={`p-3 rounded-2xl bg-white border-2 flex flex-col items-center justify-center transition-all ${
                selectedMethod === 'NAGAD'
                  ? 'border-[#F7941D] ring-2 ring-amber-500/20 shadow-md bg-amber-50/20'
                  : 'border-slate-200'
              }`}
            >
              <NagadLogo className="w-10 h-10 mb-1" />
              <span className="font-extrabold text-xs text-[#F7941D]">নগদ</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('ROCKET')}
              className={`p-3 rounded-2xl bg-white border-2 flex flex-col items-center justify-center transition-all ${
                selectedMethod === 'ROCKET'
                  ? 'border-[#8C3494] ring-2 ring-purple-500/20 shadow-md bg-purple-50/20'
                  : 'border-slate-200'
              }`}
            >
              <RocketLogo className="w-10 h-10 mb-1" />
              <span className="font-extrabold text-xs text-[#8C3494]">রকেট</span>
            </button>
          </div>
        </div>

        {/* Admin Account Number Box */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-white border-2 border-amber-300 rounded-3xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              আমাদের অফিসিয়াল {selectedMethod === 'BKASH' ? 'বিকাশ' : selectedMethod === 'NAGAD' ? 'নগদ' : 'রকেট'} নম্বর ({activeType})
            </span>
          </div>

          <div className="flex items-center justify-between bg-white rounded-2xl p-3 border border-amber-200 shadow-inner">
            <span className="text-xl font-black text-slate-900 tracking-wider font-mono">
              {activeNumber}
            </span>
            <button
              type="button"
              onClick={handleCopyNumber}
              className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-600 mt-2.5 leading-relaxed">
            ⚠️ উপরের নম্বরে <strong>Send Money</strong> করে নিচে আপনার প্রেরক মোবাইল নম্বর ও প্রাপ্ত <strong>TrxID</strong> দিয়ে রিকোয়েস্ট পাঠান।
          </p>
        </div>

        {/* Deposit Type / Purpose Selector */}
        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setIsVerificationDeposit(false);
              setAmount(500);
              setCustomAmountStr('500');
            }}
            className={`py-2.5 px-3 rounded-2xl border transition-all ${
              !isVerificationDeposit
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            সাধারণ ব্যালেন্স ডিপোজিট
          </button>

          <button
            type="button"
            onClick={handleSetVerificationDeposit}
            className={`py-2.5 px-3 rounded-2xl border transition-all flex flex-col items-center justify-center ${
              isVerificationDeposit
                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                : 'bg-amber-50 text-amber-900 border-amber-300'
            }`}
          >
            <span>ভেরিফিকেশন ডিপোজিট</span>
            <span className="text-[10px] opacity-90">(৳ {settings.verificationDepositFee})</span>
          </button>
        </div>

        {/* Deposit Form */}
        <form onSubmit={handleDepositSubmit} className="space-y-3.5">
          {/* Quick Amounts */}
          <div>
            <label className="block text-slate-800 font-bold text-xs mb-1.5">
              ৳ ডিপোজিট পরিমাণ
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {DEPOSIT_PRESETS.map((val) => {
                const isSelected = customAmountStr === String(val);
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleSelectPreset(val)}
                    className={`py-2 rounded-xl font-bold text-xs transition-all border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    ৳ {val}
                  </button>
                );
              })}
            </div>

            <input
              type="number"
              value={customAmountStr}
              onChange={(e) => setCustomAmountStr(e.target.value)}
              placeholder="টাকার পরিমাণ লিখুন (যেমন: ৫০০)"
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 font-bold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-xs"
              required
            />
          </div>

          {/* Sender Number */}
          <div>
            <label className="block text-slate-800 font-bold text-xs mb-1.5">
              যে নম্বর থেকে টাকা পাঠিয়েছেন (Sender Number)
            </label>
            <input
              type="tel"
              value={senderNumber}
              onChange={(e) => setSenderNumber(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-xs tracking-wider"
              required
            />
          </div>

          {/* Transaction ID */}
          <div>
            <label className="block text-slate-800 font-bold text-xs mb-1.5">
              ট্রানজেকশন আইডি (TrxID)
            </label>
            <input
              type="text"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="যেমন: BL9843XW21"
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 font-mono font-bold text-slate-900 uppercase focus:outline-none focus:border-emerald-600 shadow-xs tracking-widest"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-70 text-sm md:text-base uppercase"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{isSubmitting ? 'রিকোয়েস্ট পাঠানো হচ্ছে...' : 'ডিপোজিট রিকোয়েস্ট পাঠান'}</span>
          </button>
        </form>

        {/* User Deposit History */}
        <div className="pt-3">
          <h3 className="font-extrabold text-slate-900 text-sm mb-2.5">
            আপনার ডিপোজিট হিস্টোরি ({userDeposits.length})
          </h3>

          {userDeposits.length === 0 ? (
            <div className="bg-white rounded-2xl p-5 text-center border border-slate-100 text-slate-400 text-xs">
              এখনো কোনো ডিপোজিট রিকোয়েস্ট নেই।
            </div>
          ) : (
            <div className="space-y-2">
              {userDeposits.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">
                        ৳ {item.amount.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.method}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      TrxID: {item.trxId}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {item.requestedAt}
                    </div>
                  </div>

                  <div className="text-right">
                    {item.status === 'approved' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        অনুমোদিত
                      </span>
                    )}
                    {item.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        <Clock className="w-3 h-3 text-amber-600" />
                        যাচাই হচ্ছে
                      </span>
                    )}
                    {item.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        বাতিল
                      </span>
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
