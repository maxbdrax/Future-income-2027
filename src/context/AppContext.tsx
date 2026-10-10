import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  User,
  TaskItem,
  TaskHistory,
  WithdrawRequest,
  DepositRequest,
  AdminSettings,
  LiveWithdrawNotification,
  PaymentMethod,
  VIP_PLANS
} from '../types/index.ts';
import { db, handleFirestoreError, OperationType } from '../firebase.ts';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  getDoc
} from 'firebase/firestore';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  tasks: TaskItem[];
  taskHistory: TaskHistory[];
  withdrawRequests: WithdrawRequest[];
  depositRequests: DepositRequest[];
  settings: AdminSettings;
  liveNotifications: LiveWithdrawNotification[];
  activeTab: 'home' | 'tasks' | 'vip' | 'team' | 'withdraw' | 'deposit' | 'account';
  setActiveTab: (tab: 'home' | 'tasks' | 'vip' | 'team' | 'withdraw' | 'deposit' | 'account') => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  currentModal: string | null;
  setCurrentModal: (modal: string | null) => void;
  // Auth methods
  login: (phone: string, pass: string) => boolean;
  register: (name: string, phone: string, pass: string, refCode?: string) => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  // Task & Earning methods
  completeTask: (taskId: string) => { success: boolean; reward: number; message: string };
  claimDailyBonus: () => { success: boolean; amount: number; message: string; remainingTimeStr?: string };
  spinWheelReward: (amount: number) => { success: boolean; message: string };
  // VIP Level methods
  purchaseVipPlan: (planId: number) => { success: boolean; message: string };
  claimDailyVipIncome: () => { success: boolean; amount: number; message: string; remainingTimeStr?: string };
  // Transactions
  submitWithdraw: (method: PaymentMethod, number: string, amount: number) => { success: boolean; message: string; needsVerification?: boolean };
  submitDeposit: (method: PaymentMethod, senderNumber: string, trxId: string, amount: number, isVerification?: boolean) => { success: boolean; message: string };
  // Admin Controls
  checkAdminPin: (pin: string) => boolean;
  verifyUserAccount: (userId: string, isVerified: boolean) => void;
  setUserVipLevel: (userId: string, vipLevel: number) => void;
  approveWithdraw: (requestId: string) => void;
  rejectWithdraw: (requestId: string, reason?: string) => void;
  approveDeposit: (requestId: string) => void;
  rejectDeposit: (requestId: string, reason?: string) => void;
  addTask: (task: Omit<TaskItem, 'id' | 'completedCount'>) => void;
  updateTask: (task: TaskItem) => void;
  deleteTask: (taskId: string) => void;
  updateSettings: (newSettings: Partial<AdminSettings>) => void;
  adjustUserBalance: (userId: string, deltaAmount: number, reason: string) => void;
  toggleUserStatus: (userId: string) => void;
  resetToDefaults: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isFirebaseSyncing: boolean;
}

const DEFAULT_TASKS: TaskItem[] = [
  {
    id: 't-1',
    title: 'ইউটিউব ভিডিও দেখুন (৬০ সেকেন্ড)',
    description: 'ভিডিওটি সম্পূর্ণ ৬০ সেকেন্ড দেখুন এবং চ্যানেলটি সাবস্ক্রাইব করুন।',
    reward: 15.00,
    durationSec: 60,
    type: 'youtube',
    targetUrl: 'https://youtube.com',
    iconType: 'youtube',
    completedCount: 0,
    active: true
  },
  {
    id: 't-2',
    title: 'অফিসিয়াল টেলিগ্রাম চ্যানেলে জয়েন করুন',
    description: 'টেলিগ্রাম চ্যানেলে যুক্ত হয়ে পেমেন্ট প্রুফ ও নতুন আপডেট পান।',
    reward: 10.00,
    durationSec: 15,
    type: 'telegram',
    targetUrl: 'https://t.me/nexorapaybd',
    iconType: 'telegram',
    completedCount: 0,
    active: true
  },
  {
    id: 't-3',
    title: 'স্পন্সর ওয়েবসাইট ভিজিট করুন (৩০ সেকেন্ড)',
    description: 'স্পন্সর সাইট ব্রাউজ করুন এবং ৩০ সেকেন্ড অপেক্ষা করে আর্ন করুন।',
    reward: 8.00,
    durationSec: 30,
    type: 'web',
    targetUrl: 'https://google.com',
    iconType: 'globe',
    completedCount: 0,
    active: true
  },
  {
    id: 't-4',
    title: 'প্লে-স্টোর অ্যাপ রিভিউ ও ৫ স্টার দিন',
    description: 'আমাদের অ্যাপের রিভিউ দিয়ে সুন্দর একটি কমেন্ট লিখে রেটিং দিন।',
    reward: 25.00,
    durationSec: 45,
    type: 'review',
    targetUrl: 'https://play.google.com',
    iconType: 'star',
    completedCount: 0,
    active: true
  },
  {
    id: 't-5',
    title: 'ফেসবুক পেজ ফলো ও লাইক করুন',
    description: 'অফিসিয়াল ফেসবুক পেজে লাইক দিয়ে ফলো করে সাথে থাকুন।',
    reward: 8.00,
    durationSec: 20,
    type: 'web',
    targetUrl: 'https://facebook.com',
    iconType: 'facebook',
    completedCount: 0,
    active: true
  },
  {
    id: 't-6',
    title: 'ভিডিও বিজ্ঞাপন দেখুন (১৫ সেকেন্ড)',
    description: 'বিজ্ঞাপন দেখে সরাসরি ব্যালেন্সে টাকা যুক্ত করুন।',
    reward: 5.00,
    durationSec: 15,
    type: 'ads',
    targetUrl: '#',
    iconType: 'play',
    completedCount: 0,
    active: true
  }
];

