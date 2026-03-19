"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getRandomPuzzle } from "@/lib/puzzle-engine";
import { useGameStore } from "@/lib/store";
import { useAuth } from "@/contexts/AuthContext";
import { TRADES, PUZZLE_TYPES, BASE_TRADE_CODES, SPECIALTY_CODES } from "@/constants/trades";
import { TradeCode } from "@/types/trade";
import { PuzzleType } from "@/types/puzzle";
import XPBar from "@/components/XPBar";
import GuestPrompt, { incrementGuestPuzzleCount, isDailyLimitReached } from "@/components/GuestPrompt";
import AuthModal from "@/components/AuthModal";
import CodeCheckPuzzle from "@/components/puzzles/CodeCheckPuzzle";
import SizeItPuzzle from "@/components/puzzles/SizeItPuzzle";
import WhatsWrongPuzzle from "@/components/puzzles/WhatsWrongPuzzle";
import WhatsMissingPuzzle from "@/components/puzzles/WhatsMissingPuzzle";
import SequencePuzzle from "@/components/puzzles/SequencePuzzle";
import BuildAssemblyPuzzle from "@/components/puzzles/BuildAssemblyPuzzle";

type DifficultySelection = 1 | 2 | 3 | "progressive";

const ALL_TRADE_CODES = [...BASE_TRADE_CODES, ...SPECIALTY_CODES];
const ALL_PUZZLE_TYPES = Object.keys(PUZZLE_TYPES) as PuzzleType[];

const DIFFICULTY_OPTIONS: { value: DifficultySelection; label: string; subtitle: string; image?: string }[] = [
  { value: 1, label: "Apprentice", subtitle: "Year 1-2 basics", image: "/images/ui-icons/difficulty-1.png" },
  { value: 2, label: "Intermediate", subtitle: "Year 3-4 applied knowledge", image: "/images/ui-icons/difficulty-2.png" },
  { value: 3, label: "Journeyman", subtitle: "Expert edge cases", image: "/images/ui-icons/difficulty-3.png" },
  { value: "progressive", label: "Progressive", subtitle: "Start easy, level up as you go" },
];

const PROGRESSIVE_LABELS: Record<number, string> = {
  1: "Year 1-2",
  2: "Year 3-4",
  3: "Journeyman",
};

