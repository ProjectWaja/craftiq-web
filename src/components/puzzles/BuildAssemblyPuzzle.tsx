"use client";

import { useState, useMemo } from "react";
import { BuildAssemblyPuzzle as BuildAssemblyPuzzleType } from "@/types/puzzle";
import { scoreBuildAssembly, shuffle } from "@/lib/puzzle-engine";
import { useGameStore } from "@/lib/store";
import { playSound } from "@/lib/sounds";
import PuzzleShell from "./PuzzleShell";
import ResultCard from "./ResultCard";

interface Props {
  puzzle: BuildAssemblyPuzzleType;
  onNextPuzzle: (wasCorrect: boolean) => void;
  timedMode?: boolean;
  timeLimit?: number;
  onTimeUp?: () => void;
}

export default function BuildAssemblyPuzzle({ puzzle, onNextPuzzle, timedMode, timeLimit, onTimeUp }: Props) {
  // Combine real parts + distractors and shuffle
  const allParts = useMemo(
    () => shuffle([
      ...puzzle.parts.map((p) => ({ id: p.id, name: p.name, isDistractor: false })),
      ...puzzle.distractors.map((d) => ({ id: d.id, name: d.name, isDistractor: true })),
    ]),
    [puzzle],
  );

  const [placements, setPlacements] = useState<Record<number, number | null>>(
    Object.fromEntries(puzzle.positions.map((p) => [p.id, null]))
  );
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof scoreBuildAssembly> | null>(null);
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null);
  const addResult = useGameStore((s) => s.addResult);

  // Parts already placed somewhere
  const placedPartIds = Object.values(placements).filter((v): v is number => v !== null);

  const handleSelectPart = (partId: number) => {
    if (submitted) return;
    setSelectedPartId(partId === selectedPartId ? null : partId);
  };

  const handleSelectPosition = (posId: number) => {
    if (submitted || selectedPartId === null) return;

    // Remove part from any existing position
    const updated = { ...placements };
    for (const key of Object.keys(updated)) {
      if (updated[Number(key)] === selectedPartId) {
        updated[Number(key)] = null;
      }
    }
    updated[posId] = selectedPartId;
    setPlacements(updated);
    setSelectedPartId(null);
  };

  const handleClearPosition = (posId: number) => {
    if (submitted) return;
    setPlacements((prev) => ({ ...prev, [posId]: null }));
  };

  const handleSubmit = () => {
    if (submitted) return;
    playSound('submit');
    const scored = scoreBuildAssembly(placements, puzzle);
    setResult(scored);
    setSubmitted(true);

    addResult({
      puzzleId: puzzle.id,
      puzzleType: "build-assembly",
      trade: puzzle.trade,
      difficulty: puzzle.difficulty,
      xpEarned: scored.xpEarned,
      correctCount: scored.correctPlacements.length,
      incorrectCount: scored.misplacements.length,
      totalPossible: puzzle.positions.length,
      timestamp: Date.now(),
    });
  };

  const handleTimeUp = () => {
    if (!submitted) {
      handleSubmit();
    }
    onTimeUp?.();
  };

  const getPartName = (partId: number) => allParts.find((p) => p.id === partId)?.name ?? "?";

  const getPositionStyle = (posId: number) => {
    if (!submitted) {
      const hasPlacement = placements[posId] !== null;
      return hasPlacement
        ? "border-accent bg-accent-glow"
        : selectedPartId !== null
          ? "border-accent/40 bg-accent/5 cursor-pointer"
          : "border-border bg-surface-light";
    }
    return result?.correctPlacements.includes(posId)
      ? "border-success/40 bg-success/5"
      : "border-error/40 bg-error/5";
  };

  return (
    <PuzzleShell
      trade={puzzle.trade}
      title={puzzle.title}
      difficulty={puzzle.difficulty}
      xpReward={puzzle.xpReward}
      puzzleType="build-assembly"
      timedMode={timedMode}
      timeLimit={timeLimit}
      onTimeUp={handleTimeUp}
    >
      <p className="mb-4 text-sm text-text-secondary">{puzzle.description}</p>

      {/* Parts bank */}
      <div className="mb-6">
        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-text-disabled">
          Available Parts {!submitted && "(tap to select, then tap a position)"}
        </h3>
        <div className="flex flex-wrap gap-2">
          {allParts.map((part) => {
            const isPlaced = placedPartIds.includes(part.id);
            const isSelected = selectedPartId === part.id;
            const isUsedDistractor = submitted && result?.usedDistractors.includes(part.id);

            return (
              <button
                key={part.id}
                onClick={() => handleSelectPart(part.id)}
                disabled={submitted || isPlaced}
                className={`rounded-lg border-2 px-3 py-2 text-xs font-semibold transition-all ${
                  isPlaced
                    ? "border-border bg-surface-light opacity-30"
                    : isSelected
                      ? "border-accent bg-accent-glow"
                      : "border-border bg-surface-light hover:border-border-medium"
                } ${submitted && part.isDistractor ? "text-text-tertiary line-through" : ""}`}
              >
                {part.name}
                {isUsedDistractor && <span className="ml-1 text-error">(doesn&apos;t belong)</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Positions */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-text-disabled">Assembly Positions</h3>
        {puzzle.positions.map((pos) => {
          const placedPartId = placements[pos.id];
          const correctPart = puzzle.parts.find((p) => p.correctPosition === pos.id);

          return (
            <div
              key={pos.id}
              onClick={() => handleSelectPosition(pos.id)}
              className={`flex items-center justify-between rounded-xl border-2 p-4 transition-all ${getPositionStyle(pos.id)}`}
            >
              <div>
                <span className="text-xs text-text-tertiary">{pos.label}</span>
                {placedPartId !== null && (
                  <p className="mt-1 text-sm font-semibold">{getPartName(placedPartId)}</p>
                )}
                {placedPartId === null && !submitted && (
                  <p className="mt-1 text-xs text-text-tertiary italic">Empty</p>
                )}
                {submitted && !result?.correctPlacements.includes(pos.id) && correctPart && (
                  <p className="mt-1 text-xs text-success">Correct: {correctPart.name}</p>
                )}
              </div>
              {!submitted && placedPartId !== null && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleClearPosition(pos.id); }}
                  className="rounded-lg px-2 py-1 text-xs text-error hover:bg-error/10"
                >
                  Remove
                </button>
              )}
              {submitted && (
                <span className={`text-sm ${result?.correctPlacements.includes(pos.id) ? "text-success" : "text-error"}`}>
                  {result?.correctPlacements.includes(pos.id) ? "\u2713" : "\u2717"}
                </span>
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
          Submit Assembly
        </button>
      )}

      {submitted && result && (
        <ResultCard
          isCorrect={result.misplacements.length === 0}
          xpEarned={result.xpEarned}
          explanation={puzzle.explanation}
          onNextPuzzle={onNextPuzzle}
          trade={puzzle.trade}
          type="build-assembly"
          correctCount={result.correctPlacements.length}
          totalPossible={puzzle.positions.length}
        />
      )}
    </PuzzleShell>
  );
}
