'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MousePointerClick, Trash2, RotateCcw, Download, Upload,
  Eye, EyeOff, TrendingUp, BarChart3, Sigma, Sparkles,
  Plus, Minus, Shuffle, Grid3X3, Layers, Info, Play, Pause, SkipForward
} from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

// ─── Dataset Presets ────────────────────────────────────
const PRESETS: { name: string; icon: string; desc: string; points: Point[] }[] = [
  {
    name: 'Linear', icon: '📈', desc: 'Clean linear relationship',
    points: [
      { x: 50, y: 340 }, { x: 100, y: 300 }, { x: 150, y: 280 },
      { x: 200, y: 240 }, { x: 260, y: 210 }, { x: 320, y: 170 },
      { x: 380, y: 150 }, { x: 440, y: 110 }, { x: 500, y: 80 },
    ],
  },
  {
    name: 'Noisy', icon: '🌊', desc: 'Linear with high noise',
    points: Array.from({ length: 20 }, (_, i) => ({
      x: 40 + i * 25,
      y: 320 - i * 12 + (Math.sin(i * 1.7) * 60),
    })),
  },
  {
    name: 'Outlier', icon: '⚡', desc: 'One extreme outlier',
    points: [
      { x: 60, y: 300 }, { x: 120, y: 270 }, { x: 180, y: 240 },
      { x: 240, y: 210 }, { x: 300, y: 180 }, { x: 360, y: 150 },
      { x: 420, y: 120 }, { x: 300, y: 30 }, // outlier
    ],
  },
  {
    name: 'Quadratic', icon: '🔄', desc: 'Curved — linear fails here',
    points: Array.from({ length: 15 }, (_, i) => {
      const x = 40 + i * 35;
      const t = (i - 7) / 7;
      return { x, y: 200 + t * t * 150 };
    }),
  },
  {
    name: 'Clusters', icon: '🎯', desc: 'Two separate clusters',
    points: [
      ...Array.from({ length: 8 }, () => ({
        x: 60 + Math.random() * 80,
        y: 280 + (Math.random() - 0.5) * 60,
      })),
      ...Array.from({ length: 8 }, () => ({
        x: 380 + Math.random() * 80,
        y: 100 + (Math.random() - 0.5) * 60,
      })),
    ],
  },
  {
    name: 'No Trend', icon: '🎲', desc: 'Random scatter, no relationship',
    points: Array.from({ length: 18 }, () => ({
      x: 40 + Math.random() * 480,
      y: 40 + Math.random() * 320,
    })),
  },
];

// ─── Helper Functions ───────────────────────────────────
function calcRegression(pts: Point[]) {
  if (pts.length < 2) return { slope: 0, intercept: 200, r2: 0 };
  const n = pts.length;
  const sumX = pts.reduce((s, p) => s + p.x, 0);
  const sumY = pts.reduce((s, p) => s + p.y, 0);
  const sumXY = pts.reduce((s, p) => s + p.x * p.y, 0);
  const sumXX = pts.reduce((s, p) => s + p.x * p.x, 0);
  const sumYY = pts.reduce((s, p) => s + p.y * p.y, 0);
  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return { slope: 0, intercept: sumY / n, r2: 0 };
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  // R²
  const ssRes = pts.reduce((s, p) => s + (p.y - (slope * p.x + intercept)) ** 2, 0);
  const meanY = sumY / n;
  const ssTot = pts.reduce((s, p) => s + (p.y - meanY) ** 2, 0);
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
  return { slope, intercept, r2 };
}

// ─── Polynomial Regression (Least Squares via Normal Equation) ──
function fitPolynomial(pts: Point[], degree: number): { coeffs: number[]; r2: number } {
  const n = pts.length;
  if (n <= degree) return { coeffs: new Array(degree + 1).fill(0), r2: 0 };

  // Normalize x to [0,1] to avoid numerical instability
  const xMin = Math.min(...pts.map(p => p.x));
  const xMax = Math.max(...pts.map(p => p.x));
  const xRange = xMax - xMin || 1;
  const xs = pts.map(p => (p.x - xMin) / xRange);
  const ys = pts.map(p => p.y);

  // Build Vandermonde matrix V (n x (degree+1))
  const d = degree + 1;
  // VtV = V^T * V  (d x d)
  const VtV: number[][] = Array.from({ length: d }, () => new Array(d).fill(0));
  // VtY = V^T * y  (d x 1)
  const VtY: number[] = new Array(d).fill(0);

  for (let i = 0; i < n; i++) {
    const powers: number[] = new Array(d);
    powers[0] = 1;
    for (let j = 1; j < d; j++) powers[j] = powers[j - 1] * xs[i];

    for (let r = 0; r < d; r++) {
      for (let c = 0; c < d; c++) {
        VtV[r][c] += powers[r] * powers[c];
      }
      VtY[r] += powers[r] * ys[i];
    }
  }

  // Solve VtV * coeffs = VtY via Gaussian elimination with partial pivoting
  const aug: number[][] = VtV.map((row, i) => [...row, VtY[i]]);
  for (let col = 0; col < d; col++) {
    // Partial pivot
    let maxRow = col;
    for (let row = col + 1; row < d; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
    }
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];

    if (Math.abs(aug[col][col]) < 1e-12) continue; // singular

    for (let row = col + 1; row < d; row++) {
      const factor = aug[row][col] / aug[col][col];
      for (let j = col; j <= d; j++) {
        aug[row][j] -= factor * aug[col][j];
      }
    }
  }
  // Back substitution
  const coeffsNorm = new Array(d).fill(0);
  for (let i = d - 1; i >= 0; i--) {
    let sum = aug[i][d];
    for (let j = i + 1; j < d; j++) sum -= aug[i][j] * coeffsNorm[j];
    coeffsNorm[i] = Math.abs(aug[i][i]) > 1e-12 ? sum / aug[i][i] : 0;
  }

  // Convert coefficients back from normalized x to original x
  // y = c0 + c1*((x-xMin)/xRange) + c2*((x-xMin)/xRange)^2 + ...
  // We store them so that evalPoly can use original x coords
  // Store as { coeffsNorm, xMin, xRange } — but simpler: just return normalized coeffs
  // and we'll evaluate using normalized x in drawing.
  // Actually, let's return a function-friendly format: coeffsNorm + normalization info
  // For simplicity, we'll pack normalization into the coeffs array indirectly.
  // Better: just return normalized coefficients and use a separate eval function.

  // R²
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    let pred = 0;
    let xp = 1;
    for (let j = 0; j < d; j++) {
      pred += coeffsNorm[j] * xp;
      xp *= xs[i];
    }
    ssRes += (ys[i] - pred) ** 2;
    ssTot += (ys[i] - meanY) ** 2;
  }
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  return { coeffs: coeffsNorm, r2 };
}

