import React from 'react';

// Bangladeshi Taka ৳ Icon
export const TakaIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <span className={`inline-flex items-center justify-center font-bold text-lg select-none ${className}`}>
    ৳
  </span>
);

// bKash Logo Icon (Pink Bird Silhouette)
export const BkashLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <div className={`flex items-center justify-center bg-[#E2136E] text-white rounded-2xl shadow-sm ${className}`}>
    <svg viewBox="0 0 100 100" fill="currentColor" className="w-4/5 h-4/5">
      {/* bKash origami bird representation */}
      <polygon points="50,15 78,42 62,45 88,60 55,56 42,85 45,55 15,48 44,40" />
    </svg>
  </div>
);

// Nagad Logo Icon (Orange Running Figure)
export const NagadLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <div className={`flex items-center justify-center bg-white border border-amber-200 text-[#F7941D] rounded-2xl shadow-sm p-1 ${className}`}>
    <svg viewBox="0 0 100 100" fill="currentColor" className="w-4/5 h-4/5">
      <circle cx="58" cy="24" r="10" fill="#ED1C24" />
      <path d="M30 45 Q45 35 60 40 L72 55 L82 52 L80 60 L68 62 L55 50 L46 65 L58 85 L48 88 L34 68 L24 82 L16 75 L28 55 Z" fill="#F7941D" />
    </svg>
  </div>
);

// Rocket Logo Icon (Purple Rocket)
export const RocketLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <div className={`flex items-center justify-center bg-[#8C3494] text-white rounded-2xl shadow-sm ${className}`}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3/5 h-3/5">
      <path d="M13.13 2.13a1 1 0 0 0-1.26 0C8.36 4.93 6 8.9 6 13c0 2.5 1 4.5 2 6l3-1.5V21a1 1 0 0 0 1.6.8l3.4-2.55c.67-.5.98-1.34 1-2.25.04-4.1-2.36-8.07-5.87-10.87zM12 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
    </svg>
  </div>
);

// Businessman Avatar in Blue Suit & Red Tie (Matches Screenshot avatar)
export const AvatarSuit: React.FC<{ className?: string; size?: number }> = ({ className = "w-12 h-12" }) => (
  <div className={`relative rounded-full overflow-hidden bg-sky-100 flex items-center justify-center border-2 border-amber-300 shadow-sm shrink-0 ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Background circle */}
      <circle cx="50" cy="50" r="50" fill="#E0F2FE" />
      {/* Head / Face */}
      <ellipse cx="50" cy="40" rx="18" ry="20" fill="#FED7AA" />
      {/* Hair */}
      <path d="M32 35 C32 20 40 18 50 18 C60 18 68 20 68 35 C66 30 62 26 50 26 C38 26 34 30 32 35 Z" fill="#334155" />
      {/* Shirt Collar */}
      <polygon points="50,56 42,48 58,48" fill="#FFFFFF" />
      {/* Red Tie */}
      <polygon points="50,50 53,53 52,72 50,78 48,72 47,53" fill="#DC2626" />
      {/* Blue Suit Jacket */}
      <path d="M22 100 L32 60 L42 50 L50 68 L58 50 L68 60 L78 100 Z" fill="#1E40AF" />
      {/* Shoulders */}
      <path d="M15 100 C15 75 30 62 38 58 L50 72 L62 58 C70 62 85 75 85 100 Z" fill="#2563EB" opacity="0.4" />
    </svg>
  </div>
);

// Future Income 2027 Logo (Modern Futuristic Growth Emblem)
export const FutureIncomeLogo: React.FC<{ className?: string }> = ({ className = "h-10" }) => (
  <div className={`flex items-center gap-2.5 select-none ${className}`}>
    {/* Futuristic Emblem */}
    <div className="relative flex items-center justify-center shrink-0">
      <svg viewBox="0 0 100 100" className="w-10 h-10 drop-shadow-sm">
        <defs>
          <linearGradient id="fiGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="fiGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>

        {/* Outer futuristic faceted hexagon / shield */}
        <polygon points="50,6 88,26 88,74 50,94 12,74 12,26" fill="url(#fiGrad1)" opacity="0.15" />
        <polygon points="50,10 84,28 84,72 50,90 16,72 16,28" fill="none" stroke="url(#fiGrad1)" strokeWidth="3.5" strokeLinejoin="round" />

        {/* Ascending dynamic growth bar chart & arrow */}
        <rect x="28" y="54" width="7" height="20" rx="3" fill="#0284C7" />
        <rect x="40" y="44" width="7" height="30" rx="3" fill="#10B981" />
        <rect x="52" y="34" width="7" height="40" rx="3" fill="#F59E0B" />

        {/* Dynamic Future Arrow */}
        <path d="M26 50 Q48 30 68 20" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <polygon points="68,14 78,20 70,28" fill="#FFFFFF" />

        {/* Center shining star / spark */}
        <circle cx="50" cy="50" r="3" fill="#FFFFFF" />
      </svg>
    </div>

    {/* Brand Typography */}
    <div className="flex flex-col leading-tight">
      <div className="flex items-center gap-1.5">
        <span className="text-xl font-black tracking-tight text-slate-900">
          <span className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">Future</span>{' '}
          <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Income</span>
        </span>
        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
          2027
        </span>
      </div>
      <span className="text-[9px] tracking-widest uppercase font-bold text-slate-500">
        SMART INCOME PLATFORM
      </span>
    </div>
  </div>
);

// Backward compatibility alias
export const NexoraLogo = FutureIncomeLogo;
