"use client";

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

export default function PuzzleShell({ trade, title, difficulty, xpReward, puzzleType, children }: PuzzleShellProps) {
  const tradeConfig = TRADES[trade];
  const headerImage = puzzleType ? PUZZLE_HEADER_IMAGES[puzzleType] : undefined;

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

      {/* Puzzle content */}
      {children}
    </div>
  );
}
