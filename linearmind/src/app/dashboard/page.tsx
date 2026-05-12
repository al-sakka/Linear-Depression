'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { curriculum, getTotalLessons } from '@/lib/curriculum';
import { BookOpen, Trophy, Zap, Target, ChevronRight, CheckCircle2, Lock } from 'lucide-react';
import { useEffect } from 'react';
import { useHydrated } from '@/lib/useHydrated';
import { useRequireAuth } from '@/components/auth/RequireAuth';

export default function DashboardPage() {
  const { progress, user, updateStreak, getCompletionPercentage } = useStore();
  const hydrated = useHydrated();
  const { authenticated, loading } = useRequireAuth();
  const completion = getCompletionPercentage();
  const totalLessons = getTotalLessons();

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  if (!hydrated || loading || !authenticated) {
    return (
      <div className="min-h-screen particle-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen particle-bg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="text-foreground/50">Continue your journey into Linear Regression</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'XP Earned', value: progress.xp, icon: Zap, color: 'text-primary-light', bg: 'bg-primary/10' },
            { label: 'Lessons Done', value: `${progress.completedLessons.length}/${totalLessons}`, icon: BookOpen, color: 'text-success', bg: 'bg-success/10' },
            { label: 'Achievements', value: progress.achievements.length, icon: Trophy, color: 'text-warning', bg: 'bg-warning/10' },
            { label: 'Day Streak', value: progress.streak, icon: Target, color: 'text-error', bg: 'bg-error/10' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-4"
            >
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-foreground/40">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Overall Progress</h2>
            <span className="text-sm font-mono text-primary-light">{completion}%</span>
          </div>
          <div className="h-3 bg-surface-light rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${completion}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-foreground/40 mt-2">
            {completion === 100
              ? '🎉 You completed everything! Check out achievements.'
              : `${totalLessons - progress.completedLessons.length} lessons remaining`}
          </p>
        </motion.div>

        {/* Modules */}
        <h2 className="text-xl font-bold mb-4">Learning Path</h2>
        <div className="space-y-3">
          {curriculum.map((module, i) => {
            const completedInModule = module.lessons.filter((l) =>
              progress.completedLessons.includes(`${module.id}/${l.id}`)
            ).length;
            const moduleCompletion = Math.round(
              (completedInModule / module.lessons.length) * 100
            );
            const isComplete = moduleCompletion === 100;

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Link href={`/learn/${module.id}`}>
                  <div className={`glass rounded-xl p-5 flex items-center gap-4 group hover:border-primary/30 transition-all cursor-pointer ${isComplete ? 'border-success/20' : ''}`}>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: `${module.color}15` }}
                    >
                      {module.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{module.title}</h3>
                        {isComplete && (
                          <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-foreground/40 mb-2 truncate">
                        {module.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-surface-light rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${moduleCompletion}%`,
                              backgroundColor: module.color,
                            }}
                          />
                        </div>
                        <span className="text-xs text-foreground/40 shrink-0">
                          {completedInModule}/{module.lessons.length}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-foreground/30 group-hover:text-foreground/60 transition-colors shrink-0" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <Link href="/quiz">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass rounded-xl p-5 flex items-center gap-4 group hover:border-warning/30 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <span className="text-xl">📝</span>
              </div>
              <div>
                <h3 className="font-semibold">Take a Quiz</h3>
                <p className="text-xs text-foreground/40">Test your knowledge with smart questions</p>
              </div>
              <ChevronRight className="w-5 h-5 text-foreground/30 ml-auto" />
            </motion.div>
          </Link>
          <Link href="/playground">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass rounded-xl p-5 flex items-center gap-4 group hover:border-accent/30 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <span className="text-xl">🎮</span>
              </div>
              <div>
                <h3 className="font-semibold">Playground</h3>
                <p className="text-xs text-foreground/40">Free experiment with regression</p>
              </div>
              <ChevronRight className="w-5 h-5 text-foreground/30 ml-auto" />
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
