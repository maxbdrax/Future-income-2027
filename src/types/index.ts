export type PaymentMethod = 'BKASH' | 'NAGAD' | 'ROCKET';

export interface User {
  id: string;
  name: string;
  phone: string;
  pass?: string;
  avatar?: string;
  balance: number;
  totalEarnings: number;
  totalReferrals: number;
  referralCode: string;
  referredBy?: string;
  status: 'active' | 'banned';
  createdAt: string;
  dailySpinsRemaining: number;
  lastDailyBonusClaimedAt?: number; // timestamp in ms for 24h check
  isVerified?: boolean; // admin verified account requirement
  verifiedAt?: string;
  vipLevel?: number; // 0 = Free, 1 = VIP 1, 2 = VIP 2, etc.
  vipPurchasedAt?: string;
  lastVipIncomeClaimedAt?: number; // timestamp in ms for 24h VIP claim
  totalVipEarnings?: number;
}

export interface VipPlan {
  id: number;
  name: string;
  title: string;
  price: number; // in BDT
  dailyIncome: number; // in BDT
  monthlyReturn: number; // calculated approx 30 days
  colorGradient: string;
  borderColor: string;
  badgeBg: string;
  textColor: string;
  features: string[];
}

export const VIP_PLANS: VipPlan[] = [
  {
    id: 1,
    name: 'VIP 1',
    title: 'ব্রোঞ্জ ভিআইপি',
    price: 100,
    dailyIncome: 10,
    monthlyReturn: 300,
    colorGradient: 'from-amber-500 to-amber-700',
    borderColor: 'border-amber-400',
    badgeBg: 'bg-amber-100 text-amber-800',
    textColor: 'text-amber-500',
    features: ['প্রতিদিন ১০ টাকা ফিক্সড আয়', '২৪ ঘন্টা পর পর দাবি', 'দ্রুত উইথড্র সাপোর্ট']
  },
  {
    id: 2,
    name: 'VIP 2',
    title: 'সিলভার ভিআইপি',
    price: 300,
    dailyIncome: 35,
    monthlyReturn: 1050,
    colorGradient: 'from-slate-400 to-slate-700',
    borderColor: 'border-slate-400',
    badgeBg: 'bg-slate-100 text-slate-800',
    textColor: 'text-slate-400',
    features: ['প্রতিদিন ৩৫ টাকা ফিক্সড আয়', '২৪ ঘন্টা পর পর দাবি', 'অগ্রাধিকার সাপোর্ট']
  },
  {
    id: 3,
    name: 'VIP 3',
    title: 'গোল্ড ভিআইপি',
    price: 500,
    dailyIncome: 65,
    monthlyReturn: 1950,
    colorGradient: 'from-yellow-400 to-amber-600',
    borderColor: 'border-yellow-400',
    badgeBg: 'bg-yellow-100 text-yellow-800',
    textColor: 'text-yellow-500',
    features: ['প্রতিদিন ৬৫ টাকা ফিক্সড আয়', '২৪ ঘন্টা পর পর দাবি', 'ভিআইপি স্পেশাল ব্যাজ']
  },
  {
    id: 4,
    name: 'VIP 4',
    title: 'প্লাটিনাম ভিআইপি',
    price: 1000,
    dailyIncome: 140,
    monthlyReturn: 4200,
    colorGradient: 'from-cyan-500 to-blue-700',
    borderColor: 'border-cyan-400',
    badgeBg: 'bg-cyan-100 text-cyan-800',
    textColor: 'text-cyan-500',
    features: ['প্রতিদিন ১৪০ টাকা ফিক্সড আয়', '২৪ ঘন্টা পর পর দাবি', 'ভিআইপি ফাস্ট ট্র্যাক পেমেন্ট']
  },
  {
    id: 5,
    name: 'VIP 5',
    title: 'ডায়মন্ড ভিআইপি',
    price: 2500,
    dailyIncome: 380,
    monthlyReturn: 11400,
    colorGradient: 'from-purple-600 to-pink-600',
    borderColor: 'border-purple-400',
    badgeBg: 'bg-purple-100 text-purple-800',
    textColor: 'text-purple-500',
    features: ['প্রতিদিন ৩৮০ টাকা সর্বোচ্চ আয়', '২৪ ঘন্টা পর পর দাবি', '১০০% ইনস্ট্যান্ট উইথড্র অনুমোদন']
  }
];

export type TaskType = 'web' | 'youtube' | 'telegram' | 'review' | 'ads';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  reward: number; // in Taka
  durationSec: number;
  type: TaskType;
  targetUrl: string;
  iconType: string;
  completedCount: number;
  active: boolean;
}

export interface TaskHistory {
  id: string;
  userId: string;
  taskId: string;
  taskTitle: string;
  reward: number;
  completedAt: string;
}

export interface WithdrawRequest {
  id: string;
  userId: string;
  userName: string;
  method: PaymentMethod;
  receiverNumber: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  adminNote?: string;
}

export interface DepositRequest {
  id: string;
  userId: string;
  userName: string;
  method: PaymentMethod;
  senderNumber: string;
  trxId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  adminNote?: string;
  isVerificationDeposit?: boolean;
}

export interface AdminSettings {
  bkashNumber: string;
  bkashType: string; // Personal / Agent / Merchant
  nagadNumber: string;
  nagadType: string;
  rocketNumber: string;
  rocketType: string;
  minWithdraw: number;
  requiredReferralsForWithdraw: number; // default 10
  verificationDepositFee: number; // required deposit to verify account
  dailyBonusAmount: number; // daily bonus amount editable by admin
  referBonus: number;
  dailySpinLimit: number;
  adminSecretPin: string; // secret password to enter admin
  supportTelegram: string;
  supportPhone: string;
  notice: string;
  videoTutorialUrl: string;
  apkDownloadUrl: string;
  // Google AdSense & Ad Networks
  adsensePubId: string;
  adsenseBannerSlot: string;
  adsenseRewardSlot: string;
  adsEnabled: boolean;
  customAdCode: string;
}

export interface LiveWithdrawNotification {
  id: string;
  name: string;
  amount: number;
  method: 'বিকাশ' | 'নগদ' | 'রকেট';
  maskedPhone: string;
  timeText: string;
}
