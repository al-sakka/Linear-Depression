'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Point {
  x: number;
  y: number;
}

function generateLinearData(): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i < 20; i++) {
    const x = 1 + Math.random() * 9;
    const noise = (Math.random() - 0.5) * 4;
    const y = 2.5 * x + 3 + noise;
    pts.push({ x, y });
  }
  return pts;
}

function fitLine(points: Point[]): { m: number; b: number } {
  const n = points.length;
  const sumX = points.reduce((a, p) => a + p.x, 0);
  const sumY = points.reduce((a, p) => a + p.y, 0);
  const sumXY = points.reduce((a, p) => a + p.x * p.y, 0);
  const sumX2 = points.reduce((a, p) => a + p.x * p.x, 0);
  const den = n * sumX2 - sumX ** 2;
  if (den === 0) return { m: 0, b: sumY / n };
  const m = (n * sumXY - sumX * sumY) / den;
  const b = (sumY - m * sumX) / n;
  return { m, b };
}

export default function MetricsViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [slopeOffset, setSlopeOffset] = useState(0);
  const [interceptOffset, setInterceptOffset] = useState(0);
  const [seed, setSeed] = useState(0);

  const data = useMemo(() => generateLinearData(), [seed]);
  const bestFit = useMemo(() => fitLine(data), [data]);

  const currentM = bestFit.m + slopeOffset;
  const currentB = bestFit.b + interceptOffset;

  // Compute all metrics
  const metrics = useMemo(() => {
    const errors = data.map(p => p.y - (currentM * p.x + currentB));
    const absErrors = errors.map(e => Math.abs(e));
    const sqErrors = errors.map(e => e * e);

    const mae = absErrors.reduce((a, e) => a + e, 0) / data.length;
    const mse = sqErrors.reduce((a, e) => a + e, 0) / data.length;
    const rmse = Math.sqrt(mse);

    const meanY = data.reduce((a, p) => a + p.y, 0) / data.length;
    const ssTotal = data.reduce((a, p) => a + (p.y - meanY) ** 2, 0);
    const ssRes = sqErrors.reduce((a, e) => a + e, 0);
    const r2 = 1 - ssRes / ssTotal;

    return { mae, mse, rmse, r2 };
  }, [data, currentM, currentB]);

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
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
    }
    for (let i = 0; i < h; i += 40) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
    }

    // Map data to canvas
    const xMin = 0, xMax = 11;
    const allY = data.map(p => p.y);
    const yMin = Math.min(...allY) - 5;
    const yMax = Math.max(...allY) + 5;

    const toCanvas = (px: number, py: number) => ({
      cx: 20 + ((px - xMin) / (xMax - xMin)) * (w - 40),
      cy: h - 20 - ((py - yMin) / (yMax - yMin)) * (h - 40),
    });

    // Draw error lines
    data.forEach(p => {
      const pred = currentM * p.x + currentB;
      const { cx, cy: cy1 } = toCanvas(p.x, p.y);
      const { cy: cy2 } = toCanvas(p.x, pred);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cx, cy1);
      ctx.lineTo(cx, cy2);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw regression line
    const y0 = currentM * xMin + currentB;
    const y1 = currentM * xMax + currentB;
    const start = toCanvas(xMin, y0);
    const end = toCanvas(xMax, y1);
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.9)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(start.cx, start.cy);
    ctx.lineTo(end.cx, end.cy);
    ctx.stroke();

    // Draw points
    data.forEach(p => {
      const { cx, cy } = toCanvas(p.x, p.y);
      ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [data, currentM, currentB]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">📊</span> Metrics Playground
        </h3>
        <button
          onClick={() => { setSeed(s => s + 1); setSlopeOffset(0); setInterceptOffset(0); }}
          className="px-3 py-1 text-xs rounded-lg bg-surface-light text-foreground/50 hover:text-foreground/80 transition-colors"
        >
          🎲 New Data
        </button>
      </div>

      {/* Line adjustment sliders */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-foreground/50">Slope Offset</span>
            <span className="text-primary font-mono">{slopeOffset > 0 ? '+' : ''}{slopeOffset.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={-3}
            max={3}
            step={0.1}
            value={slopeOffset}
            onChange={(e) => setSlopeOffset(Number(e.target.value))}
            className="w-full accent-primary h-1.5"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-foreground/50">Intercept Offset</span>
            <span className="text-secondary font-mono">{interceptOffset > 0 ? '+' : ''}{interceptOffset.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={-10}
            max={10}
            step={0.5}
            value={interceptOffset}
            onChange={(e) => setInterceptOffset(Number(e.target.value))}
            className="w-full accent-secondary h-1.5"
          />
        </div>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} className="w-full h-48 rounded-xl mb-5" />

      {/* Metrics cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <motion.div
          animate={{ scale: slopeOffset === 0 && interceptOffset === 0 ? 1.02 : 1 }}
          className="bg-primary/5 rounded-xl p-3 border border-primary/10"
        >
          <p className="text-xs text-primary/70 mb-0.5">MAE</p>
          <p className="text-lg font-mono font-bold text-primary">{metrics.mae.toFixed(2)}</p>
          <p className="text-xs text-foreground/30 mt-1">Avg |error|</p>
        </motion.div>
        <motion.div
          animate={{ scale: slopeOffset === 0 && interceptOffset === 0 ? 1.02 : 1 }}
          className="bg-secondary/5 rounded-xl p-3 border border-secondary/10"
        >
          <p className="text-xs text-secondary/70 mb-0.5">MSE</p>
          <p className="text-lg font-mono font-bold text-secondary">{metrics.mse.toFixed(2)}</p>
          <p className="text-xs text-foreground/30 mt-1">Avg error²</p>
        </motion.div>
        <motion.div
          animate={{ scale: slopeOffset === 0 && interceptOffset === 0 ? 1.02 : 1 }}
          className="bg-accent/5 rounded-xl p-3 border border-accent/10"
        >
          <p className="text-xs text-accent/70 mb-0.5">RMSE</p>
          <p className="text-lg font-mono font-bold text-accent">{metrics.rmse.toFixed(2)}</p>
          <p className="text-xs text-foreground/30 mt-1">√MSE</p>
        </motion.div>
        <motion.div
          animate={{ scale: slopeOffset === 0 && interceptOffset === 0 ? 1.02 : 1 }}
          className={`rounded-xl p-3 border ${
            metrics.r2 > 0.8 ? 'bg-success/5 border-success/10' : metrics.r2 > 0.5 ? 'bg-warning/5 border-warning/10' : 'bg-error/5 border-error/10'
          }`}
        >
          <p className={`text-xs mb-0.5 ${metrics.r2 > 0.8 ? 'text-success/70' : metrics.r2 > 0.5 ? 'text-warning/70' : 'text-error/70'}`}>R²</p>
          <p className={`text-lg font-mono font-bold ${metrics.r2 > 0.8 ? 'text-success' : metrics.r2 > 0.5 ? 'text-warning' : 'text-error'}`}>{metrics.r2.toFixed(3)}</p>
          <p className="text-xs text-foreground/30 mt-1">{(metrics.r2 * 100).toFixed(0)}% explained</p>
        </motion.div>
      </div>

      {/* Reset to best fit button */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => { setSlopeOffset(0); setInterceptOffset(0); }}
          className="px-4 py-2 text-xs rounded-lg bg-success/20 text-success hover:bg-success/30 transition-colors"
        >
          ✨ Snap to Best Fit
        </button>
        <button
          onClick={() => { setSlopeOffset((Math.random() - 0.5) * 4); setInterceptOffset((Math.random() - 0.5) * 15); }}
          className="px-4 py-2 text-xs rounded-lg bg-error/20 text-error hover:bg-error/30 transition-colors"
        >
          🎲 Random Bad Fit
        </button>
      </div>

      {/* Insight */}
      <div className="mt-4 bg-background/30 rounded-lg p-3">
        <p className="text-xs text-foreground/40">
          💡 Notice: MSE grows much faster than MAE when you move the line — it penalizes large errors heavily.
          R² = 1.0 means perfect fit, R² = 0 means no better than guessing the average.
        </p>
      </div>
    </div>
  );
}
