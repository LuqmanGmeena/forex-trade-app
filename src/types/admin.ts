export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR';
  permissions: AdminPermission[];
  createdAt: number;
}

export interface AdminPermission {
  id: string;
  name: string;
  description: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalTrades: number;
  totalRewardsEarned: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
}

export interface PaymentStats {
  totalPaid: number;
  pendingAmount: number;
  rejectedAmount: number;
  averageWithdrawal: number;
  topEarners: UserEarning[];
}

export interface UserEarning {
  userId: string;
  userName: string;
  totalEarned: number;
  availableBalance: number;
  pendingWithdrawal: number;
}

export interface AdminSettings {
  minWithdrawal: number;
  maxWithdrawal: number;
  withdrawalFee: number;
  taskRewardMultiplier: number;
  quizRewardMultiplier: number;
  achievementRewardMultiplier: number;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
}