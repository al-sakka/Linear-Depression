'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Neuron {
  weights: number[];
  bias: number;
  activation: 'none' | 'relu' | 'sigmoid';
  output?: number;
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function relu(x: number): number {
  return Math.max(0, x);
}

function activate(x: number, fn: 'none' | 'relu' | 'sigmoid'): number {
  if (fn === 'relu') return relu(x);
  if (fn === 'sigmoid') return sigmoid(x);
  return x;
}

export default function NeuronBridgeViz() {
  const [layers, setLayers] = useState(1); // 1 = single neuron, 2 = hidden + output, 3 = 2 hidden + output
  const [input, setInput] = useState([3, 5]);
  const [showMath, setShowMath] = useState(true);

  // Fixed weights for deterministic display
  const networkConfig: { hidden: Neuron[][]; output: Neuron } = (() => {
    if (layers === 1) {
      return {
        hidden: [],
        output: { weights: [2.5, -1.2], bias: 0.8, activation: 'none' },
      };
    }
    if (layers === 2) {
      return {
        hidden: [[
          { weights: [0.7, 0.3], bias: -0.5, activation: 'relu' },
          { weights: [-0.4, 0.9], bias: 0.2, activation: 'relu' },
          { weights: [0.5, -0.6], bias: 0.1, activation: 'relu' },
        ]],
        output: { weights: [1.2, 0.8, -0.5], bias: 0.3, activation: 'none' },
      };
    }
    return {
      hidden: [
        [
          { weights: [0.7, 0.3], bias: -0.5, activation: 'relu' },
          { weights: [-0.4, 0.9], bias: 0.2, activation: 'relu' },
        ],
        [
          { weights: [0.6, -0.3], bias: 0.1, activation: 'relu' },
          { weights: [-0.5, 0.8], bias: -0.2, activation: 'relu' },
          { weights: [0.4, 0.4], bias: 0.0, activation: 'relu' },
        ],
      ],
      output: { weights: [1.0, 0.7, -0.3], bias: 0.5, activation: 'none' },
    };
  })();

  // Forward pass
  const computeForward = () => {
    let currentInput = [...input];
    const layerOutputs: number[][] = [currentInput];

    for (const layer of networkConfig.hidden) {
      const outputs = layer.map(neuron => {
        const z = neuron.weights.reduce((sum, w, i) => sum + w * (currentInput[i] || 0), 0) + neuron.bias;
        return activate(z, neuron.activation);
      });
      layerOutputs.push(outputs);
      currentInput = outputs;
    }

    // Output
    const z = networkConfig.output.weights.reduce((sum, w, i) => sum + w * (currentInput[i] || 0), 0) + networkConfig.output.bias;
    const out = activate(z, networkConfig.output.activation);
    layerOutputs.push([out]);

    return { layerOutputs, finalOutput: out };
  };

  const { layerOutputs, finalOutput } = computeForward();

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">🧠</span> From Linear Regression to Neural Networks
        </h3>
        <label className="flex items-center gap-2 text-xs text-foreground/50">
          <input type="checkbox" checked={showMath} onChange={(e) => setShowMath(e.target.checked)} className="accent-primary" />
          Show Math
        </label>
      </div>

      {/* Architecture selector */}
      <div className="flex gap-2 mb-5">
        {[
          { n: 1, label: '1 Neuron (= Linear Regression)', emoji: '📐' },
          { n: 2, label: '1 Hidden Layer', emoji: '🔗' },
          { n: 3, label: '2 Hidden Layers', emoji: '🧠' },
        ].map(({ n, label, emoji }) => (
          <button
            key={n}
            onClick={() => setLayers(n)}
            className={`flex-1 px-3 py-2 text-xs rounded-xl border transition-all ${
              layers === n
                ? 'bg-primary/20 border-primary/40 text-primary-light font-bold'
                : 'bg-surface-light border-border text-foreground/50 hover:text-foreground/70'
            }`}
          >
            <span className="text-lg">{emoji}</span>
            <br />{label}
          </button>
        ))}
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-foreground/50">x₁ (input)</span>
            <span className="text-primary font-mono">{input[0].toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.1}
            value={input[0]}
            onChange={(e) => setInput([Number(e.target.value), input[1]])}
            className="w-full accent-primary h-1.5"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-foreground/50">x₂ (input)</span>
            <span className="text-secondary font-mono">{input[1].toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.1}
            value={input[1]}
            onChange={(e) => setInput([input[0], Number(e.target.value)])}
            className="w-full accent-secondary h-1.5"
          />
        </div>
      </div>

      {/* Network visualization */}
      <div className="bg-background/30 rounded-xl p-4 mb-4 overflow-x-auto">
        <div className="flex items-center justify-center gap-6 min-w-max">
          {/* Input layer */}
          <div className="flex flex-col gap-4">
            <p className="text-xs text-center text-foreground/30 mb-1">Input</p>
            {input.map((val, i) => (
              <motion.div
                key={i}
                className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              >
                <span className="text-xs font-mono text-primary font-bold">{val.toFixed(1)}</span>
              </motion.div>
            ))}
          </div>

          {/* Hidden layers */}
          <AnimatePresence mode="wait">
            {networkConfig.hidden.map((layer, layerIdx) => (
              <motion.div
                key={`hidden-${layerIdx}-${layers}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col gap-3"
              >
                <p className="text-xs text-center text-foreground/30 mb-1">Hidden {layerIdx + 1}</p>
                {layer.map((neuron, nIdx) => (
                  <motion.div
                    key={nIdx}
                    className="w-14 h-14 rounded-full bg-secondary/20 border-2 border-secondary/40 flex items-center justify-center relative"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-xs font-mono text-secondary font-bold">
                      {layerOutputs[layerIdx + 1]?.[nIdx]?.toFixed(1) ?? '?'}
                    </span>
                    <span className="absolute -bottom-4 text-xs text-foreground/20">{neuron.activation}</span>
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Arrow to output */}
          <div className="text-foreground/20 text-xl">→</div>

          {/* Output layer */}
          <div className="flex flex-col gap-4">
            <p className="text-xs text-center text-foreground/30 mb-1">Output</p>
            <motion.div
              className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center"
              animate={{ boxShadow: ['0 0 0px rgba(6,182,212,0)', '0 0 15px rgba(6,182,212,0.3)', '0 0 0px rgba(6,182,212,0)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-sm font-mono text-accent font-bold">{finalOutput.toFixed(2)}</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Math breakdown */}
      {showMath && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-surface-light/50 rounded-xl p-4 mb-4 font-mono text-xs space-y-2 overflow-x-auto"
        >
          {layers === 1 && (
            <div className="text-foreground/60">
              <p className="text-primary mb-1">Linear Regression = Single Neuron:</p>
              <p>ŷ = w₁·x₁ + w₂·x₂ + b</p>
              <p className="text-foreground/40 mt-1">
                ŷ = ({networkConfig.output.weights[0]})·({input[0].toFixed(1)}) + ({networkConfig.output.weights[1]})·({input[1].toFixed(1)}) + ({networkConfig.output.bias})
              </p>
              <p className="text-accent font-bold mt-1">= {finalOutput.toFixed(3)}</p>
            </div>
          )}
          {layers >= 2 && (
            <div className="text-foreground/60">
              <p className="text-secondary mb-1">Hidden Layer Computation (with ReLU):</p>
              {networkConfig.hidden[0].map((n, i) => (
                <p key={i} className="text-foreground/40">
                  h{i + 1} = ReLU({n.weights[0]}·{input[0].toFixed(1)} + {n.weights[1]}·{input[1].toFixed(1)} + {n.bias}) = {layerOutputs[1]?.[i]?.toFixed(3)}
                </p>
              ))}
              <p className="text-accent font-bold mt-2">
                output = {finalOutput.toFixed(3)}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Key insight */}
      <div className="bg-background/30 rounded-lg p-3">
        <p className="text-xs text-foreground/50">
          {layers === 1 && '📐 A single neuron with no activation = Linear Regression! Same formula: ŷ = W·x + b.'}
          {layers === 2 && '🔗 Adding a hidden layer with ReLU activation lets the network model non-linear patterns. Each neuron learns a different feature.'}
          {layers === 3 && '🧠 Deeper networks can model increasingly complex functions. Each layer builds on the abstractions from the previous one.'}
        </p>
      </div>
    </div>
  );
}
