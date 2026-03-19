"use client";

import { useState, useMemo } from "react";
import { WhatsMissingPuzzle as WhatsMissingPuzzleType } from "@/types/puzzle";
import { scoreWhatsMissing } from "@/lib/puzzle-engine";
import { shuffle } from "@/lib/puzzle-engine";
import { useGameStore } from "@/lib/store";
import { playSound } from "@/lib/sounds";
import PuzzleShell from "./PuzzleShell";
import ResultCard from "./ResultCard";

interface Props {
  puzzle: WhatsMissingPuzzleType;
  onNextPuzzle: (wasCorrect: boolean) => void;
  timedMode?: boolean;
  timeLimit?: number;
  onTimeUp?: () => void;
}

export default function WhatsMissingPuzzle({ puzzle, onNextPuzzle, timedMode, timeLimit, onTimeUp }: Props) {
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof scoreWhatsMissing> | null>(null);
  const addResult = useGameStore((s) => s.addResult);

  // Combine missing item names + distractors and shuffle
  const choices = useMemo(() => {
    const missingNames = puzzle.missingItems.map((m) => m.name);
    return shuffle([...missingNames, ...puzzle.distractors]);
  }, [puzzle]);

  const toggleChoice = (name: string) => {
    if (submitted) return;
    setSelectedNames((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleSubmit = () => {
    if (submitted) return;
    playSound('submit');
    const scored = scoreWhatsMissing(selectedNames, puzzle);
    setResult(scored);
    setSubmitted(true);

    addResult({
      puzzleId: puzzle.id,
      puzzleType: "whats-missing",
      trade: puzzle.trade,
      difficulty: puzzle.difficulty,
      xpEarned: scored.xpEarned,
      correctCount: scored.correctSelections.length,
      incorrectCount: scored.falsePositives.length + scored.missed.length,
      totalPossible: puzzle.missingItems.length,
      timestamp: Date.now(),
    });
  };

  const handleTimeUp = () => {
    if (!submitted) {
      handleSubmit();
    }
    onTimeUp?.();
  };

  const missingNames = puzzle.missingItems.map((m) => m.name);

  const getChoiceStyle = (name: string) => {
    if (!submitted) {
      return selectedNames.includes(name)
        ? "border-accent bg-accent-glow"
        : "border-border bg-surface-light hover:border-border-medium";
    }

    const isMissing = missingNames.includes(name);
    const wasSelected = selectedNames.includes(name);

    if (isMissing && wasSelected) return "border-success bg-success/10";
    if (isMissing && !wasSelected) return "border-warning bg-warning/10";
    if (!isMissing && wasSelected) return "border-error bg-error/10";
    return "border-border bg-surface-light opacity-50";
  };

  return (
    <PuzzleShell
      trade={puzzle.trade}
      title={puzzle.title}
      difficulty={puzzle.difficulty}
      xpReward={puzzle.xpReward}
      puzzleType="whats-missing"
      timedMode={timedMode}
      timeLimit={timeLimit}
      onTimeUp={handleTimeUp}
    >
      <p className="mb-4 text-sm text-text-secondary">{puzzle.description}</p>

      {/* Present items */}
      <div className="rounded-2xl border border-border bg-surface-light p-5">
        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-text-disabled">
          Components Present
        </h3>
        <ul className="space-y-1.5">
          {puzzle.presentItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="mt-0.5 text-success">&#8226;</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Choices */}
      <div className="mt-6">
        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-text-disabled">
          What&apos;s missing? Select all that apply.
        </h3>
        <div className="space-y-3">
          {choices.map((name) => {
            const isMissing = missingNames.includes(name);
            const missingItem = puzzle.missingItems.find((m) => m.name === name);

            return (
              <button
                key={name}
                onClick={() => toggleChoice(name)}
                disabled={submitted}
                className={`w-full rounded-xl border-2 p-4 text-left transition-all ${getChoiceStyle(name)}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{name}</span>
                  {selectedNames.includes(name) && !submitted && (
                    <span className="text-xs text-accent">Selected</span>
                  )}
                  {submitted && isMissing && selectedNames.includes(name) && (
                    <span className="text-xs font-semibold text-success">Correct!</span>
                  )}
                  {submitted && isMissing && !selectedNames.includes(name) && (
                    <span className="text-xs font-semibold text-warning">Missed</span>
                  )}
                  {submitted && !isMissing && selectedNames.includes(name) && (
                    <span className="text-xs font-semibold text-error">Not missing</span>
                  )}
                </div>
                {submitted && isMissing && missingItem && (
                  <p className="mt-2 border-t border-border pt-2 text-xs text-text-secondary">
                    {missingItem.explanation}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="mt-6 w-full rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Submit ({selectedNames.length} selected)
        </button>
      )}

      {submitted && result && (
        <ResultCard
          isCorrect={result.missed.length === 0 && result.falsePositives.length === 0}
          xpEarned={result.xpEarned}
          explanation={puzzle.explanation}
          onNextPuzzle={onNextPuzzle}
          trade={puzzle.trade}
          type="whats-missing"
          correctCount={result.correctSelections.length}
          totalPossible={puzzle.missingItems.length}
        />
      )}
    </PuzzleShell>
  );
}
