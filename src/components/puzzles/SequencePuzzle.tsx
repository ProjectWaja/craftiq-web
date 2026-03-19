"use client";

import { useState, useMemo } from "react";
import { SequencePuzzle as SequencePuzzleType, SequenceStep } from "@/types/puzzle";
import { scoreSequence, shuffle } from "@/lib/puzzle-engine";
import { useGameStore } from "@/lib/store";
import PuzzleShell from "./PuzzleShell";
import ResultCard from "./ResultCard";

interface Props {
  puzzle: SequencePuzzleType;
  onNextPuzzle: () => void;
}

export default function SequencePuzzle({ puzzle, onNextPuzzle }: Props) {
  const shuffled = useMemo(() => shuffle([...puzzle.steps]), [puzzle]);
  const [steps, setSteps] = useState<SequenceStep[]>(shuffled);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof scoreSequence> | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const addResult = useGameStore((s) => s.addResult);

  const moveStep = (from: number, to: number) => {
    if (submitted || from === to) return;
    const updated = [...steps];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setSteps(updated);
  };

  const handleSubmit = () => {
    if (submitted) return;
    const scored = scoreSequence(steps, puzzle);
    setResult(scored);
    setSubmitted(true);

    addResult({
      puzzleId: puzzle.id,
      puzzleType: "sequence",
      trade: puzzle.trade,
      difficulty: puzzle.difficulty,
      xpEarned: scored.xpEarned,
      correctCount: scored.correctCount,
      incorrectCount: scored.totalSteps - scored.correctCount,
      totalPossible: scored.totalSteps,
      timestamp: Date.now(),
    });
  };

  return (
    <PuzzleShell trade={puzzle.trade} title={puzzle.title} difficulty={puzzle.difficulty} xpReward={puzzle.xpReward} puzzleType="sequence">
      <p className="mb-4 text-sm text-text-secondary">{puzzle.description}</p>
      <p className="mb-4 text-xs text-text-tertiary">Drag to reorder, or use the arrow buttons.</p>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step, idx) => {
          const isCorrectPosition = submitted && step.order === idx + 1;
          const isWrongPosition = submitted && step.order !== idx + 1;

          return (
            <div
              key={step.id}
              draggable={!submitted}
              onDragStart={() => setDragIdx(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIdx !== null) moveStep(dragIdx, idx);
                setDragIdx(null);
              }}
              className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                submitted
                  ? isCorrectPosition
                    ? "border-success/40 bg-success/5"
                    : "border-error/40 bg-error/5"
                  : dragIdx === idx
                    ? "border-accent bg-accent-glow opacity-70"
                    : "border-border bg-surface-light"
              } ${!submitted ? "cursor-grab active:cursor-grabbing" : ""}`}
            >
              {/* Position number */}
              <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                submitted
                  ? isCorrectPosition ? "bg-success/20 text-success" : "bg-error/20 text-error"
                  : "bg-white/10 text-text-tertiary"
              }`}>
                {idx + 1}
              </span>

              <span className="flex-1 text-sm">{step.text}</span>

              {/* Move buttons */}
              {!submitted && (
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveStep(idx, Math.max(0, idx - 1))}
                    disabled={idx === 0}
                    className="rounded px-1.5 py-0.5 text-xs text-text-tertiary hover:bg-white/10 disabled:opacity-20"
                    aria-label="Move up"
                  >
                    &#9650;
                  </button>
                  <button
                    onClick={() => moveStep(idx, Math.min(steps.length - 1, idx + 1))}
                    disabled={idx === steps.length - 1}
                    className="rounded px-1.5 py-0.5 text-xs text-text-tertiary hover:bg-white/10 disabled:opacity-20"
                    aria-label="Move down"
                  >
                    &#9660;
                  </button>
                </div>
              )}

              {/* Correct position indicator */}
              {submitted && isWrongPosition && (
                <span className="text-[11px] text-text-tertiary">#{step.order}</span>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="mt-6 w-full rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Submit Order
        </button>
      )}

      {submitted && result && (
        <ResultCard
          isCorrect={result.correctCount === result.totalSteps}
          xpEarned={result.xpEarned}
          explanation={puzzle.explanation}
          onNextPuzzle={onNextPuzzle}
          trade={puzzle.trade}
          type="sequence"
          correctCount={result.correctCount}
          totalPossible={result.totalSteps}
        />
      )}
    </PuzzleShell>
  );
}
