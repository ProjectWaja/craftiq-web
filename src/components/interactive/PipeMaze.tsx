"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { TRADES } from "@/constants/trades";
import { useGameStore } from "@/lib/store";
import { playSound } from "@/lib/sounds";
import ResultCard from "@/components/puzzles/ResultCard";
import PuzzleShell from "@/components/puzzles/PuzzleShell";
import type { BaseTradeCode } from "@/types/trade";
import type { Difficulty } from "@/types/puzzle";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MazeEnd {
  pos: [number, number];
  label: string;
  correct: boolean;
}

export interface PipeMazeConfig {
  id: string;
  trade: BaseTradeCode;
  difficulty: Difficulty;
  title: string;
  description: string;
  gridSize: number;
  grid: string[][];
  rotatable: [number, number][];
  start: [number, number];
  ends: MazeEnd[];
  explanation: string;
  xpReward: number;
}

type Dir = "up" | "down" | "left" | "right";

// ---------------------------------------------------------------------------
// Connection maps
// ---------------------------------------------------------------------------

const CONNECTIONS: Record<string, Set<Dir>> = {
  "─": new Set(["left", "right"]),
  "│": new Set(["up", "down"]),
  "┐": new Set(["left", "down"]),
  "┌": new Set(["right", "down"]),
  "└": new Set(["right", "up"]),
  "┘": new Set(["left", "up"]),
  "┬": new Set(["left", "right", "down"]),
  "┴": new Set(["left", "right", "up"]),
  "├": new Set(["up", "down", "right"]),
  "┤": new Set(["up", "down", "left"]),
  "┼": new Set(["up", "down", "left", "right"]),
  S: new Set(["up", "down", "left", "right"]),
  A: new Set(["up", "down", "left", "right"]),
  B: new Set(["up", "down", "left", "right"]),
  C: new Set(["up", "down", "left", "right"]),
  V: new Set(["up", "down"]),
};

const ROTATION_MAP: Record<string, string> = {
  "─": "│",
  "│": "─",
  "┐": "┌",
  "┌": "└",
  "└": "┘",
  "┘": "┐",
  "┬": "├",
  "├": "┴",
  "┴": "┤",
  "┤": "┬",
};

const OPPOSITE: Record<Dir, Dir> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const DIR_DELTA: Record<Dir, [number, number]> = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
};

// ---------------------------------------------------------------------------
// Flow BFS
// ---------------------------------------------------------------------------

function getConnections(cell: string): Set<Dir> {
  return CONNECTIONS[cell] ?? new Set();
}

function computeFlow(
  grid: string[][],
  start: [number, number]
): Set<string> {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const visited = new Set<string>();
  const queue: [number, number][] = [start];
  const key = (r: number, c: number) => `${r},${c}`;

  visited.add(key(start[0], start[1]));

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const cell = grid[r][c];
    const conns = getConnections(cell);

    for (const dir of conns) {
      const [dr, dc] = DIR_DELTA[dir];
      const nr = r + dr;
      const nc = c + dc;

      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const nKey = key(nr, nc);
      if (visited.has(nKey)) continue;

      const neighbor = grid[nr][nc];
      const neighborConns = getConnections(neighbor);
      if (neighborConns.has(OPPOSITE[dir])) {
        visited.add(nKey);
        queue.push([nr, nc]);
      }
    }
  }

  return visited;
}

// ---------------------------------------------------------------------------
// Sprite tile mapping
// ---------------------------------------------------------------------------

const TILE_IMAGES: Record<string, string> = {
  "─": "/images/tiles/pipe-horizontal.jpeg",
  "│": "/images/tiles/pipe-vertical.jpeg",
  "┐": "/images/tiles/pipe-corner.jpeg",   // rotated via CSS
  "┌": "/images/tiles/pipe-corner.jpeg",
  "└": "/images/tiles/pipe-corner.jpeg",
  "┘": "/images/tiles/pipe-corner.jpeg",
  "┬": "/images/tiles/pipe-t-junction.jpeg", // rotated via CSS
  "┴": "/images/tiles/pipe-t-junction.jpeg",
  "├": "/images/tiles/pipe-t-junction.jpeg",
  "┤": "/images/tiles/pipe-t-junction.jpeg",
  "┼": "/images/tiles/pipe-cross.jpeg",
  "S": "/images/tiles/source.jpeg",
  "A": "/images/tiles/dest-a.jpeg",
  "B": "/images/tiles/dest-b.jpeg",
  "C": "/images/tiles/dest-c.jpeg",
  "V": "/images/tiles/valve-open.jpeg",
  "█": "/images/tiles/wall.jpeg",
};

// The corner image connects top-to-right (┐ shape). Map each corner to the rotation needed.
const TILE_ROTATION: Record<string, number> = {
  "┐": 0,      // base orientation: top + right
  "┌": 270,    // right + bottom
  "└": 180,    // bottom + left
  "┘": 90,     // left + top
  "┬": 0,      // base T: left + right + bottom
  "├": 270,
  "┴": 180,
  "┤": 90,
};

