'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { curriculum, getTotalLessons } from '@/lib/curriculum';
import { BookOpen, Trophy, Zap, Target, ChevronRight, CheckCircle2, Lock, FlameIcon, Code2, Gamepad2 } from 'lucide-react';
import { useEffect } from 'react';
import { useHydrated } from '@/lib/useHydrated';
import { useRequireAuth } from '@/components/auth/RequireAuth';

function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = 'url(#progressGrad)',
  trackColor = 'rgba(99, 102, 241, 0.08)',
  children,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function MiniCircularProgress({
  percentage,
  color,
  size = 40,
}: {
  percentage: number;
  color: string;
  size?: number;
}) {
  const sw = 3;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (percentage / 100) * c;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(226,232,240,0.06)" strokeWidth={sw} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: off }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <span className="absolute text-[9px] font-bold text-foreground/60">{percentage}%</span>
    </div>
  );
}

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

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="min-h-screen particle-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Hero section: Welcome + Circular Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 sm:p-8 mb-6 overflow-hidden relative"
        >
          {/* Decorative gradient blob */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-accent/10 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 relative z-10">
            {/* Text */}
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm text-foreground/40 mb-1">{greeting}</p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {user ? `${user.name.split(' ')[0]}` : 'Learner'} 👋
              </h1>
              <p className="text-foreground/50 text-sm sm:text-base mb-4">
                {completion === 100
                  ? '🎉 You\'ve mastered Linear Regression!'
                  : completion > 50
                  ? 'You\'re making great progress — keep going!'
                  : 'Continue your journey into Linear Regression'}
              </p>

              {/* Compact stat pills */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary-light border border-primary/10">
                  <Zap className="w-3 h-3" /> {progress.xp} XP
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-error/10 text-error border border-error/10">
                  <FlameIcon className="w-3 h-3" /> {progress.streak} day streak
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-warning/10 text-warning border border-warning/10">
                  <Trophy className="w-3 h-3" /> {progress.achievements.length} badges
                </span>
              </div>
            </div>

            {/* Circular progress */}
            <div className="shrink-0">
              <CircularProgress percentage={completion} size={140} strokeWidth={10}>
                <div className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-br from-primary via-secondary to-accent bg-clip-text text-transparent">
                    {completion}%
                  </p>
                  <p className="text-[10px] text-foreground/40 font-medium">COMPLETE</p>
                </div>
              </CircularProgress>
              <p className="text-center text-xs text-foreground/30 mt-2">
                {progress.completedLessons.length}/{totalLessons} lessons
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[
            { label: 'XP Earned', value: progress.xp, icon: Zap, gradient: 'from-primary/20 to-primary/5', border: 'border-primary/10', color: 'text-primary-light' },
            { label: 'Lessons Done', value: `${progress.completedLessons.length}/${totalLessons}`, icon: BookOpen, gradient: 'from-success/20 to-success/5', border: 'border-success/10', color: 'text-success' },
            { label: 'Achievements', value: progress.achievements.length, icon: Trophy, gradient: 'from-warning/20 to-warning/5', border: 'border-warning/10', color: 'text-warning' },
            { label: 'Day Streak', value: progress.streak, icon: Target, gradient: 'from-error/20 to-error/5', border: 'border-error/10', color: 'text-error' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className={`relative overflow-hidden rounded-2xl border ${stat.border} bg-surface/50 backdrop-blur-sm p-4 sm:p-5`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} pointer-events-none`} />
              <div className="relative z-10">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-3 opacity-70`} />
                <p className="text-2xl sm:text-3xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-xs text-foreground/40 mt-0.5">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Learning Path */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Learning Path</h2>
          <span className="text-xs text-foreground/30 font-medium">{curriculum.length} modules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
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
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                <Link href={`/learn/${module.id}`}>
                  <div className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-surface/40 backdrop-blur-sm p-4 sm:p-5 transition-all duration-300 hover:border-primary/30 hover:bg-surface/60 cursor-pointer ${isComplete ? 'border-success/20' : ''}`}>
                    {/* Subtle gradient accent on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: `linear-gradient(135deg, ${module.color}08 0%, transparent 60%)` }}
                    />

                    <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                      {/* Module icon */}
                      <div
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl shrink-0 border"
                        style={{
                          backgroundColor: `${module.color}10`,
                          borderColor: `${module.color}20`,
                        }}
                      >
                        {module.icon}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-semibold text-sm sm:text-base truncate">{module.title}</h3>
                          {isComplete && (
                            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] sm:text-xs text-foreground/35 truncate">
                          {module.description}
                        </p>
                      </div>

                      {/* Mini circular progress */}
                      <MiniCircularProgress percentage={moduleCompletion} color={module.color} />

                      <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground/50 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg sm:text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/quiz">
            <motion.div
              whileHover={{ y: -2 }}
              className="group relative overflow-hidden rounded-2xl border border-warning/10 bg-surface/40 backdrop-blur-sm p-5 transition-all duration-300 hover:border-warning/30 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-warning/8 to-transparent pointer-events-none" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-warning/10 border border-warning/15 flex items-center justify-center">
                  <span className="text-xl">📝</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">Take a Quiz</h3>
                  <p className="text-[11px] text-foreground/35 truncate">Test your knowledge</p>
                </div>
                <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground/50 transition-colors shrink-0" />
              </div>
            </motion.div>
          </Link>

          <Link href="/playground">
            <motion.div
              whileHover={{ y: -2 }}
              className="group relative overflow-hidden rounded-2xl border border-accent/10 bg-surface/40 backdrop-blur-sm p-5 transition-all duration-300 hover:border-accent/30 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/8 to-transparent pointer-events-none" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/15 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">Playground</h3>
                  <p className="text-[11px] text-foreground/35 truncate">Experiment with regression</p>
                </div>
                <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground/50 transition-colors shrink-0" />
              </div>
            </motion.div>
          </Link>

          <Link href="/examples">
            <motion.div
              whileHover={{ y: -2 }}
              className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-surface/40 backdrop-blur-sm p-5 transition-all duration-300 hover:border-primary/30 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent pointer-events-none" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">Code Examples</h3>
                  <p className="text-[11px] text-foreground/35 truncate">Python, JS & TS samples</p>
                </div>
                <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground/50 transition-colors shrink-0" />
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
