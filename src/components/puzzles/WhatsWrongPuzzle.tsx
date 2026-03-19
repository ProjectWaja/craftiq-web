"use client";

import { useState } from "react";
import { WhatsWrongPuzzle as WhatsWrongPuzzleType } from "@/types/puzzle";
import { scoreWhatsWrong } from "@/lib/puzzle-engine";
import { useGameStore } from "@/lib/store";
import PuzzleShell from "./PuzzleShell";
import ResultCard from "./ResultCard";

interface Props {
  puzzle: WhatsWrongPuzzleType;
  onNextPuzzle: (wasCorrect: boolean) => void;
}

export default function WhatsWrongPuzzle({ puzzle, onNextPuzzle }: Props) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof scoreWhatsWrong> | null>(null);
  const addResult = useGameStore((s) => s.addResult);

  const toggleComponent = (id: number) => {
    if (submitted) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (submitted) return;
    const scored = scoreWhatsWrong(selectedIds, puzzle);
    setResult(scored);
    setSubmitted(true);

    const violations = puzzle.components.filter((c) => !c.correct);
    addResult({
      puzzleId: puzzle.id,
      puzzleType: "whats-wrong",
      trade: puzzle.trade,
      difficulty: puzzle.difficulty,
      xpEarned: scored.xpEarned,
      correctCount: scored.correctHits.length,
      incorrectCount: scored.falsePositives.length + scored.missed.length,
      totalPossible: violations.length,
      timestamp: Date.now(),
    });
  };

  const getComponentStyle = (id: number, correct: boolean) => {
    if (!submitted) {
      return selectedIds.includes(id)
        ? "border-error bg-error/10"
        : "border-border bg-surface-light hover:border-border-medium";
    }

    // After submission
    if (!correct) {
      // This is a violation
      return selectedIds.includes(id)
        ? "border-success bg-success/10" // Correctly identified
        : "border-warning bg-warning/10"; // Missed
    } else {
      // This is correct
      return selectedIds.includes(id)
        ? "border-error bg-error/10" // False positive
        : "border-border bg-surface-light opacity-50";
    }
  };

  return (
    <PuzzleShell trade={puzzle.trade} title={puzzle.title} difficulty={puzzle.difficulty} xpReward={puzzle.xpReward} puzzleType="whats-wrong">
      <p className="mb-4 text-sm text-text-secondary">
        {puzzle.description || "Tap each component that has a code violation."}
      </p>

      {/* Component list */}
      <div className="space-y-3">
        {puzzle.components.map((comp) => (
          <button
            key={comp.id}
            onClick={() => toggleComponent(comp.id)}
            disabled={submitted}
            className={`w-full rounded-xl border-2 p-4 text-left transition-all ${getComponentStyle(comp.id, comp.correct)}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{comp.name}</span>
              {selectedIds.includes(comp.id) && !submitted && (
                <span className="text-xs text-error">Flagged</span>
              )}
              {submitted && !comp.correct && selectedIds.includes(comp.id) && (
                <span className="text-xs font-semibold text-success">Correct!</span>
              )}
              {submitted && !comp.correct && !selectedIds.includes(comp.id) && (
                <span className="text-xs font-semibold text-warning">Missed</span>
              )}
              {submitted && comp.correct && selectedIds.includes(comp.id) && (
                <span className="text-xs font-semibold text-error">False alarm</span>
              )}
            </div>

            {/* Show violation detail after submission */}
            {submitted && !comp.correct && comp.violation && (
              <div className="mt-2 border-t border-border pt-2">
                <p className="text-xs text-text-secondary">{comp.violation}</p>
                {comp.codeReference && (
                  <p className="mt-1 font-mono text-[11px] text-accent">{comp.codeReference}</p>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Submit */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          className="mt-6 w-full rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Submit ({selectedIds.length} flagged)
        </button>
      )}

      {submitted && result && (
        <ResultCard
          isCorrect={result.missed.length === 0 && result.falsePositives.length === 0}
          xpEarned={result.xpEarned}
          explanation={puzzle.explanation}
          onNextPuzzle={onNextPuzzle}
          trade={puzzle.trade}
          type="whats-wrong"
          correctCount={result.correctHits.length}
          totalPossible={puzzle.components.filter((c) => !c.correct).length}
        />
      )}
    </PuzzleShell>
  );
}