// ---------------------------------------------------------------------------
// CSS Pipe Renderer helpers (fallback)
// ---------------------------------------------------------------------------

interface ConnectionBarProps {
  dir: Dir;
  color: string;
  hasFlow: boolean;
}

function ConnectionBar({ dir, color, hasFlow }: ConnectionBarProps) {
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    backgroundColor: hasFlow ? color : "rgba(255,255,255,0.15)",
    borderRadius: 2,
    transition: "background-color 0.3s ease",
  };

  const barWidth = 10;
  const half = barWidth / 2;

  switch (dir) {
    case "up":
      return (
        <div
          style={{
            ...baseStyle,
            top: 0,
            left: `calc(50% - ${half}px)`,
            width: barWidth,
            height: "50%",
          }}
        />
      );
    case "down":
      return (
        <div
          style={{
            ...baseStyle,
            bottom: 0,
            left: `calc(50% - ${half}px)`,
            width: barWidth,
            height: "50%",
          }}
        />
      );
    case "left":
      return (
        <div
          style={{
            ...baseStyle,
            left: 0,
            top: `calc(50% - ${half}px)`,
            width: "50%",
            height: barWidth,
          }}
        />
      );
    case "right":
      return (
        <div
          style={{
            ...baseStyle,
            right: 0,
            top: `calc(50% - ${half}px)`,
            width: "50%",
            height: barWidth,
          }}
        />
      );
  }
}

