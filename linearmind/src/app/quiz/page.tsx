'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { quizQuestions, getQuizTypeLabel } from '@/lib/quiz-data';
import { curriculum } from '@/lib/curriculum';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
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
      const score = Math.round(((correctCount + (selectedAnswer === currentQ.correctIndex ? 0 : 0)) / questions.length) * 100);
      const finalCorrect = correctCount + (selectedAnswer === currentQ.correctIndex ? 1 : 0) - (isAnswered && selectedAnswer === currentQ.correctIndex ? 1 : 0);
      // Recalculate properly
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

  // Module selection
  if (!hydrated || loading || !authenticated) {
    return (
      <div className="min-h-screen particle-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!selectedModule) {
    return (
      <div className="min-h-screen particle-bg">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-2">📝 Quiz Center</h1>
            <p className="text-foreground/50 mb-8">Choose a module to test your knowledge</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {curriculum.map((module, i) => {
              const qCount = quizQuestions.filter((q) => q.moduleId === module.id).length;
              const prevScore = progress.quizScores[module.id];

              if (qCount === 0) return null;

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedModule(module.id)}
                  className="glass rounded-xl p-5 cursor-pointer hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${module.color}15` }}
                    >
                      {module.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{module.title}</h3>
                      <p className="text-xs text-foreground/40">{qCount} questions</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-foreground/20 group-hover:text-foreground/50" />
                  </div>
                  {prevScore !== undefined && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-surface-light rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${prevScore}%`,
                            backgroundColor: prevScore === 100 ? '#10b981' : prevScore >= 70 ? '#f59e0b' : '#ef4444',
                          }}
                        />
                      </div>
                      <span className="text-xs font-mono text-foreground/40">
                        Best: {prevScore}%
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Finished
  if (isFinished) {
    const finalScore = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="min-h-screen particle-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="text-5xl mb-4">
            {finalScore === 100 ? '🏆' : finalScore >= 70 ? '🎉' : '💪'}
          </div>
          <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-foreground/50 mb-6">
            You scored{' '}
            <span
              className={`font-bold ${
                finalScore === 100
                  ? 'text-success'
                  : finalScore >= 70
                  ? 'text-warning'
                  : 'text-error'
              }`}
            >
              {finalScore}%
            </span>{' '}
            ({correctCount}/{questions.length} correct)
          </p>

          <div className="h-3 bg-surface-light rounded-full overflow-hidden mb-6">
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor:
                  finalScore === 100 ? '#10b981' : finalScore >= 70 ? '#f59e0b' : '#ef4444',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${finalScore}%` }}
              transition={{ duration: 1 }}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex-1 py-3 rounded-lg bg-surface-light text-foreground/60 hover:text-foreground transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={reset}
              className="flex-1 py-3 rounded-lg bg-primary/20 text-primary-light hover:bg-primary/30 transition-colors"
            >
              Other Quizzes
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Quiz in progress
  return (
    <div className="min-h-screen particle-bg">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={reset} className="text-sm text-foreground/40 hover:text-foreground/60">
            ← Back
          </button>
          <div className="flex-1 h-1.5 bg-surface-light rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-mono text-foreground/40">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Question type badge */}
            <div className="mb-4">
              <span className="text-xs bg-surface-light px-2.5 py-1 rounded-full text-foreground/50">
                {getQuizTypeLabel(currentQ.type)}
              </span>
            </div>

            {/* Question */}
            <h2 className="text-xl font-semibold mb-6">{currentQ.question}</h2>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((option, i) => {
                let style = 'glass hover:border-primary/30';
                if (isAnswered) {
                  if (i === currentQ.correctIndex) {
                    style = 'border-success/50 bg-success/10';
                  } else if (i === selectedAnswer && i !== currentQ.correctIndex) {
                    style = 'border-error/50 bg-error/10';
                  } else {
                    style = 'opacity-50';
                  }
                } else if (i === selectedAnswer) {
                  style = 'border-primary/50 bg-primary/10';
                }

                return (
                  <motion.button
                    key={i}
                    whileHover={!isAnswered ? { scale: 1.01 } : {}}
                    whileTap={!isAnswered ? { scale: 0.99 } : {}}
                    onClick={() => handleAnswer(i)}
                    className={`w-full text-left rounded-xl p-4 flex items-center gap-3 transition-all border ${style}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center text-sm font-bold shrink-0">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-sm flex-1">{option}</span>
                    {isAnswered && i === currentQ.correctIndex && (
                      <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                    )}
                    {isAnswered && i === selectedAnswer && i !== currentQ.correctIndex && (
                      <XCircle className="w-5 h-5 text-error shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-4 mb-6"
              >
                <p className="text-sm font-semibold mb-1">
                  {selectedAnswer === currentQ.correctIndex ? '✅ Correct!' : '❌ Not quite.'}
                </p>
                <p className="text-sm text-foreground/60">{currentQ.explanation}</p>
              </motion.div>
            )}

            {/* Next button */}
            {isAnswered && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleNext}
                className="w-full py-3 rounded-lg bg-primary/20 text-primary-light hover:bg-primary/30 transition-colors font-medium flex items-center justify-center gap-2"
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
