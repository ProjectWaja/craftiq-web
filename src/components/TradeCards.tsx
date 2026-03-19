"use client";

import Image from "next/image";

interface Trade {
  name: string;
  code: string;
  color: string;
  icon: string;
  union: string;
  premium?: boolean;
}

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

function TradeCard({ trade }: { trade: Trade }) {
  const heroImage = TRADE_HERO_IMAGES[trade.code];

  return (
    <a
      href={`/play/${trade.code}`}
      className="group relative overflow-hidden rounded-2xl border-2 p-6 text-center transition-all duration-300 hover:scale-[1.04] hover:-translate-y-1"
      style={{
        borderColor: `${trade.color}33`,
        backgroundColor: `${trade.color}0A`,
        boxShadow: `0 0 0 0 ${trade.color}00`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${trade.color}66`;
        e.currentTarget.style.backgroundColor = `${trade.color}15`;
        e.currentTarget.style.boxShadow = `0 0 30px ${trade.color}20, 0 0 60px ${trade.color}10`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${trade.color}33`;
        e.currentTarget.style.backgroundColor = `${trade.color}0A`;
        e.currentTarget.style.boxShadow = `0 0 0 0 ${trade.color}00`;
      }}
    >
      {/* Hero image background at low opacity */}
      {heroImage && (
        <div className="absolute inset-0 opacity-20">
          <Image
            src={heroImage}
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0C0F1A]/90" />
        </div>
      )}

      {trade.premium && (
        <span className="absolute -top-0.5 right-3 rounded-b-lg bg-[#8B5CF6] px-2 py-0.5 text-[9px] font-bold text-white">
          PRO
        </span>
      )}
      <span className="relative block text-4xl transition-transform duration-300 group-hover:scale-110">
        {trade.icon}
      </span>
      <h3 className="relative mt-3 font-mono text-sm font-bold" style={{ color: trade.color }}>
        {trade.name}
      </h3>
      <p className="relative mt-1 text-[11px] text-text-tertiary">{trade.union}</p>
      <span
        className="relative mt-3 inline-block rounded-lg px-3 py-1 text-[11px] font-semibold opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ backgroundColor: `${trade.color}22`, color: trade.color }}
      >
        Play Now &rarr;
      </span>
    </a>
  );
}

export default function TradeCards({ trades }: { trades: Trade[] }) {
  const core = trades.filter((t) => !t.premium);
  const premium = trades.filter((t) => t.premium);

  return (
    <>
      <div className="mt-12">
        <h3 className="mb-6 text-center text-[10px] font-semibold uppercase tracking-widest text-text-disabled">
          Core Trades — Free
        </h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {core.map((trade) => (
            <TradeCard key={trade.code} trade={trade} />
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="mb-6 text-center text-[10px] font-semibold uppercase tracking-widest text-text-disabled">
          Premium Specialties
        </h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {premium.map((trade) => (
            <TradeCard key={trade.code} trade={trade} />
          ))}
        </div>
      </div>
    </>
  );
}