// Center dot at junction
function CenterDot({ color, hasFlow }: { color: string; hasFlow: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 10,
        height: 10,
        borderRadius: "50%",
        backgroundColor: hasFlow ? color : "rgba(255,255,255,0.15)",
        transition: "background-color 0.3s ease",
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface PipeMazeProps {
  config: PipeMazeConfig;
  onNextPuzzle: (wasCorrect: boolean) => void;
}

export default function PipeMaze({ config, onNextPuzzle }: PipeMazeProps) {
  const addResult = useGameStore((s) => s.addResult);
  const trade = TRADES[config.trade];
  const tradeColor = trade.color;

  // Grid state: deep copy so rotations mutate local copy
  const [grid, setGrid] = useState<string[][]>(() =>
    config.grid.map((row) => [...row])
  );
  const [rotations, setRotations] = useState(0);
  const [solved, setSolved] = useState(false);
  const [xpResult, setXpResult] = useState<{
    xpEarned: number;
    leveledUp: boolean;
  } | null>(null);

  // Build a set of rotatable cell keys for O(1) lookup
  const rotatableSet = useMemo(() => {
    const s = new Set<string>();
    for (const [r, c] of config.rotatable) s.add(`${r},${c}`);
    return s;
  }, [config.rotatable]);

  // Compute flow on every grid change
  const flowCells = useMemo(() => computeFlow(grid, config.start), [grid, config.start]);

  // Check if any end is reached
  const reachedEnd = useMemo(() => {
    for (const end of config.ends) {
      if (flowCells.has(`${end.pos[0]},${end.pos[1]}`)) {
        return end;
      }
    }
    return null;
  }, [flowCells, config.ends]);

  // Auto-solve when correct end reached
  useEffect(() => {
    if (solved) return;
    if (reachedEnd && reachedEnd.correct) {
      setSolved(true);

      // Calculate XP: bonus for fewer rotations
      const parRotations = config.rotatable.length * 2;
      const bonus = rotations <= parRotations ? 1.25 : 1;
      const baseXP = Math.round(config.xpReward * bonus);

      const result = addResult({
        puzzleId: config.id,
        puzzleType: "build-assembly", // closest existing type
        trade: config.trade,
        difficulty: config.difficulty,
        xpEarned: baseXP,
        correctCount: 1,
        incorrectCount: 0,
        totalPossible: 1,
        timestamp: Date.now(),
      });

      setXpResult(result);
      playSound("correct");
    }
  }, [reachedEnd, solved, rotations, config, addResult]);

  // Handle cell click
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (solved) return;
      const key = `${row},${col}`;
      if (!rotatableSet.has(key)) return;

      const cell = grid[row][col];
      const next = ROTATION_MAP[cell];
      if (!next) return;

      setGrid((prev) => {
        const copy = prev.map((r) => [...r]);
        copy[row][col] = next;
        return copy;
      });
      setRotations((r) => r + 1);
      playSound("wrong"); // light click feedback
    },
    [grid, solved, rotatableSet]
  );

  // End lookup map for rendering
  const endMap = useMemo(() => {
    const m = new Map<string, MazeEnd>();
    for (const e of config.ends) m.set(`${e.pos[0]},${e.pos[1]}`, e);
    return m;
  }, [config.ends]);

  // Cell size responsive
  const cellSize = config.gridSize <= 5 ? 56 : config.gridSize <= 7 ? 48 : 40;

  return (
    <PuzzleShell
      trade={config.trade}
      title={config.title}
      difficulty={config.difficulty}
      xpReward={config.xpReward}
      puzzleType="build-assembly"
    >
      {/* Description */}
      <p className="mb-4 text-sm text-text-secondary">{config.description}</p>

      {/* Rotation counter */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs text-text-tertiary">
          Rotations: <span className="font-mono font-bold text-text-primary">{rotations}</span>
        </span>
        {!solved && (
          <span className="text-xs text-text-tertiary">
            Tap highlighted cells to rotate
          </span>
        )}
        {solved && (
          <span className="text-xs font-semibold text-success">
            Path complete!
          </span>
        )}
      </div>

      {/* Maze Grid */}
      <div className="flex justify-center">
        <div
          className="relative rounded-xl border border-border bg-[#0a0d17] p-2"
          style={{
            display: "inline-grid",
            gridTemplateColumns: `repeat(${config.gridSize}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${grid.length}, ${cellSize}px)`,
            gap: 2,
          }}
        >
          {grid.map((row, ri) =>
            row.map((cell, ci) => {
              const key = `${ri},${ci}`;
              const isRotatable = rotatableSet.has(key);
              const hasFlow = flowCells.has(key);
              const isStart = ri === config.start[0] && ci === config.start[1];
              const endInfo = endMap.get(key);
              const conns = getConnections(cell);
              const isEmpty = cell === " ";
              const isWall = cell === "█";

              return (
                <div
                  key={key}
                  onClick={() => handleCellClick(ri, ci)}
                  className={`relative select-none ${
                    isRotatable && !solved
                      ? "cursor-pointer ring-1 ring-dashed ring-white/20 hover:ring-white/40"
                      : ""
                  }`}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    borderRadius: 6,
                    backgroundColor: isWall
                      ? "rgba(255,255,255,0.04)"
                      : hasFlow
                        ? `${tradeColor}1A`
                        : "transparent",
                    transition: "background-color 0.3s ease",
                    border: isRotatable && !solved
                      ? "1px dashed rgba(255,255,255,0.15)"
                      : "1px solid transparent",
                  }}
                >
                  {/* Render tile sprite or CSS fallback */}
                  {!isEmpty && (() => {
                    const tileImg = TILE_IMAGES[cell];
                    const rotation = TILE_ROTATION[cell] ?? 0;

                    if (tileImg) {
                      return (
                        <img
                          src={tileImg}
                          alt={cell}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transform: rotation ? `rotate(${rotation}deg)` : undefined,
                            transition: "transform 0.2s ease",
                            opacity: hasFlow ? 1 : 0.5,
                            filter: hasFlow ? `drop-shadow(0 0 6px ${tradeColor}80)` : "none",
                          }}
                          draggable={false}
                        />
                      );
                    }

                    // CSS fallback for unmapped cells
                    return (
                      <>
                        {Array.from(conns).map((dir) => (
                          <ConnectionBar
                            key={dir}
                            dir={dir}
                            color={tradeColor}
                            hasFlow={hasFlow}
                          />
                        ))}
                        {conns.size > 0 && (
                          <CenterDot color={tradeColor} hasFlow={hasFlow} />
                        )}
                      </>
                    );
                  })()}

                  {/* Rotate indicator for rotatable cells */}
                  {isRotatable && !solved && !isStart && !endInfo && (
                    <div
                      className="absolute bottom-0.5 right-0.5 text-[8px] text-white/30"
                      style={{ lineHeight: 1 }}
                    >
                      ↻
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* End labels legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {config.ends.map((end) => {
          const reached = flowCells.has(`${end.pos[0]},${end.pos[1]}`);
          return (
            <div
              key={end.label}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs"
              style={{
                backgroundColor:
                  reached && end.correct
                    ? "rgba(34,197,94,0.15)"
                    : reached && !end.correct
                      ? "rgba(239,68,68,0.15)"
                      : "rgba(255,255,255,0.04)",
                border: `1px solid ${
                  reached && end.correct
                    ? "rgba(34,197,94,0.3)"
                    : reached && !end.correct
                      ? "rgba(239,68,68,0.3)"
                      : "rgba(255,255,255,0.08)"
                }`,
              }}
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor:
                    reached && end.correct
                      ? "#22C55E"
                      : reached && !end.correct
                        ? "#EF4444"
                        : "rgba(255,255,255,0.1)",
                  color: reached ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                }}
              >
                {end.pos === config.ends[0].pos
                  ? "A"
                  : end.pos === config.ends[1].pos
                    ? "B"
                    : "C"}
              </span>
              <span className="text-text-secondary">{end.label}</span>
              {reached && end.correct && (
                <span className="ml-1 text-success">&#10003;</span>
              )}
              {reached && !end.correct && (
                <span className="ml-1 text-error">&#10007;</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Result */}
      {solved && xpResult && (
        <ResultCard
          isCorrect={true}
          xpEarned={xpResult.xpEarned}
          explanation={config.explanation}
          onNextPuzzle={onNextPuzzle}
          trade={config.trade}
          type="pipe-maze"
        />
      )}
    </PuzzleShell>
  );
}
