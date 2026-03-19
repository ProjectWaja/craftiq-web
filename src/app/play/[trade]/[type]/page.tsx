"use client";

import { useState, useCallback, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { getRandomPuzzle } from "@/lib/puzzle-engine";
import { useGameStore } from "@/lib/store";
import { useAuth } from "@/contexts/AuthContext";
import { TRADES, PUZZLE_TYPES } from "@/constants/trades";
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

const TIME_LIMITS: Record<number, number> = {
  1: 30,
  2: 20,
  3: 15,
};

export default function PuzzlePage({ params }: { params: Promise<{ trade: string; type: string }> }) {
  const { trade, type } = use(params);
  const tradeCode = trade as TradeCode;
  const puzzleType = type as PuzzleType;
  const { isAuthenticated, loading: authLoading } = useAuth();

  const completedIds = useGameStore((s) => s.completedPuzzleIds);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultySelection | null>(null);
  const [puzzle, setPuzzle] = useState<ReturnType<typeof getRandomPuzzle>>(null);
  const [showLimitGate, setShowLimitGate] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Progressive mode state
  const [progressiveDifficulty, setProgressiveDifficulty] = useState(1);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [difficultyToast, setDifficultyToast] = useState<string | null>(null);

  // Timed challenge mode
  const [timedMode, setTimedMode] = useState(false);
  const [showTimedOption, setShowTimedOption] = useState(false);

  const tradeConfig = TRADES[tradeCode];
  const typeConfig = PUZZLE_TYPES[puzzleType];

  // TODO: wire isPro to RevenueCat subscription status
  const isPro = false;

  // Calculate time limit based on current difficulty
  const currentDifficulty = selectedDifficulty === "progressive"
    ? progressiveDifficulty
    : (selectedDifficulty ?? 1);
  const timeLimit = TIME_LIMITS[currentDifficulty] ?? 30;

  // Load first puzzle when difficulty is selected
  useEffect(() => {
    if (selectedDifficulty === null || showTimedOption) return;
    const maxDiff = selectedDifficulty === "progressive" ? progressiveDifficulty : selectedDifficulty;
    const next = getRandomPuzzle(tradeCode, puzzleType, completedIds, maxDiff);
    setPuzzle(next);
    setPuzzleKey((k) => k + 1);
  }, [selectedDifficulty, showTimedOption]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDifficultySelect = (value: DifficultySelection) => {
    setSelectedDifficulty(value);
    setShowTimedOption(true);
  };

  const handleStartPuzzles = () => {
    setShowTimedOption(false);
  };

  const loadNext = useCallback((wasCorrect: boolean) => {
    // Handle progressive difficulty updates
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
    }

    // Free tier (guest or free account) gets 3 puzzles/day. Pro is unlimited.
    if (!isPro) {
      incrementGuestPuzzleCount();
      if (isDailyLimitReached()) {
        setShowLimitGate(true);
        return;
      }
    }

    const maxDiff = selectedDifficulty === "progressive"
      ? (wasCorrect && consecutiveCorrect + 1 >= 3 && progressiveDifficulty < 3
          ? progressiveDifficulty + 1
          : !wasCorrect && consecutiveWrong + 1 >= 2 && progressiveDifficulty > 1
            ? progressiveDifficulty - 1
            : progressiveDifficulty)
      : (selectedDifficulty ?? 1);
    const next = getRandomPuzzle(tradeCode, puzzleType, completedIds, maxDiff);
    setPuzzle(next);
    setPuzzleKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tradeCode, puzzleType, completedIds, isPro, selectedDifficulty, progressiveDifficulty, consecutiveCorrect, consecutiveWrong]);

  if (!tradeConfig || !typeConfig) {
    return (
      <div className="mx-auto max-w-2xl px-6 pt-32 pb-20 text-center">
        <h1 className="font-mono text-2xl font-bold">Not Found</h1>
        <p className="mt-2 text-text-secondary">Invalid trade or puzzle type.</p>
        <Link href="/play" className="mt-4 inline-block text-accent hover:underline">Back to Play</Link>
      </div>
    );
  }

  // Difficulty picker screen
  if (selectedDifficulty === null) {
    return (
      <div className="mx-auto max-w-lg px-6 pt-28 pb-20">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-text-tertiary">
          <Link href="/play" className="hover:text-text-secondary">Play</Link>
          <span>/</span>
          <span style={{ color: tradeConfig.color }}>{tradeConfig.name}</span>
          <span>/</span>
          <span>{typeConfig.name}</span>
        </div>

        <div className="text-center">
          <h1 className="font-mono text-2xl font-bold text-text-primary">Choose Difficulty</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Select your skill level for {typeConfig.name}
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {DIFFICULTY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleDifficultySelect(option.value)}
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

  // Timed mode option screen (shown after difficulty selection)
  if (showTimedOption) {
    const diffLabel = selectedDifficulty === "progressive"
      ? "Progressive"
      : DIFFICULTY_OPTIONS.find((o) => o.value === selectedDifficulty)?.label ?? "";
    const previewTimeLimit = selectedDifficulty === "progressive"
      ? TIME_LIMITS[1]
      : TIME_LIMITS[selectedDifficulty as number] ?? 30;

    return (
      <div className="mx-auto max-w-lg px-6 pt-28 pb-20">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-text-tertiary">
          <Link href="/play" className="hover:text-text-secondary">Play</Link>
          <span>/</span>
          <span style={{ color: tradeConfig.color }}>{tradeConfig.name}</span>
          <span>/</span>
          <span>{typeConfig.name}</span>
        </div>

        <div className="text-center">
          <h1 className="font-mono text-2xl font-bold text-text-primary">
            {diffLabel} Mode
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Ready to start? You can also enable timed challenges for bonus XP.
          </p>
        </div>

        {/* Timed mode toggle */}
        <div className="mt-8">
          <button
            onClick={() => setTimedMode(!timedMode)}
            className={`flex w-full items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all ${
              timedMode
                ? "border-accent bg-accent/10"
                : "border-border bg-surface-light hover:border-border-medium"
            }`}
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-warning/15 text-2xl">
              <span>&#9201;</span>
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-bold transition-colors ${timedMode ? "text-accent" : "text-text-primary"}`}>
                Timed Challenge
              </h3>
              <p className="mt-0.5 text-xs text-text-tertiary">
                {previewTimeLimit}s per puzzle — bonus XP for fast answers
              </p>
            </div>
            <div className={`flex h-6 w-11 items-center rounded-full px-0.5 transition-colors ${
              timedMode ? "bg-accent" : "bg-white/10"
            }`}>
              <div className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                timedMode ? "translate-x-5" : "translate-x-0"
              }`} />
            </div>
          </button>
        </div>

        {/* Start button */}
        <button
          onClick={handleStartPuzzles}
          className="mt-8 w-full rounded-xl bg-accent px-8 py-4 text-base font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:opacity-90"
        >
          Start Puzzles
        </button>

        <button
          onClick={() => {
            setSelectedDifficulty(null);
            setShowTimedOption(false);
            setTimedMode(false);
          }}
          className="mt-4 block w-full text-center text-sm text-text-tertiary hover:text-text-secondary transition-colors"
        >
          Change Difficulty
        </button>
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="mx-auto max-w-2xl px-6 pt-32 pb-20 text-center">
        <h1 className="font-mono text-2xl font-bold">No Puzzles Available</h1>
        <p className="mt-2 text-text-secondary">No puzzles found for {tradeConfig.name} — {typeConfig.name}.</p>
        <Link href="/play" className="mt-4 inline-block text-accent hover:underline">Back to Play</Link>
      </div>
    );
  }

  // Daily limit gate — applies to both guests and free accounts
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
        <h1 className="mt-6 font-mono text-3xl font-bold">
          Nice Work Today!
        </h1>
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

  // Shared timed mode props
  const timedProps = timedMode
    ? { timedMode: true, timeLimit }
    : {};

  return (
    <div className="pt-28 pb-20">
      {/* Difficulty toast */}
      {difficultyToast && (
        <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 animate-pulse rounded-xl border border-accent/30 bg-accent/15 px-5 py-3 text-sm font-semibold text-accent shadow-lg">
          {difficultyToast}
        </div>
      )}

      {/* Timed mode indicator */}
      {timedMode && (
        <div className="mx-auto mb-2 max-w-2xl px-4">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-warning/15 px-3 py-1 text-xs font-semibold text-warning">
            <span>&#9201;</span> Timed Challenge — {timeLimit}s per puzzle
          </span>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="mx-auto mb-4 max-w-2xl px-4">
        <div className="flex items-center gap-2 text-sm text-text-tertiary">
          <Link href="/play" className="hover:text-text-secondary">Play</Link>
          <span>/</span>
          <span style={{ color: tradeConfig.color }}>{tradeConfig.name}</span>
          <span>/</span>
          <span>{typeConfig.name}</span>
          {selectedDifficulty === "progressive" && (
            <>
              <span>/</span>
              <span className="text-accent">Progressive (Lvl {progressiveDifficulty})</span>
            </>
          )}
        </div>
      </div>

      {/* Guest prompt — shows after every puzzle for non-authenticated users */}
      <GuestPrompt />

      {/* XP Bar */}
      <div className="mx-auto mb-6 max-w-2xl px-4">
        <XPBar />
      </div>

      {/* Puzzle */}
      <div key={puzzleKey}>
        {puzzleType === "code-check" && <CodeCheckPuzzle puzzle={puzzle as any} onNextPuzzle={loadNext} {...timedProps} />}
        {puzzleType === "size-it" && <SizeItPuzzle puzzle={puzzle as any} onNextPuzzle={loadNext} {...timedProps} />}
        {puzzleType === "whats-wrong" && <WhatsWrongPuzzle puzzle={puzzle as any} onNextPuzzle={loadNext} {...timedProps} />}
        {puzzleType === "whats-missing" && <WhatsMissingPuzzle puzzle={puzzle as any} onNextPuzzle={loadNext} {...timedProps} />}
        {puzzleType === "sequence" && <SequencePuzzle puzzle={puzzle as any} onNextPuzzle={loadNext} {...timedProps} />}
        {puzzleType === "build-assembly" && <BuildAssemblyPuzzle puzzle={puzzle as any} onNextPuzzle={loadNext} {...timedProps} />}
      </div>
    </div>
  );
}
