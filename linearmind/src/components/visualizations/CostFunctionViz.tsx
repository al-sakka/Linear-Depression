'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function CostFunctionViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lineOffset, setLineOffset] = useState(0);

  const points = [
    { x: 60, y: 320 },
    { x: 120, y: 280 },
    { x: 180, y: 240 },
    { x: 240, y: 190 },
    { x: 300, y: 160 },
    { x: 360, y: 130 },
    { x: 420, y: 90 },
    { x: 480, y: 60 },
  ];

  // Best fit
  const n = points.length;
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumXX = points.reduce((s, p) => s + p.x * p.x, 0);
  const bestSlope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const bestIntercept = (sumY - bestSlope * sumX) / n;

  const currentIntercept = bestIntercept + lineOffset;

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

    // Error bars (squared area visualization)
    points.forEach((p) => {
      const predicted = bestSlope * p.x + currentIntercept;
      const error = Math.abs(p.y - predicted);

      // Error square
      const alpha = Math.min(error / 100, 0.5);
      ctx.fillStyle = `rgba(239, 68, 68, ${alpha * 0.3})`;
      ctx.strokeStyle = `rgba(239, 68, 68, ${alpha * 0.6})`;
      ctx.lineWidth = 1;
      const size = error;
      if (p.y > predicted) {
        ctx.fillRect(p.x - size / 2, predicted, size, p.y - predicted);
        ctx.strokeRect(p.x - size / 2, predicted, size, p.y - predicted);
      } else {
        ctx.fillRect(p.x - size / 2, p.y, size, predicted - p.y);
        ctx.strokeRect(p.x - size / 2, p.y, size, predicted - p.y);
      }

      // Error line
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, predicted);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Regression line
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.9)';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(99, 102, 241, 0.3)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, currentIntercept);
    ctx.lineTo(w, bestSlope * w + currentIntercept);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Points
    points.forEach((p) => {
      ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
      ctx.shadowColor = 'rgba(168, 85, 247, 0.4)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }, [currentIntercept, bestSlope]);

  useEffect(() => {
    draw();
  }, [draw]);

  const mse =
    points.reduce((sum, p) => {
      const predicted = bestSlope * p.x + currentIntercept;
      return sum + (p.y - predicted) ** 2;
    }, 0) / n;

  const maxMSE = 40000;
  const msePercent = Math.min((mse / maxMSE) * 100, 100);

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="gradient-border rounded-xl overflow-hidden"
      >
        <canvas ref={canvasRef} className="w-full h-[380px] bg-surface/50" />
      </motion.div>

      <div className="glass rounded-lg p-4">
        <label className="flex items-center justify-between text-sm mb-2">
          <span className="text-foreground/70">Drag line offset</span>
          <span className="font-mono text-primary-light">{lineOffset > 0 ? '+' : ''}{lineOffset.toFixed(0)}</span>
        </label>
        <input
          type="range"
          min={-200}
          max={200}
          step={1}
          value={lineOffset}
          onChange={(e) => setLineOffset(parseFloat(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-foreground/40 mt-1">
          <span>Move Up</span>
          <span>Best Fit</span>
          <span>Move Down</span>
        </div>
      </div>

      {/* MSE Meter */}
      <div className="glass rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-foreground/70">Mean Squared Error (MSE)</span>
          <span className={`font-mono font-bold text-lg ${mse < 500 ? 'text-success' : mse < 5000 ? 'text-warning' : 'text-error'}`}>
            {mse.toFixed(0)}
          </span>
        </div>
        <div className="h-3 bg-surface-light rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: mse < 500
                ? 'linear-gradient(90deg, #10b981, #34d399)'
                : mse < 5000
                ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                : 'linear-gradient(90deg, #ef4444, #f87171)',
            }}
            animate={{ width: `${msePercent}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>
        <div className="flex justify-between text-xs text-foreground/40 mt-1">
          <span>Perfect ✨</span>
          <span>Terrible 💥</span>
        </div>
      </div>

      <p className="text-xs text-foreground/50 text-center">
        The red squares represent squared errors. Notice how they grow dramatically as you move the line away!
      </p>
    </div>
  );
}
