"use client";

import { useState, useCallback, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { getRandomPuzzle } from "@/lib/puzzle-engine";
import { useGameStore } from "@/lib/store";
import { useAuth } from "@/contexts/AuthContext";
import { TRADES, PUZZLE_TYPES } from "@/constants/trades";
import { TradeCode } from "@/types/trade";
import { PuzzleType } from "@/types/puzzle";
import XPBar from "@/components/XPBar";
import GuestPrompt, { incrementGuestPuzzleCount, isGuestLimitReached } from "@/components/GuestPrompt";
import AuthModal from "@/components/AuthModal";
import CodeCheckPuzzle from "@/components/puzzles/CodeCheckPuzzle";
import SizeItPuzzle from "@/components/puzzles/SizeItPuzzle";
import WhatsWrongPuzzle from "@/components/puzzles/WhatsWrongPuzzle";
import WhatsMissingPuzzle from "@/components/puzzles/WhatsMissingPuzzle";
import SequencePuzzle from "@/components/puzzles/SequencePuzzle";
import BuildAssemblyPuzzle from "@/components/puzzles/BuildAssemblyPuzzle";

export default function PuzzlePage({ params }: { params: Promise<{ trade: string; type: string }> }) {
  const { trade, type } = use(params);
  const tradeCode = trade as TradeCode;
  const puzzleType = type as PuzzleType;
  const { isAuthenticated, loading: authLoading } = useAuth();

  const completedIds = useGameStore((s) => s.completedPuzzleIds);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [puzzle, setPuzzle] = useState(() => getRandomPuzzle(tradeCode, puzzleType, completedIds));
  const [showLimitGate, setShowLimitGate] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const tradeConfig = TRADES[tradeCode];
  const typeConfig = PUZZLE_TYPES[puzzleType];

  const loadNext = useCallback(() => {
    // Track guest puzzle count and check limit
    if (!isAuthenticated) {
      incrementGuestPuzzleCount();
      if (isGuestLimitReached()) {
        setShowLimitGate(true);
        return;
      }
    }

    const next = getRandomPuzzle(tradeCode, puzzleType, completedIds);
    setPuzzle(next);
    setPuzzleKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tradeCode, puzzleType, completedIds, isAuthenticated]);

  if (!tradeConfig || !typeConfig) {
    return (
      <div className="mx-auto max-w-2xl px-6 pt-32 pb-20 text-center">
        <h1 className="font-mono text-2xl font-bold">Not Found</h1>
        <p className="mt-2 text-text-secondary">Invalid trade or puzzle type.</p>
        <Link href="/play" className="mt-4 inline-block text-accent hover:underline">Back to Play</Link>
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

  // Daily limit gate for guests
  if (showLimitGate && !isAuthenticated) {
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
          You&apos;ve completed your 3 free puzzles for today. Come back tomorrow for 3 more, or create a free account for unlimited access.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => setAuthModalOpen(true)}
            className="rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:shadow-xl"
          >
            Create Free Account
          </button>
          <Link
            href="/play"
            className="rounded-xl border border-border bg-surface-light px-8 py-4 text-base font-semibold text-text-primary transition-colors hover:bg-white/[0.08]"
          >
            Back to Trades
          </Link>
        </div>

        <p className="mt-6 text-sm text-text-tertiary">
          Free accounts get 3 puzzles/day. Go Pro for unlimited.
        </p>

        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20">
      {/* Breadcrumb */}
      <div className="mx-auto mb-4 max-w-2xl px-4">
        <div className="flex items-center gap-2 text-sm text-text-tertiary">
          <Link href="/play" className="hover:text-text-secondary">Play</Link>
          <span>/</span>
          <span style={{ color: tradeConfig.color }}>{tradeConfig.name}</span>
          <span>/</span>
          <span>{typeConfig.name}</span>
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
        {puzzleType === "code-check" && <CodeCheckPuzzle puzzle={puzzle as any} onNextPuzzle={loadNext} />}
        {puzzleType === "size-it" && <SizeItPuzzle puzzle={puzzle as any} onNextPuzzle={loadNext} />}
        {puzzleType === "whats-wrong" && <WhatsWrongPuzzle puzzle={puzzle as any} onNextPuzzle={loadNext} />}
        {puzzleType === "whats-missing" && <WhatsMissingPuzzle puzzle={puzzle as any} onNextPuzzle={loadNext} />}
        {puzzleType === "sequence" && <SequencePuzzle puzzle={puzzle as any} onNextPuzzle={loadNext} />}
        {puzzleType === "build-assembly" && <BuildAssemblyPuzzle puzzle={puzzle as any} onNextPuzzle={loadNext} />}
      </div>
    </div>
  );
}
