'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Brain, Sparkles, BookOpen, BarChart3, Bot, Trophy, Zap, ArrowRight, Play, Smartphone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let t = 0;
    const points = Array.from({ length: 12 }, () => ({
      x: Math.random() * 500 + 50,
      baseY: 0,
      y: 0,
    }));

    points.sort((a, b) => a.x - b.x);
    points.forEach((p) => {
      p.baseY = 350 - p.x * 0.5 + (Math.random() - 0.5) * 60;
      p.y = p.baseY;
    });

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      t += 0.02;

      points.forEach((p) => {
        p.y = p.baseY + Math.sin(t + p.x * 0.01) * 8;
      });

      const n = points.length;
      const sumX = points.reduce((s, p) => s + p.x, 0);
      const sumY = points.reduce((s, p) => s + p.y, 0);
      const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
      const sumXX = points.reduce((s, p) => s + p.x * p.x, 0);
      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(0, intercept);
      ctx.lineTo(w, slope * w + intercept);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(0, intercept);
      ctx.lineTo(w, slope * w + intercept);
      ctx.stroke();
      ctx.shadowBlur = 0;

      points.forEach((p) => {
        ctx.fillStyle = 'rgba(168, 85, 247, 0.1)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(168, 85, 247, 0.7)';
        ctx.shadowColor = 'rgba(168, 85, 247, 0.5)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        const predicted = slope * p.x + intercept;
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, predicted);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-40"
    />
  );
}

const features = [
  {
    icon: BookOpen,
    title: 'Structured Curriculum',
    description: '7 modules from basics to advanced concepts, with progressive difficulty',
    color: '#6366f1',
  },
  {
    icon: BarChart3,
    title: 'Interactive Visualizations',
    description: 'Drag points, adjust parameters, and watch regression respond in real-time',
    color: '#a855f7',
  },
  {
    icon: Bot,
    title: 'LinearMind AI',
    description: 'Ask questions anytime. Get explanations at your level — beginner to math-heavy',
    color: '#06b6d4',
  },
  {
    icon: Zap,
    title: 'Failure Cases',
    description: 'Break the model intentionally. Add outliers, noise, nonlinear data — see why it fails',
    color: '#ef4444',
  },
  {
    icon: Trophy,
    title: 'Gamified Progress',
    description: 'Earn XP, unlock achievements, track streaks, and compete with yourself',
    color: '#f59e0b',
  },
  {
    icon: Sparkles,
    title: 'Smart Quizzes',
    description: 'Conceptual, visual, and scenario-based questions that make you think',
    color: '#10b981',
  },
];

