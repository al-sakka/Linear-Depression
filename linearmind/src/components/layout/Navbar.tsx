'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  Brain,
  LayoutDashboard,
  BookOpen,
  Trophy,
  HelpCircle,
  LogOut,
  LogIn,
  Menu,
  X,
  Lock,
  Code2,
} from 'lucide-react';
import { useState } from 'react';
import { useHydrated } from '@/lib/useHydrated';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, protected: true },
  { href: '/learn', label: 'Learn', icon: BookOpen, protected: true },
  { href: '/quiz', label: 'Quiz', icon: HelpCircle, protected: true },
  { href: '/examples', label: 'Examples', icon: Code2, protected: false },
  { href: '/playground', label: 'Playground', icon: Brain, protected: false },
  { href: '/achievements', label: 'Achievements', icon: Trophy, protected: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, progress, reset } = useStore();
  const { firebaseUser, logout } = useAuth();
  const hydrated = useHydrated();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === '/' || pathname === '/login') return null;
  if (!hydrated) return null;

  return (
    <nav className="glass-strong sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text hidden sm:block">
              LinearMind
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const isLocked = link.protected && !firebaseUser;
              return (
                <Link key={link.href} href={isLocked ? '/login' : link.href}>
                  <motion.div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isLocked
                        ? 'text-foreground/30 cursor-not-allowed'
                        : isActive
                          ? 'bg-primary/20 text-primary-light'
                          : 'text-foreground/60 hover:text-foreground hover:bg-surface-light'
                    }`}
                    whileHover={{ scale: isLocked ? 1 : 1.02 }}
                    whileTap={{ scale: isLocked ? 1 : 0.98 }}
                  >
                    {isLocked ? <Lock className="w-3.5 h-3.5" /> : <link.icon className="w-4 h-4" />}
                    {link.label}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* XP Badge */}
            {firebaseUser && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-xs">⚡</span>
              <span className="text-xs font-bold text-primary-light">
                {progress.xp} XP
              </span>
            </div>
            )}

            {/* Streak */}
            {firebaseUser && progress.streak > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20">
                <span className="text-xs">🔥</span>
                <span className="text-xs font-bold text-warning">
                  {progress.streak}
                </span>
              </div>
            )}

            {/* User */}
            {user ? (
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-primary/30"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary-light">
                    {user.name[0]}
                  </div>
                )}
                <button
                  onClick={() => { logout(); reset(); }}
                  className="text-foreground/40 hover:text-error transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/login">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/20 text-primary-light text-sm hover:bg-primary/30 transition-colors">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </div>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-foreground/60 hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-strong border-t border-border"
        >
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const isLocked = link.protected && !firebaseUser;
              return (
                <Link
                  key={link.href}
                  href={isLocked ? '/login' : link.href}
                  onClick={() => setMobileOpen(false)}
                >
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                      isLocked
                        ? 'text-foreground/30'
                        : isActive
                          ? 'bg-primary/20 text-primary-light'
                          : 'text-foreground/60 hover:text-foreground hover:bg-surface-light'
                    }`}
                  >
                    {isLocked ? <Lock className="w-3.5 h-3.5" /> : <link.icon className="w-4 h-4" />}
                    {link.label}
                    {isLocked && <span className="ml-auto text-xs text-foreground/20">Sign in</span>}
                  </div>
                </Link>
              );
            })}
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/40">
              ⚡ {progress.xp} XP
              {progress.streak > 0 && <span className="ml-2">🔥 {progress.streak}</span>}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
