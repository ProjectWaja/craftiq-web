"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { TRADES } from "@/constants/trades";
import { useGameStore } from "@/lib/store";
import XPBar from "@/components/XPBar";
import type { BaseTradeCode } from "@/types/trade";
import type { PipeMazeConfig } from "@/components/interactive/PipeMaze";
import mazes from "@/data/interactive/pipe-mazes.json";

const TRADE_TABS: { code: BaseTradeCode | "all"; label: string }[] = [
  { code: "all", label: "All" },
  { code: "plumbing", label: "Plumbing" },
  { code: "hvac", label: "HVAC" },
  { code: "electrical", label: "Electrical" },
  { code: "pipefitting", label: "Pipefitting" },
  { code: "controls", label: "Controls" },
];

const DIFFICULTY_STARS: Record<number, string> = {
  1: "\u2605",
  2: "\u2605\u2605",
  3: "\u2605\u2605\u2605",
};

export default function MazeListPage() {
  const [tradeFilter, setTradeFilter] = useState<BaseTradeCode | "all">("all");
  const completedIds = useGameStore((s) => s.completedPuzzleIds);

  const filteredMazes = useMemo(() => {
    const typed = mazes as PipeMazeConfig[];
    let list = tradeFilter === "all" ? typed : typed.filter((m) => m.trade === tradeFilter);
    // Sort by difficulty then by id
    list = [...list].sort((a, b) => a.difficulty - b.difficulty || a.id.localeCompare(b.id));
    return list;
  }, [tradeFilter]);

  return (
    <div className="mx-auto max-w-4xl px-6 pt-28 pb-20">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-text-tertiary">
        <Link href="/play" className="hover:text-text-secondary">
          Play
        </Link>
        <span>/</span>
        <span className="text-accent">Pipe Mazes</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/15 text-3xl">
          🧩
        </div>
        <div>
          <h1 className="font-mono text-2xl font-bold">Pipe Mazes</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Rotate pipe segments to connect the source to the correct destination.
          </p>
        </div>
      </div>

      {/* XP Bar */}
      <div className="mt-6">
        <XPBar />
      </div>

      {/* Trade filter tabs */}
      <div className="mt-8 flex flex-wrap gap-2">
        {TRADE_TABS.map((tab) => {
          const isActive = tradeFilter === tab.code;
          const color =
            tab.code === "all" ? "#8B5CF6" : TRADES[tab.code as BaseTradeCode]?.color ?? "#8B5CF6";
          return (
            <button
              key={tab.code}
              onClick={() => setTradeFilter(tab.code)}
              className="rounded-lg px-4 py-2 text-xs font-semibold transition-all"
              style={{
                backgroundColor: isActive ? `${color}22` : "rgba(255,255,255,0.04)",
                color: isActive ? color : "rgba(255,255,255,0.5)",
                border: `1px solid ${isActive ? `${color}44` : "rgba(255,255,255,0.08)"}`,
              }}
            >
              {tab.code !== "all" && (
                <span className="mr-1.5">
                  {TRADES[tab.code as BaseTradeCode]?.icon}
                </span>
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Maze cards */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMazes.map((maze) => {
          const t = TRADES[maze.trade as BaseTradeCode];
          const isCompleted = completedIds.includes(maze.id);

          return (
            <Link
              key={maze.id}
              href={`/play/maze/${maze.id}`}
              className="group rounded-2xl border p-4 transition-all hover:scale-[1.01]"
              style={{
                borderColor: isCompleted
                  ? "rgba(34,197,94,0.3)"
                  : `${t?.color ?? "#8B5CF6"}22`,
                backgroundColor: isCompleted
                  ? "rgba(34,197,94,0.05)"
                  : `${t?.color ?? "#8B5CF6"}06`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{t?.icon}</span>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: t?.color }}
                  >
                    {t?.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-warning">
                    {DIFFICULTY_STARS[maze.difficulty]}
                  </span>
                  {isCompleted && (
                    <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                      Done
                    </span>
                  )}
                </div>
              </div>

              <h3 className="mt-2 text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
                {maze.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-text-tertiary">
                {maze.description}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] font-mono text-text-disabled">
                  {maze.gridSize}x{maze.gridSize} grid
                </span>
                <span className="rounded-lg bg-warning/15 px-2 py-0.5 text-[10px] font-semibold text-warning">
                  {maze.xpReward} XP
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredMazes.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-text-secondary">No mazes found for this trade.</p>
        </div>
      )}
    </div>
  );
}