const teamMembers = [
  { name: 'Sakka', role: 'Frontend', emoji: '🎨', linkedin: 'https://www.linkedin.com/in/abdallah-el-sakka/' },
  { name: 'Hatem', role: 'AI/Backend', emoji: '🤖', linkedin: 'https://www.linkedin.com/in/abdelrahman-hatem-016aa7241/' },
  { name: 'Antar', role: 'ML/Content', emoji: '🧠', linkedin: 'https://www.linkedin.com/in/zeyadantar1/' },
];

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden particle-bg">
        <HeroCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/30 to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse-glow">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-medium text-primary-light bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                Interactive Learning
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold mb-4">
              <span className="gradient-text">LinearMind</span>
            </h1>

            <p className="text-xl sm:text-2xl text-foreground/60 mb-2 font-light">
              Learn Linear Regression{' '}
              <span className="text-primary-light font-medium">interactively</span>
            </p>
            <p className="text-foreground/40 mb-8 max-w-lg mx-auto">
              Drag points. Break models. Ask AI. Watch learning happen visually.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/login">
                <motion.button
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-lg flex items-center gap-2 glow"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(99, 102, 241, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  Start Learning
                </motion.button>
              </Link>
              <Link href="/playground">
                <motion.button
                  className="px-8 py-3.5 rounded-xl border border-border text-foreground/70 font-medium text-lg flex items-center gap-2 hover:bg-surface-light hover:text-foreground transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try Playground
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>

            <motion.div
              className="mt-12"
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex items-start justify-center p-1.5 mx-auto">
                <div className="w-1.5 h-2.5 rounded-full bg-foreground/30" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-28 px-4 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Packed with features
            </motion.span>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Not your typical{' '}
              <span className="gradient-text">lecture slides</span>
            </h2>
            <p className="text-foreground/50 max-w-lg mx-auto text-lg">
              Every feature is designed to make Linear Regression feel intuitive, not intimidating.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="group relative"
              >
                {/* Hover glow */}
                {hoveredFeature === i && (
                  <motion.div
                    layoutId="feature-glow"
                    className="absolute inset-0 rounded-2xl opacity-50 blur-xl -z-10"
                    style={{ backgroundColor: `${feature.color}20` }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="glass rounded-2xl p-7 h-full transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                    style={{ backgroundColor: `${feature.color}15`, boxShadow: hoveredFeature === i ? `0 8px 30px ${feature.color}20` : 'none' }}
                  >
                    <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-foreground/50 leading-relaxed">{feature.description}</p>
                  <div className="mt-4 h-0.5 w-0 group-hover:w-full bg-gradient-to-r rounded-full transition-all duration-500" style={{ backgroundImage: `linear-gradient(to right, ${feature.color}, transparent)` }} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              { value: '7', label: 'Modules', icon: '📚' },
              { value: '12', label: 'Lessons', icon: '📖' },
              { value: '15+', label: 'Quiz Questions', icon: '🧪' },
              { value: '7', label: 'Visualizations', icon: '📊' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="glass rounded-xl p-5 text-center group hover:border-primary/20 transition-colors"
              >
                <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">{stat.icon}</span>
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs text-foreground/40 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-28 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/50 via-surface/80 to-surface/50" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-3xl -translate-y-1/2" />
        </div>

        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm mb-6"
            >
              <Play className="w-4 h-4" />
              Simple 5-step journey
            </motion.span>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              How <span className="gradient-text">learning</span> works
            </h2>
            <p className="text-foreground/50 max-w-md mx-auto">
              A proven loop designed to make concepts stick — not just memorize.
            </p>
          </motion.div>

          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-secondary/30 to-accent/30 hidden sm:block" />

            <div className="space-y-6 sm:space-y-0">
              {[
                { step: '01', title: 'Read & Understand', desc: 'Clear, concise explanations with real-world examples and visual metaphors that make abstract math feel concrete.', icon: '📖', color: '#6366f1' },
                { step: '02', title: 'Interact & Experiment', desc: 'Drag points, adjust sliders, tweak learning rates — watch the model respond live to every change you make.', icon: '🎮', color: '#a855f7' },
                { step: '03', title: 'Break & Learn', desc: 'Intentionally break the model with outliers, noise, and nonlinear data. Understand WHY it fails, not just that it fails.', icon: '💥', color: '#ef4444' },
                { step: '04', title: 'Ask AI', desc: 'Stuck? Your LinearMind AI explains at any level — from "explain like I\'m 5" to full mathematical derivations with LaTeX.', icon: '🤖', color: '#06b6d4' },
                { step: '05', title: 'Quiz & Prove', desc: 'Scenario-based questions that test real understanding. No rote memorization — only genuine comprehension passes.', icon: '🧪', color: '#10b981' },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative sm:grid sm:grid-cols-2 sm:gap-12 sm:py-8 ${i % 2 === 0 ? '' : 'sm:direction-rtl'}`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-6 md:left-1/2 top-10 w-3 h-3 rounded-full border-2 -translate-x-1/2 hidden sm:block" style={{ borderColor: item.color, backgroundColor: `${item.color}40` }}>
                    <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: item.color }} />
                  </div>

                  <div className={`${i % 2 === 0 ? 'sm:text-right sm:pr-12' : 'sm:col-start-2 sm:pl-12'}`}>
                    <div className={`glass rounded-2xl p-6 group hover:border-primary/20 transition-all hover:-translate-y-1 ${i % 2 === 0 ? '' : ''}`}>
                      <div className={`flex items-center gap-3 mb-3 ${i % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}>
                        <span className="text-3xl group-hover:scale-110 transition-transform inline-block">{item.icon}</span>
                        <div className={i % 2 === 0 ? 'sm:text-right' : ''}>
                          <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ color: item.color, backgroundColor: `${item.color}15` }}>Step {item.step}</span>
                          <h3 className="font-bold text-lg mt-1">{item.title}</h3>
                        </div>
                      </div>
                      <p className={`text-sm text-foreground/50 leading-relaxed ${i % 2 === 0 ? 'sm:text-right' : ''}`}>{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-accent/5 to-primary/5 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/20 text-warning text-sm mb-6"
            >
              <Trophy className="w-4 h-4" />
              The builders
            </motion.span>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Meet the <span className="gradient-text">Team</span>
            </h2>
            <p className="text-foreground/50 max-w-md mx-auto">
              Three passionate students turning ML education into an interactive experience.
            </p>
          </motion.div>

          <div className="flex justify-center gap-6 flex-wrap">
            {teamMembers.map((member, i) => (
              <motion.a
                key={member.name}
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: 'spring', bounce: 0.3 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-105" />
                
                <div className="relative glass rounded-2xl p-8 text-center w-52 border border-transparent group-hover:border-primary/20 transition-all duration-300">
                  {/* Avatar */}
                  <div className="relative mx-auto mb-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300 mx-auto">
                      {member.emoji}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success/20 border-2 border-background flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-success" />
                    </div>
                  </div>
                  
                  <p className="font-bold text-lg mb-0.5">{member.name}</p>
                  <p className="text-xs text-foreground/40 mb-3">{member.role}</p>
                  
                  {/* LinkedIn indicator */}
                  <div className="flex items-center justify-center gap-1.5 text-xs text-primary-light/60 group-hover:text-primary-light transition-colors">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    <span>Connect</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-2 h-2 rounded-full bg-primary/30 animate-pulse" />
          <div className="absolute bottom-10 right-1/3 w-3 h-3 rounded-full bg-secondary/20 animate-pulse" />
          <div className="absolute top-1/2 right-10 w-2 h-2 rounded-full bg-accent/30 animate-pulse" />
          {/* Decorative circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-secondary/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-accent/5" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="glass rounded-3xl p-12 sm:p-16 text-center border border-primary/10 relative overflow-hidden">
            {/* Inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/20"
            >
              <Brain className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Ready to <span className="gradient-text">master regression</span>?
            </h2>
            <p className="text-foreground/50 mb-4 text-lg max-w-md mx-auto">
              Stop reading slides. Start interacting with data.
            </p>
            <p className="text-foreground/30 mb-10 text-sm">
              Join students who chose understanding over memorization.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <motion.button
                  className="px-10 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-lg glow flex items-center gap-2"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(99, 102, 241, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap className="w-5 h-5" />
                  Launch LinearMind
                </motion.button>
              </Link>
              <Link href="/playground">
                <motion.button
                  className="px-8 py-4 rounded-xl border border-border text-foreground/60 font-medium flex items-center gap-2 hover:bg-surface-light hover:text-foreground transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-4 h-4" />
                  Try the Playground
                </motion.button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex items-center justify-center gap-6 text-xs text-foreground/25">
              <span className="flex items-center gap-1">✓ Free forever</span>
              <span className="flex items-center gap-1">✓ No signup required for playground</span>
              <span className="flex items-center gap-1">✓ AI-powered</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Mobile App QR Code */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/5 to-secondary/5 blur-3xl" />
          <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-primary/20 animate-pulse" />
          <div className="absolute bottom-20 right-10 w-2 h-2 rounded-full bg-secondary/30 animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-accent/10 animate-pulse" />
        </div>

        <div className="max-w-4xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm mb-6"
            >
              <Smartphone className="w-4 h-4" />
              Now available on mobile
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Learn <span className="gradient-text">On The Go</span>
            </h2>
            <p className="text-foreground/50 max-w-md mx-auto">
              Take your regression mastery anywhere. Same powerful experience, pocket-sized.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Features list */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {[
                { icon: '📱', title: 'Native Experience', desc: 'Smooth, responsive interface designed for touch' },
                { icon: '📶', title: 'Offline Mode', desc: 'Download lessons and learn without internet' },
                { icon: '🎯', title: 'Quick Quizzes', desc: 'Bite-sized tests perfect for commute learning' },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-4 glass rounded-xl p-4 hover:border-primary/20 transition-colors"
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h4 className="font-semibold text-sm">{feature.title}</h4>
                    <p className="text-xs text-foreground/40">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* QR Code card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <div className="relative">
                {/* Glow effect behind card */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-xl scale-105" />
                
                <div className="relative glass rounded-3xl p-8 text-center border border-primary/10">
                  {/* Phone mockup frame */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/20">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="font-bold text-lg mb-1">Scan to Download</h3>
                  <p className="text-xs text-foreground/40 mb-5">Point your camera at the QR code</p>
                  
                  <div className="relative inline-block">
                    {/* Corner accents */}
                    <div className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-primary rounded-tl-md" />
                    <div className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-primary rounded-tr-md" />
                    <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-secondary rounded-bl-md" />
                    <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-secondary rounded-br-md" />
                    
                    <div className="bg-white rounded-xl p-3">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=6366f1&data=${encodeURIComponent('https://drive.google.com/drive/folders/155SHh7smzQJhVsMQigvcT0_6Q-o8L4Bb?usp=drive_link')}`}
                        alt="Download mobile app QR code"
                        width={180}
                        height={180}
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-3 text-xs text-foreground/30">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Android
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-surface/50 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold gradient-text">LinearMind</span>
            </div>
            <p className="text-sm text-foreground/30 text-center">
              Trained with ❤️ and a suspiciously high learning rate.
            </p>
            <div className="flex items-center gap-3 text-foreground/20 text-xs">
              <span>Next.js</span>
              <span className="w-1 h-1 rounded-full bg-foreground/20" />
              <span>Firebase</span>
              <span className="w-1 h-1 rounded-full bg-foreground/20" />
              <span>Gemini AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
