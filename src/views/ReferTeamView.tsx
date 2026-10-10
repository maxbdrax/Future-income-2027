import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Header } from '../components/Header.tsx';
import { Copy, Check, Users, Sparkles, Share2, HelpCircle } from 'lucide-react';

export const ReferTeamView: React.FC = () => {
  const { currentUser, settings, users, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  const refCode = currentUser?.referralCode || currentUser?.id || '2161000';
  const referralLink = `${window.location.origin}/register?ref=${refCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showToast('রেফারেল লিঙ্ক কপি করা হয়েছে!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Future Income 2027 - ঘরে বসে আয় করুন',
        text: `Future Income 2027 তে যুক্ত হয়ে প্রতিদিন নিশ্চিত টাকা আয় করুন! আমার রেফারেল লিংক দিয়ে একাউন্ট খুলে ৳৫০ বোনাস পান: ${referralLink}`,
        url: referralLink
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  // Find team members who signed up with this user's refer code
  const myReferredMembers = users.filter(
    (u) => u.referredBy === refCode || u.referredBy === currentUser?.id
  );

  return (
    <div className="min-h-screen pb-32">
      <Header />

      <div className="px-4 py-4 space-y-4 max-w-md mx-auto">
        {/* Big Refer & Earn Gradient Card (Exact Match to Screenshot 3) */}
        <div className="bg-gradient-to-b from-[#EA580C] via-[#F97316] to-[#FB923C] rounded-3xl p-5 text-white shadow-xl shadow-orange-900/15 border border-orange-400/40 space-y-4">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-sm">
              রেফার করুন আয় করুন!
            </h2>
            <p className="text-white/95 text-xs md:text-sm font-semibold mt-2 leading-relaxed">
              এই লিংকটি বন্ধুদের সাথে শেয়ার করুন। তারা যোগদান করলে আপনি প্রতি রেফারের জন্য{' '}
              <span className="font-extrabold text-amber-200">
                {settings.referBonus.toFixed(2)} টাকা
              </span>{' '}
              বোনাস পাবেন ✅
            </p>
          </div>

          {/* 1. Total Referrals Box */}
          <div className="bg-white rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
            <span className="text-slate-800 font-extrabold text-xs md:text-sm">
              আপনার মোট রেফার
            </span>
            <span className="text-red-600 font-black text-lg md:text-xl">
              {currentUser?.totalReferrals || 0} জন
            </span>
          </div>

          {/* 2. Referral Income Box */}
          <div className="bg-white rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
            <span className="text-slate-800 font-extrabold text-xs md:text-sm">
              রেফার থেকে আয়
            </span>
            <span className="text-red-600 font-black text-lg md:text-xl">
              ৳ {((currentUser?.totalReferrals || 0) * settings.referBonus).toFixed(2)}
            </span>
          </div>

          {/* 3. Dashed Referral Link Box */}
          <div className="bg-white/95 rounded-2xl p-3 border-2 border-dashed border-amber-300 text-center shadow-inner">
            <p className="text-red-700 font-bold text-xs md:text-sm truncate font-mono select-all">
              {referralLink}
            </p>
          </div>

          {/* 4. Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopy}
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-extrabold py-3 px-3 rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all text-xs md:text-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'কপি হয়েছে!' : 'লিঙ্ক কপি করুন'}</span>
            </button>

            <button
              onClick={handleShare}
              className="bg-white hover:bg-amber-50 text-orange-600 font-extrabold py-3 px-3 rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all text-xs md:text-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>শেয়ার করুন</span>
            </button>
          </div>
        </div>

        {/* How to Earn Instructions */}
        <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-sm space-y-3">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>কীভাবে রেফার করে আয় করবেন?</span>
          </h3>

          <ul className="text-xs text-slate-600 space-y-2.5 font-medium">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                ১
              </span>
              <span>উপরের কপি বাটনে ক্লিক করে আপনার রেফারেল লিঙ্কটি কপি করে নিন।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                ২
              </span>
              <span>আপনার লিঙ্কটি ফেসবুক, হোয়াটসঅ্যাপ, টেলিগ্রাম বা বন্ধুদের মেসেঞ্জারে পাঠান।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                ৩
              </span>
              <span>বন্ধু একাউন্ট খোলার সাথে সাথেই আপনার একাউন্টে ৳ {settings.referBonus.toFixed(2)} টাকা বোনাস যোগ হবে!</span>
            </li>
          </ul>
        </div>

        {/* Team Members List */}
        <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-sm">
          <h3 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>আপনার রেফারেল মেম্বার তালিকা</span>
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              {myReferredMembers.length} জন
            </span>
          </h3>

          {myReferredMembers.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              এখনো কোনো মেম্বার যুক্ত হয়নি। লিঙ্ক শেয়ার করে মেম্বার তৈরি করুন!
            </div>
          ) : (
            <div className="space-y-2">
              {myReferredMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-3 bg-amber-50/50 rounded-2xl flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800">{member.name}</span>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {member.phone.slice(0, 3)}****{member.phone.slice(-4)}
                    </p>
                  </div>
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                    + ৳ {settings.referBonus} অর্জিত
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
