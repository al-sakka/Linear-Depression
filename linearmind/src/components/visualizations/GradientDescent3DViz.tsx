'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function GradientDescent3DViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [learningRate, setLearningRate] = useState(0.05);
  const [isRunning, setIsRunning] = useState(false);
  const [ballW, setBallW] = useState(4.0);
  const [ballB, setBallB] = useState(4.0);
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState<{ w: number; b: number; loss: number }[]>([]);
  const animRef = useRef<number>(0);

  // Loss surface: L(w, b) = (w - 1)^2 + (b - 2)^2 + 0.5
  // Minimum at (1, 2) with loss = 0.5
  const lossFunction = (w: number, b: number) => (w - 1) ** 2 + (b - 2) ** 2 + 0.5;
  const gradW = (w: number) => 2 * (w - 1);
  const gradB = (b: number) => 2 * (b - 2);

  const wMin = -2, wMax = 5;
  const bMin = -1, bMax = 5;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    const W = rect.width;
    const H = rect.height;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 12);
    ctx.fill();

    const pad = 40;
    const plotW = W - 2 * pad;
    const plotH = H - 2 * pad;

    const toCanvasX = (w: number) => pad + ((w - wMin) / (wMax - wMin)) * plotW;
    const toCanvasY = (b: number) => pad + ((bMax - b) / (bMax - bMin)) * plotH; // flip y

    // Draw contour lines (filled)
    const levels = [0.6, 1, 2, 4, 7, 11, 16, 22, 30, 40];
    const colors = [
      'rgba(16, 185, 129, 0.35)',
      'rgba(16, 185, 129, 0.25)',
      'rgba(34, 197, 94, 0.2)',
      'rgba(99, 102, 241, 0.15)',
      'rgba(99, 102, 241, 0.12)',
      'rgba(139, 92, 246, 0.1)',
      'rgba(168, 85, 247, 0.08)',
      'rgba(168, 85, 247, 0.06)',
      'rgba(236, 72, 153, 0.05)',
      'rgba(239, 68, 68, 0.04)',
    ];

    // Draw contour filled regions using pixel-by-pixel approach (optimized with larger step)
    const res = 3; // pixel step
    for (let px = pad; px < pad + plotW; px += res) {
      for (let py = pad; py < pad + plotH; py += res) {
        const wVal = wMin + ((px - pad) / plotW) * (wMax - wMin);
        const bVal = bMax - ((py - pad) / plotH) * (bMax - bMin);
        const loss = lossFunction(wVal, bVal);

        // Find which level this falls into
        let color = 'rgba(239, 68, 68, 0.03)';
        for (let i = levels.length - 1; i >= 0; i--) {
          if (loss <= levels[i]) {
            color = colors[i];
          }
        }
        ctx.fillStyle = color;
        ctx.fillRect(px, py, res, res);
      }
    }

    // Draw contour lines
    ctx.lineWidth = 1;
    for (let li = 0; li < levels.length; li++) {
      const level = levels[li];
      ctx.strokeStyle = `rgba(226, 232, 240, ${0.15 - li * 0.01})`;

      // March through grid to find contour crossings (simplified)
      const step = 2;
      for (let px = pad; px < pad + plotW - step; px += step) {
        for (let py = pad; py < pad + plotH - step; py += step) {
          const w1 = wMin + ((px - pad) / plotW) * (wMax - wMin);
          const b1 = bMax - ((py - pad) / plotH) * (bMax - bMin);
          const w2 = wMin + ((px + step - pad) / plotW) * (wMax - wMin);
          const b2 = bMax - ((py + step - pad) / plotH) * (bMax - bMin);

          const v00 = lossFunction(w1, b1);
          const v10 = lossFunction(w2, b1);
          const v01 = lossFunction(w1, b2);

          // Draw dot if contour crosses this cell edge
          if ((v00 < level) !== (v10 < level) || (v00 < level) !== (v01 < level)) {
            ctx.fillStyle = `rgba(226, 232, 240, ${0.2 - li * 0.015})`;
            ctx.fillRect(px, py, 1.5, 1.5);
          }
        }
      }
    }

    // Axes labels
    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'rgba(226, 232, 240, 0.5)';
    ctx.textAlign = 'center';
    ctx.fillText('Weight (w)', W / 2, H - 8);

    ctx.save();
    ctx.translate(12, H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Bias (b)', 0, 0);
    ctx.restore();

    // Axis tick labels
    ctx.font = '10px sans-serif';
    ctx.fillStyle = 'rgba(226, 232, 240, 0.3)';
    ctx.textAlign = 'center';
    for (let w = Math.ceil(wMin); w <= wMax; w++) {
      ctx.fillText(w.toString(), toCanvasX(w), H - pad + 15);
    }
    ctx.textAlign = 'right';
    for (let b = Math.ceil(bMin); b <= bMax; b++) {
      ctx.fillText(b.toString(), pad - 8, toCanvasY(b) + 4);
    }

    // Draw minimum marker
    const minX = toCanvasX(1);
    const minY = toCanvasY(2);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(minX - 6, minY - 6); ctx.lineTo(minX + 6, minY + 6);
    ctx.moveTo(minX + 6, minY - 6); ctx.lineTo(minX - 6, minY + 6);
    ctx.stroke();

    ctx.fillStyle = 'rgba(16, 185, 129, 0.5)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('optimum (1, 2)', minX + 10, minY - 5);

    // Draw path history
    if (history.length > 1) {
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(toCanvasX(history[0].w), toCanvasY(history[0].b));
      for (let i = 1; i < history.length; i++) {
        ctx.lineTo(toCanvasX(history[i].w), toCanvasY(history[i].b));
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw path dots
      history.forEach((h, i) => {
        const alpha = 0.2 + (i / history.length) * 0.6;
        ctx.fillStyle = `rgba(249, 115, 22, ${alpha})`;
        ctx.beginPath();
        ctx.arc(toCanvasX(h.w), toCanvasY(h.b), 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw current ball
    const bx = toCanvasX(ballW);
    const by = toCanvasY(ballB);

    // Glow
    const glow = ctx.createRadialGradient(bx, by, 0, bx, by, 18);
    glow.addColorStop(0, 'rgba(249, 115, 22, 0.4)');
    glow.addColorStop(1, 'rgba(249, 115, 22, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(bx, by, 18, 0, Math.PI * 2);
    ctx.fill();

    // Ball
    ctx.fillStyle = '#f97316';
    ctx.shadowColor = 'rgba(249, 115, 22, 0.5)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(bx, by, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Gradient arrow
    if (!isRunning) {
      const gw = gradW(ballW);
      const gb = gradB(ballB);
      const mag = Math.sqrt(gw * gw + gb * gb);
      if (mag > 0.1) {
        const scale = 20 / Math.max(mag, 1);
        const ax = bx - gw * scale;
        const ay = by + gb * scale; // flip y
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(ax, ay);
        ctx.stroke();

        // Arrowhead
        const angle = Math.atan2(ay - by, ax - bx);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax - 6 * Math.cos(angle - 0.4), ay - 6 * Math.sin(angle - 0.4));
        ctx.lineTo(ax - 6 * Math.cos(angle + 0.4), ay - 6 * Math.sin(angle + 0.4));
        ctx.closePath();
        ctx.fill();
      }
    }
  }, [ballW, ballB, history, isRunning]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    if (!isRunning) return;

    let w = ballW;
    let b = ballB;
    let s = step;
    const hist = [...history];

    const tick = () => {
      const gw = gradW(w);
      const gb = gradB(b);
      w -= learningRate * gw;
      b -= learningRate * gb;
      s++;

      // Clamp
      w = Math.max(wMin, Math.min(wMax, w));
      b = Math.max(bMin, Math.min(bMax, b));

      const loss = lossFunction(w, b);
      hist.push({ w, b, loss });

      setBallW(w);
      setBallB(b);
      setStep(s);
      setHistory([...hist]);

      // Stop if converged or too many steps
      if (Math.abs(gw) < 0.001 && Math.abs(gb) < 0.001) {
        setIsRunning(false);
        return;
      }
      if (s > 500) {
        setIsRunning(false);
        return;
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [isRunning]);

  const reset = () => {
    cancelAnimationFrame(animRef.current);
    setIsRunning(false);
    setBallW(4.0);
    setBallB(4.0);
    setStep(0);
    setHistory([]);
  };

  const currentLoss = lossFunction(ballW, ballB);
  const distToOptimum = Math.sqrt((ballW - 1) ** 2 + (ballB - 2) ** 2);

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">🗺️</span> 3D Loss Landscape (Contour View)
        </h3>
        <div className="text-right">
          <p className="text-xs text-foreground/40">Step {step}</p>
          <p className="text-sm font-mono font-bold text-primary">Loss: {currentLoss.toFixed(3)}</p>
        </div>
      </div>

      {/* Learning rate slider */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-foreground/50">Learning Rate (α)</span>
          <span className="text-primary font-mono font-bold">{learningRate.toFixed(3)}</span>
        </div>
        <input
          type="range"
          min={0.005}
          max={0.5}
          step={0.005}
          value={learningRate}
          onChange={(e) => setLearningRate(Number(e.target.value))}
          className="w-full accent-primary h-2"
        />
        <div className="flex justify-between text-xs text-foreground/20 mt-0.5">
          <span>Slow</span>
          <span>Fast</span>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-72 sm:h-80 rounded-xl mb-4"
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-background/30 rounded-lg p-2 text-center">
          <p className="text-xs text-foreground/40">w</p>
          <p className="text-sm font-mono font-bold text-primary">{ballW.toFixed(3)}</p>
        </div>
        <div className="bg-background/30 rounded-lg p-2 text-center">
          <p className="text-xs text-foreground/40">b</p>
          <p className="text-sm font-mono font-bold text-secondary">{ballB.toFixed(3)}</p>
        </div>
        <div className="bg-background/30 rounded-lg p-2 text-center">
          <p className="text-xs text-foreground/40">Loss</p>
          <p className="text-sm font-mono font-bold text-accent">{currentLoss.toFixed(3)}</p>
        </div>
        <div className="bg-background/30 rounded-lg p-2 text-center">
          <p className="text-xs text-foreground/40">Distance</p>
          <p className="text-sm font-mono font-bold text-warning">{distToOptimum.toFixed(3)}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex-1 px-4 py-2.5 text-sm rounded-xl font-semibold transition-colors ${
            isRunning
              ? 'bg-error/20 text-error hover:bg-error/30'
              : 'bg-primary/20 text-primary-light hover:bg-primary/30'
          }`}
        >
          {isRunning ? '⏸ Pause' : '▶ Descend'}
        </button>
        <button
          onClick={reset}
          className="px-4 py-2.5 text-sm rounded-xl bg-surface-light text-foreground/50 hover:text-foreground/80 transition-colors"
        >
          🔄 Reset
        </button>
        <button
          onClick={() => {
            const rw = wMin + Math.random() * (wMax - wMin);
            const rb = bMin + Math.random() * (bMax - bMin);
            cancelAnimationFrame(animRef.current);
            setIsRunning(false);
            setBallW(rw);
            setBallB(rb);
            setStep(0);
            setHistory([]);
          }}
          className="px-4 py-2.5 text-sm rounded-xl bg-surface-light text-foreground/50 hover:text-foreground/80 transition-colors"
        >
          🎲 Random Start
        </button>
      </div>

      {/* Insight */}
      <div className="mt-4 bg-background/30 rounded-lg p-3">
        <p className="text-xs text-foreground/40">
          💡 Each ring represents a constant loss value (like elevation lines on a topographic map). The ball follows the gradient — always moving perpendicular to the contour lines toward the center minimum. The cyan arrow shows the negative gradient direction.
        </p>
      </div>
    </div>
  );
}
