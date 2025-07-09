export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'TRADING' | 'EDUCATIONAL' | 'ENGAGEMENT' | 'REFERRAL';
  reward: number;
  requirements: {
    trades?: number;
    profit?: number;
    quizScore?: number;
    daysActive?: number;
    referrals?: number;
  };
  timeLimit?: number; // in hours
  isDaily?: boolean;
  isCompleted?: boolean;
  completedAt?: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  reward: number;
  passingScore: number;
  isCompleted?: boolean;
  score?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: number;
  requirement: {
    type: 'TRADES_COUNT' | 'PROFIT_AMOUNT' | 'DAYS_ACTIVE' | 'TASKS_COMPLETED' | 'QUIZ_SCORE';
    value: number;
  };
  isUnlocked?: boolean;
  unlockedAt?: number;
}

export interface UserRewards {
  totalEarnings: number;
  availableBalance: number;
  pendingWithdrawal: number;
  completedTasks: string[];
  completedQuizzes: string[];
  unlockedAchievements: string[];
  dailyStreak: number;
  lastActiveDate: string;
  referralCode: string;
  referredUsers: string[];
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  method: 'PAYPAL' | 'BANK_TRANSFER' | 'CRYPTO';
  details: {
    email?: string;
    bankAccount?: string;
    cryptoAddress?: string;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  requestedAt: number;
  processedAt?: number;
  notes?: string;
}