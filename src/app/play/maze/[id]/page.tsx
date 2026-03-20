"use client";

import { useMemo, useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PipeMaze from "@/components/interactive/PipeMaze";
import type { PipeMazeConfig } from "@/components/interactive/PipeMaze";
import { useGameStore } from "@/lib/store";
import XPBar from "@/components/XPBar";
import GuestPrompt from "@/components/GuestPrompt";
import mazes from "@/data/interactive/pipe-mazes.json";

export default function MazePlayPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const completedIds = useGameStore((s) => s.completedPuzzleIds);
  const [puzzleKey, setPuzzleKey] = useState(0);

  const allMazes = mazes as PipeMazeConfig[];
  const config = useMemo(() => allMazes.find((m) => m.id === id), [id, allMazes]);

  // Pick a random unplayed maze for "next"
  const pickNextMaze = useCallback(() => {
    const unplayed = allMazes.filter(
      (m) => m.id !== id && !completedIds.includes(m.id)
    );
    if (unplayed.length > 0) {
      const next = unplayed[Math.floor(Math.random() * unplayed.length)];
      return next.id;
    }
    // All played — just pick any other
    const others = allMazes.filter((m) => m.id !== id);
    if (others.length > 0) {
      return others[Math.floor(Math.random() * others.length)].id;
    }
    return null;
  }, [allMazes, id, completedIds]);

  const handleNextPuzzle = useCallback(
    (_wasCorrect: boolean) => {
      const nextId = pickNextMaze();
      if (nextId) {
        router.push(`/play/maze/${nextId}`);
      } else {
        router.push("/play/maze");
      }
    },
    [pickNextMaze, router]
  );

  if (!config) {
    return (
      <div className="mx-auto max-w-2xl px-6 pt-32 pb-20 text-center">
        <h1 className="font-mono text-2xl font-bold">Maze Not Found</h1>
        <p className="mt-2 text-text-secondary">
          Could not find a maze with ID &quot;{id}&quot;.
        </p>
        <Link
          href="/play/maze"
          className="mt-4 inline-block text-accent hover:underline"
        >
          Browse all mazes
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20">
      {/* Breadcrumb */}
      <div className="mx-auto mb-4 max-w-2xl px-4">
        <div className="flex items-center gap-2 text-sm text-text-tertiary">
          <Link href="/play" className="hover:text-text-secondary">
            Play
          </Link>
          <span>/</span>
          <Link href="/play/maze" className="hover:text-text-secondary">
            Mazes
          </Link>
          <span>/</span>
          <span className="text-accent">{config.title}</span>
        </div>
      </div>

      {/* Guest prompt */}
      <GuestPrompt />

      {/* XP bar */}
      <div className="mx-auto mb-6 max-w-2xl px-4">
        <XPBar />
      </div>

      {/* Maze */}
      <div key={`${id}-${puzzleKey}`}>
        <PipeMaze config={config} onNextPuzzle={handleNextPuzzle} />
      </div>

      {/* Back link */}
      <div className="mx-auto mt-8 max-w-2xl px-4 text-center">
        <Link
          href="/play/maze"
          className="text-sm text-text-tertiary hover:text-text-secondary transition-colors"
        >
          &#8592; Back to all mazes
        </Link>
      </div>
    </div>
  );
}
