'use client';

import { motion } from 'framer-motion';
import { useStore, achievements as achievementData } from '@/lib/store';
import { Lock, Trophy } from 'lucide-react';
import { useHydrated } from '@/lib/useHydrated';
import { useRequireAuth } from '@/components/auth/RequireAuth';

export default function AchievementsPage() {
  const { progress } = useStore();
  const hydrated = useHydrated();
  const { authenticated, loading } = useRequireAuth();

  const allAchievements = Object.entries(achievementData);

  if (!hydrated || loading || !authenticated) {
    return (
      <div className="min-h-screen particle-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen particle-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">🏆 Achievements</h1>
          <p className="text-foreground/50 mb-2">
            {progress.achievements.length}/{allAchievements.length} unlocked
          </p>
          <div className="h-2 bg-surface-light rounded-full overflow-hidden mb-8 max-w-xs">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-warning to-warning"
              initial={{ width: 0 }}
              animate={{
                width: `${(progress.achievements.length / allAchievements.length) * 100}%`,
              }}
              transition={{ duration: 1 }}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {allAchievements.map(([id, ach], i) => {
            const unlocked = progress.achievements.includes(id);

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass rounded-xl p-5 flex items-center gap-4 transition-all ${
                  unlocked ? 'border-warning/20' : 'opacity-50'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    unlocked ? 'bg-warning/10' : 'bg-surface-light'
                  }`}
                >
                  {unlocked ? ach.icon : <Lock className="w-5 h-5 text-foreground/30" />}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{ach.title}</h3>
                  <p className="text-xs text-foreground/40">{ach.description}</p>
                  {unlocked && (
                    <span className="text-xs text-warning mt-1 inline-block">
                      +100 XP
                    </span>
                  )}
                </div>
                {unlocked && (
                  <Trophy className="w-4 h-4 text-warning ml-auto shrink-0" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* XP Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 glass rounded-xl p-6 text-center"
        >
          <p className="text-foreground/50 mb-2">Total Experience Points</p>
          <p className="text-4xl font-bold gradient-text">{progress.xp} XP</p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-foreground/40">
            <span>📚 Lessons: {progress.completedLessons.length * 50} XP</span>
            <span>🏆 Achievements: {progress.achievements.length * 100} XP</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