function pickRandom<T>(arr: T[], exclude?: T): T {
  if (arr.length <= 1) return arr[0];
  const filtered = exclude !== undefined ? arr.filter((x) => x !== exclude) : arr;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export default function RandomPuzzlePage() {
  const { isAuthenticated } = useAuth();
  const completedIds = useGameStore((s) => s.completedPuzzleIds);

  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultySelection | null>(null);
  const [currentTrade, setCurrentTrade] = useState<TradeCode | null>(null);
  const [currentType, setCurrentType] = useState<PuzzleType | null>(null);
  const [puzzle, setPuzzle] = useState<ReturnType<typeof getRandomPuzzle>>(null);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [showLimitGate, setShowLimitGate] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Progressive mode state
  const [progressiveDifficulty, setProgressiveDifficulty] = useState(1);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [difficultyToast, setDifficultyToast] = useState<string | null>(null);

  const lastTradeRef = useRef<TradeCode | null>(null);
  const lastTypeRef = useRef<PuzzleType | null>(null);

  const isPro = false;

  const pickRandomPuzzle = useCallback((maxDiff: number) => {
    // Pick random trade and type, avoiding repeats if possible
    const trade = pickRandom(ALL_TRADE_CODES, lastTradeRef.current ?? undefined);
    const type = pickRandom(ALL_PUZZLE_TYPES, lastTypeRef.current ?? undefined);

    let next = getRandomPuzzle(trade, type, completedIds, maxDiff);

    // If no puzzle found with this combination, try a few more random combos
    if (!next) {
      for (let i = 0; i < 10; i++) {
        const t = pickRandom(ALL_TRADE_CODES);
        const pt = pickRandom(ALL_PUZZLE_TYPES);
        next = getRandomPuzzle(t, pt, completedIds, maxDiff);
        if (next) {
          setCurrentTrade(t);
          setCurrentType(pt);
          lastTradeRef.current = t;
          lastTypeRef.current = pt;
          return next;
        }
      }
    }

    setCurrentTrade(trade);
    setCurrentType(type);
    lastTradeRef.current = trade;
    lastTypeRef.current = type;
    return next;
  }, [completedIds]);

  // Load first puzzle when difficulty is selected
  useEffect(() => {
    if (selectedDifficulty === null) return;
    const maxDiff = selectedDifficulty === "progressive" ? progressiveDifficulty : selectedDifficulty;
    const next = pickRandomPuzzle(maxDiff);
    setPuzzle(next);
    setPuzzleKey((k) => k + 1);
  }, [selectedDifficulty]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadNext = useCallback((wasCorrect: boolean) => {
    // Handle progressive difficulty updates
    let maxDiff = selectedDifficulty === "progressive" ? progressiveDifficulty : (selectedDifficulty as number ?? 1);

    if (selectedDifficulty === "progressive") {
      let newConsCorrect = wasCorrect ? consecutiveCorrect + 1 : 0;
      let newConsWrong = wasCorrect ? 0 : consecutiveWrong + 1;
      let newProgDiff = progressiveDifficulty;

      if (newConsCorrect >= 3 && newProgDiff < 3) {
        newProgDiff = newProgDiff + 1;
        newConsCorrect = 0;
        setDifficultyToast(`Leveled up to ${PROGRESSIVE_LABELS[newProgDiff]}!`);
        setTimeout(() => setDifficultyToast(null), 3000);
      } else if (newConsWrong >= 2 && newProgDiff > 1) {
        newProgDiff = newProgDiff - 1;
        newConsWrong = 0;
        setDifficultyToast(`Dropped to ${PROGRESSIVE_LABELS[newProgDiff]}`);
        setTimeout(() => setDifficultyToast(null), 3000);
      }

      setConsecutiveCorrect(newConsCorrect);
      setConsecutiveWrong(newConsWrong);
      setProgressiveDifficulty(newProgDiff);
      maxDiff = newProgDiff;
    }

    if (!isPro) {
      incrementGuestPuzzleCount();
      if (isDailyLimitReached()) {
        setShowLimitGate(true);
        return;
      }
    }

    const next = pickRandomPuzzle(maxDiff);
    setPuzzle(next);
    setPuzzleKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [isPro, selectedDifficulty, progressiveDifficulty, consecutiveCorrect, consecutiveWrong, pickRandomPuzzle]);

  // Difficulty picker screen
  if (selectedDifficulty === null) {
    return (
      <div className="mx-auto max-w-lg px-6 pt-28 pb-20">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-text-tertiary">
          <Link href="/play" className="hover:text-text-secondary">Play</Link>
          <span>/</span>
          <span className="text-accent">Random Puzzle</span>
        </div>

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 text-3xl">
            <span>&#x1F3B2;</span>
          </div>
          <h1 className="font-mono text-2xl font-bold text-text-primary">Random Puzzle</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Choose your difficulty — we will pick the trade and puzzle type
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {DIFFICULTY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedDifficulty(option.value)}
              className="group flex w-full items-center gap-4 rounded-2xl border-2 border-border bg-surface-light p-5 text-left transition-all hover:border-accent/40 hover:bg-accent/5"
            >
              {option.image ? (
                <Image
                  src={option.image}
                  alt={option.label}
                  width={48}
                  height={48}
                  className="flex-shrink-0"
                />
              ) : (
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/15 text-2xl">
                  <span className="text-xl">&#x1F500;</span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
                  {option.label}
                </h3>
                <p className="mt-0.5 text-xs text-text-tertiary">{option.subtitle}</p>
              </div>
              <span className="text-text-tertiary group-hover:text-accent transition-colors">
                &#8250;
              </span>
            </button>
          ))}
        </div>

        <Link
          href="/play"
          className="mt-6 block text-center text-sm text-text-tertiary hover:text-text-secondary transition-colors"
        >
          Back to Trades
        </Link>
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="mx-auto max-w-2xl px-6 pt-32 pb-20 text-center">
        <h1 className="font-mono text-2xl font-bold">No Puzzles Available</h1>
        <p className="mt-2 text-text-secondary">No puzzles found at this difficulty. Try a different level.</p>
        <button
          onClick={() => setSelectedDifficulty(null)}
          className="mt-4 inline-block text-accent hover:underline"
        >
          Choose Different Difficulty
        </button>
      </div>
    );
  }

  // Daily limit gate
  if (showLimitGate && !isPro) {
    return (
      <div className="mx-auto max-w-lg px-6 pt-32 pb-20 text-center">
        <Image
          src="/images/result-states/correct.jpeg"
          alt="Great work today"
          width={120}
          height={120}
          className="mx-auto rounded-full"
        />
        <h1 className="mt-6 font-mono text-3xl font-bold">Nice Work Today!</h1>
        <p className="mt-3 text-lg text-text-secondary">
          You&apos;ve completed your 3 free puzzles for today.
          {isAuthenticated
            ? " Upgrade to Pro for unlimited puzzles across all trades and difficulty levels."
            : " Create a free account to save your progress, or go Pro for unlimited puzzles."
          }
        </p>
        <div className="mt-8 flex flex-col gap-3">
          {isAuthenticated ? (
            <Link
              href="/#pricing"
              className="rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:shadow-xl"
            >
              Go Pro — Unlimited Puzzles
            </Link>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:shadow-xl"
            >
              Create Free Account
            </button>
          )}
          <Link
            href="/play"
            className="rounded-xl border border-border bg-surface-light px-8 py-4 text-base font-semibold text-text-primary transition-colors hover:bg-white/[0.08]"
          >
            Back to Trades
          </Link>
        </div>
        <p className="mt-6 text-sm text-text-tertiary">
          Free tier: 3 puzzles/day. Pro: $9.99/mo for unlimited.
        </p>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  const tradeConfig = currentTrade ? TRADES[currentTrade] : null;
  const typeConfig = currentType ? PUZZLE_TYPES[currentType] : null;

  return (
    <div className="pt-28 pb-20">
      {/* Difficulty toast */}
      {difficultyToast && (
        <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 animate-pulse rounded-xl border border-accent/30 bg-accent/15 px-5 py-3 text-sm font-semibold text-accent shadow-lg">
          {difficultyToast}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="mx-auto mb-4 max-w-2xl px-4">
        <div className="flex items-center gap-2 text-sm text-text-tertiary">
          <Link href="/play" className="hover:text-text-secondary">Play</Link>
          <span>/</span>
          <span className="text-accent">Random</span>
          {tradeConfig && (
            <>
              <span>/</span>
              <span style={{ color: tradeConfig.color }}>{tradeConfig.name}</span>
            </>
          )}
          {typeConfig && (
            <>
              <span>/</span>
              <span>{typeConfig.name}</span>
            </>
          )}
          {selectedDifficulty === "progressive" && (
            <>
              <span>/</span>
              <span className="text-accent">Progressive (Lvl {progressiveDifficulty})</span>
            </>
          )}
        </div>
      </div>

      {/* Guest prompt */}
      <GuestPrompt />

      {/* XP Bar */}
      <div className="mx-auto mb-6 max-w-2xl px-4">
        <XPBar />
      </div>

      {/* Puzzle */}
      <div key={puzzleKey}>
        {currentType === "code-check" && <CodeCheckPuzzle puzzle={puzzle as any} onNextPuzzle={loadNext} />}
        {currentType === "size-it" && <SizeItPuzzle puzzle={puzzle as any} onNextPuzzle={loadNext} />}
        {currentType === "whats-wrong" && <WhatsWrongPuzzle puzzle={puzzle as any} onNextPuzzle={loadNext} />}
        {currentType === "whats-missing" && <WhatsMissingPuzzle puzzle={puzzle as any} onNextPuzzle={loadNext} />}
        {currentType === "sequence" && <SequencePuzzle puzzle={puzzle as any} onNextPuzzle={loadNext} />}
        {currentType === "build-assembly" && <BuildAssemblyPuzzle puzzle={puzzle as any} onNextPuzzle={loadNext} />}
      </div>
    </div>
  );
}