const DEFAULT_SETTINGS: AdminSettings = {
  bkashNumber: '01855667788',
  bkashType: 'Personal',
  nagadNumber: '01711223344',
  nagadType: 'Personal',
  rocketNumber: '01988776655',
  rocketType: 'Personal',
  minWithdraw: 600.00,
  requiredReferralsForWithdraw: 10,
  verificationDepositFee: 300.00,
  dailyBonusAmount: 10.00,
  referBonus: 70.00,
  dailySpinLimit: 5,
  adminSecretPin: 'admin7788',
  supportTelegram: 'https://t.me/nexorapaybd',
  supportPhone: '01855667788',
  notice: 'সম্মানিত মেম্বারবৃন্দ, Future Income 2027-এ প্রতিদিনের টাস্ক ও VIP লেভেলে আনলিমিটেড টাকা আয় করুন! উইথড্র রিকোয়েস্ট পাঠানোর সর্বোচ্চ ১৫-৩০ মিনিটের মধ্যে বিকাশ ও নগদে পেমেন্ট প্রদান করা হয়।',
  videoTutorialUrl: 'https://youtube.com',
  apkDownloadUrl: '#',
  // Google AdSense & Ad Networks
  adsensePubId: 'ca-pub-3335603276700829',
  adsenseBannerSlot: '9876543210',
  adsenseRewardSlot: '1234567890',
  adsEnabled: true,
  customAdCode: '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3335603276700829" crossorigin="anonymous"></script>'
};

