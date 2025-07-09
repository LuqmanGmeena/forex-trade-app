import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FirebaseService } from '../services/firebaseService';
import { Trade } from '../types/trading';
import { UserRewards, WithdrawalRequest } from '../types/rewards';

export const useFirebaseSync = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncUserData = async () => {
    if (!user || !isOnline) return;

    setSyncStatus('syncing');
    try {
      // Sync user data
      const localUserData = localStorage.getItem(`user_${user.id}`);
      if (localUserData) {
        await FirebaseService.saveUserData(user.id, JSON.parse(localUserData));
      }

      // Sync trades
      const localTrades = localStorage.getItem(`trades_${user.id}`);
      if (localTrades) {
        const trades: Trade[] = JSON.parse(localTrades);
        for (const trade of trades) {
          await FirebaseService.saveTrade(user.id, trade);
        }
      }

      // Sync rewards
      const localRewards = localStorage.getItem(`rewards_${user.id}`);
      if (localRewards) {
        await FirebaseService.saveUserRewards(user.id, JSON.parse(localRewards));
      }

      // Sync withdrawals
      const localWithdrawals = localStorage.getItem(`withdrawals_${user.id}`);
      if (localWithdrawals) {
        const withdrawals: WithdrawalRequest[] = JSON.parse(localWithdrawals);
        for (const withdrawal of withdrawals) {
          await FirebaseService.saveWithdrawalRequest(user.id, withdrawal);
        }
      }

      setSyncStatus('idle');
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
    }
  };

  const loadFromFirebase = async () => {
    if (!user || !isOnline) return;

    try {
      // Load trades from Firebase
      const trades = await FirebaseService.getUserTrades(user.id);
      if (trades.length > 0) {
        localStorage.setItem(`trades_${user.id}`, JSON.stringify(trades));
      }

      // Load rewards from Firebase
      const rewards = await FirebaseService.getUserRewards(user.id);
      if (rewards) {
        localStorage.setItem(`rewards_${user.id}`, JSON.stringify(rewards));
      }

      // Load withdrawals from Firebase
      const withdrawals = await FirebaseService.getUserWithdrawals(user.id);
      if (withdrawals.length > 0) {
        localStorage.setItem(`withdrawals_${user.id}`, JSON.stringify(withdrawals));
      }
    } catch (error) {
      console.error('Load from Firebase error:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isOnline) {
      loadFromFirebase();
    }
  }, [isAuthenticated, isOnline]);

  return {
    isOnline,
    syncStatus,
    syncUserData,
    loadFromFirebase
  };
};

export const useRealtimeData = () => {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    // Subscribe to real-time trades
    const unsubscribeTrades = FirebaseService.subscribeToUserTrades(user.id, setTrades);

    // Subscribe to real-time user data
    const unsubscribeUser = FirebaseService.subscribeToUserData(user.id, setUserData);

    return () => {
      unsubscribeTrades();
      unsubscribeUser();
    };
  }, [user]);

  return { trades, userData };
};