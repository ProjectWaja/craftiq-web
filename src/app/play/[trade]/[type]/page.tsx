"use client";

import { useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getRandomPuzzle } from "@/lib/puzzle-engine";
import { useGameStore } from "@/lib/store";
import { TRADES, PUZZLE_TYPES } from "@/constants/trades";
import { TradeCode } from "@/types/trade";
import { PuzzleType } from "@/types/puzzle";
import XPBar from "@/components/XPBar";
import GuestPrompt from "@/components/GuestPrompt";
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

  const completedIds = useGameStore((s) => s.completedPuzzleIds);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [puzzle, setPuzzle] = useState(() => getRandomPuzzle(tradeCode, puzzleType, completedIds));

  const tradeConfig = TRADES[tradeCode];
  const typeConfig = PUZZLE_TYPES[puzzleType];

  const loadNext = useCallback(() => {
    const next = getRandomPuzzle(tradeCode, puzzleType, completedIds);
    setPuzzle(next);
    setPuzzleKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tradeCode, puzzleType, completedIds]);

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

  return (
    <div className="pt-28 pb-20">
      {/* Breadcrumb */}
      <div className="mx-auto mb-4 max-w-2xl px-4">
        <div className="flex items-center gap-2 text-xs text-text-tertiary">
          <Link href="/play" className="hover:text-text-secondary">Play</Link>
          <span>/</span>
          <span style={{ color: tradeConfig.color }}>{tradeConfig.name}</span>
          <span>/</span>
          <span>{typeConfig.name}</span>
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
