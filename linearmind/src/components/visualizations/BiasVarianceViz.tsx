'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Point {
  x: number;
  y: number;
}

function generateData(n: number): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i < n; i++) {
    const x = Math.random() * 10;
    const noise = (Math.random() - 0.5) * 3;
    const y = 0.5 * x * x - 2 * x + 3 + noise; // quadratic truth
    pts.push({ x, y });
  }
  return pts;
}

function fitPolynomial(points: Point[], degree: number): number[] {
  // Fit polynomial using least squares (simple Vandermonde approach)
  const n = points.length;
  const d = degree + 1;
  
  // Build Vandermonde matrix X and vector y
  const X: number[][] = points.map(p => {
    const row: number[] = [];
    for (let j = 0; j < d; j++) row.push(Math.pow(p.x, j));
    return row;
  });
  const y = points.map(p => p.y);

  // XᵀX
  const XtX: number[][] = Array.from({ length: d }, () => Array(d).fill(0));
  for (let i = 0; i < d; i++) {
    for (let j = 0; j < d; j++) {
      for (let k = 0; k < n; k++) {
        XtX[i][j] += X[k][i] * X[k][j];
      }
    }
  }

  // Xᵀy
  const Xty: number[] = Array(d).fill(0);
  for (let i = 0; i < d; i++) {
    for (let k = 0; k < n; k++) {
      Xty[i] += X[k][i] * y[k];
    }
  }

  // Solve using Gaussian elimination
  const aug: number[][] = XtX.map((row, i) => [...row, Xty[i]]);
  for (let i = 0; i < d; i++) {
    let maxRow = i;
    for (let k = i + 1; k < d; k++) {
      if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) maxRow = k;
    }
    [aug[i], aug[maxRow]] = [aug[maxRow], aug[i]];
    if (Math.abs(aug[i][i]) < 1e-10) continue;
    for (let k = i + 1; k < d; k++) {
      const factor = aug[k][i] / aug[i][i];
      for (let j = i; j <= d; j++) aug[k][j] -= factor * aug[i][j];
    }
  }
  const coeffs = Array(d).fill(0);
  for (let i = d - 1; i >= 0; i--) {
    coeffs[i] = aug[i][d];
    for (let j = i + 1; j < d; j++) coeffs[i] -= aug[i][j] * coeffs[j];
    coeffs[i] /= aug[i][i] || 1;
  }
  return coeffs;
}

function evalPoly(coeffs: number[], x: number): number {
  return coeffs.reduce((sum, c, i) => sum + c * Math.pow(x, i), 0);
}

function computeMSE(points: Point[], coeffs: number[]): number {
  const sum = points.reduce((a, p) => a + (p.y - evalPoly(coeffs, p.x)) ** 2, 0);
  return sum / points.length;
}

