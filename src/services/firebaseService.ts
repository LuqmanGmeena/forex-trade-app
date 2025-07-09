import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Trade } from '../types/trading';
import { WithdrawalRequest, UserRewards } from '../types/rewards';

export class FirebaseService {
  // User Data Management
  static async saveUserData(userId: string, data: any) {
    try {
      await setDoc(doc(db, 'users', userId), {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  }

  static async getUserData(userId: string) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Trading Data Management
  static async saveTrade(userId: string, trade: Trade) {
    try {
      await setDoc(doc(db, 'trades', trade.id), {
        ...trade,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error saving trade:', error);
      return false;
    }
  }

  static async getUserTrades(userId: string): Promise<Trade[]> {
    try {
      const tradesQuery = query(
        collection(db, 'trades'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(tradesQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trade));
    } catch (error) {
      console.error('Error getting user trades:', error);
      return [];
    }
  }

  static async updateTrade(tradeId: string, updates: Partial<Trade>) {
    try {
      await updateDoc(doc(db, 'trades', tradeId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating trade:', error);
      return false;
    }
  }

  // Rewards Data Management
  static async saveUserRewards(userId: string, rewards: UserRewards) {
    try {
      await setDoc(doc(db, 'rewards', userId), {
        ...rewards,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error saving rewards:', error);
      return false;
    }
  }

  static async getUserRewards(userId: string): Promise<UserRewards | null> {
    try {
      const rewardsDoc = await getDoc(doc(db, 'rewards', userId));
      return rewardsDoc.exists() ? rewardsDoc.data() as UserRewards : null;
    } catch (error) {
      console.error('Error getting rewards:', error);
      return null;
    }
  }

  // Withdrawal Management
  static async saveWithdrawalRequest(userId: string, withdrawal: WithdrawalRequest) {
    try {
      await setDoc(doc(db, 'withdrawals', withdrawal.id), {
        ...withdrawal,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error saving withdrawal:', error);
      return false;
    }
  }

  static async getUserWithdrawals(userId: string): Promise<WithdrawalRequest[]> {
    try {
      const withdrawalsQuery = query(
        collection(db, 'withdrawals'),
        where('userId', '==', userId),
        orderBy('requestedAt', 'desc')
      );
      const snapshot = await getDocs(withdrawalsQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WithdrawalRequest));
    } catch (error) {
      console.error('Error getting withdrawals:', error);
      return [];
    }
  }

  static async updateWithdrawalStatus(withdrawalId: string, status: string, notes?: string) {
    try {
      await updateDoc(doc(db, 'withdrawals', withdrawalId), {
        status,
        notes,
        processedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating withdrawal:', error);
      return false;
    }
  }

  // Admin Functions
  static async getAllUsers() {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  static async getAllTrades() {
    try {
      const tradesSnapshot = await getDocs(
        query(collection(db, 'trades'), orderBy('timestamp', 'desc'))
      );
      return tradesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting all trades:', error);
      return [];
    }
  }

  static async getAllWithdrawals() {
    try {
      const withdrawalsSnapshot = await getDocs(
        query(collection(db, 'withdrawals'), orderBy('requestedAt', 'desc'))
      );
      return withdrawalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting all withdrawals:', error);
      return [];
    }
  }

  // File Upload
  static async uploadFile(file: File, path: string): Promise<string | null> {
    try {
      const fileRef = ref(storage, path);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }

  static async deleteFile(path: string): Promise<boolean> {
    try {
      const fileRef = ref(storage, path);
      await deleteObject(fileRef);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  // Real-time listeners
  static subscribeToUserData(userId: string, callback: (data: any) => void) {
    return onSnapshot(doc(db, 'users', userId), (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      }
    });
  }

  static subscribeToUserTrades(userId: string, callback: (trades: Trade[]) => void) {
    const tradesQuery = query(
      collection(db, 'trades'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    return onSnapshot(tradesQuery, (snapshot) => {
      const trades = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trade));
      callback(trades);
    });
  }

  // Analytics and Logging
  static async logUserActivity(userId: string, activity: string, metadata?: any) {
    try {
      await setDoc(doc(collection(db, 'userActivity')), {
        userId,
        activity,
        metadata,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }
}