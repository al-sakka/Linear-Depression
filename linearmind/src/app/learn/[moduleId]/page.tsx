'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { getModule, curriculum } from '@/lib/curriculum';
import { ChevronRight, ChevronLeft, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { useHydrated } from '@/lib/useHydrated';
import { useRequireAuth } from '@/components/auth/RequireAuth';

export default function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = use(params);
  const { progress } = useStore();
  const hydrated = useHydrated();
  const { authenticated, loading } = useRequireAuth();
  const module = getModule(moduleId);

  if (!module) return notFound();

  if (!hydrated || loading || !authenticated) {
    return (
      <div className="min-h-screen particle-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const moduleIndex = curriculum.findIndex(m => m.id === moduleId);
  const completedInModule = module.lessons.filter((l) =>
    progress.completedLessons.includes(`${module.id}/${l.id}`)
  ).length;
  const modulePercent = Math.round((completedInModule / module.lessons.length) * 100);
  const firstIncomplete = module.lessons.find(l => !progress.completedLessons.includes(`${module.id}/${l.id}`));

  return (
    <div className="min-h-screen particle-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back link */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link href="/learn" className="inline-flex items-center gap-1.5 text-sm text-foreground/40 hover:text-foreground/60 transition-colors mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Learning Path
          </Link>
        </motion.div>

        {/* Module hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden mb-8"
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{ background: `radial-gradient(circle at 20% 50%, ${module.color}, transparent 60%)` }}
          />
          <div className="relative p-6 sm:p-8 bg-surface border border-border/50 rounded-2xl">
            <div className="flex items-start gap-4 mb-6">
              <motion.div
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                style={{ backgroundColor: `${module.color}15`, border: `1px solid ${module.color}25` }}
              >
                {module.icon}
              </motion.div>
              <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 inline-block" style={{ color: module.color, backgroundColor: `${module.color}15` }}>
                  Module {moduleIndex + 1} of {curriculum.length}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">{module.title}</h1>
                <p className="text-foreground/50 text-sm">{module.description}</p>
              </div>
            </div>

            {/* Progress + CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 w-full sm:w-auto">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-foreground/40">{completedInModule}/{module.lessons.length} lessons</span>
                  <span className="text-xs font-bold" style={{ color: module.color }}>{modulePercent}%</span>
                </div>
                <div className="h-2 rounded-full bg-surface-light overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${modulePercent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${module.color}, ${module.color}90)` }}
                  />
                </div>
              </div>
              {firstIncomplete && (
                <Link href={`/learn/${module.id}/${firstIncomplete.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white shrink-0"
                    style={{ background: `linear-gradient(135deg, ${module.color}, ${module.color}cc)` }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {/* Lessons list */}
        <div className="relative">
          {/* Vertical connector */}
          <div className="absolute left-7 top-4 bottom-4 w-px hidden sm:block" style={{ backgroundColor: `${module.color}20` }} />

          <div className="space-y-3">
            {module.lessons.map((lesson, i) => {
              const isComplete = progress.completedLessons.includes(`${module.id}/${lesson.id}`);

              return (
                <Link key={lesson.id} href={`/learn/${module.id}/${lesson.id}`} className="block">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ x: 4 }}
                    className="relative group"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10 hidden sm:block">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isComplete
                          ? 'bg-success border-success/50'
                          : 'border-border bg-surface group-hover:border-primary'
                      }`}>
                        {isComplete && <CheckCircle2 className="w-full h-full text-white p-0.5" />}
                      </div>
                    </div>

                    <div className="sm:ml-14 rounded-xl bg-surface border border-border/50 group-hover:border-primary/30 transition-all p-5 flex items-center gap-4">
                      {/* Lesson number */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isComplete ? 'bg-success/10 text-success' : 'bg-surface-light text-foreground/30'
                      }`}>
                        {isComplete ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-sm sm:text-base ${isComplete ? 'text-foreground/50' : 'group-hover:text-foreground'} transition-colors`}>
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-foreground/30 mt-0.5 truncate">{lesson.description}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {lesson.interactiveType && (
                          <span className="hidden sm:flex items-center gap-1 text-[10px] bg-primary/10 text-primary-light px-2 py-1 rounded-full border border-primary/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-light animate-pulse" />
                            Interactive
                          </span>
                        )}
                        {lesson.image && !lesson.interactiveType && (
                          <span className="hidden sm:flex items-center gap-1 text-[10px] bg-accent/10 text-accent px-2 py-1 rounded-full border border-accent/20">
                            Illustrated
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground/50 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
