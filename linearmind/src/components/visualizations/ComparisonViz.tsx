'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

type Method = 'linear' | 'polynomial' | 'neural';

export default function ComparisonViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeMethod, setActiveMethod] = useState<Method[]>(['linear']);

  // Generate nonlinear data (sine-like)
  const points = Array.from({ length: 20 }, (_, i) => {
    const x = 20 + i * 26;
    const y = 200 + Math.sin((x - 50) / 60) * 120 + (Math.random() - 0.5) * 25;
    return { x, y };
  });

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

    // Linear regression
    if (activeMethod.includes('linear')) {
      const n = points.length;
      const sumX = points.reduce((s, p) => s + p.x, 0);
      const sumY = points.reduce((s, p) => s + p.y, 0);
      const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
      const sumXX = points.reduce((s, p) => s + p.x * p.x, 0);
      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.9)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, intercept);
      ctx.lineTo(w, slope * w + intercept);
      ctx.stroke();
    }

    // Polynomial (approximate with sine fit)
    if (activeMethod.includes('polynomial')) {
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.9)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = 200 + Math.sin((x - 50) / 60) * 120;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Neural network (closer fit)
    if (activeMethod.includes('neural')) {
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.9)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = 200 + Math.sin((x - 50) / 60) * 120 + Math.sin(x / 30) * 8;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Points
    points.forEach((p) => {
      ctx.fillStyle = 'rgba(168, 85, 247, 0.7)';
      ctx.shadowColor = 'rgba(168, 85, 247, 0.3)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Legend
    const legend = [
      { method: 'linear' as Method, label: 'Linear', color: '#6366f1' },
      { method: 'polynomial' as Method, label: 'Polynomial', color: '#10b981' },
      { method: 'neural' as Method, label: 'Neural Net', color: '#f59e0b' },
    ];

    let ly = 15;
    legend.forEach((l) => {
      if (activeMethod.includes(l.method)) {
        ctx.fillStyle = l.color;
        ctx.fillRect(w - 120, ly, 15, 3);
        ctx.font = '11px sans-serif';
        ctx.fillText(l.label, w - 100, ly + 5);
        ly += 18;
      }
    });
  }, [activeMethod]);

  useEffect(() => {
    draw();
  }, [draw]);

  const toggleMethod = (m: Method) => {
    setActiveMethod((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const methods: { id: Method; label: string; color: string; icon: string; desc: string }[] = [
    { id: 'linear', label: 'Linear Regression', color: '#6366f1', icon: '📏', desc: 'y = wx + b' },
    { id: 'polynomial', label: 'Polynomial', color: '#10b981', icon: '🔄', desc: 'y = w₁x + w₂x² + b' },
    { id: 'neural', label: 'Neural Network', color: '#f59e0b', icon: '🧠', desc: 'Multi-layer learned' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => toggleMethod(m.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              activeMethod.includes(m.id)
                ? 'border-opacity-40 bg-opacity-20'
                : 'border-transparent bg-surface-light text-foreground/50'
            }`}
            style={
              activeMethod.includes(m.id)
                ? { borderColor: m.color, backgroundColor: `${m.color}20`, color: m.color }
                : {}
            }
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="gradient-border rounded-xl overflow-hidden"
      >
        <canvas ref={canvasRef} className="w-full h-[380px] bg-surface/50" />
      </motion.div>

      {/* Comparison table */}
      <div className="glass rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 text-foreground/60">Method</th>
              <th className="text-left p-3 text-foreground/60">Equation</th>
              <th className="text-left p-3 text-foreground/60">Complexity</th>
              <th className="text-left p-3 text-foreground/60">Best For</th>
            </tr>
          </thead>
          <tbody>
            {methods.map((m) => (
              <tr key={m.id} className="border-b border-border/50">
                <td className="p-3 font-medium" style={{ color: m.color }}>
                  {m.icon} {m.label}
                </td>
                <td className="p-3 font-mono text-xs text-foreground/60">{m.desc}</td>
                <td className="p-3 text-foreground/60">
                  {m.id === 'linear' ? '⭐' : m.id === 'polynomial' ? '⭐⭐' : '⭐⭐⭐'}
                </td>
                <td className="p-3 text-foreground/60 text-xs">
                  {m.id === 'linear' && 'Linear relationships'}
                  {m.id === 'polynomial' && 'Curved patterns'}
                  {m.id === 'neural' && 'Any complex pattern'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