const DEFAULT_NOTIFICATIONS: LiveWithdrawNotification[] = [
  { id: '1', name: 'ফাহিম মাহমুদ', amount: 2460, method: 'বিকাশ', maskedPhone: '013****2023', timeText: 'মাত্র সফল হয়েছে' },
  { id: '2', name: 'রিয়াদুল', amount: 2900, method: 'নগদ', maskedPhone: '017****3030', timeText: 'মাত্র সফল হয়েছে' },
  { id: '3', name: 'শরিফুল ইসলাম', amount: 600, method: 'বিকাশ', maskedPhone: '015****8440', timeText: 'মাত্র সফল হয়েছে' },
  { id: '4', name: 'তানভীর হাসান', amount: 1500, method: 'বিকাশ', maskedPhone: '019****9912', timeText: '১ মিনিট আগে' },
  { id: '5', name: 'মেহেদী হাসান', amount: 3000, method: 'নগদ', maskedPhone: '018****4455', timeText: '২ মিনিট আগে' }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nexora_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('nexora_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('nexora_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>(() => {
    const saved = localStorage.getItem('nexora_task_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>(() => {
    const saved = localStorage.getItem('nexora_withdraws');
    return saved ? JSON.parse(saved) : [];
  });

  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>(() => {
    const saved = localStorage.getItem('nexora_deposits');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('nexora_settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  const [liveNotifications] = useState<LiveWithdrawNotification[]>(DEFAULT_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'home' | 'tasks' | 'vip' | 'team' | 'withdraw' | 'deposit' | 'account'>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFirebaseSyncing, setIsFirebaseSyncing] = useState(true);

  const currentUserRef = useRef<User | null>(currentUser);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // Sync to local storage for fast cached start
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nexora_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('nexora_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nexora_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('nexora_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('nexora_task_history', JSON.stringify(taskHistory));
  }, [taskHistory]);

  useEffect(() => {
    localStorage.setItem('nexora_withdraws', JSON.stringify(withdrawRequests));
  }, [withdrawRequests]);

  useEffect(() => {
    localStorage.setItem('nexora_deposits', JSON.stringify(depositRequests));
  }, [depositRequests]);

  useEffect(() => {
    localStorage.setItem('nexora_settings', JSON.stringify(settings));
  }, [settings]);

  // ==========================================
  // REAL-TIME FIRESTORE LISTENERS (MULTI-DEVICE SYNC)
  // ==========================================
  useEffect(() => {
    let unsubUsers: (() => void) | undefined;
    let unsubSettings: (() => void) | undefined;
    let unsubTasks: (() => void) | undefined;
    let unsubWithdraws: (() => void) | undefined;
    let unsubDeposits: (() => void) | undefined;
    let unsubHistory: (() => void) | undefined;

    try {
      // 1. Settings listener
      const settingsDocRef = doc(db, 'settings', 'global');
      unsubSettings = onSnapshot(settingsDocRef, (snap) => {
        if (snap.exists()) {
          const remoteSettings = snap.data() as AdminSettings;
          // Auto upgrade old placeholder ID to user's real publisher ID
          if (remoteSettings.adsensePubId === 'ca-pub-1234567890123456' || !remoteSettings.adsensePubId) {
            remoteSettings.adsensePubId = 'ca-pub-3335603276700829';
            remoteSettings.customAdCode = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3335603276700829" crossorigin="anonymous"></script>';
            setDoc(settingsDocRef, remoteSettings, { merge: true }).catch(err => {
              handleFirestoreError(err, OperationType.WRITE, 'settings/global');
            });
          }
          setSettings(prev => ({ ...prev, ...remoteSettings }));
        } else {
          // Initialize in Firestore
          setDoc(settingsDocRef, DEFAULT_SETTINGS).catch(err => {
            handleFirestoreError(err, OperationType.WRITE, 'settings/global');
          });
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/global');
      });

      // 2. Users listener
      const usersColRef = collection(db, 'users');
      unsubUsers = onSnapshot(usersColRef, (snapshot) => {
        const loadedUsers: User[] = [];
        snapshot.forEach(d => {
          loadedUsers.push(d.data() as User);
        });
        setUsers(loadedUsers);

        // Keep logged in currentUser in sync with cloud data
        const currentId = currentUserRef.current?.id;
        if (currentId) {
          const matching = loadedUsers.find(u => u.id === currentId);
          if (matching) {
            setCurrentUser(matching);
          }
        }
        setIsFirebaseSyncing(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'users');
      });

      // 3. Tasks listener
      const tasksColRef = collection(db, 'tasks');
      unsubTasks = onSnapshot(tasksColRef, (snapshot) => {
        if (snapshot.empty) {
          // Seed default tasks into Firestore if empty
          DEFAULT_TASKS.forEach(t => {
            setDoc(doc(db, 'tasks', t.id), t).catch(err => {
              handleFirestoreError(err, OperationType.WRITE, `tasks/${t.id}`);
            });
          });
        } else {
          const loadedTasks: TaskItem[] = [];
          snapshot.forEach(d => {
            loadedTasks.push(d.data() as TaskItem);
          });
          setTasks(loadedTasks);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'tasks');
      });

      // 4. Withdraw requests listener
      const withdrawsColRef = collection(db, 'withdraw_requests');
      unsubWithdraws = onSnapshot(withdrawsColRef, (snapshot) => {
        const loaded: WithdrawRequest[] = [];
        snapshot.forEach(d => {
          loaded.push(d.data() as WithdrawRequest);
        });
        // Sort newest first
        loaded.sort((a, b) => (b.requestedAt > a.requestedAt ? 1 : -1));
        setWithdrawRequests(loaded);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'withdraw_requests');
      });

      // 5. Deposit requests listener
      const depositsColRef = collection(db, 'deposit_requests');
      unsubDeposits = onSnapshot(depositsColRef, (snapshot) => {
        const loaded: DepositRequest[] = [];
        snapshot.forEach(d => {
          loaded.push(d.data() as DepositRequest);
        });
        loaded.sort((a, b) => (b.requestedAt > a.requestedAt ? 1 : -1));
        setDepositRequests(loaded);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'deposit_requests');
      });

      // 6. Task history listener
      const historyColRef = collection(db, 'task_history');
      unsubHistory = onSnapshot(historyColRef, (snapshot) => {
        const loaded: TaskHistory[] = [];
        snapshot.forEach(d => {
          loaded.push(d.data() as TaskHistory);
        });
        setTaskHistory(loaded);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'task_history');
      });

    } catch (err) {
      console.error('Firestore init error:', err);
    }

    return () => {
      unsubUsers?.();
      unsubSettings?.();
      unsubTasks?.();
      unsubWithdraws?.();
      unsubDeposits?.();
      unsubHistory?.();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Admin PIN verification
  const checkAdminPin = (pin: string): boolean => {
    return pin.trim() === settings.adminSecretPin.trim();
  };

  // Auth: Login
  const login = (phone: string, pass: string): boolean => {
    const existing = users.find(u => u.phone.trim() === phone.trim());
    if (existing) {
      if (existing.status === 'banned') {
        showToast('আপনার একাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। এডমিনের সাথে যোগাযোগ করুন।');
        return false;
      }
      if (existing.pass && existing.pass !== pass.trim()) {
        showToast('ভুল পাসওয়ার্ড দিয়েছেন! সঠিক পাসওয়ার্ড দিয়ে চেষ্টা করুন।');
        return false;
      }
      setCurrentUser(existing);
      showToast(`স্বাগতম ${existing.name}! লগিন সফল হয়েছে।`);
      return true;
    }
    showToast('এই ফোন নাম্বারে কোনো একাউন্ট পাওয়া যায়নি! অনুগ্রহ করে নতুন একাউন্ট তৈরি করুন।');
    return false;
  };

  // Auth: Register
  const register = (name: string, phone: string, pass: string, refCode?: string): boolean => {
    if (users.some(u => u.phone.trim() === phone.trim())) {
      showToast('এই ফোন নাম্বারে ইতিমধ্যে একাউন্ট রয়েছে! অনুগ্রহ করে লগিন করুন।');
      return false;
    }

    let initialBonus = 50.00; // Sign-up bonus
    const newId = String(Math.floor(2000000 + Math.random() * 800000));
    
    // Check referral code
    if (refCode && refCode.trim()) {
      const trimmedRef = refCode.trim();
      const referrer = users.find(u => u.referralCode === trimmedRef || u.id === trimmedRef);
      if (referrer) {
        // Bonus and increment referral count to referrer
        const updatedReferrer: Partial<User> = {
          balance: +(referrer.balance + settings.referBonus).toFixed(2),
          totalEarnings: +(referrer.totalEarnings + settings.referBonus).toFixed(2),
          totalReferrals: (referrer.totalReferrals || 0) + 1
        };
        // Update in Firestore
        updateDoc(doc(db, 'users', referrer.id), updatedReferrer).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `users/${referrer.id}`);
        });
        initialBonus += 20.00; // Extra bonus for using referral code
      }
    }

    const newUser: User = {
      id: newId,
      name: name.trim() || 'মেম্বার',
      phone: phone.trim(),
      pass: pass.trim(),
      balance: initialBonus,
      totalEarnings: 0.00,
      totalReferrals: 0,
      referralCode: newId,
      referredBy: refCode?.trim(),
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      dailySpinsRemaining: settings.dailySpinLimit,
      isVerified: false,
      vipLevel: 0,
      totalVipEarnings: 0
    };

    // Save to Firestore
    setDoc(doc(db, 'users', newId), newUser).catch(err => {
      handleFirestoreError(err, OperationType.CREATE, `users/${newId}`);
    });

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`অভিনন্দন ${newUser.name}! একাউন্ট তৈরি সম্পন্ন ও ৳${initialBonus.toFixed(2)} বোনাস যোগ হয়েছে।`);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('লগআউট সম্পন্ন হয়েছে।');
  };

  const switchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  // Complete Task
  const completeTask = (taskId: string) => {
    if (!currentUser) return { success: false, reward: 0, message: 'প্রথমে লগিন করুন' };
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return { success: false, reward: 0, message: 'টাস্ক পাওয়া যায়নি' };

    const newHistory: TaskHistory = {
      id: `th-${Date.now()}`,
      userId: currentUser.id,
      taskId: task.id,
      taskTitle: task.title,
      reward: task.reward,
      completedAt: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    };

    // Write history to Firestore
    setDoc(doc(db, 'task_history', newHistory.id), newHistory).catch(err => {
      handleFirestoreError(err, OperationType.CREATE, `task_history/${newHistory.id}`);
    });

    // Update task completion count in Firestore
    updateDoc(doc(db, 'tasks', taskId), {
      completedCount: (task.completedCount || 0) + 1
    }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `tasks/${taskId}`);
    });

    // Update user balance in Firestore
    const updatedUser = {
      ...currentUser,
      balance: +(currentUser.balance + task.reward).toFixed(2),
      totalEarnings: +(currentUser.totalEarnings + task.reward).toFixed(2)
    };
    updateDoc(doc(db, 'users', currentUser.id), {
      balance: updatedUser.balance,
      totalEarnings: updatedUser.totalEarnings
    }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.id}`);
    });

    setCurrentUser(updatedUser);
    const msg = `অভিনন্দন! আপনার ব্যালেন্সে ৳${task.reward.toFixed(2)} টাকা সফলভাবে যোগ হয়েছে।`;
    showToast(msg);
    return { success: true, reward: task.reward, message: msg };
  };

  // Daily Bonus with strict 24-HOUR COOLDOWN
  const claimDailyBonus = () => {
    if (!currentUser) return { success: false, amount: 0, message: 'প্রথমে লগিন করুন' };
    
    const now = Date.now();
    const lastClaim = currentUser.lastDailyBonusClaimedAt || 0;
    const cooldownMs = 24 * 60 * 60 * 1000;

    if (now - lastClaim < cooldownMs) {
      const remainingMs = cooldownMs - (now - lastClaim);
      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const remainingTimeStr = `${hours} ঘণ্টা ${minutes} মিনিট`;
      const msg = `আপনি ইতিমধ্যে আজকের বোনাস গ্রহণ করেছেন! পরবর্তী ক্লেইম করতে পারবেন ${remainingTimeStr} পর।`;
      showToast(msg);
      return { success: false, amount: 0, message: msg, remainingTimeStr };
    }

    const bonusAmount = settings.dailyBonusAmount || 10.00;
    const updatedUser = {
      ...currentUser,
      balance: +(currentUser.balance + bonusAmount).toFixed(2),
      totalEarnings: +(currentUser.totalEarnings + bonusAmount).toFixed(2),
      lastDailyBonusClaimedAt: now
    };

    updateDoc(doc(db, 'users', currentUser.id), {
      balance: updatedUser.balance,
      totalEarnings: updatedUser.totalEarnings,
      lastDailyBonusClaimedAt: now
    }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.id}`);
    });

    setCurrentUser(updatedUser);
    const msg = `অভিনন্দন! দৈনিক বোনাস ৳${bonusAmount.toFixed(2)} আপনার ব্যালেন্সে যুক্ত হয়েছে! (২৪ ঘণ্টা পর পুনরায় ক্লেইম করতে পারবেন)`;
    showToast(msg);
    return { success: true, amount: bonusAmount, message: msg };
  };

  // Spin Wheel Reward
  const spinWheelReward = (amount: number) => {
    if (!currentUser) return { success: false, message: 'প্রথমে লগিন করুন' };
    if (currentUser.dailySpinsRemaining <= 0) {
      return { success: false, message: 'আজকের সব স্পিন শেষ! আগামীকাল আবার আসুন।' };
    }

    const updatedUser = {
      ...currentUser,
      balance: +(currentUser.balance + amount).toFixed(2),
      totalEarnings: +(currentUser.totalEarnings + amount).toFixed(2),
      dailySpinsRemaining: Math.max(0, currentUser.dailySpinsRemaining - 1)
    };

    updateDoc(doc(db, 'users', currentUser.id), {
      balance: updatedUser.balance,
      totalEarnings: updatedUser.totalEarnings,
      dailySpinsRemaining: updatedUser.dailySpinsRemaining
    }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.id}`);
    });

    setCurrentUser(updatedUser);
    const msg = `চমৎকার! স্পিন করে আপনি ৳${amount.toFixed(2)} জিতেছেন!`;
    showToast(msg);
    return { success: true, message: msg };
  };

  // ==========================================
  // VIP LEVEL PURCHASING & DAILY INCOME (NEW!)
  // ==========================================
  const purchaseVipPlan = (planId: number) => {
    if (!currentUser) return { success: false, message: 'প্রথমে লগিন করুন' };

    const plan = VIP_PLANS.find(p => p.id === planId);
    if (!plan) return { success: false, message: 'প্ল্যান পাওয়া যায়নি!' };

    if (currentUser.balance < plan.price) {
      const msg = `আপনার ব্যালেন্সে পর্যাপ্ত টাকা নেই! এই প্ল্যানটি কিনতে ৳${plan.price} টাকা প্রয়োজন। প্রথমে ডিপোজিট করুন।`;
      showToast(msg);
      return { success: false, message: msg };
    }

    if ((currentUser.vipLevel || 0) >= plan.id) {
      const msg = 'আপনি ইতিমধ্যে এই বা এর চেয়ে উচ্চতর VIP লেভেলে আছেন!';
      showToast(msg);
      return { success: false, message: msg };
    }

    // Deduct cost and activate VIP tier
    const updatedUser = {
      ...currentUser,
      balance: +(currentUser.balance - plan.price).toFixed(2),
      vipLevel: plan.id,
      vipPurchasedAt: new Date().toISOString(),
      lastVipIncomeClaimedAt: 0 // allow immediate claim on purchase
    };

    // Update in Firestore
    updateDoc(doc(db, 'users', currentUser.id), {
      balance: updatedUser.balance,
      vipLevel: updatedUser.vipLevel,
      vipPurchasedAt: updatedUser.vipPurchasedAt,
      lastVipIncomeClaimedAt: 0
    }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.id}`);
    });

    // Save purchase record in Firestore
    const purchaseDocId = `vip-pur-${Date.now()}`;
    setDoc(doc(db, 'vip_purchases', purchaseDocId), {
      id: purchaseDocId,
      userId: currentUser.id,
      userName: currentUser.name,
      vipLevel: plan.id,
      vipName: plan.name,
      cost: plan.price,
      dailyIncome: plan.dailyIncome,
      purchasedAt: new Date().toISOString()
    }).catch(err => {
      handleFirestoreError(err, OperationType.CREATE, `vip_purchases/${purchaseDocId}`);
    });

    setCurrentUser(updatedUser);
    const msg = `অভিনন্দন! আপনি সফলভাবে ${plan.name} (${plan.title}) পার্সেস করেছেন! এখন প্রতিদিন ৳${plan.dailyIncome} টাকা করে নিশ্চিত ইনকাম উপভোগ করুন।`;
    showToast(msg);
    return { success: true, message: msg };
  };

  const claimDailyVipIncome = () => {
    if (!currentUser) return { success: false, amount: 0, message: 'প্রথমে লগিন করুন' };

    if (!currentUser.vipLevel || currentUser.vipLevel < 1) {
      const msg = 'আপনার কোনো সক্রিয় VIP লেভেল নেই! প্রতিদিন নিশ্চিত আয় পেতে একটি VIP লেভেল প্যাকেজ কিনুন।';
      showToast(msg);
      return { success: false, amount: 0, message: msg };
    }

    const plan = VIP_PLANS.find(p => p.id === currentUser.vipLevel);
    if (!plan) return { success: false, amount: 0, message: 'VIP প্ল্যান পাওয়া যায়নি!' };

    const now = Date.now();
    const lastClaim = currentUser.lastVipIncomeClaimedAt || 0;
    const cooldownMs = 24 * 60 * 60 * 1000;

    if (lastClaim > 0 && now - lastClaim < cooldownMs) {
      const remainingMs = cooldownMs - (now - lastClaim);
      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const remainingTimeStr = `${hours} ঘণ্টা ${minutes} মিনিট`;
      const msg = `আপনি ইতিমধ্যে আজকের VIP আয় গ্রহণ করেছেন! পরবর্তী ক্লেইম করতে পারবেন ${remainingTimeStr} পর।`;
      showToast(msg);
      return { success: false, amount: 0, message: msg, remainingTimeStr };
    }

    const incomeAmount = plan.dailyIncome;
    const updatedUser = {
      ...currentUser,
      balance: +(currentUser.balance + incomeAmount).toFixed(2),
      totalEarnings: +(currentUser.totalEarnings + incomeAmount).toFixed(2),
      totalVipEarnings: +((currentUser.totalVipEarnings || 0) + incomeAmount).toFixed(2),
      lastVipIncomeClaimedAt: now
    };

    updateDoc(doc(db, 'users', currentUser.id), {
      balance: updatedUser.balance,
      totalEarnings: updatedUser.totalEarnings,
      totalVipEarnings: updatedUser.totalVipEarnings,
      lastVipIncomeClaimedAt: now
    }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.id}`);
    });

    setCurrentUser(updatedUser);
    const msg = `অভিনন্দন! আপনার ${plan.name} দৈনিক আয় ৳${incomeAmount.toFixed(2)} সফলভাবে ব্যালেন্সে যুক্ত হয়েছে! (২৪ ঘণ্টা পর পুনরায় ক্লেইম করতে পারবেন)`;
    showToast(msg);
    return { success: true, amount: incomeAmount, message: msg };
  };

  // Withdraw - With 10 Referrals, 600 Tk, and Secret Verification Check
  const submitWithdraw = (method: PaymentMethod, number: string, amount: number) => {
    if (!currentUser) return { success: false, message: 'প্রথমে লগিন করুন' };
    
    if (amount < settings.minWithdraw) {
      const msg = `সর্বনিম্ন উত্তোলনের পরিমাণ ৳${settings.minWithdraw.toFixed(2)} টাকা!`;
      showToast(msg);
      return { success: false, message: msg };
    }

    if (currentUser.balance < amount) {
      const msg = 'আপনার একাউন্টে পর্যাপ্ত ব্যালেন্স নেই!';
      showToast(msg);
      return { success: false, message: msg };
    }

    if (!number || number.length < 11) {
      const msg = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন!';
      showToast(msg);
      return { success: false, message: msg };
    }

    // Must have at least 10 referrals (or configured number)
    const requiredRefs = settings.requiredReferralsForWithdraw || 10;
    if (currentUser.totalReferrals < requiredRefs) {
      const msg = `উইথড্র করতে সর্বনিম্ন ${requiredRefs} জন সফল রেফার প্রয়োজন! আপনার বর্তমান রেফার: ${currentUser.totalReferrals} জন।`;
      showToast(msg);
      return { success: false, message: msg };
    }

    // SECRET CONDITION: If balance >= 600 AND referrals >= 10, BUT NOT VERIFIED:
    if (!currentUser.isVerified) {
      const msg = `⚠️ একাউন্ট ভেরিফিকেশন আবশ্যক! অভিনন্দন, আপনি ৬০০ টাকা এবং ${requiredRefs} জন রেফার সম্পন্ন করেছেন। উইথড্র নিরাপত্তা নিশ্চিত করার জন্য এডমিন নির্ধারিত ৳${settings.verificationDepositFee.toFixed(2)} টাকা ডিপোজিট করে একাউন্ট ভেরিফাই করুন।`;
      showToast(msg);
      return { success: false, needsVerification: true, message: msg };
    }

    // Verified: Proceed with withdraw
    const updatedUser = {
      ...currentUser,
      balance: +(currentUser.balance - amount).toFixed(2)
    };

    updateDoc(doc(db, 'users', currentUser.id), {
      balance: updatedUser.balance
    }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.id}`);
    });
    setCurrentUser(updatedUser);

    const newReq: WithdrawRequest = {
      id: `w-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      method,
      receiverNumber: number.trim(),
      amount,
      status: 'pending',
      requestedAt: new Date().toLocaleString('bn-BD')
    };

    setDoc(doc(db, 'withdraw_requests', newReq.id), newReq).catch(err => {
      handleFirestoreError(err, OperationType.CREATE, `withdraw_requests/${newReq.id}`);
    });

    const msg = `৳${amount.toFixed(2)} টাকার উইথড্র রিকোয়েস্ট সফল হয়েছে! শীঘ্রই পেমেন্ট প্রদান করা হবে।`;
    showToast(msg);
    return { success: true, message: msg };
  };

  // Deposit
  const submitDeposit = (method: PaymentMethod, senderNumber: string, trxId: string, amount: number, isVerification = false) => {
    if (!currentUser) return { success: false, message: 'প্রথমে লগিন করুন' };
    if (amount <= 0) return { success: false, message: 'সঠিক ডিপোজিট পরিমাণ লিখুন!' };
    if (!senderNumber || senderNumber.length < 11) return { success: false, message: 'যে নম্বর থেকে টাকা পাঠিয়েছেন তা লিখুন!' };
    if (!trxId || trxId.trim().length < 6) return { success: false, message: 'সঠিক ট্রানজেকশন আইডি (TrxID) প্রদান করুন!' };

    const newDep: DepositRequest = {
      id: `dep-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      method,
      senderNumber: senderNumber.trim(),
      trxId: trxId.trim().toUpperCase(),
      amount,
      status: 'pending',
      requestedAt: new Date().toLocaleString('bn-BD'),
      isVerificationDeposit: isVerification
    };

    setDoc(doc(db, 'deposit_requests', newDep.id), newDep).catch(err => {
      handleFirestoreError(err, OperationType.CREATE, `deposit_requests/${newDep.id}`);
    });

    const msg = isVerification
      ? `৳${amount.toFixed(2)} টাকার ভেরিফিকেশন ডিপোজিট রিকোয়েস্ট পাঠানো হয়েছে! এডমিন যাচাই করে আপনার একাউন্ট ভেরিফাইড করবেন।`
      : `৳${amount.toFixed(2)} টাকা ডিপোজিট রিকোয়েস্ট গৃহীত হয়েছে! এডমিন ভেরিফাই করে ব্যালেন্স যোগ করবেন।`;
    showToast(msg);
    return { success: true, message: msg };
  };

  // Admin Verification Toggle
  const verifyUserAccount = (userId: string, isVerified: boolean) => {
    const verifiedAt = isVerified ? new Date().toLocaleString('bn-BD') : undefined;
    updateDoc(doc(db, 'users', userId), {
      isVerified,
      verifiedAt: verifiedAt || null
    }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    });

    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? ({ ...prev, isVerified, verifiedAt }) : null);
    }
    showToast(isVerified ? 'ইউজারের একাউন্ট সফলভাবে Verified করা হয়েছে!' : 'ইউজারের ভেরিফিকেশন বাতিল করা হয়েছে।');
  };

  // Admin set VIP Level
  const setUserVipLevel = (userId: string, vipLevel: number) => {
    updateDoc(doc(db, 'users', userId), {
      vipLevel
    }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    });
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? ({ ...prev, vipLevel }) : null);
    }
    showToast(`ইউজারের VIP লেভেল সফলভাবে VIP ${vipLevel} হিসেবে আপডেট করা হয়েছে!`);
  };

  // Admin Actions: Withdrawals
  const approveWithdraw = (requestId: string) => {
    updateDoc(doc(db, 'withdraw_requests', requestId), {
      status: 'approved',
      processedAt: new Date().toLocaleString('bn-BD'),
      adminNote: 'এডমিন কর্তৃক পেমেন্ট সফলভাবে পাঠানো হয়েছে।'
    }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `withdraw_requests/${requestId}`);
    });
    showToast('উইথড্র রিকোয়েস্ট সফলভাবে Approved করা হয়েছে!');
  };

  const rejectWithdraw = (requestId: string, reason = 'ভুল নম্বর বা তথ্যের কারণে বাতিল') => {
    const req = withdrawRequests.find(r => r.id === requestId);
    if (!req) return;

    // Refund money to user
    const targetUser = users.find(u => u.id === req.userId);
    if (targetUser) {
      const refundBal = +(targetUser.balance + req.amount).toFixed(2);
      updateDoc(doc(db, 'users', req.userId), {
        balance: refundBal
      }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `users/${req.userId}`);
      });
      if (currentUser?.id === req.userId) {
        setCurrentUser(prev => prev ? ({ ...prev, balance: refundBal }) : null);
      }
    }

    updateDoc(doc(db, 'withdraw_requests', requestId), {
      status: 'rejected',
      processedAt: new Date().toLocaleString('bn-BD'),
      adminNote: reason
    }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `withdraw_requests/${requestId}`);
    });
    showToast('উইথড্র রিকোয়েস্ট Rejected করা হয়েছে এবং টাকা ব্যালেন্সে ফেরত দেওয়া হয়েছে!');
  };

  // Admin Actions: Deposits
  const approveDeposit = (requestId: string) => {
    const req = depositRequests.find(r => r.id === requestId);
    if (!req) return;

    const targetUser = users.find(u => u.id === req.userId);
    if (targetUser) {
      const newBal = +(targetUser.balance + req.amount).toFixed(2);
      const isVer = req.isVerificationDeposit ? true : targetUser.isVerified;
      const verAt = req.isVerificationDeposit ? new Date().toLocaleString('bn-BD') : targetUser.verifiedAt;

      updateDoc(doc(db, 'users', req.userId), {
        balance: newBal,
        isVerified: isVer,
        verifiedAt: verAt || null
      }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `users/${req.userId}`);
      });

      if (currentUser?.id === req.userId) {
        setCurrentUser(prev => prev ? ({ ...prev, balance: newBal, isVerified: isVer, verifiedAt: verAt }) : null);
      }
    }

    updateDoc(doc(db, 'deposit_requests', requestId), {
      status: 'approved',
      processedAt: new Date().toLocaleString('bn-BD'),
      adminNote: 'এডমিন কর্তৃক ডিপোজিট অনুমোদিত হয়েছে।'
    }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `deposit_requests/${requestId}`);
    });

    showToast(`ডিপোজিট অনুমোদিত! ৳${req.amount.toFixed(2)} ইউজারের একাউন্টে যোগ হয়েছে${req.isVerificationDeposit ? ' এবং একাউন্ট ভেরিফাইড হয়েছে' : ''}।`);
  };

  const rejectDeposit = (requestId: string, reason = 'ভুল ট্রানজেকশন আইডি বা টাকা পাওয়া যায়নি') => {
    updateDoc(doc(db, 'deposit_requests', requestId), {
      status: 'rejected',
      processedAt: new Date().toLocaleString('bn-BD'),
      adminNote: reason
    }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `deposit_requests/${requestId}`);
    });
    showToast('ডিপোজিট রিকোয়েস্ট Rejected করা হয়েছে।');
  };

  const addTask = (newTaskData: Omit<TaskItem, 'id' | 'completedCount'>) => {
    const newId = `t-${Date.now()}`;
    const newTask: TaskItem = {
      ...newTaskData,
      id: newId,
      completedCount: 0
    };
    setDoc(doc(db, 'tasks', newId), newTask).catch(err => {
      handleFirestoreError(err, OperationType.CREATE, `tasks/${newId}`);
    });
    showToast('নতুন টাস্ক যুক্ত করা হয়েছে!');
  };

  const updateTask = (updatedTask: TaskItem) => {
    updateDoc(doc(db, 'tasks', updatedTask.id), updatedTask as any).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `tasks/${updatedTask.id}`);
    });
    showToast('টাস্ক আপডেট সম্পন্ন হয়েছে!');
  };

  const deleteTask = (taskId: string) => {
    deleteDoc(doc(db, 'tasks', taskId)).catch(err => {
      handleFirestoreError(err, OperationType.DELETE, `tasks/${taskId}`);
    });
    showToast('টাস্ক ডিলিট করা হয়েছে!');
  };

  const updateSettings = (newSettings: Partial<AdminSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    updateDoc(doc(db, 'settings', 'global'), newSettings).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, 'settings/global');
    });
    showToast('সেটিংস সফলভাবে ফায়ারবেসে সেভ করা হয়েছে!');
  };

  const adjustUserBalance = (userId: string, deltaAmount: number, reason: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      const newBal = Math.max(0, +(targetUser.balance + deltaAmount).toFixed(2));
      updateDoc(doc(db, 'users', userId), { balance: newBal }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
      });
      if (currentUser?.id === userId) {
        setCurrentUser(prev => prev ? ({ ...prev, balance: newBal }) : null);
      }
      showToast(`ব্যালেন্স সমন্বয় করা হয়েছে (${deltaAmount >= 0 ? '+' : ''}${deltaAmount} ৳): ${reason}`);
    }
  };

  const toggleUserStatus = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      const nextStatus = targetUser.status === 'active' ? 'banned' : 'active';
      updateDoc(doc(db, 'users', userId), { status: nextStatus }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
      });
      if (currentUser?.id === userId) {
        setCurrentUser(prev => prev ? ({ ...prev, status: nextStatus }) : null);
      }
      showToast('ইউজারের স্ট্যাটাস পরিবর্তন করা হয়েছে!');
    }
  };

  const resetToDefaults = () => {
    setCurrentUser(null);
    localStorage.clear();
    showToast('লোকাল সেশন ক্লিয়ার করা হয়েছে!');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        tasks,
        taskHistory,
        withdrawRequests,
        depositRequests,
        settings,
        liveNotifications,
        activeTab,
        setActiveTab,
        isSidebarOpen,
        setIsSidebarOpen,
        isAdminOpen,
        setIsAdminOpen,
        currentModal,
        setCurrentModal,
        login,
        register,
        logout,
        switchUser,
        completeTask,
        claimDailyBonus,
        spinWheelReward,
        purchaseVipPlan,
        claimDailyVipIncome,
        submitWithdraw,
        submitDeposit,
        checkAdminPin,
        verifyUserAccount,
        setUserVipLevel,
        approveWithdraw,
        rejectWithdraw,
        approveDeposit,
        rejectDeposit,
        addTask,
        updateTask,
        deleteTask,
        updateSettings,
        adjustUserBalance,
        toggleUserStatus,
        resetToDefaults,
        toastMessage,
        showToast,
        isFirebaseSyncing
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
