import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types/auth';
import { auth, db } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  updateUserProfile: (data: { firstName?: string; lastName?: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            firstName: userData.firstName,
            lastName: userData.lastName,
            createdAt: userData.createdAt || Date.now()
          };
          
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Also store in localStorage for compatibility
          localStorage.setItem('forex_user', JSON.stringify(user));
        } else {
          // Create user document if it doesn't exist
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
            lastName: firebaseUser.displayName?.split(' ')[1] || '',
            createdAt: Date.now()
          };
          
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            createdAt: serverTimestamp(),
          });
          
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          
          localStorage.setItem('forex_user', JSON.stringify(user));
        }
      } else {
        // Fallback to localStorage for demo users
        const storedUser = localStorage.getItem('forex_user');
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            localStorage.removeItem('forex_user');
            setAuthState(prev => ({ ...prev, isLoading: false }));
          }
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // First try Firebase authentication
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return true;
      } catch (firebaseError) {
        // Fallback to localStorage for demo users
        const storedUsers = JSON.parse(localStorage.getItem('forex_users') || '[]');
        const user = storedUsers.find((u: any) => u.email === email && u.password === password);
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          setAuthState({
            user: userWithoutPassword,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem('forex_user', JSON.stringify(userWithoutPassword));
          return true;
        }
        
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<boolean> => {
    try {
      // Try Firebase registration first
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        
        // Store additional user data in Firestore
        const userDoc = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          isActive: true,
          role: isAdmin ? "admin" : "user"
        };
        
        await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
        
        // Update Firebase Auth profile
        await updateProfile(userCredential.user, {
          displayName: `${userData.firstName} ${userData.lastName}`
        });
        
        return true;
      } catch (firebaseError) {
        // Fallback to localStorage
        const storedUsers = JSON.parse(localStorage.getItem('forex_users') || '[]');
        
        // Check if user already exists
        if (storedUsers.some((u: any) => u.email === userData.email)) {
          return false;
        }
        
        // Create new user
        const newUser = {
          id: Date.now().toString(),
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          createdAt: Date.now(),
        };
        
        // Store user
        storedUsers.push(newUser);
        localStorage.setItem('forex_users', JSON.stringify(storedUsers));
        
        // Auto-login after registration
        const { password: _, ...userWithoutPassword } = newUser;
        setAuthState({
          user: userWithoutPassword,
          isAuthenticated: true,
          isLoading: false,
        });
        localStorage.setItem('forex_user', JSON.stringify(userWithoutPassword));
        
        return true;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem('forex_user');
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    }
  };

  const updateUserProfile = async (data: { firstName?: string; lastName?: string }): Promise<boolean> => {
    try {
      if (auth.currentUser && authState.user) {
        // Update Firestore
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
          ...data,
          updatedAt: serverTimestamp()
        }, { merge: true });
        
        // Update Firebase Auth profile
        if (data.firstName || data.lastName) {
          const displayName = `${data.firstName || authState.user.firstName} ${data.lastName || authState.user.lastName}`;
          await updateProfile(auth.currentUser, { displayName });
        }
        
        // Update local state
        const updatedUser = { ...authState.user, ...data };
        setAuthState(prev => ({ ...prev, user: updatedUser }));
        localStorage.setItem('forex_user', JSON.stringify(updatedUser));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };
  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        resetPassword,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};