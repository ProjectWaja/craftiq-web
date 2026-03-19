"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { playSound } from "@/lib/sounds";
import XPFlyUp from "./XPFlyUp";

interface ResultCardProps {
  isCorrect: boolean;
  xpEarned: number;
  explanation: string;
  codeReference?: string;
  onNextPuzzle: (wasCorrect: boolean) => void;
  trade: string;
  type: string;
  correctCount?: number;
  totalPossible?: number;
}

export default function ResultCard({
  isCorrect,
  xpEarned,
  explanation,
  codeReference,
  onNextPuzzle,
  trade,
  type,
  correctCount,
  totalPossible,
}: ResultCardProps) {
  const isPerfect = isCorrect && correctCount !== undefined && totalPossible !== undefined && correctCount === totalPossible;

  const resultImage = isPerfect
    ? "/images/result-states/perfect.png"
    : isCorrect
      ? "/images/result-states/correct.jpeg"
      : "/images/result-states/wrong.png";

  const resultAlt = isPerfect ? "Perfect score" : isCorrect ? "Correct answer" : "Wrong answer";

  // Play sound on mount
  useEffect(() => {
    if (isPerfect) playSound('perfect');
    else if (isCorrect) playSound('correct');
    else playSound('wrong');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`mt-6 rounded-2xl border p-6 ${isCorrect ? "border-success/30 bg-success/5" : "border-error/30 bg-error/5"}`}>
      {/* XP Fly-Up */}
      <XPFlyUp xp={xpEarned} show={true} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={resultImage}
            alt={resultAlt}
            width={64}
            height={64}
            className="rounded-full"
          />
          <div>
            <h3 className="font-mono text-lg font-bold" style={{ color: isCorrect ? "#22C55E" : "#EF4444" }}>
              {isPerfect ? "Perfect!" : isCorrect ? "Correct!" : "Not Quite"}
            </h3>
            <p className="text-sm text-text-secondary">+{xpEarned} XP earned</p>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-4 rounded-xl border border-border bg-surface-light p-4">
        <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-disabled">Explanation</h4>
        <p className="text-sm leading-relaxed text-text-secondary">{explanation}</p>
        {codeReference && (
          <p className="mt-2 font-mono text-xs text-accent">{codeReference}</p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onNextPuzzle(isCorrect)}
          className="flex-1 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Next Puzzle
        </button>
        <Link
          href={`/play`}
          className="rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-white/[0.08]"
        >
          Back
        </Link>
      </div>
    </div>
  );
}
