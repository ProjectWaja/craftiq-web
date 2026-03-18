"use client";

import Link from "next/link";

interface ResultCardProps {
  isCorrect: boolean;
  xpEarned: number;
  explanation: string;
  codeReference?: string;
  onNextPuzzle: () => void;
  trade: string;
  type: string;
}

export default function ResultCard({
  isCorrect,
  xpEarned,
  explanation,
  codeReference,
  onNextPuzzle,
  trade,
  type,
}: ResultCardProps) {
  return (
    <div className={`mt-6 rounded-2xl border p-6 ${isCorrect ? "border-success/30 bg-success/5" : "border-error/30 bg-error/5"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{isCorrect ? "\u2713" : "\u2717"}</span>
          <div>
            <h3 className="font-mono text-lg font-bold" style={{ color: isCorrect ? "#22C55E" : "#EF4444" }}>
              {isCorrect ? "Correct!" : "Not Quite"}
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
          onClick={onNextPuzzle}
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
