import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ShieldCheck, Lock, X, KeyRound } from 'lucide-react';

interface SecretAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecretAdminModal: React.FC<SecretAdminModalProps> = ({ isOpen, onClose }) => {
  const { checkAdminPin, setIsAdminOpen, showToast } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkAdminPin(pin)) {
      setError(false);
      setPin('');
      onClose();
      setIsAdminOpen(true);
      showToast('অ্যাডমিন প্যানেলে স্বাগতম!');
    } else {
      setError(true);
      showToast('ভুল সিক্রেট পাসওয়ার্ড!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-xs w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-500 mx-auto flex items-center justify-center mb-3">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="font-extrabold text-base text-white tracking-wide">
            সিক্রেট কন্ট্রোল এক্সেস
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            এডমিন পাসওয়ার্ড দিন (ডিফল্ট: admin7788)
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <div className="relative">
              <input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="সিক্রেট পিন / পাসওয়ার্ড"
                className={`w-full bg-slate-800 border ${
                  error ? 'border-red-500 ring-2 ring-red-500/30' : 'border-slate-700 focus:border-red-500'
                } rounded-2xl py-3 px-4 text-center text-sm font-mono tracking-widest text-white placeholder-slate-500 focus:outline-none`}
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 px-4 rounded-2xl shadow-lg shadow-red-900/30 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>প্রবেশ করুন</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
