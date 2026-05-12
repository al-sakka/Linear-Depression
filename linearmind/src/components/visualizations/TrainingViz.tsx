'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

export default function TrainingViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [weight, setWeight] = useState(0);
  const [bias, setBias] = useState(200);
  const [epoch, setEpoch] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [lossHistory, setLossHistory] = useState<{ epoch: number; loss: number }[]>([]);
  const [lr, setLr] = useState(0.05);

  // Normalize x to [0,1] for stable gradient computation
  const xMin = 50;
  const xMax = 500;
  const yMin = 50;
  const yMax = 340;

  const points = [
    { x: 50, y: 340 }, { x: 80, y: 310 }, { x: 120, y: 290 },
    { x: 160, y: 260 }, { x: 200, y: 230 }, { x: 250, y: 200 },
    { x: 290, y: 170 }, { x: 330, y: 150 }, { x: 380, y: 120 },
    { x: 420, y: 95 }, { x: 460, y: 70 }, { x: 500, y: 50 },
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

    // Grid
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
    }
    for (let i = 0; i < h; i += 40) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
    }

    // Error lines
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    points.forEach((p) => {
      const xNorm = (p.x - xMin) / (xMax - xMin);
      const predicted = weight * xNorm + bias;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, predicted);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Current line
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.9)';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(99, 102, 241, 0.3)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    const x0Norm = (0 - xMin) / (xMax - xMin);
    const x1Norm = (w - xMin) / (xMax - xMin);
    ctx.moveTo(0, weight * x0Norm + bias);
    ctx.lineTo(w, weight * x1Norm + bias);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Points
    points.forEach((p) => {
      ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
      ctx.shadowColor = 'rgba(168, 85, 247, 0.4)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Epoch label
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = 'rgba(99, 102, 241, 0.7)';
    ctx.fillText(`Epoch: ${epoch}`, 10, 20);
  }, [weight, bias, epoch]);

  useEffect(() => {
    draw();
  }, [draw]);

  const trainStep = useCallback(() => {
    const n = points.length;
    let dw = 0;
    let db = 0;

    // Use normalized x values for stable gradients
    points.forEach((p) => {
      const xNorm = (p.x - xMin) / (xMax - xMin); // [0, 1]
      const predicted = weight * xNorm + bias;
      const error = predicted - p.y;
      dw += error * xNorm;
      db += error;
    });

    dw /= n;
    db /= n;

    const newWeight = weight - lr * dw;
    const newBias = bias - lr * db;

    setWeight(newWeight);
    setBias(newBias);
    setEpoch((prev) => prev + 1);

    const mse = points.reduce((sum, p) => {
      const xNorm = (p.x - xMin) / (xMax - xMin);
      const predicted = newWeight * xNorm + newBias;
      return sum + (p.y - predicted) ** 2;
    }, 0) / n;

    setLossHistory((prev) => [...prev, { epoch: prev.length + 1, loss: parseFloat(mse.toFixed(1)) }]);

    // Stop training when converged
    if (mse < 20) {
      setIsTraining(false);
    }
  }, [weight, bias, lr]);

  useEffect(() => {
    if (!isTraining) return;
    const interval = setInterval(() => {
      for (let i = 0; i < 10; i++) trainStep();
    }, 30);
    return () => clearInterval(interval);
  }, [isTraining, trainStep]);

  const reset = () => {
    setIsTraining(false);
    setWeight(0);
    setBias(200);
    setEpoch(0);
    setLossHistory([]);
  };

  const mse =
    points.reduce((sum, p) => {
      const xNorm = (p.x - xMin) / (xMax - xMin);
      const predicted = weight * xNorm + bias;
      return sum + (p.y - predicted) ** 2;
    }, 0) / points.length;

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="gradient-border rounded-xl overflow-hidden"
      >
        <canvas ref={canvasRef} className="w-full h-[350px] bg-surface/50" />
      </motion.div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsTraining(!isTraining)}
          className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all ${
            isTraining
              ? 'bg-error/20 text-error hover:bg-error/30'
              : 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 glow'
          }`}
        >
          {isTraining ? '⏸ Pause Training' : '🏋️ Train Model'}
        </button>
        <button
          onClick={trainStep}
          disabled={isTraining}
          className="px-4 py-3 rounded-lg text-sm bg-secondary/20 text-secondary hover:bg-secondary/30 transition-colors disabled:opacity-30"
        >
          +1 Epoch
        </button>
        <button
          onClick={reset}
          className="px-4 py-3 rounded-lg text-sm bg-surface-light text-foreground/60 hover:text-foreground transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Learning Rate Slider */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-foreground/50">Learning Rate</label>
          <span className="font-mono text-sm font-bold text-primary-light">{lr}</span>
        </div>
        <input
          type="range"
          min={0.001}
          max={0.1}
          step={0.001}
          value={lr}
          onChange={(e) => setLr(parseFloat(e.target.value))}
          className="w-full accent-primary h-1.5 rounded-lg appearance-none bg-surface-light cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-foreground/30 mt-1">
          <span>0.001</span>
          <span>0.05</span>
          <span>0.1</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-xs text-foreground/50 mb-1">Epoch</p>
          <p className="font-mono font-bold text-primary-light">{epoch}</p>
        </div>
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-xs text-foreground/50 mb-1">Weight</p>
          <p className="font-mono font-bold text-secondary text-sm">{weight.toFixed(4)}</p>
        </div>
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-xs text-foreground/50 mb-1">Bias</p>
          <p className="font-mono font-bold text-accent text-sm">{bias.toFixed(1)}</p>
        </div>
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-xs text-foreground/50 mb-1">MSE</p>
          <p className={`font-mono font-bold text-sm ${mse < 500 ? 'text-success' : 'text-warning'}`}>
            {mse.toFixed(0)}
          </p>
        </div>
      </div>

      {/* Loss chart */}
      {lossHistory.length > 1 && (
        <div className="glass rounded-lg p-4">
          <p className="text-sm text-foreground/60 mb-2">Loss over epochs</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={lossHistory.slice(-100)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
              <XAxis dataKey="epoch" tick={{ fontSize: 10, fill: 'rgba(226,232,240,0.4)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(226,232,240,0.4)' }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, fontSize: 12 }}
              />
              <Line type="monotone" dataKey="loss" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
