'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Point {
  x: number;
  y: number;
}

function computeCorrelation(points: Point[]): number {
  if (points.length < 3) return 0;
  const n = points.length;
  const sumX = points.reduce((a, p) => a + p.x, 0);
  const sumY = points.reduce((a, p) => a + p.y, 0);
  const sumXY = points.reduce((a, p) => a + p.x * p.y, 0);
  const sumX2 = points.reduce((a, p) => a + p.x * p.x, 0);
  const sumY2 = points.reduce((a, p) => a + p.y * p.y, 0);
  const num = n * sumXY - sumX * sumY;
  const den = Math.sqrt((n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2));
  if (den === 0) return 0;
  return num / den;
}

function getCorrelationLabel(r: number): { text: string; color: string; emoji: string } {
  const abs = Math.abs(r);
  if (abs > 0.8) return { text: r > 0 ? 'Strong Positive' : 'Strong Negative', color: r > 0 ? 'text-success' : 'text-error', emoji: r > 0 ? '📈' : '📉' };
  if (abs > 0.5) return { text: r > 0 ? 'Moderate Positive' : 'Moderate Negative', color: 'text-warning', emoji: '📊' };
  if (abs > 0.2) return { text: 'Weak', color: 'text-foreground/50', emoji: '🤷' };
  return { text: 'No Correlation', color: 'text-foreground/30', emoji: '❌' };
}

function leastSquares(points: Point[]): { m: number; b: number } | null {
  if (points.length < 2) return null;
  const n = points.length;
  const sumX = points.reduce((a, p) => a + p.x, 0);
  const sumY = points.reduce((a, p) => a + p.y, 0);
  const sumXY = points.reduce((a, p) => a + p.x * p.y, 0);
  const sumX2 = points.reduce((a, p) => a + p.x * p.x, 0);
  const den = n * sumX2 - sumX ** 2;
  if (den === 0) return null;
  const m = (n * sumXY - sumX * sumY) / den;
  const b = (sumY - m * sumX) / n;
  return { m, b };
}

export default function CorrelationViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [challenge, setChallenge] = useState<string | null>(null);
  const [challengeResult, setChallengeResult] = useState<string | null>(null);

  const challenges = [
    { text: 'Draw a STRONG POSITIVE correlation', check: (r: number) => r > 0.8 },
    { text: 'Draw a STRONG NEGATIVE correlation', check: (r: number) => r < -0.8 },
    { text: 'Draw NO correlation (random scatter)', check: (r: number) => Math.abs(r) < 0.2 },
    { text: 'Draw a MODERATE correlation', check: (r: number) => Math.abs(r) > 0.4 && Math.abs(r) < 0.75 },
  ];

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

    // Background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 12);
    ctx.fill();

    // Grid
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
    }
    for (let i = 0; i < h; i += 40) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
    }

    // Axes labels
    ctx.font = '11px sans-serif';
    ctx.fillStyle = 'rgba(226, 232, 240, 0.3)';
    ctx.fillText('x →', w - 30, h - 8);
    ctx.fillText('y ↑', 8, 16);

    // Instruction
    if (points.length === 0) {
      ctx.fillStyle = 'rgba(226, 232, 240, 0.2)';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Click to place data points', w / 2, h / 2);
      ctx.textAlign = 'start';
      return;
    }

    // Regression line
    const line = leastSquares(points);
    if (line && points.length >= 3) {
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      const y0 = line.m * 0 + line.b;
      const y1 = line.m * w + line.b;
      ctx.moveTo(0, y0);
      ctx.lineTo(w, y1);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Points
    points.forEach((p, i) => {
      const r = computeCorrelation(points);
      const hue = r > 0 ? 140 : r < 0 ? 0 : 220;
      ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
      ctx.shadowColor = `hsla(${hue}, 70%, 60%, 0.4)`;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Point number
      ctx.fillStyle = 'rgba(226, 232, 240, 0.6)';
      ctx.font = '9px sans-serif';
      ctx.fillText(`${i + 1}`, p.x + 10, p.y - 5);
    });
  }, [points]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newPoints = [...points, { x, y }];
    setPoints(newPoints);

    // Check challenge
    if (challenge !== null) {
      const r = computeCorrelation(newPoints);
      const idx = challenges.findIndex(c => c.text === challenge);
      if (idx >= 0 && newPoints.length >= 8 && challenges[idx].check(r)) {
        setChallengeResult('🎉 Challenge Complete!');
      }
    }
  };

  const r = computeCorrelation(points);
  const label = getCorrelationLabel(r);

  const startChallenge = () => {
    const idx = Math.floor(Math.random() * challenges.length);
    setChallenge(challenges[idx].text);
    setChallengeResult(null);
    setPoints([]);
  };

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">🎨</span> Correlation Explorer
        </h3>
        <div className="text-right">
          <p className="text-xs text-foreground/40">Pearson r</p>
          <p className={`text-xl font-mono font-bold ${label.color}`}>
            {points.length >= 3 ? r.toFixed(3) : '—'}
          </p>
        </div>
      </div>

      {/* Challenge mode */}
      {challenge && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border border-primary/20 rounded-xl p-3 mb-4"
        >
          <p className="text-sm text-primary-light font-semibold">🎯 Challenge: {challenge}</p>
          <p className="text-xs text-foreground/40 mt-1">Place at least 8 points. ({points.length}/8)</p>
          {challengeResult && (
            <motion.p
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-sm text-success font-bold mt-2"
            >{challengeResult}</motion.p>
          )}
        </motion.div>
      )}

      {/* Correlation label */}
      {points.length >= 3 && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{label.emoji}</span>
          <span className={`text-sm font-semibold ${label.color}`}>{label.text}</span>
          <span className="text-xs text-foreground/30">({points.length} points)</span>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-64 rounded-xl cursor-crosshair"
      />

      {/* Controls */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => { setPoints([]); setChallengeResult(null); }}
          className="px-4 py-2 text-xs rounded-lg bg-surface-light text-foreground/50 hover:text-foreground/80 transition-colors"
        >
          🗑️ Clear
        </button>
        <button
          onClick={() => { if (points.length > 0) setPoints(points.slice(0, -1)); }}
          className="px-4 py-2 text-xs rounded-lg bg-surface-light text-foreground/50 hover:text-foreground/80 transition-colors"
        >
          ↩️ Undo
        </button>
        <button
          onClick={startChallenge}
          className="px-4 py-2 text-xs rounded-lg bg-primary/20 text-primary-light hover:bg-primary/30 transition-colors"
        >
          🎯 Challenge Me
        </button>
        <button
          onClick={() => {
            // Generate random scatter
            const pts: Point[] = [];
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            for (let i = 0; i < 15; i++) {
              pts.push({ x: 30 + Math.random() * (rect.width - 60), y: 30 + Math.random() * (rect.height - 60) });
            }
            setPoints(pts);
          }}
          className="px-4 py-2 text-xs rounded-lg bg-surface-light text-foreground/50 hover:text-foreground/80 transition-colors"
        >
          🎲 Random
        </button>
      </div>

      {/* Fun fact */}
      <div className="mt-4 bg-background/30 rounded-lg p-3">
        <p className="text-xs text-foreground/40">
          💡 <strong className="text-foreground/60">Fun fact:</strong> Even with r = 0.99, you cannot conclude causation. 
          Ice cream sales and drowning deaths correlate at r ≈ 0.85 every summer! (Both caused by hot weather.)
        </p>
      </div>
    </div>
  );
}
