"use client";

import { useGameStore, useLevel, useLevelProgress, useXPToNext } from "@/lib/store";

export default function XPBar() {
  const totalXP = useGameStore((s) => s.totalXP);
  const puzzlesCompleted = useGameStore((s) => s.puzzlesCompleted);
  const streak = useGameStore((s) => s.currentStreak);
  const level = useLevel();
  const progress = useLevelProgress();
  const xpToNext = useXPToNext();

  return (
    <div className="rounded-2xl border border-border bg-surface-light p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
            style={{ backgroundColor: `${level.color}22`, color: level.color }}
          >
            Y{level.year}
          </div>
          <div>
            <p className="text-sm font-semibold">{level.name}</p>
            <p className="text-xs text-text-tertiary">
              {totalXP} XP total{xpToNext !== null ? ` \u2022 ${xpToNext} to next` : " \u2022 Max level!"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-text-tertiary">
          <span>{puzzlesCompleted} solved</span>
          {streak > 0 && <span className="text-warning">{streak}d streak</span>}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, backgroundColor: level.color }}
        />
      </div>
    </div>
  );
}
