"use client";

import { useState } from "react";
import { SizeItPuzzle as SizeItPuzzleType } from "@/types/puzzle";
import { scoreSizeIt } from "@/lib/puzzle-engine";
import { useGameStore } from "@/lib/store";
import { playSound } from "@/lib/sounds";
import PuzzleShell from "./PuzzleShell";
import ResultCard from "./ResultCard";

interface Props {
  puzzle: SizeItPuzzleType;
  onNextPuzzle: (wasCorrect: boolean) => void;
  timedMode?: boolean;
  timeLimit?: number;
  onTimeUp?: () => void;
}

export default function SizeItPuzzle({ puzzle, onNextPuzzle, timedMode, timeLimit, onTimeUp }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof scoreSizeIt> | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const addResult = useGameStore((s) => s.addResult);

  const handleSubmit = (overrideSelected?: string | null) => {
    const answer = overrideSelected !== undefined ? overrideSelected : selected;
    if (submitted) return;
    if (!answer) {
      // Time-up with no selection: treat as wrong
      const scored = scoreSizeIt("", puzzle);
      setResult(scored);
      setSubmitted(true);
      addResult({
        puzzleId: puzzle.id,
        puzzleType: "size-it",
        trade: puzzle.trade,
        difficulty: puzzle.difficulty,
        xpEarned: 0,
        correctCount: 0,
        incorrectCount: 1,
        totalPossible: 1,
        timestamp: Date.now(),
      });
      return;
    }
    playSound('submit');
    const scored = scoreSizeIt(answer, puzzle);
    const xpEarned = hintUsed ? Math.round(scored.xpEarned * 0.75) : scored.xpEarned;
    const adjustedResult = { ...scored, xpEarned };
    setResult(adjustedResult);
    setSubmitted(true);

    addResult({
      puzzleId: puzzle.id,
      puzzleType: "size-it",
      trade: puzzle.trade,
      difficulty: puzzle.difficulty,
      xpEarned,
      correctCount: scored.isCorrect ? 1 : 0,
      incorrectCount: scored.isCorrect ? 0 : 1,
      totalPossible: 1,
      timestamp: Date.now(),
    });
  };

  const handleTimeUp = () => {
    if (!submitted) {
      handleSubmit(selected);
    }
    onTimeUp?.();
  };

  return (
    <PuzzleShell
      trade={puzzle.trade}
      title={puzzle.title}
      difficulty={puzzle.difficulty}
      xpReward={puzzle.xpReward}
      puzzleType="size-it"
      hint={puzzle.hint}
      onHintUsed={() => setHintUsed(true)}
      timedMode={timedMode}
      timeLimit={timeLimit}
      onTimeUp={handleTimeUp}
    >
      {/* Scenario */}
      <div className="rounded-2xl border border-border bg-surface-light p-6">
        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-text-disabled">Scenario</h3>
        <p className="text-sm leading-relaxed text-text-primary">{puzzle.scenario}</p>
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
          onClick={() => handleSubmit()}
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
          correctCount={result.isCorrect ? 1 : 0}
          totalPossible={1}
        />
      )}
    </PuzzleShell>
  );
}
