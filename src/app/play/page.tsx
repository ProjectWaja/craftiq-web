"use client";

import Link from "next/link";
import Image from "next/image";
import { TRADES, PUZZLE_TYPES, BASE_TRADE_CODES, SPECIALTY_CODES } from "@/constants/trades";
import { TradeCode } from "@/types/trade";
import { PuzzleType } from "@/types/puzzle";
import { useGameStore } from "@/lib/store";
import XPBar from "@/components/XPBar";

const TRADE_HERO_IMAGES: Record<string, string> = {
  hvac: '/images/trade-heroes/hvac.jpeg',
  plumbing: '/images/trade-heroes/plumbing.jpeg',
  electrical: '/images/trade-heroes/electrical.jpeg',
  pipefitting: '/images/trade-heroes/pipefitting.png',
  controls: '/images/trade-heroes/controls.png',
  'data-center': '/images/trade-heroes/data-center.jpeg',
  'central-plant': '/images/trade-heroes/central-plant.jpeg',
  healthcare: '/images/trade-heroes/healthcare.png',
  'high-rise': '/images/trade-heroes/high-rise.jpeg',
  industrial: '/images/trade-heroes/industrial.png',
};

const MASTERY_LABELS: Record<number, string> = {
  1: "Building foundations",
  2: "Ready for Year 3-4",
  3: "Journeyman level",
};

const puzzleTypeKeys = Object.keys(PUZZLE_TYPES) as PuzzleType[];

export default function PlayPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-28 pb-20">
      <h1 className="font-mono text-3xl font-bold">Play</h1>
      <p className="mt-2 text-text-secondary">Pick a trade and puzzle type to start solving.</p>

      {/* XP Bar */}
      <div className="mt-6">
        <XPBar />
      </div>

      {/* Play Random */}
      <div className="mt-8">
        <Link
          href="/play/random"
          className="group flex items-center gap-5 rounded-2xl border-2 border-accent/20 bg-accent/5 p-6 transition-all hover:border-accent/40 hover:bg-accent/10"
        >
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-3xl transition-transform group-hover:scale-110">
            <span>&#x1F3B2;</span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-text-primary">Random Puzzle</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Random trade &amp; type — great for daily practice
            </p>
          </div>
          <span className="text-2xl text-accent/60 transition-transform group-hover:translate-x-1 group-hover:text-accent">
            &#8250;
          </span>
        </Link>
      </div>

      {/* Brain Teasers */}
      <div className="mt-8">
        <Link
          href="/play/maze"
          className="group flex items-center gap-5 rounded-2xl border-2 border-teal-500/20 bg-teal-500/5 p-6 transition-all hover:border-teal-500/40 hover:bg-teal-500/10"
        >
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-teal-500/15 text-3xl transition-transform group-hover:scale-110">
            <span>&#x1F9E9;</span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-text-primary">Pipe Mazes</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Fun brain teasers between puzzles — rotate pipes to complete the path
            </p>
          </div>
          <span className="text-2xl text-teal-500/60 transition-transform group-hover:translate-x-1 group-hover:text-teal-500">
            &#8250;
          </span>
        </Link>
      </div>

      {/* Base Trades */}
      <div className="mt-10">
        <h2 className="text-[10px] font-semibold uppercase tracking-widest text-text-disabled">Core Trades</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BASE_TRADE_CODES.map((code) => (
            <TradeCard key={code} code={code} />
          ))}
        </div>
      </div>

      {/* Specialty Trades */}
      <div className="mt-10">
        <h2 className="text-[10px] font-semibold uppercase tracking-widest text-text-disabled">
          Premium Specialties
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SPECIALTY_CODES.map((code) => (
            <TradeCard key={code} code={code} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MasteryIndicator({ code }: { code: TradeCode }) {
  const mastery = useGameStore((s) => s.tradeMastery[code]);
  if (!mastery || mastery.puzzlesSolved === 0) return null;

  const trade = TRADES[code];
  const suggested = mastery.suggestedDifficulty;
  const stars = Array.from({ length: 3 }, (_, i) => i < suggested);

  return (
    <div className="mt-3 flex items-center gap-2">
      <div className="flex gap-0.5">
        {stars.map((filled, i) => (
          <span
            key={i}
            className="text-xs"
            style={{ color: filled ? trade.color : "#475569" }}
          >
            {filled ? "\u2605" : "\u2606"}
          </span>
        ))}
      </div>
      <span className="text-[10px] text-text-tertiary">
        {MASTERY_LABELS[suggested] ?? "Building foundations"}
      </span>
    </div>
  );
}

function TradeCard({ code }: { code: TradeCode }) {
  const trade = TRADES[code];
  const puzzleTypeKeys = Object.keys(PUZZLE_TYPES) as PuzzleType[];

  const heroImage = TRADE_HERO_IMAGES[code];

  return (
    <div
      className="overflow-hidden rounded-2xl border transition-all hover:scale-[1.01]"
      style={{ borderColor: `${trade.color}22`, backgroundColor: `${trade.color}06` }}
    >
      {/* Trade hero image */}
      {heroImage && (
        <div className="relative h-20 overflow-hidden rounded-t-xl">
          <Image
            src={heroImage}
            alt={`${trade.name} hero`}
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-current"
            style={{ color: `${trade.color}06` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0C0F1A]/80" />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{trade.icon}</span>
          <div>
            <h3 className="text-sm font-bold" style={{ color: trade.color }}>{trade.name}</h3>
            <p className="text-[11px] text-text-tertiary">{trade.union}</p>
          </div>
          {trade.isSpecialty && (
            <span className="ml-auto rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">PRO</span>
          )}
        </div>

        {/* Mastery indicator */}
        <MasteryIndicator code={code} />

        {/* Puzzle type links */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {puzzleTypeKeys.map((type) => {
            const pt = PUZZLE_TYPES[type];
            return (
              <Link
                key={type}
                href={`/play/${code}/${type}`}
                className="rounded-lg border border-border bg-surface-light px-3 py-2 text-center text-xs transition-colors hover:bg-white/[0.08]"
              >
                <span className="mr-1">{pt.icon}</span>
                {pt.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
