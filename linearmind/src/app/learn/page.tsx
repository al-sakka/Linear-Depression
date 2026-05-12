'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { curriculum } from '@/lib/curriculum';
import { CheckCircle2, ChevronRight, Lock, Sparkles, Zap, Trophy } from 'lucide-react';
import { useHydrated } from '@/lib/useHydrated';
import { useRequireAuth } from '@/components/auth/RequireAuth';
import { useState } from 'react';

export default function LearnPage() {
  const { progress } = useStore();
  const hydrated = useHydrated();
  const { authenticated, loading } = useRequireAuth();
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  if (!hydrated || loading || !authenticated) {
    return (
      <div className="min-h-screen particle-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalCompleted = progress.completedLessons.length;
  const totalLessons = curriculum.reduce((sum, m) => sum + m.lessons.length, 0);
  const overallPercent = Math.round((totalCompleted / totalLessons) * 100);

  return (
    <div className="min-h-screen particle-bg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-10 overflow-hidden rounded-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/10 rounded-2xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.15),transparent_60%)]" />
          <div className="relative p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl sm:text-4xl font-bold mb-2"
                >
                  <span className="gradient-text">Learning Path</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-foreground/50 text-sm sm:text-base"
                >
                  Master Linear Regression from history to neural networks
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
                    <circle
                      cx="40" cy="40" r="34"
                      fill="none"
                      stroke="currentColor"
                      className="text-surface-light"
                      strokeWidth="6"
                    />
                    <circle
                      cx="40" cy="40" r="34"
                      fill="none"
                      stroke="url(#progressGrad)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${overallPercent * 2.136} 213.6`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{overallPercent}%</span>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-foreground/60">{totalCompleted} of {totalLessons}</p>
                  <p className="text-foreground/40">lessons done</p>
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
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-primary-light" />
                <span className="text-primary-light font-medium">{curriculum.length} Modules</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs">
                <Zap className="w-3.5 h-3.5 text-accent" />
                <span className="text-accent font-medium">{totalLessons} Lessons</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20 text-xs">
                <Trophy className="w-3.5 h-3.5 text-warning" />
                <span className="text-warning font-medium">{progress.xp} XP</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Timeline/Modules */}
        <div className="relative">
          {/* Vertical line connector */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-secondary/20 to-accent/40 hidden sm:block" />

          <div className="space-y-4">
            {curriculum.map((module, mi) => {
              const completedInModule = module.lessons.filter((l) =>
                progress.completedLessons.includes(`${module.id}/${l.id}`)
              ).length;
              const modulePercent = Math.round((completedInModule / module.lessons.length) * 100);
              const isModuleComplete = completedInModule === module.lessons.length;
              const isHovered = hoveredModule === module.id;

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: mi * 0.06 }}
                  onMouseEnter={() => setHoveredModule(module.id)}
                  onMouseLeave={() => setHoveredModule(null)}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 top-7 hidden sm:block z-10">
                    <motion.div
                      animate={{ scale: isHovered ? 1.3 : 1 }}
                      className={`w-5 h-5 rounded-full border-2 ${
                        isModuleComplete
                          ? 'bg-success border-success/50'
                          : completedInModule > 0
                          ? 'border-primary bg-primary/30'
                          : 'border-border bg-surface'
                      }`}
                    >
                      {isModuleComplete && (
                        <CheckCircle2 className="w-full h-full text-white p-0.5" />
                      )}
                    </motion.div>
                  </div>

                  <div className="sm:ml-14">
                    <motion.div
                      animate={{
                        borderColor: isHovered ? `${module.color}40` : 'transparent',
                      }}
                      className="rounded-2xl border border-transparent bg-surface overflow-hidden transition-all duration-300"
                      style={{
                        boxShadow: isHovered ? `0 0 30px ${module.color}10` : 'none',
                      }}
                    >
                      {/* Module header */}
                      <Link href={`/learn/${module.id}`}>
                        <div className="p-5 sm:p-6 cursor-pointer group">
                          <div className="flex items-center gap-4">
                            <motion.div
                              animate={{ rotate: isHovered ? 10 : 0 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                              style={{ backgroundColor: `${module.color}15` }}
                            >
                              {module.icon}
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ color: module.color, backgroundColor: `${module.color}15` }}>
                                  Module {mi + 1}
                                </span>
                                {isModuleComplete && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-success/15 text-success">
                                    Complete
                                  </span>
                                )}
                              </div>
                              <h2 className="font-bold text-lg group-hover:text-foreground transition-colors">
                                {module.title}
                              </h2>
                              <p className="text-xs text-foreground/40 mt-0.5">
                                {module.description}
                              </p>
                            </div>
                            <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                              <span className="text-2xl font-bold font-mono" style={{ color: module.color }}>
                                {modulePercent}%
                              </span>
                              <span className="text-[10px] text-foreground/30">
                                {completedInModule}/{module.lessons.length} lessons
                              </span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-foreground/20 group-hover:text-foreground/50 group-hover:translate-x-1 transition-all shrink-0" />
                          </div>

                          {/* Progress bar */}
                          <div className="mt-4 h-1 rounded-full bg-surface-light overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${modulePercent}%` }}
                              transition={{ delay: mi * 0.06 + 0.3, duration: 0.8, ease: 'easeOut' }}
                              className="h-full rounded-full"
                              style={{ background: `linear-gradient(90deg, ${module.color}, ${module.color}80)` }}
                            />
                          </div>
                        </div>
                      </Link>

                      {/* Lesson pills - peek preview */}
                      <div className="px-5 sm:px-6 pb-4">
                        <div className="flex flex-wrap gap-1.5">
                          {module.lessons.map((lesson, li) => {
                            const isComplete = progress.completedLessons.includes(
                              `${module.id}/${lesson.id}`
                            );
                            return (
                              <Link
                                key={lesson.id}
                                href={`/learn/${module.id}/${lesson.id}`}
                              >
                                <motion.div
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.97 }}
                                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                    isComplete
                                      ? 'bg-success/10 text-success border border-success/20'
                                      : 'bg-surface-light text-foreground/50 hover:text-foreground/80 border border-border/50 hover:border-primary/30'
                                  }`}
                                >
                                  {isComplete ? (
                                    <CheckCircle2 className="w-3 h-3" />
                                  ) : (
                                    <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px]">
                                      {li + 1}
                                    </span>
                                  )}
                                  {lesson.title}
                                  {lesson.interactiveType && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-light animate-pulse" />
                                  )}
                                </motion.div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
