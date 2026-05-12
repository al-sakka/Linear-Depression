'use client';

import { motion } from 'framer-motion';
import { useStore, achievements as achievementData } from '@/lib/store';
import { Lock, Trophy, Sparkles, Zap, Star } from 'lucide-react';
import { useHydrated } from '@/lib/useHydrated';
import { useRequireAuth } from '@/components/auth/RequireAuth';
import { useState } from 'react';

export default function AchievementsPage() {
  const { progress } = useStore();
  const hydrated = useHydrated();
  const { authenticated, loading } = useRequireAuth();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const allAchievements = Object.entries(achievementData);
  const unlockedCount = progress.achievements.length;
  const totalCount = allAchievements.length;
  const percent = Math.round((unlockedCount / totalCount) * 100);

  const filtered = allAchievements.filter(([id]) => {
    if (filter === 'unlocked') return progress.achievements.includes(id);
    if (filter === 'locked') return !progress.achievements.includes(id);
    return true;
  });

  if (!hydrated || loading || !authenticated) {
    return (
      <div className="min-h-screen particle-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen particle-bg">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-10 overflow-hidden rounded-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-warning/15 via-secondary/10 to-primary/10 rounded-2xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.15),transparent_60%)]" />
          <div className="relative p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl sm:text-4xl font-bold mb-2"
                >
                  <span className="gradient-text">Achievements</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-foreground/50 text-sm sm:text-base"
                >
                  Track your milestones and earn rewards
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4"
              >
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" className="text-surface-light" strokeWidth="6" />
                    <circle
                      cx="40" cy="40" r="34"
                      fill="none"
                      stroke="url(#achGrad)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${percent * 2.136} 213.6`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="achGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{percent}%</span>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-foreground/60">{unlockedCount} of {totalCount}</p>
                  <p className="text-foreground/40">unlocked</p>
                </div>
              </motion.div>
            </div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3 mt-6"
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20 text-xs">
                <Trophy className="w-3.5 h-3.5 text-warning" />
                <span className="text-warning font-medium">{unlockedCount} Unlocked</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs">
                <Zap className="w-3.5 h-3.5 text-primary-light" />
                <span className="text-primary-light font-medium">{progress.xp} XP Total</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-xs">
                <Star className="w-3.5 h-3.5 text-secondary" />
                <span className="text-secondary font-medium">{unlockedCount * 100} XP from Badges</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2 mb-6"
        >
          {(['all', 'unlocked', 'locked'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                filter === f
                  ? 'bg-primary/20 text-primary-light border border-primary/30'
                  : 'bg-surface border border-border/50 text-foreground/40 hover:text-foreground/60 hover:border-border'
              }`}
            >
              {f === 'all' ? `All (${totalCount})` : f === 'unlocked' ? `Unlocked (${unlockedCount})` : `Locked (${totalCount - unlockedCount})`}
            </button>
          ))}
        </motion.div>

        {/* Achievement grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(([id, ach], i) => {
            const unlocked = progress.achievements.includes(id);

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: unlocked ? -4 : 0 }}
                className="relative group"
              >
                <div
                  className={`rounded-2xl bg-surface border p-5 transition-all h-full ${
                    unlocked
                      ? 'border-warning/20 group-hover:border-warning/40'
                      : 'border-border/50 opacity-60'
                  }`}
                  style={{
                    boxShadow: unlocked ? '0 0 25px rgba(245, 158, 11, 0.08)' : 'none',
                  }}
                >
                  {/* Accent corner glow */}
                  {unlocked && (
                    <div className="absolute top-0 right-0 w-20 h-20 opacity-15 group-hover:opacity-25 transition-opacity bg-[radial-gradient(circle,#f59e0b,transparent_70%)]" />
                  )}

                  <div className="relative flex items-start gap-4">
                    <motion.div
                      whileHover={unlocked ? { rotate: 10, scale: 1.1 } : {}}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                        unlocked
                          ? 'bg-warning/10 border border-warning/20'
                          : 'bg-surface-light border border-border/50'
                      }`}
                    >
                      {unlocked ? ach.icon : <Lock className="w-5 h-5 text-foreground/20" />}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-sm mb-0.5 ${unlocked ? '' : 'text-foreground/40'}`}>
                        {ach.title}
                      </h3>
                      <p className="text-xs text-foreground/40 leading-relaxed">{ach.description}</p>
                      {unlocked && (
                        <div className="flex items-center gap-1 mt-2">
                          <Sparkles className="w-3 h-3 text-warning" />
                          <span className="text-[10px] font-bold text-warning uppercase tracking-wider">+100 XP earned</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* XP Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 relative rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-warning/10" />
          <div className="relative bg-surface border border-border/50 rounded-2xl p-8 text-center">
            <p className="text-foreground/40 text-sm mb-3 uppercase tracking-wider font-medium">Total Experience Points</p>
            <motion.p
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, type: 'spring' }}
              className="text-5xl font-bold gradient-text mb-5"
            >
              {progress.xp} XP
            </motion.p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-foreground/40">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-light">
                <span>📚</span>
                <span>Lessons: {progress.completedLessons.length * 50} XP</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-light">
                <span>🏆</span>
                <span>Achievements: {progress.achievements.length * 100} XP</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
