"use client";

import { useState } from "react";
import { CodeCheckPuzzle as CodeCheckPuzzleType } from "@/types/puzzle";
import { scoreCodeCheck } from "@/lib/puzzle-engine";
import { useGameStore } from "@/lib/store";
import PuzzleShell from "./PuzzleShell";
import ResultCard from "./ResultCard";

interface Props {
  puzzle: CodeCheckPuzzleType;
  onNextPuzzle: () => void;
}

export default function CodeCheckPuzzle({ puzzle, onNextPuzzle }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof scoreCodeCheck> | null>(null);
  const addResult = useGameStore((s) => s.addResult);

  const handleSubmit = (answer: boolean) => {
    if (submitted) return;
    const scored = scoreCodeCheck(answer, puzzle);
    setResult(scored);
    setSubmitted(true);

    addResult({
      puzzleId: puzzle.id,
      puzzleType: "code-check",
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
      </div>

      {/* Answer buttons */}
      {!submitted && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSubmit(true)}
            className="rounded-xl border-2 border-success/30 bg-success/5 px-6 py-5 text-center transition-all hover:border-success/60 hover:bg-success/10"
          >
            <span className="block text-2xl">&#10003;</span>
            <span className="mt-1 block text-sm font-semibold text-success">Up to Code</span>
          </button>
          <button
            onClick={() => handleSubmit(false)}
            className="rounded-xl border-2 border-error/30 bg-error/5 px-6 py-5 text-center transition-all hover:border-error/60 hover:bg-error/10"
          >
            <span className="block text-2xl">&#10007;</span>
            <span className="mt-1 block text-sm font-semibold text-error">Code Violation</span>
          </button>
        </div>
      )}

      {/* Result */}
      {submitted && result && (
        <ResultCard
          isCorrect={result.isCorrect}
          xpEarned={result.xpEarned}
          explanation={puzzle.explanation}
          codeReference={puzzle.codeReference}
          onNextPuzzle={onNextPuzzle}
          trade={puzzle.trade}
          type="code-check"
        />
      )}
    </PuzzleShell>
  );
}
