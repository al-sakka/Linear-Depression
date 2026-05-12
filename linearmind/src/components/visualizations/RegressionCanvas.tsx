'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Point {
  x: number;
  y: number;
}

export default function RegressionCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([
    { x: 80, y: 300 },
    { x: 150, y: 260 },
    { x: 200, y: 220 },
    { x: 280, y: 200 },
    { x: 320, y: 160 },
    { x: 400, y: 140 },
    { x: 450, y: 100 },
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState(-1);

  const calculateRegression = useCallback((pts: Point[]) => {
    if (pts.length < 2) return { slope: 0, intercept: 200 };
    const n = pts.length;
    const sumX = pts.reduce((s, p) => s + p.x, 0);
    const sumY = pts.reduce((s, p) => s + p.y, 0);
    const sumXY = pts.reduce((s, p) => s + p.x * p.y, 0);
    const sumXX = pts.reduce((s, p) => s + p.x * p.x, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return { slope, intercept };
  }, []);

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

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h);
      ctx.stroke();
    }
    for (let i = 0; i < h; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(w, i);
      ctx.stroke();
    }

    // Regression line
    if (points.length >= 2) {
      const { slope, intercept } = calculateRegression(points);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.8)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(0, intercept);
      ctx.lineTo(w, slope * w + intercept);
      ctx.stroke();

      // Error lines
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      points.forEach((p) => {
        const predicted = slope * p.x + intercept;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, predicted);
        ctx.stroke();
      });
      ctx.setLineDash([]);
    }

    // Points
    points.forEach((p, i) => {
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8);
      gradient.addColorStop(0, 'rgba(168, 85, 247, 1)');
      gradient.addColorStop(1, 'rgba(168, 85, 247, 0.3)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, i === dragIndex ? 10 : 7, 0, Math.PI * 2);
      ctx.fill();

      // Glow
      ctx.shadowColor = 'rgba(168, 85, 247, 0.5)';
      ctx.shadowBlur = 15;
      ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }, [points, dragIndex, calculateRegression]);

  useEffect(() => {
    draw();
  }, [draw]);

  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getCanvasPos(e);
    const idx = points.findIndex(
      (p) => Math.hypot(p.x - pos.x, p.y - pos.y) < 15
    );
    if (idx !== -1) {
      setIsDragging(true);
      setDragIndex(idx);
    } else {
      setPoints([...points, pos]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || dragIndex === -1) return;
    const pos = getCanvasPos(e);
    const newPoints = [...points];
    newPoints[dragIndex] = pos;
    setPoints(newPoints);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragIndex(-1);
  };

  const clearPoints = () => setPoints([]);
  const resetPoints = () =>
    setPoints([
      { x: 80, y: 300 },
      { x: 150, y: 260 },
      { x: 200, y: 220 },
      { x: 280, y: 200 },
      { x: 320, y: 160 },
      { x: 400, y: 140 },
      { x: 450, y: 100 },
    ]);

  const { slope, intercept } = calculateRegression(points);
  const mse =
    points.length >= 2
      ? points.reduce((sum, p) => {
          const predicted = slope * p.x + intercept;
          return sum + (p.y - predicted) ** 2;
        }, 0) / points.length
      : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground/60">
          Click to add points. Drag to move them.
        </p>
        <div className="flex gap-2">
          <button
            onClick={resetPoints}
            className="px-3 py-1.5 text-xs rounded-lg bg-primary/20 text-primary-light hover:bg-primary/30 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={clearPoints}
            className="px-3 py-1.5 text-xs rounded-lg bg-error/20 text-error hover:bg-error/30 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="gradient-border rounded-xl overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-[400px] cursor-crosshair bg-surface/50"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </motion.div>

      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-xs text-foreground/50 mb-1">Points</p>
          <p className="text-lg font-bold text-primary-light">{points.length}</p>
        </div>
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-xs text-foreground/50 mb-1">Slope (m)</p>
          <p className="text-lg font-bold text-secondary">{slope.toFixed(3)}</p>
        </div>
        <div className="glass rounded-lg p-3 text-center">
          <p className="text-xs text-foreground/50 mb-1">MSE</p>
          <p className="text-lg font-bold text-error">{mse.toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
}
