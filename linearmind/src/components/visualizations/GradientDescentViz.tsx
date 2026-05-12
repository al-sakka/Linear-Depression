'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

export default function GradientDescentViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [learningRate, setLearningRate] = useState(0.05);
  const [ballPos, setBallPos] = useState(4); // x position on loss surface
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState<{ step: number; loss: number }[]>([]);
  const animRef = useRef<number>(0);
  const stepRef = useRef(0);

  // Quadratic loss surface: L(w) = (w - 1)^2 + 0.5
  const lossFunction = (w: number) => (w - 1) ** 2 + 0.5;
  const gradient = (w: number) => 2 * (w - 1);

  const drawSurface = useCallback(() => {
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

    // Map loss surface to canvas
    const wMin = -3, wMax = 5;
    const lMax = 20;
    const toCanvasX = (wVal: number) => ((wVal - wMin) / (wMax - wMin)) * w;
    const toCanvasY = (loss: number) => h - (loss / lMax) * h * 0.85 - 20;

    // Draw surface
    const gradient = ctx.createLinearGradient(0, h, 0, 0);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.1)');
    gradient.addColorStop(1, 'rgba(168, 85, 247, 0.05)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(toCanvasX(wMin), h);
    for (let wVal = wMin; wVal <= wMax; wVal += 0.05) {
      ctx.lineTo(toCanvasX(wVal), toCanvasY(lossFunction(wVal)));
    }
    ctx.lineTo(toCanvasX(wMax), h);
    ctx.closePath();
    ctx.fill();

    // Surface curve
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.7)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let wVal = wMin; wVal <= wMax; wVal += 0.05) {
      const cx = toCanvasX(wVal);
      const cy = toCanvasY(lossFunction(wVal));
      if (wVal === wMin) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();

    // Minimum marker
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(toCanvasX(1), toCanvasY(0.5));
    ctx.lineTo(toCanvasX(1), h);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = '11px sans-serif';
    ctx.fillStyle = 'rgba(16, 185, 129, 0.7)';
    ctx.fillText('minimum', toCanvasX(1) - 22, h - 5);

    // Ball
    const bx = toCanvasX(ballPos);
    const by = toCanvasY(lossFunction(ballPos));

    // Ball shadow/glow
    ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(bx, by, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Ball highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(bx - 3, by - 3, 4, 0, Math.PI * 2);
    ctx.fill();

    // Gradient arrow
    const grad = 2 * (ballPos - 1);
    const arrowLen = Math.min(Math.abs(grad) * 15, 60) * Math.sign(-grad);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + arrowLen, by);
    ctx.stroke();

    // Arrow head
    if (Math.abs(arrowLen) > 5) {
      const dir = Math.sign(arrowLen);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.beginPath();
      ctx.moveTo(bx + arrowLen, by);
      ctx.lineTo(bx + arrowLen - dir * 8, by - 5);
      ctx.lineTo(bx + arrowLen - dir * 8, by + 5);
      ctx.closePath();
      ctx.fill();
    }

    // Labels
    ctx.font = '11px sans-serif';
    ctx.fillStyle = 'rgba(226, 232, 240, 0.6)';
    ctx.fillText('Loss', 10, 20);
    ctx.fillText('Weight (w)', w - 70, h - 5);

    // Current values
    ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`w = ${ballPos.toFixed(3)}`, bx + 15, by - 5);
    ctx.fillText(`L = ${lossFunction(ballPos).toFixed(3)}`, bx + 15, by + 12);
  }, [ballPos]);

  useEffect(() => {
    drawSurface();
  }, [drawSurface]);

  const step = useCallback(() => {
    setBallPos((prev) => {
      const grad = gradient(prev);
      const newPos = prev - learningRate * grad;
      // Clamp
      return Math.max(-3, Math.min(5, newPos));
    });
    stepRef.current += 1;
    setBallPos((prev) => {
      setHistory((h) => [...h, { step: stepRef.current, loss: parseFloat(lossFunction(prev).toFixed(4)) }]);
      return prev;
    });
  }, [learningRate]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      step();
      // Stop if converged
      setBallPos((prev) => {
        if (Math.abs(prev - 1) < 0.001) {
          setIsRunning(false);
        }
        return prev;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isRunning, step]);

  const reset = () => {
    setIsRunning(false);
    setBallPos(4);
    setHistory([]);
    stepRef.current = 0;
  };

  const currentLoss = lossFunction(ballPos);

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="gradient-border rounded-xl overflow-hidden"
      >
        <canvas ref={canvasRef} className="w-full h-[320px] bg-surface/50" />
      </motion.div>

      {/* Controls */}
      <div className="glass rounded-lg p-4">
        <label className="flex items-center justify-between text-sm mb-2">
          <span className="text-foreground/70">Learning Rate (α)</span>
          <span className={`font-mono font-bold ${
            learningRate > 0.8 ? 'text-error' : learningRate < 0.01 ? 'text-warning' : 'text-success'
          }`}>
            {learningRate.toFixed(3)}
          </span>
        </label>
        <input
          type="range"
          min={0.001}
          max={1.1}
          step={0.001}
          value={learningRate}
          onChange={(e) => setLearningRate(parseFloat(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-foreground/40 mt-1">
          <span>🐌 Too slow</span>
          <span>✅ Good</span>
          <span>⚡ Too fast</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors ${
            isRunning
              ? 'bg-error/20 text-error hover:bg-error/30'
              : 'bg-primary/20 text-primary-light hover:bg-primary/30'
          }`}
        >
          {isRunning ? '⏸ Pause' : '▶ Start Descent'}
        </button>
        <button
          onClick={step}
          disabled={isRunning}
          className="px-4 py-2.5 rounded-lg text-sm bg-secondary/20 text-secondary hover:bg-secondary/30 transition-colors disabled:opacity-30"
        >
          Step
        </button>
        <button
          onClick={reset}
          className="px-4 py-2.5 rounded-lg text-sm bg-surface-light text-foreground/60 hover:text-foreground hover:bg-surface transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Loss chart */}
      {history.length > 1 && (
        <div className="glass rounded-lg p-4">
          <p className="text-sm text-foreground/60 mb-2">Loss over steps</p>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={history.slice(-50)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
              <XAxis dataKey="step" tick={{ fontSize: 10, fill: 'rgba(226,232,240,0.4)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(226,232,240,0.4)' }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: 'rgba(226,232,240,0.6)' }}
              />
              <Line type="monotone" dataKey="loss" stroke="#6366f1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-xs text-foreground/50 mb-1">Weight</p>
          <p className="font-mono font-bold text-primary-light">{ballPos.toFixed(3)}</p>
        </div>
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-xs text-foreground/50 mb-1">Loss</p>
          <p className={`font-mono font-bold ${currentLoss < 1 ? 'text-success' : 'text-warning'}`}>
            {currentLoss.toFixed(4)}
          </p>
        </div>
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-xs text-foreground/50 mb-1">Steps</p>
          <p className="font-mono font-bold text-secondary">{stepRef.current}</p>
        </div>
      </div>
    </div>
  );
}
