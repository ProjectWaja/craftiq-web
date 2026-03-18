"use client";

import { TRADES } from "@/constants/trades";
import { TradeCode } from "@/types/trade";
import { Difficulty } from "@/types/puzzle";

interface PuzzleShellProps {
  trade: TradeCode;
  title: string;
  difficulty: Difficulty;
  xpReward: number;
  children: React.ReactNode;
}

const DIFFICULTY_LABELS = ["", "Year 1-2", "Year 3-4", "Journeyman+"];

export default function PuzzleShell({ trade, title, difficulty, xpReward, children }: PuzzleShellProps) {
  const tradeConfig = TRADES[trade];

  return (
    <div className="mx-auto max-w-2xl px-4">
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
          <span className="rounded-lg px-2 py-1 text-[11px] font-semibold" style={{ backgroundColor: `${tradeConfig.color}22`, color: tradeConfig.color }}>
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
