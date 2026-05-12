'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface DataPoint {
  size: number;
  bedrooms: number;
  price: number;
}

const rawData: DataPoint[] = [
  { size: 60, bedrooms: 1, price: 250 },
  { size: 80, bedrooms: 2, price: 420 },
  { size: 95, bedrooms: 2, price: 480 },
  { size: 120, bedrooms: 3, price: 680 },
  { size: 140, bedrooms: 3, price: 780 },
  { size: 150, bedrooms: 3, price: 850 },
  { size: 180, bedrooms: 4, price: 1020 },
  { size: 200, bedrooms: 4, price: 1150 },
  { size: 220, bedrooms: 5, price: 1300 },
  { size: 250, bedrooms: 5, price: 1450 },
];

function normalize(data: DataPoint[]) {
  const sizeMin = Math.min(...data.map((d) => d.size));
  const sizeMax = Math.max(...data.map((d) => d.size));
  const bedMin = Math.min(...data.map((d) => d.bedrooms));
  const bedMax = Math.max(...data.map((d) => d.bedrooms));
  return data.map((d) => ({
    size: (d.size - sizeMin) / (sizeMax - sizeMin),
    bedrooms: (d.bedrooms - bedMin) / (bedMax - bedMin),
    price: d.price,
  }));
}

export default function FeatureScalingViz() {
  const [scaled, setScaled] = useState(false);
  const [learningRate] = useState(0.00001);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);

  // Unscaled training state
  const [rawWeights, setRawWeights] = useState({ w1: 0, w2: 0, b: 0 });
  const [rawLossHistory, setRawLossHistory] = useState<number[]>([]);

  // Scaled training state
  const [scaledWeights, setScaledWeights] = useState({ w1: 0, w2: 0, b: 0 });
  const [scaledLossHistory, setScaledLossHistory] = useState<number[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scaledData = useMemo(() => normalize(rawData), []);

  const computeLoss = useCallback((data: { size: number; bedrooms: number; price: number }[], w: { w1: number; w2: number; b: number }) => {
    const sum = data.reduce((acc, d) => {
      const pred = w.w1 * d.size + w.w2 * d.bedrooms + w.b;
      return acc + (d.price - pred) ** 2;
    }, 0);
    return sum / data.length;
  }, []);

  const gradientStep = useCallback((
    data: { size: number; bedrooms: number; price: number }[],
    w: { w1: number; w2: number; b: number },
    lr: number
  ) => {
    const m = data.length;
    let dw1 = 0, dw2 = 0, db = 0;
    for (const d of data) {
      const pred = w.w1 * d.size + w.w2 * d.bedrooms + w.b;
      const err = pred - d.price;
      dw1 += err * d.size;
      dw2 += err * d.bedrooms;
      db += err;
    }
    return {
      w1: w.w1 - (lr * 2 * dw1) / m,
      w2: w.w2 - (lr * 2 * dw2) / m,
      b: w.b - (lr * 2 * db) / m,
    };
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsTraining(false);
    setEpoch(0);
    setRawWeights({ w1: 0, w2: 0, b: 0 });
    setScaledWeights({ w1: 0, w2: 0, b: 0 });
    setRawLossHistory([]);
    setScaledLossHistory([]);
  }, []);

  const startTraining = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setEpoch(0);
    setRawWeights({ w1: 0, w2: 0, b: 0 });
    setScaledWeights({ w1: 0, w2: 0, b: 0 });
    setRawLossHistory([]);
    setScaledLossHistory([]);
    // Use setTimeout to ensure state is flushed before starting
    setTimeout(() => setIsTraining(true), 0);
  }, []);

  useEffect(() => {
    if (!isTraining) return;

    let localRawW = { w1: 0, w2: 0, b: 0 };
    let localScaledW = { w1: 0, w2: 0, b: 0 };
    let localEpoch = 0;
    const rawLosses: number[] = [];
    const scaledLosses: number[] = [];

    const scaledLr = 0.1;

    intervalRef.current = setInterval(() => {
      if (localEpoch >= 200) {
        setIsTraining(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      // Raw gradient step
      localRawW = gradientStep(rawData, localRawW, learningRate);
      const rawLoss = computeLoss(rawData, localRawW);
      rawLosses.push(rawLoss);

      // Scaled gradient step
      localScaledW = gradientStep(scaledData, localScaledW, scaledLr);
      const scaledLoss = computeLoss(scaledData, localScaledW);
      scaledLosses.push(scaledLoss);

      localEpoch++;
      setEpoch(localEpoch);
      setRawWeights({ ...localRawW });
      setScaledWeights({ ...localScaledW });
      setRawLossHistory([...rawLosses]);
      setScaledLossHistory([...scaledLosses]);
    }, 40);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTraining]);

  // Draw loss curves
  useEffect(() => {
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
    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
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

    // Labels
    ctx.font = '11px sans-serif';
    ctx.fillStyle = 'rgba(226, 232, 240, 0.4)';
    ctx.fillText('Loss', 8, 16);
    ctx.fillText('Epoch', w - 40, h - 6);

    if (rawLossHistory.length < 2) {
      ctx.fillStyle = 'rgba(226, 232, 240, 0.2)';
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Press Train to compare convergence', w / 2, h / 2);
      ctx.textAlign = 'start';
      return;
    }

    const maxLoss = Math.max(rawLossHistory[0], scaledLossHistory[0], 1);
    const padding = 20;

    const drawCurve = (losses: number[], color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      losses.forEach((loss, i) => {
        const x = padding + (i / 200) * (w - 2 * padding);
        const y = padding + ((loss / maxLoss) * (h - 2 * padding));
        const clampedY = Math.min(Math.max(y, padding), h - padding);
        if (i === 0) ctx.moveTo(x, clampedY);
        else ctx.lineTo(x, clampedY);
      });
      ctx.stroke();
    };

    // Raw loss curve (red/orange)
    drawCurve(rawLossHistory, 'rgba(239, 68, 68, 0.8)');
    // Scaled loss curve (green)
    drawCurve(scaledLossHistory, 'rgba(16, 185, 129, 0.8)');

  }, [rawLossHistory, scaledLossHistory]);

  const currentData = scaled ? scaledData : rawData;

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">📏</span> Feature Scaling Demo
        </h3>
        <span className="text-xs text-foreground/40">Epoch: {epoch}/200</span>
      </div>

      {/* Toggle raw vs scaled view */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setScaled(false)}
          className={`px-4 py-2 text-xs rounded-lg transition-colors ${
            !scaled ? 'bg-error/20 text-error' : 'bg-surface-light text-foreground/40 hover:text-foreground/60'
          }`}
        >
          🔴 Raw Data
        </button>
        <button
          onClick={() => setScaled(true)}
          className={`px-4 py-2 text-xs rounded-lg transition-colors ${
            scaled ? 'bg-success/20 text-success' : 'bg-surface-light text-foreground/40 hover:text-foreground/60'
          }`}
        >
          🟢 Scaled Data
        </button>
      </div>

      {/* Data comparison table */}
      <div className="overflow-x-auto mb-5">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-2 text-foreground/40">#</th>
              <th className="text-right py-2 px-2 text-primary/70">Size {scaled ? '(0-1)' : '(m²)'}</th>
              <th className="text-right py-2 px-2 text-secondary/70">Bedrooms {scaled ? '(0-1)' : ''}</th>
              <th className="text-right py-2 px-2 text-foreground/50">Price(K)</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((d, i) => (
              <tr key={i} className="border-b border-border/30">
                <td className="py-1 px-2 text-foreground/40">{i + 1}</td>
                <td className="py-1 px-2 text-right font-mono text-primary/80">
                  {scaled ? d.size.toFixed(2) : d.size}
                </td>
                <td className="py-1 px-2 text-right font-mono text-secondary/80">
                  {scaled ? d.bedrooms.toFixed(2) : d.bedrooms}
                </td>
                <td className="py-1 px-2 text-right font-mono text-foreground/70">{d.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scale range comparison */}
      <div className="bg-background/50 rounded-xl p-4 mb-5">
        <p className="text-xs text-foreground/50 mb-3">Feature Ranges</p>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-primary/70">Size</span>
              <span className="text-foreground/40 font-mono">
                {scaled ? '0.00 → 1.00' : '60 → 250'}
              </span>
            </div>
            <div className="h-3 bg-surface-light rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary/50 rounded-full"
                animate={{ width: scaled ? '100%' : '100%' }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-secondary/70">Bedrooms</span>
              <span className="text-foreground/40 font-mono">
                {scaled ? '0.00 → 1.00' : '1 → 5'}
              </span>
            </div>
            <div className="h-3 bg-surface-light rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-secondary/50 rounded-full"
                animate={{ width: scaled ? '100%' : '2%' }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-foreground/30 mt-3">
          {scaled
            ? '✅ Both features are on the same scale [0, 1] — gradient descent converges evenly'
            : '⚠️ Size (60-250) dominates Bedrooms (1-5) — gradient descent zig-zags!'}
        </p>
      </div>

      {/* Train button */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={startTraining}
          disabled={isTraining}
          className="px-4 py-2 text-sm rounded-lg bg-primary/20 text-primary-light hover:bg-primary/30 transition-colors disabled:opacity-40"
        >
          {isTraining ? '⏳ Training...' : '🚀 Train Both (Raw vs Scaled)'}
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 text-sm rounded-lg bg-surface-light text-foreground/40 hover:text-foreground/60 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Loss curve canvas */}
      <div className="mb-4">
        <p className="text-xs text-foreground/40 mb-2">Loss Convergence Comparison</p>
        <canvas
          ref={canvasRef}
          className="w-full h-48 rounded-xl"
        />
        <div className="flex gap-4 mt-2 text-xs text-foreground/40">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-error rounded-sm inline-block" /> Raw (no scaling)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-success rounded-sm inline-block" /> Scaled (normalized)</span>
        </div>
      </div>

      {/* Weight comparison */}
      {epoch > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-error/5 rounded-xl p-3 border border-error/10">
            <p className="text-xs text-error/70 mb-1 font-semibold">Raw Weights</p>
            <p className="text-xs font-mono text-foreground/50">
              w₁={rawWeights.w1.toFixed(3)}<br />
              w₂={rawWeights.w2.toFixed(3)}<br />
              b={rawWeights.b.toFixed(1)}
            </p>
            <p className="text-xs text-foreground/30 mt-1">
              Loss: {rawLossHistory.length > 0 ? rawLossHistory[rawLossHistory.length - 1].toFixed(0) : '—'}
            </p>
          </div>
          <div className="bg-success/5 rounded-xl p-3 border border-success/10">
            <p className="text-xs text-success/70 mb-1 font-semibold">Scaled Weights</p>
            <p className="text-xs font-mono text-foreground/50">
              w₁={scaledWeights.w1.toFixed(3)}<br />
              w₂={scaledWeights.w2.toFixed(3)}<br />
              b={scaledWeights.b.toFixed(1)}
            </p>
            <p className="text-xs text-foreground/30 mt-1">
              Loss: {scaledLossHistory.length > 0 ? scaledLossHistory[scaledLossHistory.length - 1].toFixed(0) : '—'}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
