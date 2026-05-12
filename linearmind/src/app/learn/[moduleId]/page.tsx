'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { getModule } from '@/lib/curriculum';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
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

  return (
    <div className="min-h-screen particle-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/learn" className="text-sm text-foreground/40 hover:text-foreground/60 transition-colors mb-4 inline-block">
            ← Back to Curriculum
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${module.color}15` }}
            >
              {module.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{module.title}</h1>
              <p className="text-foreground/50 text-sm">{module.description}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {module.lessons.map((lesson, i) => {
              const isComplete = progress.completedLessons.includes(`${module.id}/${lesson.id}`);

              return (
                <Link key={lesson.id} href={`/learn/${module.id}/${lesson.id}`} className="block">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-xl p-5 flex items-center gap-4 group hover:border-primary/30 transition-all cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                      {isComplete ? (
                        <CheckCircle2 className="w-6 h-6 text-success" />
                      ) : (
                        <div
                          className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold"
                          style={{ borderColor: `${module.color}40`, color: `${module.color}` }}
                        >
                          {i + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{lesson.title}</h3>
                      <p className="text-sm text-foreground/40">{lesson.description}</p>
                    </div>
                    {lesson.interactiveType && (
                      <span className="text-xs bg-primary/10 text-primary-light px-2.5 py-1 rounded-full">
                        🎮 Interactive
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-foreground/20 group-hover:text-foreground/50" />
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
