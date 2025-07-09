import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Task, Quiz, Achievement, UserRewards, WithdrawalRequest } from '../types/rewards';
import { tasksData, quizzesData, achievementsData } from '../data/rewardsData';

interface RewardsContextType {
  userRewards: UserRewards;
  tasks: Task[];
  quizzes: Quiz[];
  achievements: Achievement[];
  withdrawalRequests: WithdrawalRequest[];
  completeTask: (taskId: string) => void;
  completeQuiz: (quizId: string, score: number) => void;
  unlockAchievement: (achievementId: string) => void;
  requestWithdrawal: (amount: number, method: string, details: any) => void;
  addEarnings: (amount: number, source: string) => void;
  updateDailyStreak: () => void;
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

export const useRewards = () => {
  const context = useContext(RewardsContext);
  if (context === undefined) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
};

export const RewardsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [userRewards, setUserRewards] = useState<UserRewards>({
    totalEarnings: 0,
    availableBalance: 0,
    pendingWithdrawal: 0,
    completedTasks: [],
    completedQuizzes: [],
    unlockedAchievements: [],
    dailyStreak: 0,
    lastActiveDate: '',
    referralCode: '',
    referredUsers: []
  });
  const [tasks, setTasks] = useState<Task[]>(tasksData);
  const [quizzes, setQuizzes] = useState<Quiz[]>(quizzesData);
  const [achievements, setAchievements] = useState<Achievement[]>(achievementsData);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);

  // Load user rewards data
  useEffect(() => {
    if (isAuthenticated && user) {
      const storedRewards = localStorage.getItem(`rewards_${user.id}`);
      if (storedRewards) {
        const rewards = JSON.parse(storedRewards);
        setUserRewards(rewards);
        
        // Generate referral code if not exists
        if (!rewards.referralCode) {
          const referralCode = `REF${user.id.slice(-6).toUpperCase()}`;
          setUserRewards(prev => ({ ...prev, referralCode }));
        }
      } else {
        // Initialize new user rewards
        const referralCode = `REF${user.id.slice(-6).toUpperCase()}`;
        const initialRewards: UserRewards = {
          totalEarnings: 0,
          availableBalance: 0,
          pendingWithdrawal: 0,
          completedTasks: [],
          completedQuizzes: [],
          unlockedAchievements: [],
          dailyStreak: 0,
          lastActiveDate: new Date().toDateString(),
          referralCode,
          referredUsers: []
        };
        setUserRewards(initialRewards);
      }

      // Load withdrawal requests
      const storedWithdrawals = localStorage.getItem(`withdrawals_${user.id}`);
      if (storedWithdrawals) {
        setWithdrawalRequests(JSON.parse(storedWithdrawals));
      }
    }
  }, [isAuthenticated, user]);

  // Save rewards data when it changes
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`rewards_${user.id}`, JSON.stringify(userRewards));
    }
  }, [userRewards, isAuthenticated, user]);

  // Update tasks with completion status
  useEffect(() => {
    setTasks(prev => prev.map(task => ({
      ...task,
      isCompleted: userRewards.completedTasks.includes(task.id)
    })));
  }, [userRewards.completedTasks]);

  // Update quizzes with completion status
  useEffect(() => {
    setQuizzes(prev => prev.map(quiz => ({
      ...quiz,
      isCompleted: userRewards.completedQuizzes.includes(quiz.id)
    })));
  }, [userRewards.completedQuizzes]);

  // Update achievements with unlock status
  useEffect(() => {
    setAchievements(prev => prev.map(achievement => ({
      ...achievement,
      isUnlocked: userRewards.unlockedAchievements.includes(achievement.id)
    })));
  }, [userRewards.unlockedAchievements]);

  const completeTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !userRewards.completedTasks.includes(taskId)) {
      setUserRewards(prev => ({
        ...prev,
        completedTasks: [...prev.completedTasks, taskId],
        totalEarnings: prev.totalEarnings + task.reward,
        availableBalance: prev.availableBalance + task.reward
      }));
    }
  };

  const completeQuiz = (quizId: string, score: number) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (quiz && !userRewards.completedQuizzes.includes(quizId) && score >= quiz.passingScore) {
      setUserRewards(prev => ({
        ...prev,
        completedQuizzes: [...prev.completedQuizzes, quizId],
        totalEarnings: prev.totalEarnings + quiz.reward,
        availableBalance: prev.availableBalance + quiz.reward
      }));
    }
  };

  const unlockAchievement = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !userRewards.unlockedAchievements.includes(achievementId)) {
      setUserRewards(prev => ({
        ...prev,
        unlockedAchievements: [...prev.unlockedAchievements, achievementId],
        totalEarnings: prev.totalEarnings + achievement.reward,
        availableBalance: prev.availableBalance + achievement.reward
      }));
    }
  };

  const requestWithdrawal = (amount: number, method: string, details: any) => {
    if (amount <= userRewards.availableBalance && user) {
      const request: WithdrawalRequest = {
        id: Date.now().toString(),
        userId: user.id,
        amount,
        method: method as any,
        details,
        status: 'PENDING',
        requestedAt: Date.now()
      };

      setWithdrawalRequests(prev => [...prev, request]);
      setUserRewards(prev => ({
        ...prev,
        availableBalance: prev.availableBalance - amount,
        pendingWithdrawal: prev.pendingWithdrawal + amount
      }));

      localStorage.setItem(`withdrawals_${user.id}`, JSON.stringify([...withdrawalRequests, request]));
    }
  };

  const addEarnings = (amount: number, source: string) => {
    setUserRewards(prev => ({
      ...prev,
      totalEarnings: prev.totalEarnings + amount,
      availableBalance: prev.availableBalance + amount
    }));
  };

  const updateDailyStreak = () => {
    const today = new Date().toDateString();
    const lastActive = new Date(userRewards.lastActiveDate);
    const todayDate = new Date(today);
    const daysDiff = Math.floor((todayDate.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      // Consecutive day
      setUserRewards(prev => ({
        ...prev,
        dailyStreak: prev.dailyStreak + 1,
        lastActiveDate: today
      }));
    } else if (daysDiff > 1) {
      // Streak broken
      setUserRewards(prev => ({
        ...prev,
        dailyStreak: 1,
        lastActiveDate: today
      }));
    } else if (userRewards.lastActiveDate !== today) {
      // Same day, first login
      setUserRewards(prev => ({
        ...prev,
        lastActiveDate: today
      }));
    }
  };

  return (
    <RewardsContext.Provider
      value={{
        userRewards,
        tasks,
        quizzes,
        achievements,
        withdrawalRequests,
        completeTask,
        completeQuiz,
        unlockAchievement,
        requestWithdrawal,
        addEarnings,
        updateDailyStreak
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
};