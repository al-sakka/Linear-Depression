'use client';

import { use, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { getLesson, getModule, getNextLesson, getPrevLesson } from '@/lib/curriculum';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, CheckCircle2, BookOpen } from 'lucide-react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { useHydrated } from '@/lib/useHydrated';
import { useRequireAuth } from '@/components/auth/RequireAuth';

const RegressionCanvas = dynamic(() => import('@/components/visualizations/RegressionCanvas'), { ssr: false });
const SlopeInterceptViz = dynamic(() => import('@/components/visualizations/SlopeInterceptViz'), { ssr: false });
const CostFunctionViz = dynamic(() => import('@/components/visualizations/CostFunctionViz'), { ssr: false });
const GradientDescentViz = dynamic(() => import('@/components/visualizations/GradientDescentViz'), { ssr: false });
const TrainingViz = dynamic(() => import('@/components/visualizations/TrainingViz'), { ssr: false });
const FailureCasesViz = dynamic(() => import('@/components/visualizations/FailureCasesViz'), { ssr: false });
const ComparisonViz = dynamic(() => import('@/components/visualizations/ComparisonViz'), { ssr: false });
const MultivariateViz = dynamic(() => import('@/components/visualizations/MultivariateViz'), { ssr: false });
const FeatureScalingViz = dynamic(() => import('@/components/visualizations/FeatureScalingViz'), { ssr: false });
const CorrelationViz = dynamic(() => import('@/components/visualizations/CorrelationViz'), { ssr: false });
const BiasVarianceViz = dynamic(() => import('@/components/visualizations/BiasVarianceViz'), { ssr: false });
const MetricsViz = dynamic(() => import('@/components/visualizations/MetricsViz'), { ssr: false });
const NeuronBridgeViz = dynamic(() => import('@/components/visualizations/NeuronBridgeViz'), { ssr: false });
const GradientDescent3DViz = dynamic(() => import('@/components/visualizations/GradientDescent3DViz'), { ssr: false });
const ResidualsViz = dynamic(() => import('@/components/visualizations/ResidualsViz'), { ssr: false });

