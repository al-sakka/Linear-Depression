'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { curriculum } from '@/lib/curriculum';
import { CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';
import { useHydrated } from '@/lib/useHydrated';
import { useRequireAuth } from '@/components/auth/RequireAuth';

export default function LearnPage() {
  const { progress } = useStore();
  const hydrated = useHydrated();
  const { authenticated, loading } = useRequireAuth();

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
          <h1 className="text-3xl font-bold mb-2">📚 Curriculum</h1>
          <p className="text-foreground/50 mb-8">
            Master Linear Regression step by step
          </p>
        </motion.div>

        <div className="space-y-6">
          {curriculum.map((module, mi) => {
            const completedInModule = module.lessons.filter((l) =>
              progress.completedLessons.includes(`${module.id}/${l.id}`)
            ).length;

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mi * 0.1 }}
                className="glass rounded-xl overflow-hidden"
              >
                {/* Module header */}
                <div className="p-5 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${module.color}15` }}
                    >
                      {module.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="font-semibold">{module.title}</h2>
                      <p className="text-xs text-foreground/40">
                        {completedInModule}/{module.lessons.length} lessons completed
                      </p>
                    </div>
                    <div className="text-sm font-mono" style={{ color: module.color }}>
                      {Math.round((completedInModule / module.lessons.length) * 100)}%
                    </div>
                  </div>
                </div>

                {/* Lessons */}
                <div className="divide-y divide-border/30">
                  {module.lessons.map((lesson, li) => {
                    const isComplete = progress.completedLessons.includes(
                      `${module.id}/${lesson.id}`
                    );

                    return (
                      <Link
                        key={lesson.id}
                        href={`/learn/${module.id}/${lesson.id}`}
                      >
                        <div className="p-4 flex items-center gap-3 hover:bg-surface-light/50 transition-colors group cursor-pointer">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                            {isComplete ? (
                              <CheckCircle2 className="w-5 h-5 text-success" />
                            ) : (
                              <div
                                className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                                style={{ borderColor: `${module.color}40`, color: `${module.color}80` }}
                              >
                                {li + 1}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-sm font-medium ${isComplete ? 'text-foreground/50' : ''}`}>
                              {lesson.title}
                            </h3>
                            <p className="text-xs text-foreground/30 truncate">
                              {lesson.description}
                            </p>
                          </div>
                          {lesson.interactiveType && (
                            <span className="text-xs bg-primary/10 text-primary-light px-2 py-0.5 rounded-full shrink-0">
                              Interactive
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground/50 shrink-0" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
