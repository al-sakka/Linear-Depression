'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const RegressionCanvas = dynamic(
  () => import('@/components/visualizations/RegressionCanvas'),
  { ssr: false }
);

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen particle-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">🎮 Playground</h1>
          <p className="text-foreground/50 mb-8">
            Free experiment! Click to add points, drag to move them, and watch the regression line adapt in real-time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <RegressionCanvas />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 glass rounded-xl p-6"
        >
          <h2 className="font-semibold mb-3">🧪 Experiments to Try</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                title: 'Perfect Line',
                desc: 'Place points in a straight line. Notice MSE → 0.',
              },
              {
                title: 'Add an Outlier',
                desc: 'Place one point far away. Watch the line shift toward it.',
              },
              {
                title: 'Curved Data',
                desc: 'Arrange points in a curve. The straight line cannot fit!',
              },
              {
                title: 'Random Scatter',
                desc: 'Place points randomly. Observe high MSE and a confused line.',
              },
            ].map((exp) => (
              <div
                key={exp.title}
                className="p-3 rounded-lg bg-surface-light/50 border border-border/30"
              >
                <h3 className="text-sm font-medium mb-1">{exp.title}</h3>
                <p className="text-xs text-foreground/40">{exp.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
