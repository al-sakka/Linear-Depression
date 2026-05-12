'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function SlopeInterceptViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [slope, setSlope] = useState(1);
  const [intercept, setIntercept] = useState(200);

  const points = [
    { x: 60, y: 320 },
    { x: 120, y: 270 },
    { x: 180, y: 230 },
    { x: 250, y: 200 },
    { x: 300, y: 150 },
    { x: 380, y: 120 },
    { x: 430, y: 80 },
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

    // Line
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.9)';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, intercept);
    ctx.lineTo(w, slope * w + intercept);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Intercept marker
    ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
    ctx.beginPath();
    ctx.arc(0, intercept, 6, 0, Math.PI * 2);
    ctx.fill();

    // Label for intercept
    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'rgba(6, 182, 212, 0.9)';
    ctx.fillText(`b = ${(400 - intercept).toFixed(0)}`, 10, intercept - 12);

    // Points
    points.forEach((p) => {
      ctx.fillStyle = 'rgba(168, 85, 247, 0.7)';
      ctx.shadowColor = 'rgba(168, 85, 247, 0.4)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Slope angle indicator
    const angle = Math.atan(slope);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    const cx = w / 2;
    const cy = slope * cx + intercept;
    ctx.beginPath();
    ctx.moveTo(cx - 40, cy);
    ctx.lineTo(cx + 40, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = '11px sans-serif';
    ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
    ctx.fillText(`m = ${slope.toFixed(2)}`, cx + 45, cy - 5);
    ctx.fillText(`angle = ${((angle * 180) / Math.PI).toFixed(1)}°`, cx + 45, cy + 12);
  }, [slope, intercept]);

  useEffect(() => {
    draw();
  }, [draw]);

  const mse =
    points.reduce((sum, p) => {
      const predicted = slope * p.x + intercept;
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass rounded-lg p-4">
          <label className="flex items-center justify-between text-sm mb-2">
            <span className="text-foreground/70">Slope (m)</span>
            <span className="font-mono text-primary-light">{slope.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={-2}
            max={2}
            step={0.01}
            value={slope}
            onChange={(e) => setSlope(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-foreground/40 mt-1">
            <span>-2.0</span>
            <span>0</span>
            <span>2.0</span>
          </div>
        </div>

        <div className="glass rounded-lg p-4">
          <label className="flex items-center justify-between text-sm mb-2">
            <span className="text-foreground/70">Intercept (b)</span>
            <span className="font-mono text-accent">{(400 - intercept).toFixed(0)}</span>
          </label>
          <input
            type="range"
            min={0}
            max={400}
            step={1}
            value={intercept}
            onChange={(e) => setIntercept(parseFloat(e.target.value))}
            className="w-full accent-accent"
          />
          <div className="flex justify-between text-xs text-foreground/40 mt-1">
            <span>400</span>
            <span>200</span>
            <span>0</span>
          </div>
        </div>
      </div>

      <div className="glass rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground/60">Equation</p>
            <p className="font-mono text-lg">
              <span className="text-foreground/80">y = </span>
              <span className="text-primary-light">{slope.toFixed(2)}</span>
              <span className="text-foreground/80">x + </span>
              <span className="text-accent">{(400 - intercept).toFixed(0)}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-foreground/60">MSE</p>
            <p className={`font-mono text-lg ${mse < 1000 ? 'text-success' : mse < 5000 ? 'text-warning' : 'text-error'}`}>
              {mse.toFixed(0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
