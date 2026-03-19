"use client";

import Link from "next/link";
import Image from "next/image";
import { TRADES, PUZZLE_TYPES, BASE_TRADE_CODES, SPECIALTY_CODES } from "@/constants/trades";
import { TradeCode } from "@/types/trade";
import { PuzzleType } from "@/types/puzzle";
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
