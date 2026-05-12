import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProgress {
  completedLessons: string[]; // "moduleId/lessonId"
  quizScores: Record<string, number>; // moduleId -> score
  xp: number;
  streak: number;
  lastActiveDate: string;
  achievements: string[];
}

interface AppState {
  user: { name: string; email: string; photoURL: string } | null;
  progress: UserProgress;
  isChatOpen: boolean;
  
  setUser: (user: AppState['user']) => void;
  setProgress: (progress: UserProgress) => void;
  completeLesson: (moduleId: string, lessonId: string) => void;
  setQuizScore: (moduleId: string, score: number) => void;
  addXP: (amount: number) => void;
  addAchievement: (id: string) => void;
  toggleChat: () => void;
  updateStreak: () => void;
  getCompletionPercentage: () => number;
  isLessonComplete: (moduleId: string, lessonId: string) => boolean;
  reset: () => void;
}

const initialProgress: UserProgress = {
  completedLessons: [],
  quizScores: {},
  xp: 0,
  streak: 0,
  lastActiveDate: '',
  achievements: [],
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      progress: initialProgress,
      isChatOpen: false,
      _hasHydrated: false,

      setUser: (user) => set({ user }),

      setProgress: (progress) => set({ progress }),

      completeLesson: (moduleId, lessonId) => {
        const key = `${moduleId}/${lessonId}`;
        const state = get();
        if (state.progress.completedLessons.includes(key)) return;
        
        set({
          progress: {
            ...state.progress,
            completedLessons: [...state.progress.completedLessons, key],
            xp: state.progress.xp + 50,
          },
        });

        // Check achievements
        const newCompleted = state.progress.completedLessons.length + 1;
        if (newCompleted === 1) get().addAchievement('first-lesson');
        if (newCompleted === 5) get().addAchievement('five-lessons');
        if (newCompleted >= 12) get().addAchievement('all-lessons');
      },

      setQuizScore: (moduleId, score) => {
        const state = get();
        const prevScore = state.progress.quizScores[moduleId] || 0;
        const xpGain = score > prevScore ? (score - prevScore) * 20 : 0;
        
        set({
          progress: {
            ...state.progress,
            quizScores: { ...state.progress.quizScores, [moduleId]: Math.max(prevScore, score) },
            xp: state.progress.xp + xpGain,
          },
        });

        if (score === 100) get().addAchievement(`perfect-${moduleId}`);
      },

      addXP: (amount) => {
        const state = get();
        set({ progress: { ...state.progress, xp: state.progress.xp + amount } });
      },

      addAchievement: (id) => {
        const state = get();
        if (state.progress.achievements.includes(id)) return;
        set({
          progress: {
            ...state.progress,
            achievements: [...state.progress.achievements, id],
            xp: state.progress.xp + 100,
          },
        });
      },

      toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

      updateStreak: () => {
        const state = get();
        if (!state.user) return;
        const today = new Date().toISOString().split('T')[0];
        const lastActive = state.progress.lastActiveDate;
        
        if (lastActive === today) return;
        
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const newStreak = lastActive === yesterday ? state.progress.streak + 1 : 1;
        
        set({
          progress: {
            ...state.progress,
            streak: newStreak,
            lastActiveDate: today,
          },
        });

        if (newStreak >= 3) get().addAchievement('streak-3');
        if (newStreak >= 7) get().addAchievement('streak-7');
      },

      getCompletionPercentage: () => {
        const state = get();
        const totalLessons = 12; // total across all modules
        return Math.round((state.progress.completedLessons.length / totalLessons) * 100);
      },

      isLessonComplete: (moduleId, lessonId) => {
        return get().progress.completedLessons.includes(`${moduleId}/${lessonId}`);
      },

      reset: () => set({ progress: initialProgress, user: null }),
    }),
    {
      name: 'linearmind-storage',
      skipHydration: true,
    }
  )
);

export const achievements: Record<string, { title: string; description: string; icon: string }> = {
  'first-lesson': { title: 'First Step', description: 'Complete your first lesson', icon: '🎉' },
  'five-lessons': { title: 'Knowledge Seeker', description: 'Complete 5 lessons', icon: '📚' },
  'all-lessons': { title: 'Regression Master', description: 'Complete all lessons', icon: '🏆' },
  'streak-3': { title: 'On Fire', description: '3-day learning streak', icon: '🔥' },
  'streak-7': { title: 'Unstoppable', description: '7-day learning streak', icon: '⚡' },
  'perfect-intro': { title: 'Perfect Start', description: 'Score 100% on Introduction quiz', icon: '⭐' },
  'perfect-math': { title: 'Math Wizard', description: 'Score 100% on Mathematics quiz', icon: '🧙' },
  'perfect-cost': { title: 'MSE Slayer', description: 'Score 100% on Cost Function quiz', icon: '⚔️' },
  'perfect-gradient': { title: 'Gradient Master', description: 'Score 100% on Gradient Descent quiz', icon: '🎯' },
  'perfect-failures': { title: 'Failure Expert', description: 'Score 100% on Failure Cases quiz', icon: '🛡️' },
};