function InteractiveDemo({ type }: { type: string }) {
  switch (type) {
    case 'regression-canvas':
      return <RegressionCanvas />;
    case 'slope-intercept':
      return <SlopeInterceptViz />;
    case 'cost-function':
      return <CostFunctionViz />;
    case 'gradient-descent':
      return <GradientDescentViz />;
    case 'gradient-descent-3d':
      return <GradientDescent3DViz />;
    case 'training':
      return <TrainingViz />;
    case 'failure-cases':
      return <FailureCasesViz />;
    case 'comparison':
      return <ComparisonViz />;
    case 'multivariate':
      return <MultivariateViz />;
    case 'feature-scaling':
      return <FeatureScalingViz />;
    case 'correlation':
      return <CorrelationViz />;
    case 'bias-variance':
      return <BiasVarianceViz />;
    case 'metrics':
      return <MetricsViz />;
    case 'neuron-bridge':
      return <NeuronBridgeViz />;
    case 'residuals':
      return <ResidualsViz />;
    default:
      return null;
  }
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>;
}) {
  const { moduleId, lessonId } = use(params);
  const router = useRouter();
  const { completeLesson, isLessonComplete, progress } = useStore();
  const hydrated = useHydrated();
  const { authenticated, loading } = useRequireAuth();

  const module = getModule(moduleId);
  const lesson = getLesson(moduleId, lessonId);
  const next = getNextLesson(moduleId, lessonId);
  const prev = getPrevLesson(moduleId, lessonId);
  const isComplete = isLessonComplete(moduleId, lessonId);

  if (!module || !lesson) return notFound();

  const lessonIndex = module.lessons.findIndex(l => l.id === lessonId);
  const totalInModule = module.lessons.length;

  if (!hydrated || loading || !authenticated) {
    return (
      <div className="min-h-screen particle-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleComplete = () => {
    if (!isComplete) {
      completeLesson(moduleId, lessonId);
      toast.success('Lesson completed! +50 XP', {
        icon: '🎉',
        style: {
          background: '#1e293b',
          color: '#e2e8f0',
          border: '1px solid rgba(16, 185, 129, 0.3)',
        },
      });
    }
    if (next) {
      router.push(`/learn/${next.moduleId}/${next.lessonId}`);
    } else {
      router.push('/learn');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen particle-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm text-foreground/40 mb-6 flex-wrap"
        >
          <Link href="/learn" className="hover:text-foreground/60 transition-colors">
            Learning Path
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href={`/learn/${moduleId}`}
            className="hover:text-foreground/60 transition-colors"
          >
            {module.title}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground/60">{lesson.title}</span>
        </motion.div>

        {/* Lesson header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden mb-8"
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{ background: `radial-gradient(circle at 10% 50%, ${module.color}, transparent 50%)` }}
          />
          <div className="relative bg-surface border border-border/50 rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 250, delay: 0.1 }}
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: `${module.color}15`, border: `1px solid ${module.color}25` }}
              >
                {module.icon}
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ color: module.color, backgroundColor: `${module.color}15` }}>
                    Lesson {lessonIndex + 1} of {totalInModule}
                  </span>
                  {isComplete && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-success/15 text-success flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">{lesson.title}</h1>
                <p className="text-sm text-foreground/40 mt-1">{lesson.description}</p>
              </div>
            </div>

            {/* Mini progress dots */}
            <div className="flex items-center gap-1.5 mt-5">
              {module.lessons.map((l, i) => {
                const done = progress.completedLessons.includes(`${module.id}/${l.id}`);
                const isCurrent = l.id === lessonId;
                return (
                  <Link key={l.id} href={`/learn/${moduleId}/${l.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.3 }}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        isCurrent
                          ? 'w-8'
                          : 'w-3 hover:w-5'
                      }`}
                      style={{
                        backgroundColor: isCurrent
                          ? module.color
                          : done
                          ? 'rgb(16, 185, 129)'
                          : 'var(--surface-light)',
                      }}
                      title={l.title}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-surface border border-border/50 p-6 sm:p-8 mb-6"
        >
          <div className="space-y-4">
            {lesson.content.map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className={`leading-relaxed ${
                  paragraph.startsWith('🔄') ||
                  paragraph.startsWith('🎯') ||
                  paragraph.startsWith('📉') ||
                  paragraph.startsWith('📈') ||
                  paragraph.startsWith('🌊') ||
                  paragraph.startsWith('🏠') ||
                  paragraph.startsWith('📈') ||
                  paragraph.startsWith('🏥') ||
                  paragraph.startsWith('🌤️') ||
                  paragraph.startsWith('⚡') ||
                  paragraph.startsWith('🐌') ||
                  paragraph.startsWith('✅')
                    ? 'pl-4 border-l-2 border-primary/30 text-foreground/80'
                    : paragraph.includes('=') && paragraph.length < 60
                    ? 'font-mono text-center text-lg text-primary-light bg-primary/5 rounded-lg py-3'
                    : 'text-foreground/70'
                }`}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </motion.div>

        {/* Interactive Demo */}
        {lesson.interactiveType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <InteractiveDemo type={lesson.interactiveType} />
          </motion.div>
        )}

        {/* Static Illustration */}
        {!lesson.interactiveType && lesson.image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className="rounded-2xl border border-border/50 bg-surface p-4 flex justify-center">
              <img
                src={lesson.image}
                alt={`${lesson.title} illustration`}
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between gap-4 pt-4"
        >
          {prev ? (
            <Link
              href={`/learn/${prev.moduleId}/${prev.lessonId}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border/50 text-foreground/60 hover:text-foreground hover:border-primary/30 transition-all text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Link>
          ) : (
            <div />
          )}

          <button
            onClick={handleComplete}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${
              isComplete
                ? 'bg-surface border border-border/50 text-foreground/60 hover:text-foreground hover:border-primary/30'
                : 'bg-gradient-to-r from-primary to-secondary text-white glow hover:opacity-90'
            }`}
          >
            {isComplete ? (
              <>
                {next ? 'Next Lesson' : 'Back to Learning Path'}
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Complete & Continue
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
