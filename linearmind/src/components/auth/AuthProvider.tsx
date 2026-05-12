'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useStore } from '@/lib/store';
import { loadUserProgress, saveUserProgress } from '@/lib/firestore';

interface AuthContextType {
  firebaseUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setUser, setProgress, progress } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        setUser({
          name: user.displayName || 'User',
          email: user.email || '',
          photoURL: user.photoURL || '',
        });
        // Load progress from Firestore
        const savedProgress = await loadUserProgress(user.uid);
        if (savedProgress) {
          setProgress(savedProgress);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setProgress]);

  // Save progress to Firestore whenever it changes (debounced)
  useEffect(() => {
    if (!firebaseUser) return;
    const timeout = setTimeout(() => {
      saveUserProgress(firebaseUser.uid, progress);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [firebaseUser, progress]);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
