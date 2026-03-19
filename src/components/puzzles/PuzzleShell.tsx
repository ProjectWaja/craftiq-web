"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { TRADES } from "@/constants/trades";
import { TradeCode } from "@/types/trade";
import { Difficulty } from "@/types/puzzle";

interface PuzzleShellProps {
  trade: TradeCode;
  title: string;
  difficulty: Difficulty;
  xpReward: number;
  puzzleType?: string;
  children: React.ReactNode;
  hint?: string;
  onHintUsed?: () => void;
  timedMode?: boolean;
  timeLimit?: number;
  onTimeUp?: () => void;
}

const DIFFICULTY_LABELS = ["", "Year 1-2", "Year 3-4", "Journeyman+"];

const PUZZLE_HEADER_IMAGES: Record<string, string> = {
  'whats-wrong': '/images/puzzle-headers/whats-wrong.jpeg',
  'whats-missing': '/images/puzzle-headers/whats-missing.jpeg',
  'build-assembly': '/images/puzzle-headers/build-assembly.png',
  'size-it': '/images/puzzle-headers/size-it-right.png',
  'sequence': '/images/puzzle-headers/sequence.png',
  'code-check': '/images/puzzle-headers/code-check.jpeg',
};

const DIFFICULTY_IMAGES: Record<number, string> = {
  1: '/images/ui-icons/difficulty-1.png',
  2: '/images/ui-icons/difficulty-2.png',
  3: '/images/ui-icons/difficulty-3.png',
};

export default function PuzzleShell({
  trade,
  title,
  difficulty,
  xpReward,
  puzzleType,
  children,
  hint,
  onHintUsed,
  timedMode,
  timeLimit,
  onTimeUp,
}: PuzzleShellProps) {
  const tradeConfig = TRADES[trade];
  const headerImage = puzzleType ? PUZZLE_HEADER_IMAGES[puzzleType] : undefined;

  // Hint state
  const [hintRevealed, setHintRevealed] = useState(false);

  const handleRevealHint = () => {
    if (!hintRevealed) {
      setHintRevealed(true);
      onHintUsed?.();
    }
  };

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(timeLimit ?? 0);
  const timerFired = useRef(false);

  const stableOnTimeUp = useCallback(() => {
    onTimeUp?.();
  }, [onTimeUp]);

  useEffect(() => {
    if (!timedMode || !timeLimit) return;
    setTimeRemaining(timeLimit);
    timerFired.current = false;
  }, [timedMode, timeLimit]);

  useEffect(() => {
    if (!timedMode || !timeLimit) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0 && !timerFired.current) {
          timerFired.current = true;
          // Defer the callback to avoid setState-during-render
          setTimeout(() => stableOnTimeUp(), 0);
          clearInterval(interval);
          return 0;
        }
        return Math.max(0, next);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timedMode, timeLimit, stableOnTimeUp]);

  const timerPercent = timedMode && timeLimit ? (timeRemaining / timeLimit) * 100 : 0;
  const timerColor = timerPercent > 60 ? "#22C55E" : timerPercent > 30 ? "#F59E0B" : "#EF4444";

  return (
    <div className="mx-auto max-w-2xl px-4">
      {/* Puzzle header image */}
      {headerImage && (
        <div className="relative mb-6 h-40 overflow-hidden rounded-2xl">
          <Image
            src={headerImage}
            alt={puzzleType ?? "Puzzle header"}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0C0F1A]" />
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{tradeConfig.icon}</span>
          <div>
            <h1 className="font-mono text-lg font-bold leading-tight">{title}</h1>
            <p className="text-xs text-text-tertiary">{tradeConfig.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold" style={{ backgroundColor: `${tradeConfig.color}22`, color: tradeConfig.color }}>
            {DIFFICULTY_IMAGES[difficulty] && (
              <Image
                src={DIFFICULTY_IMAGES[difficulty]}
                alt={`Difficulty ${difficulty}`}
                width={24}
                height={24}
                className="inline-block"
              />
            )}
            {DIFFICULTY_LABELS[difficulty]}
          </span>
          <span className="rounded-lg bg-warning/15 px-2 py-1 text-[11px] font-semibold text-warning">
            {xpReward} XP
          </span>
        </div>
      </div>

      {/* Timer bar */}
      {timedMode && timeLimit && timeLimit > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-tertiary flex items-center gap-1">
              <span>&#9201;</span> {timeRemaining}s
            </span>
            {timeRemaining <= 5 && timeRemaining > 0 && (
              <span className="text-xs font-semibold text-error animate-pulse">Hurry!</span>
            )}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-linear"
              style={{
                width: `${timerPercent}%`,
                backgroundColor: timerColor,
              }}
            />
          </div>
        </div>
      )}

      {/* Hint button */}
      {hint && (
        <div className="mb-4">
          {!hintRevealed ? (
            <button
              onClick={handleRevealHint}
              className="flex items-center gap-2 rounded-xl border border-warning/20 bg-warning/10 px-4 py-2.5 text-sm font-semibold text-warning transition-colors hover:bg-warning/15"
            >
              <Image
                src="/images/ui-icons/hint.png"
                alt="Hint"
                width={24}
                height={24}
                className="flex-shrink-0"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span>Hint (-25% XP)</span>
            </button>
          ) : (
            <div className="rounded-xl border border-warning/20 bg-warning/10 px-4 py-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Image
                  src="/images/ui-icons/hint.png"
                  alt="Hint"
                  width={20}
                  height={20}
                  className="flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span className="text-xs font-semibold uppercase tracking-widest text-warning">Hint</span>
              </div>
              <p className="text-sm text-warning/90">{hint}</p>
            </div>
          )}
        </div>
      )}

      {/* Puzzle content */}
      {children}
    </div>
  );
}