function evalPoly(coeffs: number[], x: number, xMin: number, xRange: number): number {
  const xn = (x - xMin) / xRange;
  let y = 0, xp = 1;
  for (let i = 0; i < coeffs.length; i++) {
    y += coeffs[i] * xp;
    xp *= xn;
  }
  return y;
}

export default function PlaygroundPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>(PRESETS[0].points);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState(-1);
  const [hoverIndex, setHoverIndex] = useState(-1);

  // Toggles
  const [showResiduals, setShowResiduals] = useState(true);
  const [showConfidence, setShowConfidence] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showEquation, setShowEquation] = useState(true);
  const [showHistogram, setShowHistogram] = useState(false);

  // Manual line mode
  const [manualMode, setManualMode] = useState(false);
  const [manualSlope, setManualSlope] = useState(-0.5);
  const [manualIntercept, setManualIntercept] = useState(350);

  // Noise generator
  const [noiseLevel, setNoiseLevel] = useState(30);
  const [activePreset, setActivePreset] = useState(0);

  // Polynomial mode
  const [polyEnabled, setPolyEnabled] = useState(false);
  const [polyDegree, setPolyDegree] = useState(2);

  // Training mode (animated gradient descent)
  const [trainMode, setTrainMode] = useState(false);
  const [trainRunning, setTrainRunning] = useState(false);
  const [trainLR, setTrainLR] = useState(0.05);
  const [trainW, setTrainW] = useState(0);
  const [trainB, setTrainB] = useState(0);
  const [trainCoeffs, setTrainCoeffs] = useState<number[]>([]);
  const [trainEpoch, setTrainEpoch] = useState(0);
  const [trainLossHistory, setTrainLossHistory] = useState<number[]>([]);
  const [trainSpeed, setTrainSpeed] = useState(20); // steps per frame
  const trainRef = useRef<number>(0);

  // Stats
  const bestFit = useMemo(() => calcRegression(points), [points]);

  // Polynomial fit
  const polyXMin = useMemo(() => points.length > 0 ? Math.min(...points.map(p => p.x)) : 0, [points]);
  const polyXMax = useMemo(() => points.length > 0 ? Math.max(...points.map(p => p.x)) : 1, [points]);
  const polyXRange = polyXMax - polyXMin || 1;
  const polyFit = useMemo(() => {
    if (!polyEnabled || points.length < polyDegree + 1) return { coeffs: [], r2: 0 };
    return fitPolynomial(points, polyDegree);
  }, [points, polyDegree, polyEnabled]);

  const polyMse = useMemo(() => {
    if (!polyEnabled || points.length < 2 || polyFit.coeffs.length === 0) return 0;
    return points.reduce((sum, p) => {
      const pred = evalPoly(polyFit.coeffs, p.x, polyXMin, polyXRange);
      return sum + (p.y - pred) ** 2;
    }, 0) / points.length;
  }, [points, polyFit, polyEnabled, polyXMin, polyXRange]);

  // Normalize x for training: trainW and trainB are in normalized space
  const trainXMin = useMemo(() => points.length > 0 ? Math.min(...points.map(p => p.x)) : 0, [points]);
  const trainXMax = useMemo(() => points.length > 0 ? Math.max(...points.map(p => p.x)) : 1, [points]);
  const trainXRange = trainXMax - trainXMin || 1;
  const trainDisplaySlope = trainW / trainXRange;
  const trainDisplayIntercept = trainB - trainW * trainXMin / trainXRange;

  // Auto-detect curvature: compare linear R² with polynomial R²
  const trainAutoPoly = useMemo(() => {
    if (points.length < 5) return 0;
    const linR2 = bestFit.r2;
    const poly2 = fitPolynomial(points, 2);
    if (poly2.r2 - linR2 > 0.15) {
      if (points.length >= 6) {
        const poly3 = fitPolynomial(points, 3);
        if (poly3.r2 - poly2.r2 > 0.1) return 3;
      }
      return 2;
    }
    return 0;
  }, [points, bestFit.r2]);
  const trainIsPoly = trainMode && trainAutoPoly > 0;

  // Compute training MSE for polynomial training
  const trainPolyMse = useMemo(() => {
    if (!trainIsPoly || trainCoeffs.length === 0 || points.length < 2) return 0;
    return points.reduce((sum, p) => {
      const pred = evalPoly(trainCoeffs, p.x, trainXMin, trainXRange);
      return sum + (p.y - pred) ** 2;
    }, 0) / points.length;
  }, [trainIsPoly, trainCoeffs, points, trainXMin, trainXRange]);

  const activeSlope = trainMode && !trainIsPoly ? trainDisplaySlope : manualMode ? manualSlope : bestFit.slope;
  const activeIntercept = trainMode && !trainIsPoly ? trainDisplayIntercept : manualMode ? manualIntercept : bestFit.intercept;

  const mse = useMemo(() => {
    if (points.length < 2) return 0;
    return points.reduce((sum, p) => {
      const predicted = activeSlope * p.x + activeIntercept;
      return sum + (p.y - predicted) ** 2;
    }, 0) / points.length;
  }, [points, activeSlope, activeIntercept]);

  const mae = useMemo(() => {
    if (points.length < 2) return 0;
    return points.reduce((sum, p) => {
      const predicted = activeSlope * p.x + activeIntercept;
      return sum + Math.abs(p.y - predicted);
    }, 0) / points.length;
  }, [points, activeSlope, activeIntercept]);

  const residuals = useMemo(() => {
    return points.map(p => p.y - (activeSlope * p.x + activeIntercept));
  }, [points, activeSlope, activeIntercept]);

  // ─── Drawing ──────────────────────────────────────────
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
    if (showGrid) {
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.06)';
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
      }
      for (let i = 0; i < h; i += 40) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
      }
      // Axis labels
      ctx.fillStyle = 'rgba(226, 232, 240, 0.15)';
      ctx.font = '9px sans-serif';
      for (let i = 40; i < w; i += 80) {
        ctx.fillText(i.toString(), i + 2, h - 4);
      }
      for (let i = 40; i < h; i += 80) {
        ctx.fillText((h - i).toString(), 4, i - 2);
      }
    }

    if (points.length >= 2) {
      // Confidence band
      if (showConfidence) {
        const n = points.length;
        const meanX = points.reduce((s, p) => s + p.x, 0) / n;
        const sxx = points.reduce((s, p) => s + (p.x - meanX) ** 2, 0);
        const se = Math.sqrt(mse);

        ctx.fillStyle = 'rgba(99, 102, 241, 0.06)';
        ctx.beginPath();
        // Top band
        for (let px = 0; px <= w; px += 2) {
          const margin = se * 1.96 * Math.sqrt(1 / n + (px - meanX) ** 2 / sxx);
          const yPred = activeSlope * px + activeIntercept;
          if (px === 0) ctx.moveTo(px, yPred - margin);
          else ctx.lineTo(px, yPred - margin);
        }
        // Bottom band (reverse)
        for (let px = w; px >= 0; px -= 2) {
          const margin = se * 1.96 * Math.sqrt(1 / n + (px - meanX) ** 2 / sxx);
          const yPred = activeSlope * px + activeIntercept;
          ctx.lineTo(px, yPred + margin);
        }
        ctx.closePath();
        ctx.fill();

        // Band edges
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        for (const sign of [-1, 1]) {
          ctx.beginPath();
          for (let px = 0; px <= w; px += 3) {
            const margin = se * 1.96 * Math.sqrt(1 / n + (px - meanX) ** 2 / sxx);
            const yPred = activeSlope * px + activeIntercept;
            if (px === 0) ctx.moveTo(px, yPred + sign * margin);
            else ctx.lineTo(px, yPred + sign * margin);
          }
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      // Residual lines
      if (showResiduals) {
        points.forEach((p) => {
          const predicted = activeSlope * p.x + activeIntercept;
          const isPositive = p.y < predicted; // canvas y is flipped
          ctx.strokeStyle = isPositive
            ? 'rgba(239, 68, 68, 0.3)'
            : 'rgba(16, 185, 129, 0.3)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, predicted);
          ctx.stroke();
        });
        ctx.setLineDash([]);
      }

      // Best-fit line (faded if manual mode)
      if (manualMode) {
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(0, bestFit.intercept);
        ctx.lineTo(w, bestFit.slope * w + bestFit.intercept);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Active line or curve
      const lineColor = trainMode ? 'rgba(234, 179, 8, 0.9)' : manualMode ? 'rgba(249, 115, 22, 0.9)' : 'rgba(99, 102, 241, 0.85)';
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2.5;
      if (trainIsPoly && trainCoeffs.length > 0) {
        // Draw polynomial curve during training
        ctx.beginPath();
        for (let px = 0; px <= w; px += 2) {
          const py = evalPoly(trainCoeffs, px, trainXMin, trainXRange);
          if (px === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(0, activeIntercept);
        ctx.lineTo(w, activeSlope * w + activeIntercept);
        ctx.stroke();
      }

      // If training, show faded best-fit for reference
      if (trainMode) {
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        if (trainIsPoly) {
          // Show optimal polynomial curve as reference
          const optPoly = fitPolynomial(points, trainAutoPoly);
          for (let px = 0; px <= w; px += 3) {
            const py = evalPoly(optPoly.coeffs, px, polyXMin, polyXRange);
            if (px === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
        } else {
          ctx.moveTo(0, bestFit.intercept);
          ctx.lineTo(w, bestFit.slope * w + bestFit.intercept);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Polynomial curve
      if (polyEnabled && polyFit.coeffs.length > 0) {
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.9)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let px = 0; px <= w; px += 2) {
          const py = evalPoly(polyFit.coeffs, px, polyXMin, polyXRange);
          if (px === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Poly equation label
        if (showEquation) {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'right';
          ctx.fillText(`poly degree ${polyDegree}  R²=${polyFit.r2.toFixed(3)}`, w - 5, 20);
          ctx.textAlign = 'left';
        }
      }

      // Equation label on canvas
      if (showEquation) {
        ctx.fillStyle = trainMode ? 'rgba(234, 179, 8, 0.7)' : manualMode ? 'rgba(249, 115, 22, 0.7)' : 'rgba(99, 102, 241, 0.6)';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'right';
        if (trainIsPoly && trainCoeffs.length > 0) {
          const label = `poly deg ${trainAutoPoly}  MSE=${trainPolyMse.toFixed(1)}`;
          ctx.fillText(label, w - 10, 38);
        } else {
          const eqX = w - 10;
          const eqY = activeSlope * eqX + activeIntercept;
          const clampedY = Math.max(20, Math.min(h - 20, eqY));
          const slopeStr = activeSlope.toFixed(2);
          const intStr = activeIntercept.toFixed(0);
          ctx.fillText(`y = ${slopeStr}x + ${intStr}`, eqX - 5, clampedY - 8);
        }
        ctx.textAlign = 'left';
      }
    }

    // Points
    points.forEach((p, i) => {
      const isHovered = i === hoverIndex;
      const isDrag = i === dragIndex;
      const r = isDrag ? 10 : isHovered ? 9 : 7;

      // Outer glow
      if (isHovered || isDrag) {
        ctx.fillStyle = 'rgba(168, 85, 247, 0.15)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, r + 8, 0, Math.PI * 2);
        ctx.fill();
      }

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      gradient.addColorStop(0, 'rgba(168, 85, 247, 1)');
      gradient.addColorStop(1, 'rgba(168, 85, 247, 0.3)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowColor = 'rgba(168, 85, 247, 0.5)';
      ctx.shadowBlur = 12;
      ctx.fillStyle = 'rgba(168, 85, 247, 0.9)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Coordinate tooltip
      if (isHovered && !isDrag) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.roundRect(p.x - 30, p.y - 30, 60, 18, 4);
        ctx.fill();
        ctx.fillStyle = 'rgba(226, 232, 240, 0.8)';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`(${Math.round(p.x)}, ${Math.round(p.y)})`, p.x, p.y - 17);
        ctx.textAlign = 'left';
      }
    });

    // Empty state
    if (points.length === 0) {
      ctx.fillStyle = 'rgba(226, 232, 240, 0.15)';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Click anywhere to add data points', w / 2, h / 2 - 10);
      ctx.font = '11px sans-serif';
      ctx.fillStyle = 'rgba(226, 232, 240, 0.08)';
      ctx.fillText('or choose a preset below', w / 2, h / 2 + 12);
      ctx.textAlign = 'left';
    }
  }, [points, dragIndex, hoverIndex, activeSlope, activeIntercept, bestFit, mse, showResiduals, showConfidence, showGrid, showEquation, manualMode, trainMode, polyEnabled, polyFit, polyDegree, polyXMin, polyXRange, trainIsPoly, trainCoeffs, trainAutoPoly, trainXMin, trainXRange, trainPolyMse]);

  useEffect(() => { draw(); }, [draw]);

  // ─── Training Animation (Gradient Descent) ────────────
  // trainW and trainB are in normalized space: y = trainW * xNorm + trainB
  // where xNorm = (x - xMin) / (xMax - xMin) ∈ [0, 1]
  // When trainAutoPoly > 0, trains polynomial coefficients instead.

  useEffect(() => {
    if (!trainRunning || !trainMode || points.length < 2) return;

    const isPoly = trainAutoPoly > 0;
    let epoch = trainEpoch;
    const history = [...trainLossHistory];
    const n = points.length;
    const txMin = trainXMin;
    const txRange = trainXRange;

    if (isPoly) {
      const deg = trainAutoPoly;
      let coeffs = trainCoeffs.length === deg + 1 ? [...trainCoeffs] : new Array(deg + 1).fill(0);

      const tick = () => {
        for (let s = 0; s < trainSpeed; s++) {
          const grad = new Array(deg + 1).fill(0);
          let loss = 0;
          for (const p of points) {
            const xNorm = (p.x - txMin) / txRange;
            let pred = 0, xp = 1;
            for (let i = 0; i <= deg; i++) { pred += coeffs[i] * xp; xp *= xNorm; }
            const err = pred - p.y;
            xp = 1;
            for (let i = 0; i <= deg; i++) { grad[i] += err * xp; xp *= xNorm; }
            loss += err * err;
          }
          for (let i = 0; i <= deg; i++) {
            coeffs[i] -= trainLR * (2 / n) * grad[i];
          }
          loss /= n;
          epoch++;
          if (epoch % 5 === 0) { history.push(loss); if (history.length > 200) history.shift(); }
        }

        setTrainCoeffs([...coeffs]);
        setTrainEpoch(epoch);
        setTrainLossHistory([...history]);
        trainRef.current = requestAnimationFrame(tick);
      };

      trainRef.current = requestAnimationFrame(tick);
    } else {
      let w = trainW;
      let b = trainB;

      const tick = () => {
        for (let s = 0; s < trainSpeed; s++) {
          let dw = 0, db = 0;
          let loss = 0;
          for (const p of points) {
            const xNorm = (p.x - txMin) / txRange;
            const pred = w * xNorm + b;
            const err = pred - p.y;
            dw += err * xNorm;
            db += err;
            loss += err * err;
          }
          dw = (2 / n) * dw;
          db = (2 / n) * db;
          loss = loss / n;

          w -= trainLR * dw;
          b -= trainLR * db;
          epoch++;

          if (epoch % 5 === 0) {
            history.push(loss);
            if (history.length > 200) history.shift();
          }
        }

        setTrainW(w);
        setTrainB(b);
        setTrainEpoch(epoch);
        setTrainLossHistory([...history]);

        trainRef.current = requestAnimationFrame(tick);
      };

      trainRef.current = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(trainRef.current);
  }, [trainRunning, trainMode, trainSpeed, trainAutoPoly]);
  // Note: intentionally not including trainW/trainB/trainCoeffs/etc. — we read them once and mutate locally

  // ─── Canvas Interaction ───────────────────────────────
  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const findPointIndex = (pos: Point) =>
    points.findIndex(p => Math.hypot(p.x - pos.x, p.y - pos.y) < 15);

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getCanvasPos(e);
    const idx = findPointIndex(pos);
    if (idx !== -1) {
      if (e.shiftKey) {
        // Shift+click to delete a point
        setPoints(points.filter((_, i) => i !== idx));
      } else {
        setIsDragging(true);
        setDragIndex(idx);
      }
    } else {
      setPoints([...points, pos]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = getCanvasPos(e);
    if (isDragging && dragIndex !== -1) {
      const newPoints = [...points];
      newPoints[dragIndex] = pos;
      setPoints(newPoints);
    } else {
      setHoverIndex(findPointIndex(pos));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragIndex(-1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const pos = getCanvasPos(e);
    const idx = findPointIndex(pos);
    if (idx !== -1) {
      setIsDragging(true);
      setDragIndex(idx);
    } else {
      setPoints([...points, pos]);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isDragging && dragIndex !== -1) {
      const pos = getCanvasPos(e);
      const newPoints = [...points];
      newPoints[dragIndex] = pos;
      setPoints(newPoints);
    }
  };

  // ─── Actions ──────────────────────────────────────────
  const addNoise = () => {
    setPoints(points.map(p => ({
      x: p.x + (Math.random() - 0.5) * noiseLevel,
      y: p.y + (Math.random() - 0.5) * noiseLevel,
    })));
  };

  const generateRandom = (count: number) => {
    const pts: Point[] = [];
    const canvas = canvasRef.current;
    const w = canvas ? canvas.getBoundingClientRect().width : 560;
    const h = canvas ? canvas.getBoundingClientRect().height : 400;
    for (let i = 0; i < count; i++) {
      pts.push({ x: 30 + Math.random() * (w - 60), y: 30 + Math.random() * (h - 60) });
    }
    setPoints(pts);
  };

  const exportData = () => {
    const csv = 'x,y\n' + points.map(p => `${Math.round(p.x)},${Math.round(p.y)}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'regression_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // R² quality label
  const r2Quality = bestFit.r2 > 0.9 ? { label: 'Excellent', color: 'text-success' }
    : bestFit.r2 > 0.7 ? { label: 'Good', color: 'text-primary-light' }
    : bestFit.r2 > 0.4 ? { label: 'Moderate', color: 'text-warning' }
    : { label: 'Poor', color: 'text-error' };

  return (
    <div className="min-h-screen particle-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg">
              🎮
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Regression Playground</h1>
              <p className="text-foreground/40 text-sm">
                Add points, tweak parameters, and explore linear regression interactively
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 lg:items-start">

          {/* ─── LEFT: Main Canvas Area ───────────────────── */}
          <div className="space-y-4 lg:sticky lg:top-4">

            {/* Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="flex flex-wrap items-center gap-2"
            >
              <div className="flex items-center gap-1 bg-surface/60 backdrop-blur-sm border border-border/40 rounded-xl px-1 py-1">
                <button onClick={() => { setPoints(PRESETS[0].points); setActivePreset(0); }} className="px-2.5 py-1.5 text-xs rounded-lg hover:bg-surface-light transition-colors" title="Reset">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setPoints([])} className="px-2.5 py-1.5 text-xs rounded-lg hover:bg-error/20 text-error/60 hover:text-error transition-colors" title="Clear all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-5 bg-border/30" />
                <button onClick={() => generateRandom(15)} className="px-2.5 py-1.5 text-xs rounded-lg hover:bg-surface-light transition-colors" title="Random 15 points">
                  <Shuffle className="w-3.5 h-3.5" />
                </button>
                <button onClick={addNoise} className="px-2.5 py-1.5 text-xs rounded-lg hover:bg-surface-light transition-colors" title="Add noise">
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-5 bg-border/30" />
                <button onClick={exportData} className="px-2.5 py-1.5 text-xs rounded-lg hover:bg-surface-light transition-colors" title="Export CSV">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Toggle pills */}
              <div className="flex items-center gap-1 bg-surface/60 backdrop-blur-sm border border-border/40 rounded-xl px-1 py-1">
                <button
                  onClick={() => setShowResiduals(!showResiduals)}
                  className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors ${showResiduals ? 'bg-primary/20 text-primary-light' : 'text-foreground/40 hover:bg-surface-light'}`}
                  title="Residuals"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setShowConfidence(!showConfidence)}
                  className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors ${showConfidence ? 'bg-primary/20 text-primary-light' : 'text-foreground/40 hover:bg-surface-light'}`}
                  title="95% Confidence band"
                >
                  <Layers className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors ${showGrid ? 'bg-primary/20 text-primary-light' : 'text-foreground/40 hover:bg-surface-light'}`}
                  title="Grid"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setShowEquation(!showEquation)}
                  className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors ${showEquation ? 'bg-primary/20 text-primary-light' : 'text-foreground/40 hover:bg-surface-light'}`}
                  title="Equation"
                >
                  <Sigma className="w-3.5 h-3.5" />
                </button>
              </div>

              <span className="text-[10px] text-foreground/25 hidden sm:inline ml-auto">
                <MousePointerClick className="w-3 h-3 inline mr-1" />click to add · drag to move · shift+click to delete
              </span>
            </motion.div>

            {/* Canvas */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative rounded-2xl overflow-hidden border border-border/40 bg-surface/30 backdrop-blur-sm"
            >
              <canvas
                ref={canvasRef}
                className="w-full h-[360px] sm:h-[420px] cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => { handleMouseUp(); setHoverIndex(-1); }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
              />
              {/* Floating point count */}
              <div className="absolute top-3 left-3 bg-surface/80 backdrop-blur-sm border border-border/30 rounded-lg px-2.5 py-1 text-[10px] text-foreground/40 font-mono">
                {points.length} points
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="grid grid-cols-2 sm:grid-cols-5 gap-2.5"
            >
              {[
                { label: 'Slope (m)', value: activeSlope.toFixed(3), color: trainMode ? 'text-yellow-400' : manualMode ? 'text-orange-400' : 'text-primary-light' },
                { label: 'Intercept (b)', value: activeIntercept.toFixed(1), color: trainMode ? 'text-yellow-400' : manualMode ? 'text-orange-400' : 'text-secondary' },
                { label: 'MSE', value: mse.toFixed(1), color: 'text-error' },
                { label: 'MAE', value: mae.toFixed(1), color: 'text-warning' },
                { label: 'R²', value: points.length >= 2 ? bestFit.r2.toFixed(3) : '—', color: r2Quality.color, sub: points.length >= 2 ? r2Quality.label : '' },
              ].map(stat => (
                <div key={stat.label} className="bg-surface/40 backdrop-blur-sm border border-border/30 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-foreground/35 mb-0.5">{stat.label}</p>
                  <p className={`text-lg sm:text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                  {stat.sub && <p className={`text-[9px] ${stat.color} opacity-60`}>{stat.sub}</p>}
                </div>
              ))}
            </motion.div>

            {/* Residual Histogram */}
            <AnimatePresence>
              {showHistogram && points.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-surface/40 backdrop-blur-sm border border-border/30 rounded-2xl p-4 overflow-hidden"
                >
                  <h3 className="text-xs font-semibold text-foreground/50 mb-3">Residual Distribution</h3>
                  <div className="flex items-end justify-center gap-1 h-24">
                    {(() => {
                      const bins = 12;
                      const min = Math.min(...residuals);
                      const max = Math.max(...residuals);
                      const range = max - min || 1;
                      const counts = new Array(bins).fill(0);
                      residuals.forEach(r => {
                        const idx = Math.min(bins - 1, Math.floor(((r - min) / range) * bins));
                        counts[idx]++;
                      });
                      const maxCount = Math.max(...counts, 1);
                      return counts.map((c, i) => {
                        const pct = (c / maxCount) * 100;
                        const binCenter = min + (i + 0.5) * (range / bins);
                        const isNearZero = Math.abs(binCenter) < range / bins;
                        return (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(pct, 4)}%` }}
                            transition={{ delay: i * 0.03, duration: 0.4 }}
                            className={`flex-1 rounded-t-sm ${isNearZero ? 'bg-primary/50' : 'bg-foreground/10'}`}
                            title={`${c} points`}
                          />
                        );
                      });
                    })()}
                  </div>
                  <div className="flex justify-between text-[9px] text-foreground/20 mt-1">
                    <span>{Math.min(...residuals).toFixed(0)}</span>
                    <span>0</span>
                    <span>{Math.max(...residuals).toFixed(0)}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─── RIGHT: Control Panel ────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto lg:pr-1 scrollbar-thin"
          >
            {/* Presets */}
            <div className="bg-surface/40 backdrop-blur-sm border border-border/30 rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-foreground/50 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Dataset Presets
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((preset, i) => (
                  <button
                    key={preset.name}
                    onClick={() => { setPoints(preset.points); setActivePreset(i); setManualMode(false); }}
                    className={`text-left p-2.5 rounded-xl border transition-all duration-200 ${
                      activePreset === i
                        ? 'border-primary/40 bg-primary/10'
                        : 'border-border/20 bg-surface/30 hover:border-border/50 hover:bg-surface/50'
                    }`}
                  >
                    <span className="text-base">{preset.icon}</span>
                    <p className="text-xs font-medium mt-0.5">{preset.name}</p>
                    <p className="text-[9px] text-foreground/30 leading-tight">{preset.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Line Controls */}
            <div className="bg-surface/40 backdrop-blur-sm border border-border/30 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-foreground/50 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Manual Line
                </h3>
                <button
                  onClick={() => {
                    const next = !manualMode;
                    setManualMode(next);
                    if (next) {
                      setTrainMode(false);
                      cancelAnimationFrame(trainRef.current);
                      setTrainRunning(false);
                    }
                  }}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                    manualMode
                      ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                      : 'bg-surface-light text-foreground/40 border-border/30 hover:text-foreground/60'
                  }`}
                >
                  {manualMode ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className={`space-y-3 transition-opacity ${manualMode ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-foreground/40">Slope (m)</span>
                    <span className="text-orange-400 font-mono font-bold">{manualSlope.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min={-2} max={2} step={0.01}
                    value={manualSlope}
                    onChange={(e) => setManualSlope(Number(e.target.value))}
                    className="w-full accent-orange-500 h-1.5"
                  />
                  <div className="flex justify-between text-[8px] text-foreground/15"><span>-2</span><span>0</span><span>2</span></div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-foreground/40">Intercept (b)</span>
                    <span className="text-orange-400 font-mono font-bold">{manualIntercept.toFixed(0)}</span>
                  </div>
                  <input
                    type="range" min={0} max={500} step={1}
                    value={manualIntercept}
                    onChange={(e) => setManualIntercept(Number(e.target.value))}
                    className="w-full accent-orange-500 h-1.5"
                  />
                  <div className="flex justify-between text-[8px] text-foreground/15"><span>0</span><span>250</span><span>500</span></div>
                </div>
                <button
                  onClick={() => {
                    setManualSlope(bestFit.slope);
                    setManualIntercept(bestFit.intercept);
                  }}
                  className="w-full text-[10px] py-1.5 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors"
                >
                  Snap to Best Fit
                </button>
              </div>

              {manualMode && points.length >= 2 && (
                <div className="mt-3 pt-3 border-t border-border/20">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-foreground/30">Your MSE</span>
                    <span className="font-mono text-orange-400">{mse.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-foreground/30">Best MSE</span>
                    <span className="font-mono text-primary-light">
                      {(points.reduce((s, p) => s + (p.y - (bestFit.slope * p.x + bestFit.intercept)) ** 2, 0) / points.length).toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 bg-surface-light rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-error via-warning to-success transition-all duration-300"
                      style={{
                        width: `${Math.max(5, Math.min(100, (1 - (mse / (mse + 500))) * 100))}%`,
                      }}
                    />
                  </div>
                  <p className="text-[9px] text-foreground/20 mt-1">Closer to best fit →</p>
                </div>
              )}
            </div>

            {/* Training (Gradient Descent) */}
            <div className="bg-surface/40 backdrop-blur-sm border border-border/30 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-foreground/50 flex items-center gap-1.5">
                  🏋️ Train (Gradient Descent)
                  {trainMode && trainAutoPoly > 0 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                      poly°{trainAutoPoly}
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => {
                    const next = !trainMode;
                    setTrainMode(next);
                    if (next) {
                      setManualMode(false);
                      setTrainRunning(false);
                      setTrainW(0);
                      setTrainB(0);
                      setTrainCoeffs([]);
                      setTrainEpoch(0);
                      setTrainLossHistory([]);
                    } else {
                      cancelAnimationFrame(trainRef.current);
                      setTrainRunning(false);
                    }
                  }}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                    trainMode
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      : 'bg-surface-light text-foreground/40 border-border/30 hover:text-foreground/60'
                  }`}
                >
                  {trainMode ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className={`space-y-3 transition-opacity ${trainMode ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                {/* Learning rate */}
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-foreground/40">Learning Rate (α)</span>
                    <span className="text-yellow-400 font-mono font-bold">{trainLR.toFixed(3)}</span>
                  </div>
                  <input
                    type="range" min={0.001} max={0.5} step={0.001}
                    value={trainLR}
                    onChange={(e) => setTrainLR(Number(e.target.value))}
                    className="w-full accent-yellow-500 h-1.5"
                  />
                  <div className="flex justify-between text-[8px] text-foreground/15 mt-0.5">
                    <span>0.001 (slow)</span>
                    <span>0.5 (fast)</span>
                  </div>
                </div>

                {/* Speed */}
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-foreground/40">Steps / frame</span>
                    <span className="text-yellow-400 font-mono font-bold">{trainSpeed}</span>
                  </div>
                  <input
                    type="range" min={1} max={50} step={1}
                    value={trainSpeed}
                    onChange={(e) => setTrainSpeed(Number(e.target.value))}
                    className="w-full accent-yellow-500 h-1.5"
                  />
                </div>

                {/* Controls */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setTrainRunning(!trainRunning)}
                    disabled={points.length < 2}
                    className={`flex-1 text-[10px] py-2 rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                      trainRunning
                        ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                        : 'bg-yellow-500/10 text-yellow-400/70 hover:bg-yellow-500/20'
                    } disabled:opacity-30`}
                  >
                    {trainRunning ? <><Pause className="w-3 h-3" /> Pause</> : <><Play className="w-3 h-3" /> Train</>}
                  </button>
                  <button
                    onClick={() => {
                      if (points.length < 2) return;
                      const n = points.length;

                      if (trainAutoPoly > 0) {
                        // Polynomial single step
                        const deg = trainAutoPoly;
                        const coeffs = trainCoeffs.length === deg + 1 ? [...trainCoeffs] : new Array(deg + 1).fill(0);
                        const grad = new Array(deg + 1).fill(0);
                        let loss = 0;
                        for (const p of points) {
                          const xNorm = (p.x - trainXMin) / trainXRange;
                          let pred = 0, xp = 1;
                          for (let i = 0; i <= deg; i++) { pred += coeffs[i] * xp; xp *= xNorm; }
                          const err = pred - p.y;
                          xp = 1;
                          for (let i = 0; i <= deg; i++) { grad[i] += err * xp; xp *= xNorm; }
                          loss += err * err;
                        }
                        for (let i = 0; i <= deg; i++) {
                          coeffs[i] -= trainLR * (2 / n) * grad[i];
                        }
                        loss /= n;
                        setTrainCoeffs(coeffs);
                        setTrainEpoch(e => e + 1);
                        setTrainLossHistory(h => {
                          const next = [...h, loss];
                          return next.length > 200 ? next.slice(-200) : next;
                        });
                      } else {
                        // Linear single step
                        let dw = 0, db = 0, loss = 0;
                        for (const p of points) {
                          const xNorm = (p.x - trainXMin) / trainXRange;
                          const pred = trainW * xNorm + trainB;
                          const err = pred - p.y;
                          dw += err * xNorm;
                          db += err;
                          loss += err * err;
                        }
                        dw = (2 / n) * dw;
                        db = (2 / n) * db;
                        loss = loss / n;
                        setTrainW(trainW - trainLR * dw);
                        setTrainB(trainB - trainLR * db);
                        setTrainEpoch(e => e + 1);
                        setTrainLossHistory(h => {
                          const next = [...h, loss];
                          return next.length > 200 ? next.slice(-200) : next;
                        });
                      }
                    }}
                    disabled={points.length < 2 || trainRunning}
                    className="px-3 py-2 text-[10px] rounded-xl bg-surface-light text-foreground/50 hover:text-foreground/80 transition-colors border border-border/20 disabled:opacity-30"
                    title="Single step"
                  >
                    <SkipForward className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      cancelAnimationFrame(trainRef.current);
                      setTrainRunning(false);
                      setTrainW(0);
                      setTrainB(0);
                      setTrainCoeffs([]);
                      setTrainEpoch(0);
                      setTrainLossHistory([]);
                    }}
                    className="px-3 py-2 text-[10px] rounded-xl bg-surface-light text-foreground/50 hover:text-foreground/80 transition-colors border border-border/20"
                    title="Reset training"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-background/30 rounded-lg p-2 text-center">
                    <p className="text-[9px] text-foreground/30">Epoch</p>
                    <p className="text-xs font-mono font-bold text-yellow-400">{trainEpoch}</p>
                  </div>
                  <div className="bg-background/30 rounded-lg p-2 text-center">
                    <p className="text-[9px] text-foreground/30">MSE</p>
                    <p className="text-xs font-mono font-bold text-error">{(trainIsPoly ? trainPolyMse : mse).toFixed(1)}</p>
                  </div>
                  {trainIsPoly ? (
                    <>
                      <div className="bg-background/30 rounded-lg p-2 text-center col-span-2">
                        <p className="text-[9px] text-foreground/30">Mode</p>
                        <p className="text-xs font-mono font-bold text-emerald-400">Poly degree {trainAutoPoly}</p>
                      </div>
                      {trainCoeffs.map((c, i) => (
                        <div key={i} className="bg-background/30 rounded-lg p-2 text-center">
                          <p className="text-[9px] text-foreground/30">c{i}</p>
                          <p className="text-xs font-mono font-bold text-primary-light">{c.toFixed(2)}</p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <div className="bg-background/30 rounded-lg p-2 text-center">
                        <p className="text-[9px] text-foreground/30">w (slope)</p>
                        <p className="text-xs font-mono font-bold text-primary-light">{trainDisplaySlope.toFixed(4)}</p>
                      </div>
                      <div className="bg-background/30 rounded-lg p-2 text-center">
                        <p className="text-[9px] text-foreground/30">b (intercept)</p>
                        <p className="text-xs font-mono font-bold text-secondary">{trainDisplayIntercept.toFixed(1)}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Live loss chart */}
                {trainLossHistory.length > 1 && (
                  <div className="bg-background/30 rounded-lg p-2">
                    <p className="text-[9px] text-foreground/30 mb-1">Loss over time</p>
                    <div className="h-16 flex items-end gap-px">
                      {(() => {
                        const hist = trainLossHistory;
                        const maxLoss = Math.max(...hist, 1);
                        // Downsample to max 80 bars
                        const step = Math.max(1, Math.floor(hist.length / 80));
                        const sampled = hist.filter((_, i) => i % step === 0 || i === hist.length - 1);
                        return sampled.map((l, i) => {
                          const pct = Math.max(2, (l / maxLoss) * 100);
                          const progress = i / sampled.length;
                          return (
                            <div
                              key={i}
                              className="flex-1 rounded-t-sm transition-all duration-75"
                              style={{
                                height: `${pct}%`,
                                backgroundColor: `rgba(234, 179, 8, ${0.15 + progress * 0.5})`,
                              }}
                            />
                          );
                        });
                      })()}
                    </div>
                    <div className="flex justify-between text-[8px] text-foreground/15 mt-0.5">
                      <span>start</span>
                      <span>{trainLossHistory[trainLossHistory.length - 1]?.toFixed(0)}</span>
                    </div>
                  </div>
                )}

                {/* Convergence indicator */}
                {trainEpoch > 0 && points.length >= 2 && (() => {
                  if (trainIsPoly) {
                    const optPoly = fitPolynomial(points, trainAutoPoly);
                    const optMse = points.reduce((sum, p) => {
                      const pred = evalPoly(optPoly.coeffs, p.x, trainXMin, trainXRange);
                      return sum + (p.y - pred) ** 2;
                    }, 0) / points.length;
                    const converged = trainPolyMse > 0 && Math.abs(trainPolyMse - optMse) / Math.max(optMse, 1) < 0.05;
                    return (
                      <div className={`text-[9px] px-2 py-1.5 rounded-lg ${
                        converged ? 'bg-success/10 text-success' : 'bg-yellow-500/10 text-yellow-400/70'
                      }`}>
                        {converged
                          ? '✅ Converged! Matches the optimal polynomial fit.'
                          : `📐 MSE: ${trainPolyMse.toFixed(1)} → optimal: ${optMse.toFixed(1)}`}
                      </div>
                    );
                  }
                  const linConverged = Math.abs(trainDisplaySlope - bestFit.slope) < 0.01 && Math.abs(trainDisplayIntercept - bestFit.intercept) < 2;
                  return (
                    <div className={`text-[9px] px-2 py-1.5 rounded-lg ${
                      linConverged ? 'bg-success/10 text-success' : 'bg-yellow-500/10 text-yellow-400/70'
                    }`}>
                      {linConverged
                        ? '✅ Converged! Matches the best-fit line.'
                        : `📐 Distance to optimal: Δw=${Math.abs(trainDisplaySlope - bestFit.slope).toFixed(3)}, Δb=${Math.abs(trainDisplayIntercept - bestFit.intercept).toFixed(1)}`}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Noise & Tools */}
            <div className="bg-surface/40 backdrop-blur-sm border border-border/30 rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-foreground/50 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Tools
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-foreground/40">Noise Intensity</span>
                    <span className="text-foreground/50 font-mono">{noiseLevel}px</span>
                  </div>
                  <input
                    type="range" min={5} max={100} step={5}
                    value={noiseLevel}
                    onChange={(e) => setNoiseLevel(Number(e.target.value))}
                    className="w-full accent-primary h-1.5"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={addNoise}
                    className="text-[10px] py-2 rounded-xl bg-surface-light text-foreground/50 hover:text-foreground/80 transition-colors border border-border/20"
                  >
                    🌊 Add Noise
                  </button>
                  <button
                    onClick={() => generateRandom(20)}
                    className="text-[10px] py-2 rounded-xl bg-surface-light text-foreground/50 hover:text-foreground/80 transition-colors border border-border/20"
                  >
                    🎲 Random 20
                  </button>
                </div>
                <button
                  onClick={() => setShowHistogram(!showHistogram)}
                  className={`w-full text-[10px] py-2 rounded-xl border transition-all ${
                    showHistogram
                      ? 'bg-primary/10 text-primary-light border-primary/30'
                      : 'bg-surface-light text-foreground/50 border-border/20 hover:text-foreground/80'
                  }`}
                >
                  📊 {showHistogram ? 'Hide' : 'Show'} Residual Histogram
                </button>
              </div>
            </div>

            {/* Polynomial Regression */}
            <div className="bg-surface/40 backdrop-blur-sm border border-border/30 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-foreground/50 flex items-center gap-1.5">
                  🔄 Polynomial Fit
                </h3>
                <button
                  onClick={() => setPolyEnabled(!polyEnabled)}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                    polyEnabled
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-surface-light text-foreground/40 border-border/30 hover:text-foreground/60'
                  }`}
                >
                  {polyEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className={`space-y-3 transition-opacity ${polyEnabled ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-foreground/40">Degree</span>
                    <span className="text-emerald-400 font-mono font-bold">{polyDegree}</span>
                  </div>
                  <input
                    type="range" min={2} max={10} step={1}
                    value={polyDegree}
                    onChange={(e) => setPolyDegree(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5"
                  />
                  <div className="flex justify-between text-[8px] text-foreground/15 mt-0.5">
                    <span>2 (quadratic)</span>
                    <span>10</span>
                  </div>
                </div>

                {/* Degree labels */}
                <div className="flex flex-wrap gap-1">
                  {[2, 3, 4, 5].map(d => (
                    <button
                      key={d}
                      onClick={() => setPolyDegree(d)}
                      className={`text-[9px] px-2 py-1 rounded-lg border transition-all ${
                        polyDegree === d
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-surface/30 text-foreground/30 border-border/20 hover:text-foreground/50'
                      }`}
                    >
                      {d === 2 ? 'Quadratic' : d === 3 ? 'Cubic' : d === 4 ? 'Quartic' : 'Quintic'}
                    </button>
                  ))}
                </div>
              </div>

              {polyEnabled && points.length >= polyDegree + 1 && (
                <div className="mt-3 pt-3 border-t border-border/20 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-foreground/30">Poly R²</span>
                    <span className={`font-mono font-bold ${polyFit.r2 > 0.9 ? 'text-emerald-400' : polyFit.r2 > 0.7 ? 'text-primary-light' : 'text-warning'}`}>
                      {polyFit.r2.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-foreground/30">Poly MSE</span>
                    <span className="font-mono text-emerald-400">{polyMse.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-foreground/30">Linear R²</span>
                    <span className="font-mono text-primary-light">{bestFit.r2.toFixed(4)}</span>
                  </div>
                  {/* Improvement indicator */}
                  {bestFit.r2 > 0 && (
                    <div className={`text-[9px] mt-1 px-2 py-1 rounded-lg ${
                      polyFit.r2 > bestFit.r2 + 0.01
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : polyFit.r2 < bestFit.r2 - 0.01
                        ? 'bg-error/10 text-error'
                        : 'bg-foreground/5 text-foreground/30'
                    }`}>
                      {polyFit.r2 > bestFit.r2 + 0.01
                        ? `✨ Poly improves R² by +${((polyFit.r2 - bestFit.r2) * 100).toFixed(1)}%`
                        : polyFit.r2 < bestFit.r2 - 0.01
                        ? '⚠️ Linear fits better — possible overfitting'
                        : '≈ Similar fit to linear'}
                    </div>
                  )}
                  {polyDegree >= points.length && (
                    <div className="text-[9px] mt-1 px-2 py-1 rounded-lg bg-error/10 text-error">
                      ⚠️ Degree ≥ points — overfitting guaranteed!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Experiments */}
            <div className="bg-surface/40 backdrop-blur-sm border border-border/30 rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-foreground/50 mb-3 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> Experiments to Try
              </h3>
              <div className="space-y-2">
                {[
                  { icon: '📏', title: 'Perfect Line', desc: 'Place points in a line — watch MSE drop to 0 and R² reach 1.0' },
                  { icon: '⚡', title: 'Outlier Effect', desc: 'Add a far-away point — see how it pulls the entire line' },
                  { icon: '🔄', title: 'Curved Data', desc: 'Use the Quadratic preset — linear regression can\'t capture curves' },
                  { icon: '🎛️', title: 'Manual vs Best', desc: 'Toggle manual mode and try to beat the best-fit line' },
                  { icon: '🔢', title: 'Poly Overfitting', desc: 'Enable polynomial, crank degree to 10 — watch it wiggle wildly' },
                  { icon: '🏋️', title: 'Watch It Learn', desc: 'Enable training, hit play — watch gradient descent converge to the best fit' },
                  { icon: '🌊', title: 'Noise Stress Test', desc: 'Crank up noise on clean data — watch R² degrade' },
                  { icon: '📊', title: 'Residual Check', desc: 'Open histogram — healthy residuals are centered around 0' },
                ].map(exp => (
                  <div key={exp.title} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-light/30 transition-colors">
                    <span className="text-sm mt-0.5">{exp.icon}</span>
                    <div>
                      <p className="text-[11px] font-medium text-foreground/60">{exp.title}</p>
                      <p className="text-[9px] text-foreground/25 leading-snug">{exp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
