import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface UserProgress {
  completedLessons: string[];
  quizScores: Record<string, number>;
  xp: number;
  streak: number;
  lastActiveDate: string;
  achievements: string[];
}

export async function loadUserProgress(uid: string): Promise<UserProgress | null> {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProgress;
    }
    return null;
  } catch (error) {
    console.error('Error loading progress:', error);
    return null;
  }
}

export async function saveUserProgress(uid: string, progress: UserProgress): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, {
      completedLessons: progress.completedLessons,
      quizScores: progress.quizScores,
      xp: progress.xp,
      streak: progress.streak,
      lastActiveDate: progress.lastActiveDate,
      achievements: progress.achievements,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}
