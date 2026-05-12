'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Point {
  x: number;
  y: number;
}

function generateData(): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i < 25; i++) {
    const x = 1 + Math.random() * 9;
    const noise = (Math.random() - 0.5) * 4;
    const y = 2.5 * x + 5 + noise;
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

export default function ResidualsViz() {
  const scatterRef = useRef<HTMLCanvasElement>(null);
  const residualRef = useRef<HTMLCanvasElement>(null);
  const [seed, setSeed] = useState(0);

  const data = useMemo(() => generateData(), [seed]);
  const line = useMemo(() => fitLine(data), [data]);

  const residuals = useMemo(() => {
    return data.map(p => ({
      predicted: line.m * p.x + line.b,
      actual: p.y,
      x: p.x,
      residual: p.y - (line.m * p.x + line.b),
    }));
  }, [data, line]);

  const meanResidual = residuals.reduce((a, r) => a + r.residual, 0) / residuals.length;
  const stdResidual = Math.sqrt(residuals.reduce((a, r) => a + (r.residual - meanResidual) ** 2, 0) / residuals.length);
  const maxAbsResidual = Math.max(...residuals.map(r => Math.abs(r.residual)));

  const drawScatter = useCallback(() => {
    const canvas = scatterRef.current;
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
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 12);
    ctx.fill();

    const xMin = 0, xMax = 11;
    const allY = data.map(p => p.y);
    const yMin = Math.min(...allY) - 3;
    const yMax = Math.max(...allY) + 3;
    const pad = 25;

    const toCanvas = (px: number, py: number) => ({
      cx: pad + ((px - xMin) / (xMax - xMin)) * (w - 2 * pad),
      cy: h - pad - ((py - yMin) / (yMax - yMin)) * (h - 2 * pad),
    });

    // Grid
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.05)';
    ctx.lineWidth = 1;
    for (let i = pad; i < w; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, pad); ctx.lineTo(i, h - pad); ctx.stroke();
    }
    for (let i = pad; i < h; i += 30) {
      ctx.beginPath(); ctx.moveTo(pad, i); ctx.lineTo(w - pad, i); ctx.stroke();
    }

    // Residual lines
    residuals.forEach(r => {
      const { cx, cy: cy1 } = toCanvas(r.x, r.actual);
      const { cy: cy2 } = toCanvas(r.x, r.predicted);
      const isPos = r.residual >= 0;
      ctx.strokeStyle = isPos ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy1);
      ctx.lineTo(cx, cy2);
      ctx.stroke();
    });

    // Regression line
    const start = toCanvas(xMin, line.m * xMin + line.b);
    const end = toCanvas(xMax, line.m * xMax + line.b);
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(start.cx, start.cy);
    ctx.lineTo(end.cx, end.cy);
    ctx.stroke();

    // Data points
    data.forEach(p => {
      const { cx, cy } = toCanvas(p.x, p.y);
      const pred = line.m * p.x + line.b;
      const isAbove = p.y >= pred;
      ctx.fillStyle = isAbove ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)';
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Label
    ctx.fillStyle = 'rgba(226, 232, 240, 0.3)';
    ctx.font = '11px sans-serif';
    ctx.fillText('Scatter Plot + Residuals', pad + 5, pad + 12);
  }, [data, line, residuals]);

  const drawResidualPlot = useCallback(() => {
    const canvas = residualRef.current;
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
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 12);
    ctx.fill();

    const pad = 25;
    const predMin = Math.min(...residuals.map(r => r.predicted)) - 2;
    const predMax = Math.max(...residuals.map(r => r.predicted)) + 2;
    const resRange = maxAbsResidual + 1;

    const toCanvas = (pred: number, res: number) => ({
      cx: pad + ((pred - predMin) / (predMax - predMin)) * (w - 2 * pad),
      cy: h / 2 - (res / resRange) * (h / 2 - pad),
    });

    // Grid
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.05)';
    ctx.lineWidth = 1;
    for (let i = pad; i < w; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, pad); ctx.lineTo(i, h - pad); ctx.stroke();
    }

    // Zero line
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(pad, h / 2);
    ctx.lineTo(w - pad, h / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // ±1σ bands
    ctx.fillStyle = 'rgba(99, 102, 241, 0.04)';
    const y1 = h / 2 - (stdResidual / resRange) * (h / 2 - pad);
    const y2 = h / 2 + (stdResidual / resRange) * (h / 2 - pad);
    ctx.fillRect(pad, y1, w - 2 * pad, y2 - y1);

    ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
    ctx.font = '9px sans-serif';
    ctx.fillText('+1σ', w - pad + 3, y1 + 3);
    ctx.fillText('-1σ', w - pad + 3, y2 + 3);

    // Residual points
    residuals.forEach(r => {
      const { cx, cy } = toCanvas(r.predicted, r.residual);
      const isPos = r.residual >= 0;
      ctx.fillStyle = isPos ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)';
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();

      // Vertical line to zero
      ctx.strokeStyle = isPos ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, h / 2);
      ctx.stroke();
    });

    // Labels
    ctx.fillStyle = 'rgba(226, 232, 240, 0.3)';
    ctx.font = '11px sans-serif';
    ctx.fillText('Residual Plot (predicted vs. error)', pad + 5, pad + 12);
    ctx.fillText('Predicted →', w / 2 - 25, h - 5);
  }, [residuals, maxAbsResidual, stdResidual]);

  useEffect(() => {
    drawScatter();
    drawResidualPlot();
  }, [drawScatter, drawResidualPlot]);

  // Determine health of residuals
  const isHealthy = Math.abs(meanResidual) < 0.5 && maxAbsResidual < stdResidual * 3;

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">🔬</span> Residual Analysis
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full ${isHealthy ? 'bg-success/10 text-success border border-success/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>
          {isHealthy ? '✅ Healthy residuals' : '⚠️ Check pattern'}
        </span>
      </div>

      {/* Side by side plots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <canvas ref={scatterRef} className="w-full h-48 rounded-xl" />
        <canvas ref={residualRef} className="w-full h-48 rounded-xl" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-background/30 rounded-lg p-3 text-center">
          <p className="text-xs text-foreground/40 mb-1">Mean Residual</p>
          <p className={`text-sm font-mono font-bold ${Math.abs(meanResidual) < 0.5 ? 'text-success' : 'text-warning'}`}>
            {meanResidual.toFixed(3)}
          </p>
          <p className="text-xs text-foreground/25 mt-0.5">should be ≈ 0</p>
        </div>
        <div className="bg-background/30 rounded-lg p-3 text-center">
          <p className="text-xs text-foreground/40 mb-1">Std Deviation</p>
          <p className="text-sm font-mono font-bold text-primary">{stdResidual.toFixed(3)}</p>
          <p className="text-xs text-foreground/25 mt-0.5">spread of errors</p>
        </div>
        <div className="bg-background/30 rounded-lg p-3 text-center">
          <p className="text-xs text-foreground/40 mb-1">Max |Error|</p>
          <p className="text-sm font-mono font-bold text-error">{maxAbsResidual.toFixed(3)}</p>
          <p className="text-xs text-foreground/25 mt-0.5">worst prediction</p>
        </div>
      </div>

      <button
        onClick={() => setSeed(s => s + 1)}
        className="px-4 py-2 text-xs rounded-lg bg-surface-light text-foreground/50 hover:text-foreground/80 transition-colors"
      >
        🎲 New Data
      </button>

      <div className="mt-4 bg-background/30 rounded-lg p-3">
        <p className="text-xs text-foreground/40">
          💡 <strong className="text-foreground/60">Left:</strong> Scatter plot with regression line. Green lines = positive residuals (actual &gt; predicted). Red = negative.
          <strong className="text-foreground/60 ml-1">Right:</strong> Residual plot — healthy models show random scatter around zero with no patterns.
        </p>
      </div>
    </div>
  );
}
