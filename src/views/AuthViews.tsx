import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { FutureIncomeLogo } from '../components/Icons.tsx';
import { SecretAdminModal } from '../components/SecretAdminModal.tsx';
import { User, Phone, Lock, Tag, Play, ArrowRight, Home, HelpCircle, AlertCircle } from 'lucide-react';

interface AuthProps {
  authMode: 'landing' | 'register' | 'login';
  setAuthMode: (mode: 'landing' | 'register' | 'login') => void;
}

export const AuthViews: React.FC<AuthProps> = ({ authMode, setAuthMode }) => {
  const { login, register, users, showToast, setCurrentModal } = useApp();

  // Secret admin trigger count
  const [secretClickCount, setSecretClickCount] = useState(0);
  const [isSecretAdminModalOpen, setIsSecretAdminModalOpen] = useState(false);

  // Registration Form States & Errors
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [regRefCode, setRegRefCode] = useState('');

  const [regErrors, setRegErrors] = useState<{
    name?: string;
    phone?: string;
    pass?: string;
    confirmPass?: string;
    refCode?: string;
  }>({});

  // Login Form States & Errors
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginErrors, setLoginErrors] = useState<{
    phone?: string;
    pass?: string;
  }>({});

  const handleSecretTrigger = () => {
    const next = secretClickCount + 1;
    if (next >= 5) {
      setSecretClickCount(0);
      setIsSecretAdminModalOpen(true);
    } else {
      setSecretClickCount(next);
    }
  };

  // Validate Registration Form
  const validateRegister = (): boolean => {
    const errors: typeof regErrors = {};
    const trimmedName = regName.trim();
    const trimmedPhone = regPhone.trim();
    const phoneRegex = /^01[3-9]\d{8}$/; // standard BD mobile number

    if (!trimmedName || trimmedName.length < 2) {
      errors.name = 'আপনার সম্পূর্ণ নাম লিখুন (কমপক্ষে ২ অক্ষর)';
    }

    if (!trimmedPhone) {
      errors.phone = 'মোবাইল নম্বর লিখুন';
    } else if (!phoneRegex.test(trimmedPhone)) {
      errors.phone = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)';
    } else if (users.some(u => u.phone === trimmedPhone)) {
      errors.phone = 'এই মোবাইল নম্বরে ইতিমধ্যে একাউন্ট আছে! লগিন করুন';
    }

    if (!regPass) {
      errors.pass = 'পাসওয়ার্ড প্রদান করুন';
    } else if (regPass.length < 6) {
      errors.pass = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে';
    }

    if (!regConfirmPass) {
      errors.confirmPass = 'পুনরায় পাসওয়ার্ড লিখুন';
    } else if (regPass !== regConfirmPass) {
      errors.confirmPass = 'পাসওয়ার্ড দুটি মিলছে না! পুনরায় টাইপ করুন';
    }

    if (regRefCode && regRefCode.trim() && users.length > 0) {
      const trimmedRef = regRefCode.trim();
      const refExists = users.some(u => u.referralCode === trimmedRef || u.id === trimmedRef);
      if (!refExists) {
        errors.refCode = 'এই রেফার কোডটি বিদ্যমান নেই! খালি রাখুন অথবা সঠিক কোড দিন';
      }
    }

    setRegErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) {
      showToast('ফর্মের লাল রঙের ত্রুটিগুলো সংশোধন করুন!');
      return;
    }

    const success = register(regName, regPhone, regPass, regRefCode);
    if (!success) {
      setRegErrors(prev => ({
        ...prev,
        phone: 'এই মোবাইল নম্বরে ইতিমধ্যে একাউন্ট রয়েছে!'
      }));
    }
  };

  // Validate Login Form
  const validateLogin = (): boolean => {
    const errors: typeof loginErrors = {};
    const trimmedPhone = loginPhone.trim();

    if (!trimmedPhone) {
      errors.phone = 'আপনার ফোন নম্বর দিন';
    } else if (!/^01\d{9}$/.test(trimmedPhone)) {
      errors.phone = 'সঠিক ১১ ডিজিটের ফোন নম্বর দিন (01XXXXXXXXX)';
    } else {
      const userExists = users.some(u => u.phone === trimmedPhone);
      if (!userExists) {
        errors.phone = 'এই ফোন নম্বরে কোনো একাউন্ট পাওয়া যায়নি! নতুন একাউন্ট খুলুন';
      }
    }

    if (!loginPass) {
      errors.pass = 'পাসওয়ার্ড লিখুন';
    }

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) {
      showToast('সঠিক তথ্য প্রদান করুন!');
      return;
    }

    login(loginPhone, loginPass);
  };

  // 1. Landing View (Default initial page opened upon arrival - Matches Screenshot_2026-10-09-21-39-59-389)
  if (authMode === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-100 flex flex-col justify-between p-4 max-w-md mx-auto relative">
        {/* Top Header */}
        <div className="flex items-center justify-between py-2 border-b border-amber-200/60">
          <div onClick={handleSecretTrigger} className="cursor-pointer select-none">
            <FutureIncomeLogo />
          </div>
          <button
            onClick={() => setAuthMode('login')}
            className="text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-4 py-1.5 rounded-full border border-amber-300 transition-colors shadow-xs"
          >
            লগিন
          </button>
        </div>

        {/* Hero Content (Exact match to Screenshot) */}
        <div className="py-10 text-center space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-4 py-1.5 rounded-full text-xs font-extrabold shadow-xs">
            <span>👑</span>
            <span>বাংলাদেশের সেরা আর্নিং প্ল্যাটফর্ম</span>
          </div>

          {/* Big Bold Headline */}
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            ঘরে বসেই স্মার্ট ইনকাম করুন <br />
            <span className="text-[#E65100]">খুব সহজেই!</span>
          </h1>

          {/* Description */}
          <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-sm mx-auto font-medium px-2">
            Future Income 2027 তে যুক্ত হন। বন্ধুদের রেফার করে, ভিডিও দেখে এবং গেমস খেলে প্রতিদিন নিশ্চিত টাকা আয় করুন। পেমেন্ট নিন সরাসরি বিকাশ, নগদ বা রকেটের মাধ্যমে মাত্র কয়েক মিনিটে।
          </p>

          {/* Action Buttons */}
          <div className="space-y-3 pt-3">
            <button
              onClick={() => setAuthMode('register')}
              className="w-full bg-gradient-to-r from-[#FF5722] to-[#F4511E] hover:from-[#F4511E] hover:to-[#E64A19] text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-orange-900/20 active:scale-98 transition-all flex items-center justify-center gap-2 text-base"
            >
              <User className="w-5 h-5" />
              <span>+ একাউন্ট খুলুন</span>
            </button>

            <button
              onClick={() => setCurrentModal('video-tutorial')}
              className="w-full bg-white hover:bg-amber-50 text-[#FF5722] border-2 border-[#FF5722] font-black py-3.5 px-6 rounded-2xl shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <HelpCircle className="w-4 h-4" />
              <span>কীভাবে কাজ করে?</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 py-3 border-t border-slate-200">
          © 2027 Future Income 2027. সর্বস্বত্ব সংরক্ষিত।
        </div>

        <SecretAdminModal
          isOpen={isSecretAdminModalOpen}
          onClose={() => setIsSecretAdminModalOpen(false)}
        />
      </div>
    );
  }

  // 2. Register View (With instant inline RED error notifications)
  if (authMode === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EA580C] via-[#DC2626] to-[#991B1B] p-4 flex flex-col justify-center max-w-md mx-auto relative">
        {/* Top Video Banner */}
        <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex items-center justify-between text-white mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center shrink-0">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
            <div>
              <p
                onClick={handleSecretTrigger}
                className="font-bold text-xs select-none cursor-pointer"
              >
                কাজের ভিডিও
              </p>
              <span className="text-[10px] text-white/80">একাউন্ট তৈরি ও কাজের নিয়ম শিখুন</span>
            </div>
          </div>
          <button
            onClick={() => setCurrentModal('video-tutorial')}
            className="bg-amber-400 text-slate-900 font-extrabold text-[11px] px-3 py-1.5 rounded-xl shadow-sm hover:bg-amber-300 transition-colors"
          >
            ভিডিও দেখুন
          </button>
        </div>

        {/* Register Card */}
        <div className="bg-white/15 backdrop-blur-lg border border-white/30 rounded-3xl p-6 shadow-2xl text-white">
          <div className="text-center mb-5">
            <h2
              onClick={handleSecretTrigger}
              className="text-2xl font-black tracking-tight drop-shadow-sm select-none cursor-pointer"
            >
              একাউন্ট তৈরি করুন
            </h2>
            <p className="text-white/85 text-xs font-semibold mt-1">
              Future Income 2027 এ স্বাগতম!
            </p>
          </div>

          <form onSubmit={handleRegisterSubmit} noValidate className="space-y-3">
            {/* 1. Full Name */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/70">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => {
                    setRegName(e.target.value);
                    if (regErrors.name) setRegErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  placeholder="আপনার সম্পূর্ণ নাম"
                  className={`w-full bg-black/25 border ${
                    regErrors.name ? 'border-red-400 ring-2 ring-red-400/50 bg-red-950/30' : 'border-white/30 focus:border-amber-300'
                  } rounded-2xl py-3 pl-10 pr-4 text-white placeholder-white/60 text-sm focus:outline-none transition-all`}
                  required
                />
              </div>
              {regErrors.name && (
                <p className="text-red-300 bg-red-950/60 border border-red-500/40 rounded-xl px-3 py-1 text-xs mt-1 font-bold flex items-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                  <span>{regErrors.name}</span>
                </p>
              )}
            </div>

            {/* 2. Phone Number */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/70">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => {
                    setRegPhone(e.target.value);
                    if (regErrors.phone) setRegErrors(prev => ({ ...prev, phone: undefined }));
                  }}
                  placeholder="ফোন নাম্বার (যেমন: 017XXXXXXXX)"
                  className={`w-full bg-black/25 border ${
                    regErrors.phone ? 'border-red-400 ring-2 ring-red-400/50 bg-red-950/30' : 'border-white/30 focus:border-amber-300'
                  } rounded-2xl py-3 pl-10 pr-4 text-white placeholder-white/60 text-sm font-mono tracking-wider focus:outline-none transition-all`}
                  required
                />
              </div>
              {regErrors.phone && (
                <p className="text-red-300 bg-red-950/60 border border-red-500/40 rounded-xl px-3 py-1 text-xs mt-1 font-bold flex items-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                  <span>{regErrors.phone}</span>
                </p>
              )}
            </div>

            {/* 3. Password */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/70">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={regPass}
                  onChange={(e) => {
                    setRegPass(e.target.value);
                    if (regErrors.pass) setRegErrors(prev => ({ ...prev, pass: undefined }));
                  }}
                  placeholder="পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
                  className={`w-full bg-black/25 border ${
                    regErrors.pass ? 'border-red-400 ring-2 ring-red-400/50 bg-red-950/30' : 'border-white/30 focus:border-amber-300'
                  } rounded-2xl py-3 pl-10 pr-4 text-white placeholder-white/60 text-sm focus:outline-none transition-all`}
                  required
                />
              </div>
              {regErrors.pass && (
                <p className="text-red-300 bg-red-950/60 border border-red-500/40 rounded-xl px-3 py-1 text-xs mt-1 font-bold flex items-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                  <span>{regErrors.pass}</span>
                </p>
              )}
            </div>

            {/* 4. Confirm Password */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/70">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={regConfirmPass}
                  onChange={(e) => {
                    setRegConfirmPass(e.target.value);
                    if (regErrors.confirmPass) setRegErrors(prev => ({ ...prev, confirmPass: undefined }));
                  }}
                  placeholder="পুনরায় পাসওয়ার্ড"
                  className={`w-full bg-black/25 border ${
                    regErrors.confirmPass ? 'border-red-400 ring-2 ring-red-400/50 bg-red-950/30' : 'border-white/30 focus:border-amber-300'
                  } rounded-2xl py-3 pl-10 pr-4 text-white placeholder-white/60 text-sm focus:outline-none transition-all`}
                  required
                />
              </div>
              {regErrors.confirmPass && (
                <p className="text-red-300 bg-red-950/60 border border-red-500/40 rounded-xl px-3 py-1 text-xs mt-1 font-bold flex items-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                  <span>{regErrors.confirmPass}</span>
                </p>
              )}
            </div>

            {/* 5. Refer Code (Optional) */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/70">
                  <Tag className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={regRefCode}
                  onChange={(e) => {
                    setRegRefCode(e.target.value);
                    if (regErrors.refCode) setRegErrors(prev => ({ ...prev, refCode: undefined }));
                  }}
                  placeholder="রেফার কোড (যদি থাকে)"
                  className={`w-full bg-black/25 border ${
                    regErrors.refCode ? 'border-red-400 ring-2 ring-red-400/50 bg-red-950/30' : 'border-white/30 focus:border-amber-300'
                  } rounded-2xl py-3 pl-10 pr-4 text-white placeholder-white/60 text-sm font-mono focus:outline-none transition-all`}
                />
              </div>
              {regErrors.refCode && (
                <p className="text-red-300 bg-red-950/60 border border-red-500/40 rounded-xl px-3 py-1 text-xs mt-1 font-bold flex items-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                  <span>{regErrors.refCode}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-900 font-black py-3.5 px-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-sm active:scale-98 transition-all mt-3"
            >
              <User className="w-4 h-4" />
              <span>+ রেজিস্ট্রেশন সম্পন্ন করুন</span>
            </button>
          </form>

          {/* Footer links */}
          <div className="text-center mt-5 space-y-2 text-xs text-white/80 font-medium">
            <div>
              <span>ইতিমধ্যে একাউন্ট আছে? </span>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="font-bold text-amber-300 hover:underline"
              >
                লগিন করুন
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setAuthMode('landing')}
                className="text-white/70 hover:text-white flex items-center justify-center gap-1 mx-auto"
              >
                <Home className="w-3.5 h-3.5" />
                <span>হোমপেজে ফিরে যান</span>
              </button>
            </div>
          </div>
        </div>

        <SecretAdminModal
          isOpen={isSecretAdminModalOpen}
          onClose={() => setIsSecretAdminModalOpen(false)}
        />
      </div>
    );
  }

  // 3. Login View (With inline RED error notifications)
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EA580C] via-[#DC2626] to-[#991B1B] p-4 flex flex-col justify-center max-w-md mx-auto relative">
      <div className="bg-white/15 backdrop-blur-lg border border-white/30 rounded-3xl p-6 shadow-2xl text-white">
        <div className="text-center mb-6">
          <h2
            onClick={handleSecretTrigger}
            className="text-3xl font-black tracking-tight drop-shadow-sm select-none cursor-pointer"
          >
            স্বাগতম!
          </h2>
          <p className="text-white/85 text-xs font-semibold mt-1">
            Future Income 2027 একাউন্টে লগিন করুন
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} noValidate className="space-y-3.5">
          {/* Phone */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/70">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={loginPhone}
                onChange={(e) => {
                  setLoginPhone(e.target.value);
                  if (loginErrors.phone) setLoginErrors(prev => ({ ...prev, phone: undefined }));
                }}
                placeholder="আপনার ফোন নাম্বার"
                className={`w-full bg-black/25 border ${
                  loginErrors.phone ? 'border-red-400 ring-2 ring-red-400/50 bg-red-950/30' : 'border-white/30 focus:border-amber-300'
                } rounded-2xl py-3.5 pl-10 pr-4 text-white placeholder-white/60 text-sm font-mono tracking-wider focus:outline-none transition-all`}
                required
              />
            </div>
            {loginErrors.phone && (
              <p className="text-red-300 bg-red-950/60 border border-red-500/40 rounded-xl px-3 py-1 text-xs mt-1 font-bold flex items-center gap-1.5 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                <span>{loginErrors.phone}</span>
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/70">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => {
                  setLoginPass(e.target.value);
                  if (loginErrors.pass) setLoginErrors(prev => ({ ...prev, pass: undefined }));
                }}
                placeholder="পাসওয়ার্ড"
                className={`w-full bg-black/25 border ${
                  loginErrors.pass ? 'border-red-400 ring-2 ring-red-400/50 bg-red-950/30' : 'border-white/30 focus:border-amber-300'
                } rounded-2xl py-3.5 pl-10 pr-4 text-white placeholder-white/60 text-sm focus:outline-none transition-all`}
                required
              />
            </div>
            {loginErrors.pass && (
              <p className="text-red-300 bg-red-950/60 border border-red-500/40 rounded-xl px-3 py-1 text-xs mt-1 font-bold flex items-center gap-1.5 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                <span>{loginErrors.pass}</span>
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-900 font-black py-3.5 px-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-sm active:scale-98 transition-all mt-4"
          >
            <ArrowRight className="w-4 h-4" />
            <span>লগিন করুন</span>
          </button>
        </form>

        {/* Footer links */}
        <div className="text-center mt-6 space-y-3 text-xs">
          <div>
            <span className="text-white/80">একাউন্ট নেই? </span>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className="font-bold text-amber-300 hover:underline"
            >
              নতুন একাউন্ট খুলুন
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setAuthMode('landing')}
              className="text-white/70 hover:text-white flex items-center justify-center gap-1 mx-auto"
            >
              <Home className="w-3.5 h-3.5" />
              <span>হোমপেজে ফিরে যান</span>
            </button>
          </div>
        </div>
      </div>

      <SecretAdminModal
        isOpen={isSecretAdminModalOpen}
        onClose={() => setIsSecretAdminModalOpen(false)}
      />
    </div>
  );
};
