import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { AdminUser, UserStats, PaymentStats, AdminSettings, UserEarning } from '../types/admin';
import { WithdrawalRequest } from '../types/rewards';

interface AdminContextType {
  isAdmin: boolean;
  adminUser: AdminUser | null;
  userStats: UserStats;
  paymentStats: PaymentStats;
  adminSettings: AdminSettings;
  allWithdrawals: WithdrawalRequest[];
  allUsers: UserEarning[];
  allTrades: any[];
  loginAsAdmin: (email: string, password: string) => Promise<boolean>;
  updateWithdrawalStatus: (withdrawalId: string, status: string, notes?: string) => void;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
  exportUserData: () => void;
  exportPaymentData: () => void;
  exportTradingData: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    totalTrades: 0,
    totalRewardsEarned: 0,
    totalWithdrawals: 0,
    pendingWithdrawals: 0
  });
  const [paymentStats, setPaymentStats] = useState<PaymentStats>({
    totalPaid: 0,
    pendingAmount: 0,
    rejectedAmount: 0,
    averageWithdrawal: 0,
    topEarners: []
  });
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    minWithdrawal: 10,
    maxWithdrawal: 10000,
    withdrawalFee: 0,
    taskRewardMultiplier: 1,
    quizRewardMultiplier: 1,
    achievementRewardMultiplier: 1,
    maintenanceMode: false,
    registrationEnabled: true
  });
  const [allWithdrawals, setAllWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [allUsers, setAllUsers] = useState<UserEarning[]>([]);
  const [allTrades, setAllTrades] = useState<any[]>([]);

  // Initialize admin system
  useEffect(() => {
    // Create default admin user
    const adminUsers = JSON.parse(localStorage.getItem('admin_users') || '[]');
    if (adminUsers.length === 0) {
      const defaultAdmin: AdminUser = {
        id: 'admin-1',
        email: 'admin@forextrade.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'SUPER_ADMIN',
        permissions: [
          { id: 'manage_users', name: 'Manage Users', description: 'View and manage user accounts' },
          { id: 'manage_payments', name: 'Manage Payments', description: 'Process withdrawals and payments' },
          { id: 'view_analytics', name: 'View Analytics', description: 'Access platform analytics' },
          { id: 'manage_settings', name: 'Manage Settings', description: 'Update platform settings' },
          { id: 'manage_trading', name: 'Manage Trading', description: 'Monitor trading activities' }
        ],
        createdAt: Date.now()
      };
      adminUsers.push(defaultAdmin);
      localStorage.setItem('admin_users', JSON.stringify(adminUsers));
      localStorage.setItem('admin_passwords', JSON.stringify([
        { email: 'admin@forextrade.com', password: 'admin123' }
      ]));
    }

    // Load admin settings
    const savedSettings = localStorage.getItem('admin_settings');
    if (savedSettings) {
      setAdminSettings(JSON.parse(savedSettings));
    }

    loadStats();
  }, []);

  const loadStats = () => {
    // Load all user data
    const allUsersData = JSON.parse(localStorage.getItem('forex_users') || '[]');
    const today = new Date().toDateString();
    
    // Calculate user stats
    const newUsersToday = allUsersData.filter((u: any) => 
      new Date(u.createdAt).toDateString() === today
    ).length;

    // Load all rewards data
    const allRewardsData: UserEarning[] = [];
    let totalRewardsEarned = 0;
    let totalTrades = 0;
    const allTradesData: any[] = [];

    allUsersData.forEach((userData: any) => {
      const userRewards = JSON.parse(localStorage.getItem(`rewards_${userData.id}`) || '{}');
      const userTrades = JSON.parse(localStorage.getItem(`trades_${userData.id}`) || '[]');
      
      // Add user trades to admin view
      userTrades.forEach((trade: any) => {
        allTradesData.push({
          ...trade,
          userId: userData.id,
          userName: `${userData.firstName} ${userData.lastName}`,
          userEmail: userData.email
        });
      });
      
      totalTrades += userTrades.length;
      
      if (userRewards.totalEarnings) {
        allRewardsData.push({
          userId: userData.id,
          userName: `${userData.firstName} ${userData.lastName}`,
          totalEarned: userRewards.totalEarnings || 0,
          availableBalance: userRewards.availableBalance || 0,
          pendingWithdrawal: userRewards.pendingWithdrawal || 0
        });
        totalRewardsEarned += userRewards.totalEarnings || 0;
      }
    });

    // Load all withdrawals
    const allWithdrawalRequests: WithdrawalRequest[] = [];
    let totalWithdrawals = 0;
    let pendingWithdrawals = 0;
    let totalPaid = 0;
    let rejectedAmount = 0;

    allUsersData.forEach((userData: any) => {
      const userWithdrawals = JSON.parse(localStorage.getItem(`withdrawals_${userData.id}`) || '[]');
      allWithdrawalRequests.push(...userWithdrawals);
      
      userWithdrawals.forEach((w: WithdrawalRequest) => {
        if (w.status === 'COMPLETED') {
          totalPaid += w.amount;
          totalWithdrawals++;
        } else if (w.status === 'PENDING') {
          pendingWithdrawals += w.amount;
        } else if (w.status === 'REJECTED') {
          rejectedAmount += w.amount;
        }
      });
    });

    setUserStats({
      totalUsers: allUsersData.length,
      activeUsers: allUsersData.filter((u: any) => {
        const userTrades = JSON.parse(localStorage.getItem(`trades_${u.id}`) || '[]');
        return userTrades.length > 0;
      }).length,
      newUsersToday,
      totalTrades,
      totalRewardsEarned,
      totalWithdrawals,
      pendingWithdrawals: allWithdrawalRequests.filter(w => w.status === 'PENDING').length
    });

    setPaymentStats({
      totalPaid,
      pendingAmount: pendingWithdrawals,
      rejectedAmount,
      averageWithdrawal: totalWithdrawals > 0 ? totalPaid / totalWithdrawals : 0,
      topEarners: allRewardsData.sort((a, b) => b.totalEarned - a.totalEarned).slice(0, 10)
    });

    setAllWithdrawals(allWithdrawalRequests.sort((a, b) => b.requestedAt - a.requestedAt));
    setAllUsers(allRewardsData);
    setAllTrades(allTradesData.sort((a, b) => b.timestamp - a.timestamp));
  };

  const loginAsAdmin = async (email: string, password: string): Promise<boolean> => {
    const adminPasswords = JSON.parse(localStorage.getItem('admin_passwords') || '[]');
    const adminUsers = JSON.parse(localStorage.getItem('admin_users') || '[]');
    
    const adminAuth = adminPasswords.find((a: any) => a.email === email && a.password === password);
    if (adminAuth) {
      const admin = adminUsers.find((a: AdminUser) => a.email === email);
      if (admin) {
        setIsAdmin(true);
        setAdminUser(admin);
        localStorage.setItem('admin_session', JSON.stringify(admin));
        loadStats();
        return true;
      }
    }
    return false;
  };

  const updateWithdrawalStatus = (withdrawalId: string, status: string, notes?: string) => {
    // Update withdrawal in all user data
    const allUsersData = JSON.parse(localStorage.getItem('forex_users') || '[]');
    
    allUsersData.forEach((userData: any) => {
      const userWithdrawals = JSON.parse(localStorage.getItem(`withdrawals_${userData.id}`) || '[]');
      const withdrawalIndex = userWithdrawals.findIndex((w: WithdrawalRequest) => w.id === withdrawalId);
      
      if (withdrawalIndex !== -1) {
        userWithdrawals[withdrawalIndex] = {
          ...userWithdrawals[withdrawalIndex],
          status,
          processedAt: Date.now(),
          notes
        };
        localStorage.setItem(`withdrawals_${userData.id}`, JSON.stringify(userWithdrawals));
        
        // Update user rewards if rejected
        if (status === 'REJECTED') {
          const userRewards = JSON.parse(localStorage.getItem(`rewards_${userData.id}`) || '{}');
          userRewards.availableBalance += userWithdrawals[withdrawalIndex].amount;
          userRewards.pendingWithdrawal -= userWithdrawals[withdrawalIndex].amount;
          localStorage.setItem(`rewards_${userData.id}`, JSON.stringify(userRewards));
        }
      }
    });
    
    loadStats();
  };

  const updateAdminSettings = (settings: Partial<AdminSettings>) => {
    const newSettings = { ...adminSettings, ...settings };
    setAdminSettings(newSettings);
    localStorage.setItem('admin_settings', JSON.stringify(newSettings));
  };

  const exportUserData = () => {
    const data = {
      users: allUsers,
      stats: userStats,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPaymentData = () => {
    const data = {
      withdrawals: allWithdrawals,
      paymentStats,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportTradingData = () => {
    const data = {
      trades: allTrades,
      tradingStats: {
        totalTrades: allTrades.length,
        openTrades: allTrades.filter(t => t.status === 'OPEN').length,
        closedTrades: allTrades.filter(t => t.status === 'CLOSED').length,
        totalVolume: allTrades.reduce((sum, t) => sum + t.amount, 0),
        totalPnL: allTrades.reduce((sum, t) => sum + (t.pnl || 0), 0)
      },
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Check for existing admin session
  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      const admin = JSON.parse(adminSession);
      setIsAdmin(true);
      setAdminUser(admin);
      loadStats();
    }
  }, []);

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        adminUser,
        userStats,
        paymentStats,
        adminSettings,
        allWithdrawals,
        allUsers,
        allTrades,
        loginAsAdmin,
        updateWithdrawalStatus,
        updateAdminSettings,
        exportUserData,
        exportPaymentData,
        exportTradingData
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};