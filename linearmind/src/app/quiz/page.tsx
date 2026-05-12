'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { quizQuestions, getQuizTypeLabel, getDifficultyLabel } from '@/lib/quiz-data';
import { curriculum } from '@/lib/curriculum';
import { CheckCircle2, XCircle, ChevronRight, ChevronLeft, RotateCcw, Trophy, Sparkles, Target, Zap, Brain } from 'lucide-react';
import toast from 'react-hot-toast';
import { useHydrated } from '@/lib/useHydrated';
import { useRequireAuth } from '@/components/auth/RequireAuth';

export default function QuizPage() {
  const { setQuizScore, progress } = useStore();
  const hydrated = useHydrated();
  const { authenticated, loading } = useRequireAuth();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const questions = useMemo(
    () => (selectedModule ? quizQuestions.filter((q) => q.moduleId === selectedModule) : []),
    [selectedModule]
  );

  const currentQ = questions[currentIndex];

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    if (index === currentQ.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      const finalScore = Math.round((correctCount / questions.length) * 100);
      setQuizScore(selectedModule!, finalScore);
      setIsFinished(true);
      if (finalScore === 100) {
        toast.success('Perfect score! 🎯', {
          style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid rgba(245, 158, 11, 0.3)' },
        });
      }
    }
  };

  const reset = () => {
    setSelectedModule(null);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setIsFinished(false);
  };

  if (!hydrated || loading || !authenticated) {
    return (
      <div className="min-h-screen particle-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ─── Module selection ─────────────────────────────────────────
  if (!selectedModule) {
    const modulesWithQuiz = curriculum.filter(m => quizQuestions.some(q => q.moduleId === m.id));
    const totalQuizzes = modulesWithQuiz.length;
    const totalPerfect = modulesWithQuiz.filter(m => progress.quizScores[m.id] === 100).length;

    return (
      <div className="min-h-screen particle-bg">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Hero header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-10 overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-warning/15 via-primary/10 to-secondary/10 rounded-2xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(245,158,11,0.12),transparent_60%)]" />
            <div className="relative p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl sm:text-4xl font-bold mb-2"
                  >
                    <span className="gradient-text">Quiz Center</span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-foreground/50 text-sm sm:text-base"
                  >
                    Test your knowledge across every module
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
                        stroke="url(#quizGrad)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${(totalPerfect / totalQuizzes) * 213.6} 213.6`}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="quizGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{totalPerfect}/{totalQuizzes}</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="text-foreground/60">Perfect scores</p>
                    <p className="text-foreground/40">achieved</p>
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
                  <Target className="w-3.5 h-3.5 text-warning" />
                  <span className="text-warning font-medium">{totalQuizzes} Quizzes</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs">
                  <Brain className="w-3.5 h-3.5 text-primary-light" />
                  <span className="text-primary-light font-medium">{quizQuestions.length} Questions</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-xs">
                  <Trophy className="w-3.5 h-3.5 text-success" />
                  <span className="text-success font-medium">{totalPerfect} Mastered</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Module grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {curriculum.map((module, i) => {
              const qCount = quizQuestions.filter((q) => q.moduleId === module.id).length;
              const prevScore = progress.quizScores[module.id];
              if (qCount === 0) return null;

              const isPerfect = prevScore === 100;
              const hasAttempted = prevScore !== undefined;

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedModule(module.id)}
                  className="relative cursor-pointer group"
                >
                  <div
                    className="rounded-2xl bg-surface border border-border/50 p-5 transition-all group-hover:border-primary/30 overflow-hidden"
                    style={{ boxShadow: isPerfect ? `0 0 25px ${module.color}15` : 'none' }}
                  >
                    {/* Accent glow */}
                    <div
                      className="absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity"
                      style={{ background: `radial-gradient(circle, ${module.color}, transparent 70%)` }}
                    />

                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div
                          whileHover={{ rotate: 10 }}
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                          style={{ backgroundColor: `${module.color}15`, border: `1px solid ${module.color}20` }}
                        >
                          {module.icon}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm truncate">{module.title}</h3>
                          <p className="text-[11px] text-foreground/40">{qCount} questions</p>
                        </div>
                        {isPerfect && (
                          <div className="w-7 h-7 rounded-full bg-success/15 flex items-center justify-center">
                            <Trophy className="w-4 h-4 text-success" />
                          </div>
                        )}
                      </div>

                      {/* Score bar */}
                      {hasAttempted ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-foreground/30 uppercase tracking-wider">Best score</span>
                            <span className={`text-xs font-bold font-mono ${
                              isPerfect ? 'text-success' : prevScore >= 70 ? 'text-warning' : 'text-error'
                            }`}>
                              {prevScore}%
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-surface-light overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${prevScore}%` }}
                              transition={{ delay: i * 0.05 + 0.3, duration: 0.8 }}
                              className="h-full rounded-full"
                              style={{
                                backgroundColor: isPerfect ? '#10b981' : prevScore >= 70 ? '#f59e0b' : '#ef4444',
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[11px] text-foreground/30">
                          <Sparkles className="w-3 h-3" />
                          Not attempted yet
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── Results screen ───────────────────────────────────────────
  if (isFinished) {
    const finalScore = Math.round((correctCount / questions.length) * 100);
    const selectedMod = curriculum.find(m => m.id === selectedModule);

    return (
      <div className="min-h-screen particle-bg flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative max-w-md w-full overflow-hidden rounded-2xl bg-surface border border-border/50"
        >
          {/* Top gradient accent */}
          <div className={`h-1.5 w-full ${
            finalScore === 100 ? 'bg-gradient-to-r from-success to-accent' :
            finalScore >= 70 ? 'bg-gradient-to-r from-warning to-primary' :
            'bg-gradient-to-r from-error to-warning'
          }`} />

          <div className="p-8 text-center">
            {/* Animated trophy/emoji */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="text-6xl mb-5"
            >
              {finalScore === 100 ? '🏆' : finalScore >= 70 ? '🎉' : '💪'}
            </motion.div>

            <h2 className="text-2xl font-bold mb-1">
              {finalScore === 100 ? 'Perfect Score!' : finalScore >= 70 ? 'Great Job!' : 'Keep Practicing!'}
            </h2>
            <p className="text-foreground/40 text-sm mb-6">
              {selectedMod?.title}
            </p>

            {/* Score ring */}
            <div className="flex justify-center mb-6">
              <div className="relative w-28 h-28">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
                  <circle cx="56" cy="56" r="48" fill="none" stroke="currentColor" className="text-surface-light" strokeWidth="8" />
                  <motion.circle
                    cx="56" cy="56" r="48"
                    fill="none"
                    stroke={finalScore === 100 ? '#10b981' : finalScore >= 70 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${finalScore * 3.016} 301.6`}
                    initial={{ strokeDashoffset: 301.6 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className={`text-2xl font-bold ${
                      finalScore === 100 ? 'text-success' : finalScore >= 70 ? 'text-warning' : 'text-error'
                    }`}
                  >
                    {finalScore}%
                  </motion.span>
                  <span className="text-[10px] text-foreground/40">{correctCount}/{questions.length}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setSelectedAnswer(null);
                  setIsAnswered(false);
                  setCorrectCount(0);
                  setIsFinished(false);
                }}
                className="flex-1 py-3 rounded-xl bg-surface-light border border-border/50 text-foreground/60 hover:text-foreground hover:border-primary/30 transition-all flex items-center justify-center gap-2 text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Retry
              </button>
              <button
                onClick={reset}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all text-sm font-medium"
              >
                All Quizzes
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Quiz in progress ─────────────────────────────────────────
  const selectedMod = curriculum.find(m => m.id === selectedModule);
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen particle-bg">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-sm text-foreground/40 hover:text-foreground/60 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Exit
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-foreground/40">
                {selectedMod?.icon} {selectedMod?.title}
              </span>
              <span className="text-xs font-mono text-foreground/50 font-bold">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>
            <div className="h-2 rounded-full bg-surface-light overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {/* Question card */}
            <div className="rounded-2xl bg-surface border border-border/50 p-6 sm:p-8 mb-6">
              {/* Badges */}
              <div className="mb-4 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface-light text-foreground/50">
                  {getQuizTypeLabel(currentQ.type)}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getDifficultyLabel(currentQ.difficulty).color}`}>
                  {getDifficultyLabel(currentQ.difficulty).label}
                </span>
              </div>

              {/* Question text */}
              <h2 className="text-lg sm:text-xl font-bold leading-relaxed mb-6">
                {currentQ.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, i) => {
                  const isCorrect = i === currentQ.correctIndex;
                  const isSelected = i === selectedAnswer;

                  let cardStyle = 'bg-surface-light border-border/50 hover:border-primary/30 hover:bg-primary/5';
                  let letterStyle = 'bg-surface text-foreground/40';

                  if (isAnswered) {
                    if (isCorrect) {
                      cardStyle = 'bg-success/10 border-success/40';
                      letterStyle = 'bg-success/20 text-success';
                    } else if (isSelected) {
                      cardStyle = 'bg-error/10 border-error/40';
                      letterStyle = 'bg-error/20 text-error';
                    } else {
                      cardStyle = 'opacity-40 border-border/30';
                    }
                  } else if (isSelected) {
                    cardStyle = 'bg-primary/10 border-primary/40';
                    letterStyle = 'bg-primary/20 text-primary-light';
                  }

                  return (
                    <motion.button
                      key={i}
                      whileHover={!isAnswered ? { scale: 1.01, x: 4 } : {}}
                      whileTap={!isAnswered ? { scale: 0.99 } : {}}
                      onClick={() => handleAnswer(i)}
                      className={`w-full text-left rounded-xl p-4 flex items-center gap-3 transition-all border ${cardStyle}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${letterStyle}`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-sm flex-1">{option}</span>
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-error shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Explanation */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-surface border border-border/50 p-5 mb-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  {selectedAnswer === currentQ.correctIndex ? (
                    <div className="flex items-center gap-1.5 text-success text-sm font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      Correct!
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-error text-sm font-bold">
                      <XCircle className="w-4 h-4" />
                      Not quite
                    </div>
                  )}
                </div>
                <p className="text-sm text-foreground/60 leading-relaxed">{currentQ.explanation}</p>
              </motion.div>
            )}

            {/* Next button */}
            {isAnswered && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleNext}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2"
              >
                {currentIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Trophy className="w-4 h-4" />
                    See Results
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
