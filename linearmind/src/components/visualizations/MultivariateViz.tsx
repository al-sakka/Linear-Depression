'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface House {
  size: number;
  bedrooms: number;
  age: number;
  actualPrice: number;
}

const houses: House[] = [
  { size: 80, bedrooms: 2, age: 15, actualPrice: 450 },
  { size: 120, bedrooms: 3, age: 8, actualPrice: 720 },
  { size: 150, bedrooms: 3, age: 3, actualPrice: 950 },
  { size: 200, bedrooms: 4, age: 1, actualPrice: 1200 },
  { size: 95, bedrooms: 2, age: 20, actualPrice: 380 },
  { size: 180, bedrooms: 4, age: 5, actualPrice: 1050 },
  { size: 60, bedrooms: 1, age: 25, actualPrice: 250 },
  { size: 140, bedrooms: 3, age: 10, actualPrice: 780 },
];

export default function MultivariateViz() {
  const [w1, setW1] = useState(5);
  const [w2, setW2] = useState(50);
  const [w3, setW3] = useState(-8);
  const [bias, setBias] = useState(100);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [showContributions, setShowContributions] = useState(false);

  const predictions = useMemo(() => {
    return houses.map((h) => {
      const sizeContrib = w1 * h.size;
      const bedroomContrib = w2 * h.bedrooms;
      const ageContrib = w3 * h.age;
      const predicted = sizeContrib + bedroomContrib + ageContrib + bias;
      const error = h.actualPrice - predicted;
      return { ...h, predicted, error, sizeContrib, bedroomContrib, ageContrib };
    });
  }, [w1, w2, w3, bias]);

  const mse = useMemo(() => {
    const sum = predictions.reduce((acc, p) => acc + p.error * p.error, 0);
    return sum / predictions.length;
  }, [predictions]);

  const maxPrice = Math.max(
    ...predictions.map((p) => Math.max(Math.abs(p.predicted), p.actualPrice))
  );

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">🏠</span> House Price Predictor
        </h3>
        <div className="text-right">
          <p className="text-xs text-foreground/40">Mean Squared Error</p>
          <p className={`text-lg font-mono font-bold ${mse < 5000 ? 'text-success' : mse < 20000 ? 'text-warning' : 'text-error'}`}>
            {mse.toFixed(0)}K²
          </p>
        </div>
      </div>

      {/* Equation display */}
      <div className="bg-background/50 rounded-xl p-4 mb-5 font-mono text-sm text-center">
        <span className="text-foreground/50">ŷ = </span>
        <span className="text-primary font-bold">{w1}</span>
        <span className="text-foreground/40">·size + </span>
        <span className="text-secondary font-bold">{w2}</span>
        <span className="text-foreground/40">·beds + </span>
        <span className="text-accent font-bold">({w3})</span>
        <span className="text-foreground/40">·age + </span>
        <span className="text-foreground/70 font-bold">{bias}</span>
      </div>

      {/* Weight sliders */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-5">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-primary">w₁ (Size)</span>
            <span className="text-foreground/50 font-mono">{w1}</span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            step={0.5}
            value={w1}
            onChange={(e) => setW1(Number(e.target.value))}
            className="w-full accent-primary h-1.5"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-secondary">w₂ (Bedrooms)</span>
            <span className="text-foreground/50 font-mono">{w2}</span>
          </div>
          <input
            type="range"
            min={0}
            max={200}
            step={5}
            value={w2}
            onChange={(e) => setW2(Number(e.target.value))}
            className="w-full accent-secondary h-1.5"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-accent">w₃ (Age)</span>
            <span className="text-foreground/50 font-mono">{w3}</span>
          </div>
          <input
            type="range"
            min={-20}
            max={5}
            step={0.5}
            value={w3}
            onChange={(e) => setW3(Number(e.target.value))}
            className="w-full accent-accent h-1.5"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-foreground/70">b (Bias)</span>
            <span className="text-foreground/50 font-mono">{bias}</span>
          </div>
          <input
            type="range"
            min={-200}
            max={400}
            step={10}
            value={bias}
            onChange={(e) => setBias(Number(e.target.value))}
            className="w-full h-1.5"
          />
        </div>
      </div>

      {/* Toggle contributions view */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setShowContributions(!showContributions)}
          className={`text-xs px-3 py-1 rounded-full transition-colors ${
            showContributions
              ? 'bg-primary/20 text-primary-light'
              : 'bg-surface-light text-foreground/40 hover:text-foreground/60'
          }`}
        >
          {showContributions ? '📊 Hide Contributions' : '📊 Show Contributions'}
        </button>
        <span className="text-xs text-foreground/30">See how each feature contributes</span>
      </div>

      {/* Data table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-2 text-foreground/40">House</th>
              <th className="text-right py-2 px-2 text-primary/70">Size(m²)</th>
              <th className="text-right py-2 px-2 text-secondary/70">Beds</th>
              <th className="text-right py-2 px-2 text-accent/70">Age(yr)</th>
              <th className="text-right py-2 px-2 text-foreground/50">Actual(K)</th>
              <th className="text-right py-2 px-2 text-foreground/50">Predicted(K)</th>
              <th className="text-right py-2 px-2 text-foreground/50">Error</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((p, i) => (
              <motion.tr
                key={i}
                className="border-b border-border/30 cursor-pointer hover:bg-surface-light/50"
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
                animate={{ backgroundColor: hoveredRow === i ? 'rgba(99,102,241,0.05)' : 'transparent' }}
              >
                <td className="py-1.5 px-2 text-foreground/60">#{i + 1}</td>
                <td className="py-1.5 px-2 text-right font-mono text-primary/80">{p.size}</td>
                <td className="py-1.5 px-2 text-right font-mono text-secondary/80">{p.bedrooms}</td>
                <td className="py-1.5 px-2 text-right font-mono text-accent/80">{p.age}</td>
                <td className="py-1.5 px-2 text-right font-mono text-foreground/70">{p.actualPrice}</td>
                <td className="py-1.5 px-2 text-right font-mono font-bold text-foreground">{p.predicted.toFixed(0)}</td>
                <td className={`py-1.5 px-2 text-right font-mono ${Math.abs(p.error) < 50 ? 'text-success' : Math.abs(p.error) < 150 ? 'text-warning' : 'text-error'}`}>
                  {p.error > 0 ? '+' : ''}{p.error.toFixed(0)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contribution breakdown for hovered row */}
      <AnimatePresence>
        {showContributions && hoveredRow !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 bg-background/50 rounded-xl p-4"
          >
            <p className="text-xs text-foreground/50 mb-3">
              House #{hoveredRow + 1} — Feature Contributions
            </p>
            <div className="space-y-2">
              {[
                { label: `Size: ${w1} × ${predictions[hoveredRow].size}`, value: predictions[hoveredRow].sizeContrib, color: 'bg-primary' },
                { label: `Beds: ${w2} × ${predictions[hoveredRow].bedrooms}`, value: predictions[hoveredRow].bedroomContrib, color: 'bg-secondary' },
                { label: `Age: ${w3} × ${predictions[hoveredRow].age}`, value: predictions[hoveredRow].ageContrib, color: 'bg-accent' },
                { label: `Bias`, value: bias, color: 'bg-foreground/30' },
              ].map((item) => {
                const barMax = Math.max(
                  Math.abs(predictions[hoveredRow].sizeContrib),
                  Math.abs(predictions[hoveredRow].bedroomContrib),
                  Math.abs(predictions[hoveredRow].ageContrib),
                  Math.abs(bias),
                  1
                );
                const width = (Math.abs(item.value) / barMax) * 100;
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-xs text-foreground/50 w-28 shrink-0 font-mono">{item.label}</span>
                    <div className="flex-1 h-4 bg-surface-light rounded-full overflow-hidden relative">
                      <motion.div
                        className={`h-full rounded-full ${item.color} ${item.value < 0 ? 'opacity-60' : ''}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <span className={`text-xs font-mono w-16 text-right ${item.value < 0 ? 'text-error' : 'text-success'}`}>
                      {item.value > 0 ? '+' : ''}{item.value.toFixed(0)}K
                    </span>
                  </div>
                );
              })}
              <div className="border-t border-border pt-2 flex items-center gap-3">
                <span className="text-xs text-foreground/70 w-28 shrink-0 font-bold">Total</span>
                <div className="flex-1" />
                <span className="text-xs font-mono w-16 text-right font-bold text-foreground">
                  = {predictions[hoveredRow].predicted.toFixed(0)}K
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual comparison bars */}
      <div className="mt-5">
        <p className="text-xs text-foreground/40 mb-2">Actual vs Predicted</p>
        <div className="space-y-1.5">
          {predictions.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-foreground/40 w-6">#{i + 1}</span>
              <div className="flex-1 relative h-5">
                <div
                  className="absolute top-0 h-2.5 bg-foreground/15 rounded-full"
                  style={{ width: `${(p.actualPrice / maxPrice) * 100}%` }}
                />
                <motion.div
                  className={`absolute top-0 h-2.5 rounded-full ${
                    Math.abs(p.error) < 50 ? 'bg-success/50' : Math.abs(p.error) < 150 ? 'bg-warning/50' : 'bg-error/50'
                  }`}
                  animate={{ width: `${(Math.max(0, p.predicted) / maxPrice) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-2 text-xs text-foreground/40">
          <span className="flex items-center gap-1"><span className="w-3 h-2 bg-foreground/15 rounded-sm inline-block" /> Actual</span>
          <span className="flex items-center gap-1"><span className="w-3 h-2 bg-success/50 rounded-sm inline-block" /> Predicted</span>
        </div>
      </div>
    </div>
  );
}
