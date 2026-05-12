'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

type FailureMode = 'normal' | 'outliers' | 'nonlinear' | 'noisy';

export default function FailureCasesViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<FailureMode>('normal');

  const generatePoints = useCallback((m: FailureMode) => {
    const base = Array.from({ length: 20 }, (_, i) => {
      const x = 30 + i * 25;
      const y = 350 - i * 14 + (Math.random() - 0.5) * 30;
      return { x, y };
    });

    switch (m) {
      case 'outliers':
        return [
          ...base,
          { x: 100, y: 30 },
          { x: 400, y: 380 },
          { x: 250, y: 20 },
        ];
      case 'nonlinear':
        return Array.from({ length: 25 }, (_, i) => {
          const x = 20 + i * 22;
          const t = (x - 280) / 100;
          const y = 200 + t * t * 120 + (Math.random() - 0.5) * 20;
          return { x, y };
        });
      case 'noisy':
        return Array.from({ length: 30 }, (_, i) => {
          const x = 20 + i * 18;
          const y = 350 - i * 10 + (Math.random() - 0.5) * 160;
          return { x, y };
        });
      default:
        return base;
    }
  }, []);

  const [points, setPoints] = useState(() => generatePoints('normal'));

  useEffect(() => {
    setPoints(generatePoints(mode));
  }, [mode, generatePoints]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
    }
    for (let i = 0; i < h; i += 40) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
    }

    // Calculate regression
    const n = points.length;
    const sumX = points.reduce((s, p) => s + p.x, 0);
    const sumY = points.reduce((s, p) => s + p.y, 0);
    const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
    const sumXX = points.reduce((s, p) => s + p.x * p.x, 0);
    const denom = n * sumXX - sumX * sumX;
    const slope = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
    const intercept = (sumY - slope * sumX) / n;

    // Error lines
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    points.forEach((p) => {
      const predicted = slope * p.x + intercept;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, predicted);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // For nonlinear, also draw the true curve
    if (mode === 'nonlinear') {
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      for (let x = 20; x <= 540; x += 2) {
        const t = (x - 280) / 100;
        const y = 200 + t * t * 120;
        if (x === 20) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Regression line
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.9)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, intercept);
    ctx.lineTo(w, slope * w + intercept);
    ctx.stroke();

    // Points
    points.forEach((p) => {
      const isOutlier = mode === 'outliers' && (p.y < 50 || p.y > 370);
      ctx.fillStyle = isOutlier
        ? 'rgba(239, 68, 68, 0.9)'
        : 'rgba(168, 85, 247, 0.8)';
      ctx.shadowColor = isOutlier
        ? 'rgba(239, 68, 68, 0.4)'
        : 'rgba(168, 85, 247, 0.4)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, isOutlier ? 8 : 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Mode label
    ctx.font = 'bold 13px sans-serif';
    const labels: Record<FailureMode, { text: string; color: string }> = {
      normal: { text: '✅ Normal Data — Good Fit', color: 'rgba(16, 185, 129, 0.8)' },
      outliers: { text: '🎯 Outliers — Line Distorted!', color: 'rgba(239, 68, 68, 0.8)' },
      nonlinear: { text: '🔄 Nonlinear — Line Cannot Curve!', color: 'rgba(245, 158, 11, 0.8)' },
      noisy: { text: '🌊 Noisy Data — Unreliable Fit', color: 'rgba(168, 85, 247, 0.8)' },
    };
    ctx.fillStyle = labels[mode].color;
    ctx.fillText(labels[mode].text, 10, 22);
  }, [points, mode]);

  useEffect(() => {
    draw();
  }, [draw]);

  const mse =
    points.reduce((sum, p) => {
      const n = points.length;
      const sumX = points.reduce((s, p) => s + p.x, 0);
      const sumY = points.reduce((s, p) => s + p.y, 0);
      const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
      const sumXX = points.reduce((s, p) => s + p.x * p.x, 0);
      const denom = n * sumXX - sumX * sumX;
      const slope = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
      const intercept = (sumY - slope * sumX) / n;
      const predicted = slope * p.x + intercept;
      return sum + (p.y - predicted) ** 2;
    }, 0) / points.length;

  const modes: { id: FailureMode; label: string; icon: string }[] = [
    { id: 'normal', label: 'Normal', icon: '✅' },
    { id: 'outliers', label: 'Outliers', icon: '🎯' },
    { id: 'nonlinear', label: 'Nonlinear', icon: '🔄' },
    { id: 'noisy', label: 'Noisy', icon: '🌊' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === m.id
                ? 'bg-primary/30 text-primary-light border border-primary/40'
                : 'bg-surface-light text-foreground/60 hover:text-foreground border border-transparent'
            }`}
          >
            {m.icon} {m.label}
          </button>
        ))}
        <button
          onClick={() => setPoints(generatePoints(mode))}
          className="px-4 py-2 rounded-lg text-sm bg-surface-light text-foreground/50 hover:text-foreground transition-colors ml-auto"
        >
          🔄 Regenerate
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="gradient-border rounded-xl overflow-hidden"
      >
        <canvas ref={canvasRef} className="w-full h-[380px] bg-surface/50" />
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-xs text-foreground/50 mb-1">Points</p>
          <p className="text-lg font-bold text-primary-light">{points.length}</p>
        </div>
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-xs text-foreground/50 mb-1">MSE</p>
          <p className={`text-lg font-bold ${mse < 500 ? 'text-success' : mse < 2000 ? 'text-warning' : 'text-error'}`}>
            {mse.toFixed(0)}
          </p>
        </div>
      </div>

      <div className="glass rounded-lg p-3">
        <p className="text-sm text-foreground/70">
          {mode === 'normal' && '✅ With clean, linear data, the regression line fits well and the MSE is low.'}
          {mode === 'outliers' && '⚠️ Outliers pull the regression line toward them, distorting predictions for the majority of points.'}
          {mode === 'nonlinear' && '⚠️ The green dashed curve shows the true relationship. A straight line cannot capture it — this is underfitting.'}
          {mode === 'noisy' && '⚠️ Heavy noise makes the pattern unclear. The model fits noise rather than signal, reducing prediction reliability.'}
        </p>
      </div>
    </div>
  );
}
