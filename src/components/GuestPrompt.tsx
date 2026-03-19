'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGameStore } from '@/lib/store';
import AuthModal from '@/components/AuthModal';

const DAILY_LIMIT_KEY = 'craftiq-guest-daily';

function getGuestPuzzlesToday(): number {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem(DAILY_LIMIT_KEY);
  if (!stored) return 0;
  try {
    const { date, count } = JSON.parse(stored);
    const today = new Date().toISOString().split('T')[0];
    if (date === today) return count;
    return 0;
  } catch {
    return 0;
  }
}

export function incrementGuestPuzzleCount() {
  const today = new Date().toISOString().split('T')[0];
  const current = getGuestPuzzlesToday();
  localStorage.setItem(DAILY_LIMIT_KEY, JSON.stringify({ date: today, count: current + 1 }));
}

export function isDailyLimitReached(): boolean {
  return getGuestPuzzlesToday() >= 3;
}

export default function GuestPrompt() {
  const { isAuthenticated, loading } = useAuth();
  const puzzlesCompleted = useGameStore((s) => s.puzzlesCompleted);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Don't show if: still loading, user is authenticated, or no puzzles yet
  if (loading || isAuthenticated || puzzlesCompleted < 1 || dismissed) {
    return <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />;
  }

  return (
    <>
      <div className="mx-auto mb-4 max-w-2xl px-4">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-accent/30 bg-accent/10 px-5 py-4">
          <div>
            <p className="text-base font-semibold text-text-primary">
              Create a free account to save your progress
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              Your progress syncs across web and mobile. Free accounts get 3 puzzles per day.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Sign Up
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-sm text-text-tertiary hover:text-text-secondary transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
