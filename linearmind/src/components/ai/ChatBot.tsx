'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Brain, Sparkles, Loader2, Trash2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const EXPLAIN_LEVELS = ['Beginner', 'Engineer', 'Child', 'Math-heavy'] as const;

export default function ChatBot() {
  const { isChatOpen, toggleChat } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your LinearMind AI for Linear Regression. Ask me anything about regression, cost functions, gradient descent, or neural networks! 🧠',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [explainLevel, setExplainLevel] = useState<typeof EXPLAIN_LEVELS[number] | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          explainLevel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
    } catch {
      // Fallback for when API is not configured
      const fallbackResponses: Record<string, string> = {
        'what is linear regression': 'Linear Regression is a supervised learning algorithm that finds the best straight line (y = wx + b) to fit your data. It minimizes the Mean Squared Error between predictions and actual values.',
        'gradient descent': 'Gradient Descent is an optimization algorithm that iteratively adjusts weights by moving in the direction opposite to the gradient (slope) of the loss function. Think of a ball rolling downhill to find the lowest point!',
        'mse': 'MSE (Mean Squared Error) = (1/n) × Σ(yᵢ - ŷᵢ)². It measures average squared difference between predictions and actual values. Lower MSE = better model.',
        'learning rate': 'The learning rate (α) controls step size during gradient descent. Too high → overshooting, too low → slow convergence. It\'s the most important hyperparameter to tune!',
        'overfitting': 'Overfitting occurs when a model memorizes training data (including noise) instead of learning the underlying pattern. It performs well on training data but poorly on new data.',
      };

      const key = Object.keys(fallbackResponses).find(k => 
        userMessage.toLowerCase().includes(k)
      );
      
      const fallback = key 
        ? fallbackResponses[key]
        : `Great question about "${userMessage}"! This relates to Linear Regression concepts. In a nutshell: Linear Regression finds the best line y = wx + b by minimizing the cost function using gradient descent. The key is understanding how slope, intercept, error, and optimization work together. Try the interactive demos in the lessons to build intuition! 🎯`;

      if (explainLevel === 'Child') {
        setMessages((prev) => [...prev, { 
          role: 'assistant', 
          content: `🧒 Imagine you have a bunch of dots on paper. Linear Regression is like finding the best straight ruler position that goes through (or near) all the dots! The closer the ruler is to all dots, the better your "machine" can guess where new dots might be.`
        }]);
      } else if (explainLevel === 'Math-heavy') {
        setMessages((prev) => [...prev, { 
          role: 'assistant', 
          content: `📐 Formally: Given a dataset {(xᵢ, yᵢ)}ⁿᵢ₌₁, we seek parameters w*, b* = argmin_{w,b} (1/n)Σᵢ(yᵢ - (wxᵢ + b))². Taking partial derivatives: ∂L/∂w = -(2/n)Σxᵢ(yᵢ - ŷᵢ) and ∂L/∂b = -(2/n)Σ(yᵢ - ŷᵢ). Setting these to zero yields the normal equations, or we apply iterative GD: w ← w - α∂L/∂w.`
        }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: fallback }]);
      }
    } finally {
      setIsLoading(false);
      setExplainLevel(null);
    }
  };

  const quickQuestions = [
    'What is Linear Regression?',
    'Explain gradient descent',
    'What is MSE?',
    'When does regression fail?',
  ];

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={toggleChat}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg animate-pulse-glow"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] glass-strong rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">LinearMind AI</p>
                  <p className="text-xs text-foreground/50">Ask anything about regression</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages([{ role: 'assistant', content: 'Hi! I\'m your LinearMind AI for Linear Regression. Ask me anything about regression, cost functions, gradient descent, or neural networks! 🧠' }])}
                  className="text-foreground/40 hover:text-foreground transition-colors p-1"
                  title="Clear chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleChat}
                  className="text-foreground/40 hover:text-foreground transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary/20 text-foreground ml-8'
                        : 'bg-surface-light text-foreground/90 mr-8'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-0.5">{children}</ol>,
                          li: ({ children }) => <li className="text-sm">{children}</li>,
                          code: ({ children }) => <code className="bg-background/50 px-1 py-0.5 rounded text-xs font-mono text-primary-light">{children}</code>,
                          h1: ({ children }) => <h1 className="font-bold text-base mb-1">{children}</h1>,
                          h2: ({ children }) => <h2 className="font-bold text-sm mb-1">{children}</h2>,
                          h3: ({ children }) => <h3 className="font-semibold text-sm mb-1">{children}</h3>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-surface-light rounded-xl px-3 py-2 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-foreground/50">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-1.5">
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInput(q);
                        setTimeout(() => {
                          setInput(q);
                          const btn = document.getElementById('chat-send');
                          btn?.click();
                        }, 100);
                      }}
                      className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary-light hover:bg-primary/20 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Explain Level */}
            <div className="px-4 pb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-secondary" />
                <span className="text-xs text-foreground/40 mr-1">Explain as:</span>
                {EXPLAIN_LEVELS.map((level) => (
                  <button
                    key={level}
                    onClick={() => setExplainLevel(explainLevel === level ? null : level)}
                    className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
                      explainLevel === level
                        ? 'bg-secondary/20 text-secondary'
                        : 'bg-surface-light text-foreground/40 hover:text-foreground/60'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about regression..."
                  className="flex-1 bg-surface-light rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-foreground/30"
                />
                <button
                  id="chat-send"
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center text-primary-light hover:bg-primary/30 transition-colors disabled:opacity-30"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