export default function BiasVarianceViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [degree, setDegree] = useState(1);
  const [seed, setSeed] = useState(0);

  const allData = useMemo(() => generateData(30), [seed]);
  const trainData = useMemo(() => allData.slice(0, 20), [allData]);
  const testData = useMemo(() => allData.slice(20), [allData]);

  const coeffs = useMemo(() => fitPolynomial(trainData, degree), [trainData, degree]);
  const trainMSE = useMemo(() => computeMSE(trainData, coeffs), [trainData, coeffs]);
  const testMSE = useMemo(() => computeMSE(testData, coeffs), [testData, coeffs]);

  const getModelState = () => {
    if (degree <= 1 && testMSE > 5) return { label: 'Underfitting', color: 'text-warning', emoji: '📖' };
    if (testMSE > trainMSE * 3 || degree > 8) return { label: 'Overfitting', color: 'text-error', emoji: '🤓' };
    return { label: 'Good Fit!', color: 'text-success', emoji: '✅' };
  };
  const state = getModelState();

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

    // Data range
    const xMin = 0, xMax = 10;
    const allY = allData.map(p => p.y);
    const yMin = Math.min(...allY) - 2;
    const yMax = Math.max(...allY) + 2;

    const toCanvas = (px: number, py: number) => ({
      cx: 30 + ((px - xMin) / (xMax - xMin)) * (w - 60),
      cy: h - 30 - ((py - yMin) / (yMax - yMin)) * (h - 60),
    });

    // Draw regression curve
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.9)';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(99, 102, 241, 0.3)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    for (let px = xMin; px <= xMax; px += 0.05) {
      const py = evalPoly(coeffs, px);
      const { cx, cy } = toCanvas(px, py);
      if (px === xMin) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Training points (circles)
    trainData.forEach(p => {
      const { cx, cy } = toCanvas(p.x, p.y);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.7)';
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Test points (diamonds)
    testData.forEach(p => {
      const { cx, cy } = toCanvas(p.x, p.y);
      ctx.fillStyle = 'rgba(249, 115, 22, 0.8)';
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-4, -4, 8, 8);
      ctx.restore();
    });

    // Legend
    ctx.font = '11px sans-serif';
    ctx.fillStyle = 'rgba(99, 102, 241, 0.8)';
    ctx.fillText('● Train', w - 110, 20);
    ctx.fillStyle = 'rgba(249, 115, 22, 0.8)';
    ctx.fillText('◆ Test', w - 50, 20);
  }, [allData, trainData, testData, coeffs]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">⚖️</span> Bias-Variance Tradeoff
        </h3>
        <div className="text-right">
          <span className={`text-lg font-bold ${state.color}`}>{state.emoji} {state.label}</span>
        </div>
      </div>

      {/* Model complexity slider */}
      <div className="mb-5">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-foreground/50">Model Complexity (Polynomial Degree)</span>
          <span className="text-primary font-mono font-bold">{degree}</span>
        </div>
        <input
          type="range"
          min={1}
          max={15}
          value={degree}
          onChange={(e) => setDegree(Number(e.target.value))}
          className="w-full accent-primary h-2"
        />
        <div className="flex justify-between text-xs text-foreground/30 mt-1">
          <span>Simple (underfits)</span>
          <span>Complex (overfits)</span>
        </div>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} className="w-full h-56 rounded-xl mb-4" />

      {/* MSE comparison */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
          <p className="text-xs text-primary/70 mb-1">Training MSE</p>
          <p className="text-lg font-mono font-bold text-primary">{trainMSE.toFixed(2)}</p>
          <div className="h-1.5 bg-surface-light rounded-full mt-2 overflow-hidden">
            <motion.div
              className="h-full bg-primary/50 rounded-full"
              animate={{ width: `${Math.min(100, (trainMSE / 20) * 100)}%` }}
            />
          </div>
        </div>
        <div className="bg-orange-500/5 rounded-xl p-3 border border-orange-500/10">
          <p className="text-xs text-orange-400/70 mb-1">Test MSE</p>
          <p className="text-lg font-mono font-bold text-orange-400">{testMSE.toFixed(2)}</p>
          <div className="h-1.5 bg-surface-light rounded-full mt-2 overflow-hidden">
            <motion.div
              className="h-full bg-orange-500/50 rounded-full"
              animate={{ width: `${Math.min(100, (testMSE / 20) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className="bg-background/30 rounded-lg p-3">
        <p className="text-xs text-foreground/50">
          {degree <= 1 && '📖 The model is too simple — it cannot capture the curved pattern. Try increasing complexity.'}
          {degree >= 2 && degree <= 4 && trainMSE < 5 && testMSE < 8 && '✅ Good balance! The model captures the pattern without memorizing noise.'}
          {degree > 4 && degree <= 8 && '⚠️ Getting complex... notice test MSE rising while train MSE keeps dropping.'}
          {degree > 8 && '🤓 Way too complex! The model memorizes training data (low train error) but fails on new data (high test error). This is overfitting!'}
        </p>
      </div>

      {/* New data button */}
      <button
        onClick={() => setSeed(s => s + 1)}
        className="mt-3 px-4 py-2 text-xs rounded-lg bg-surface-light text-foreground/50 hover:text-foreground/80 transition-colors"
      >
        🎲 Generate New Data
      </button>
    </div>
  );
}
