"use client";

import { useState } from "react";
import { SizeItPuzzle as SizeItPuzzleType } from "@/types/puzzle";
import { scoreSizeIt } from "@/lib/puzzle-engine";
import { useGameStore } from "@/lib/store";
import PuzzleShell from "./PuzzleShell";
import ResultCard from "./ResultCard";

interface Props {
  puzzle: SizeItPuzzleType;
  onNextPuzzle: () => void;
}

export default function SizeItPuzzle({ puzzle, onNextPuzzle }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof scoreSizeIt> | null>(null);
  const [showHint, setShowHint] = useState(false);
  const addResult = useGameStore((s) => s.addResult);

  const handleSubmit = () => {
    if (!selected || submitted) return;
    const scored = scoreSizeIt(selected, puzzle);
    setResult(scored);
    setSubmitted(true);

    addResult({
      puzzleId: puzzle.id,
      puzzleType: "size-it",
      trade: puzzle.trade,
      difficulty: puzzle.difficulty,
      xpEarned: scored.xpEarned,
      correctCount: scored.isCorrect ? 1 : 0,
      incorrectCount: scored.isCorrect ? 0 : 1,
      totalPossible: 1,
      timestamp: Date.now(),
    });
  };

  return (
    <PuzzleShell trade={puzzle.trade} title={puzzle.title} difficulty={puzzle.difficulty} xpReward={puzzle.xpReward}>
      {/* Scenario */}
      <div className="rounded-2xl border border-border bg-surface-light p-6">
        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-text-disabled">Scenario</h3>
        <p className="text-sm leading-relaxed text-text-primary">{puzzle.scenario}</p>

        {/* Hint toggle */}
        <button
          onClick={() => setShowHint(!showHint)}
          className="mt-3 text-xs text-accent hover:underline"
        >
          {showHint ? "Hide hint" : "Show hint"}
        </button>
        {showHint && (
          <p className="mt-2 rounded-lg bg-accent/10 px-3 py-2 text-xs text-accent">{puzzle.hint}</p>
        )}
      </div>

      {/* Options */}
      <div className="mt-6 space-y-3">
        {puzzle.options.map((option) => {
          const isSelected = selected === option.value;
          const showFeedback = submitted && isSelected;
          const isCorrectOption = submitted && option.correct;

          return (
            <button
              key={option.value}
              onClick={() => !submitted && setSelected(option.value)}
              disabled={submitted}
              className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                submitted
                  ? option.correct
                    ? "border-success/60 bg-success/10"
                    : isSelected
                      ? "border-error/60 bg-error/10"
                      : "border-border bg-surface-light opacity-50"
                  : isSelected
                    ? "border-accent bg-accent-glow"
                    : "border-border bg-surface-light hover:border-border-medium"
              }`}
            >
              <span className="text-sm font-semibold">{option.text}</span>
              {showFeedback && (
                <p className="mt-2 text-xs text-text-secondary">{option.feedback}</p>
              )}
              {submitted && isCorrectOption && !isSelected && (
                <p className="mt-2 text-xs text-success">{option.feedback}</p>
              )}
            </button>
          );
        })}
      </div>

      {/* Submit */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="mt-6 w-full rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-30"
        >
          Submit Answer
        </button>
      )}

      {submitted && result && (
        <ResultCard
          isCorrect={result.isCorrect}
          xpEarned={result.xpEarned}
          explanation={puzzle.explanation}
          onNextPuzzle={onNextPuzzle}
          trade={puzzle.trade}
          type="size-it"
        />
      )}
    </PuzzleShell>
  );
}
