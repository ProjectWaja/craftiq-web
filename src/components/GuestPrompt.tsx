'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGameStore } from '@/lib/store';
import AuthModal from '@/components/AuthModal';

const DISMISS_KEY = 'craftiq-guest-prompt-dismissed';
const DISMISS_PUZZLE_COUNT_KEY = 'craftiq-guest-prompt-dismiss-count';

export default function GuestPrompt() {
  const { isAuthenticated, loading } = useAuth();
  const puzzlesCompleted = useGameStore((s) => s.puzzlesCompleted);
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    // Check if previously dismissed
    const dismissedAt = localStorage.getItem(DISMISS_PUZZLE_COUNT_KEY);
    if (dismissedAt) {
      const dismissCount = parseInt(dismissedAt, 10);
      // Re-show after 5 more puzzles since dismissal
      if (puzzlesCompleted >= dismissCount + 5) {
        setDismissed(false);
      }
    } else {
      setDismissed(false);
    }
  }, [puzzlesCompleted]);

  // Don't show if: still loading, user is authenticated, fewer than 3 puzzles, or dismissed
  if (loading || isAuthenticated || puzzlesCompleted < 3 || dismissed) {
    return (
      <>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </>
    );
  }

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(DISMISS_KEY, 'true');
    localStorage.setItem(DISMISS_PUZZLE_COUNT_KEY, String(puzzlesCompleted));
  };

  return (
    <>
      <div className="mx-auto mb-4 max-w-2xl px-4">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3">
          <p className="text-sm text-text-secondary">
            Create a free account to save your progress across devices
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="rounded-lg bg-accent px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              Sign Up
            </button>
            <button
              onClick={handleDismiss}
              className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
