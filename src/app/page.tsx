import Image from "next/image";
import TradeCards from "@/components/TradeCards";

const TRADES = [
  { name: "HVAC / Sheet Metal", code: "hvac", color: "#3B82F6", union: "SMACNA / UA", icon: "\u{1F300}" },
  { name: "Plumbing", code: "plumbing", color: "#10B981", union: "UA Local", icon: "\u{1F527}" },
  { name: "Electrical", code: "electrical", color: "#F59E0B", union: "IBEW Local", icon: "\u26A1" },
  { name: "Pipefitting", code: "pipefitting", color: "#8B5CF6", union: "UA Local", icon: "\u{1F529}" },
  { name: "Building Controls", code: "controls", color: "#EC4899", union: "IBEW / NECA", icon: "\u{1F39B}\uFE0F" },
  { name: "Data Center Design", code: "data-center", color: "#06B6D4", union: "IBEW / SMACNA / UA", icon: "\u{1F5A5}\uFE0F", premium: true },
  { name: "Central Plant Design", code: "central-plant", color: "#0EA5E9", union: "UA / SMACNA", icon: "\u{1F3ED}", premium: true },
  { name: "Healthcare Facilities", code: "healthcare", color: "#14B8A6", union: "UA / IBEW", icon: "\u{1F3E5}", premium: true },
  { name: "High-Rise MEP", code: "high-rise", color: "#6366F1", union: "UA / IBEW / SMACNA", icon: "\u{1F3D9}\uFE0F", premium: true },
  { name: "Industrial Process", code: "industrial", color: "#D97706", union: "UA / IBEW", icon: "\u2699\uFE0F", premium: true },
];

const PUZZLE_TYPES = [
  {
    name: "What's Wrong?",
    count: 88,
    description: "Spot code violations in real installations. Tap the component that doesn't meet code.",
    image: "/images/puzzles/whats-wrong-01.jpg",
  },
  {
    name: "What's Missing?",
    count: 73,
    description: "Identify missing components from a complete-looking install before it fails inspection.",
    image: "/images/puzzles/whats-missing-01.jpg",
  },
  {
    name: "Build the Assembly",
    count: 60,
    description: "Drag and drop parts into the correct assembly order. Get the sequence wrong, it won't pass.",
    image: "/images/puzzles/build-the-assembly-01.jpg",
  },
  {
    name: "Size It Right",
    count: 139,
    description: "Calculate correct component sizing using real formulas from ASHRAE, NEC, and SMACNA standards.",
    image: "/images/puzzles/size-it-right-01.jpg",
  },
  {
    name: "Sequence the Install",
    count: 83,
    description: "Reorder shuffled installation steps. Real-world sequencing matters on the jobsite.",
    image: "/images/puzzles/sequence-the-install-01.jpg",
  },
  {
    name: "Code or No Code?",
    count: 142,
    description: "Does this scenario pass inspection or not? Binary judgment calls rooted in actual code sections.",
    image: "/images/puzzles/code-or-no-code-01.jpg",
  },
];

const STATS = [
  { value: "825+", label: "Puzzles" },
  { value: "10", label: "Trades" },
  { value: "6", label: "Puzzle Types" },
  { value: "50+", label: "Code Standards" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-40 md:pb-32">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/app/marketing-hero-image-01.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-glow px-4 py-1.5">
              <span className="text-xs font-semibold text-accent">NEW</span>
              <span className="text-xs text-text-secondary">825+ puzzles from real construction projects</span>
            </div>

            <h1 className="font-mono text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Stop Memorizing Code Books.{" "}
              <span className="bg-gradient-to-r from-accent to-controls bg-clip-text text-transparent">
                Start Solving.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
              Master NEC, IMC, ASHRAE &amp; SMACNA codes through addictive puzzles
              rooted in real-world installations. Built for UA, IBEW &amp; SMACNA apprentices.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/play"
                className="w-full rounded-xl bg-accent px-8 py-4 text-center text-lg font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/30 sm:w-auto"
              >
                Play Free Now
              </a>
              <a
                href="#features"
                className="w-full rounded-xl border border-border-medium bg-surface-light px-8 py-4 text-center text-lg font-semibold text-text-primary transition-colors hover:bg-white/[0.08] sm:w-auto"
              >
                See How It Works
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-surface-light p-6 text-center"
              >
                <div className="font-mono text-3xl font-extrabold text-accent">{stat.value}</div>
                <div className="mt-1 text-sm text-text-tertiary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Screenshots */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="relative h-[500px] w-[240px] flex-shrink-0 snap-center overflow-hidden rounded-3xl border border-border shadow-2xl md:h-[600px] md:w-[288px]"
              >
                <Image
                  src={`/images/screenshots/screenshot-0${n}.png`}
                  alt={`CraftIQ app screenshot ${n}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features / Puzzle Types — now with illustrations */}
      <section id="features" className="bg-blueprint-iso py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-text-disabled">6 Puzzle Types</h2>
            <p className="mt-3 font-mono text-3xl font-bold md:text-4xl">
              Learn by Doing, Not Reading
            </p>
            <p className="mt-4 text-base leading-relaxed text-text-secondary">
              Every puzzle is rooted in real installation scenarios. Every explanation cites the actual code section.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PUZZLE_TYPES.map((puzzle) => (
              <a
                key={puzzle.name}
                href="/play"
                className="group overflow-hidden rounded-2xl border border-border bg-surface-light transition-all hover:border-accent/30 hover:bg-accent-glow"
              >
                {/* Puzzle illustration */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={puzzle.image}
                    alt={puzzle.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-light via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 rounded-full bg-accent/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {puzzle.count} puzzles
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-mono text-lg font-bold">{puzzle.name}</h3>
                  <p className="mt-2 text-base leading-relaxed text-text-secondary">
                    {puzzle.description}
                  </p>
                  <span className="mt-3 inline-block text-xs font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">
                    Try it &rarr;
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Trades Grid */}
      <section id="trades" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-text-disabled">10 Trades</h2>
            <p className="mt-3 font-mono text-3xl font-bold md:text-4xl">
              Your Trade. Your Code. Your Puzzles.
            </p>
            <p className="mt-4 text-base leading-relaxed text-text-secondary">
              5 core trades free. 5 premium specialty trades for advanced cross-trade knowledge.
            </p>
          </div>

          <TradeCards trades={TRADES} />
        </div>
      </section>

      {/* How It Works — with onboarding crew illustrations */}
      <section className="bg-blueprint-grid py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-text-disabled">How It Works</h2>
            <p className="mt-3 font-mono text-3xl font-bold md:text-4xl">
              Five Minutes a Day Builds Real Code Knowledge
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Pick Your Trade",
                description: "Choose from HVAC, Plumbing, Electrical, Pipefitting, Controls, and 5 premium specialties.",
                image: "/images/app/onboarding-screens-01.jpg",
              },
              {
                step: "02",
                title: "Solve Real Puzzles",
                description: "Every puzzle is based on real installation scenarios from actual construction project specs and plans.",
                image: "/images/app/onboarding-screens-02.jpg",
              },
              {
                step: "03",
                title: "Learn the Code",
                description: "Every answer explanation cites the actual code section — NEC, IMC, ASHRAE, SMACNA. You learn the 'why' behind every answer.",
                image: "/images/app/onboarding-screens-03.jpg",
              },
            ].map((item) => (
              <div key={item.step} className="overflow-hidden rounded-2xl border border-border bg-surface-light">
                <div className="relative h-52">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-light via-surface-light/30 to-transparent" />
                  <span className="absolute bottom-4 left-5 font-mono text-4xl font-black text-accent/40">{item.step}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-mono text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-text-secondary">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Standards — with Code Insight illustration */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* Code Insight image */}
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/images/features/knowledge-tip-modal-01.jpg"
                alt="Code Insight — NEC Article 110.26 clearance requirements with correct vs incorrect installation diagrams"
                width={600}
                height={600}
                className="w-full rounded-2xl"
              />
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-text-disabled">
                Real Standards
              </h2>
              <p className="mt-3 font-mono text-3xl font-bold md:text-4xl">
                Every Answer Cites the Actual Code
              </p>
              <p className="mt-4 text-base leading-relaxed text-text-secondary">
                No generic trivia. Every puzzle references real code standards used on the jobsite.
                After each puzzle, you see the exact code section, correct vs. incorrect diagrams,
                and why it matters.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  "NEC", "IMC", "IPC", "ASHRAE 90.1", "ASHRAE 62.1",
                  "SMACNA", "NFPA 90A", "NFPA 96", "IEEE 519", "ASME B31.9",
                  "UL 508", "ASCE 7", "ASTM", "California T-24",
                ].map((code) => (
                  <span
                    key={code}
                    className="rounded-lg border border-border bg-surface-light px-3 py-1.5 font-mono text-xs text-text-secondary"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification — badges, level-up, streak, leaderboard, avatars */}
      <section className="bg-blueprint-hex py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-text-disabled">
              Gamification
            </h2>
            <p className="mt-3 font-mono text-3xl font-bold md:text-4xl">
              Earn Your Stripes
            </p>
            <p className="mt-4 text-base leading-relaxed text-text-secondary">
              Track your journey from 1st Year to Master with XP, streaks, achievements, and leaderboard rankings.
            </p>
          </div>

          {/* Feature images row */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { image: "/images/features/level-up-celebration-overlay-01.jpg", label: "Level Up Celebrations" },
              { image: "/images/features/daily-challenge-streak-calendar-background-01.jpg", label: "Daily Streak Calendar" },
              { image: "/images/features/leaderboard-community-background-01.jpg", label: "Community Leaderboard" },
              { image: "/images/features/progress-achievement-card-01.jpg", label: "Achievement Tracking" },
            ].map((item) => (
              <div key={item.label} className="overflow-hidden rounded-2xl border border-border">
                <div className="relative h-48">
                  <Image src={item.image} alt={item.label} fill className="object-cover" />
                </div>
                <div className="bg-surface-light p-3 text-center">
                  <span className="text-xs font-semibold text-text-secondary">{item.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Achievement badges */}
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-4 gap-4 sm:grid-cols-6">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="overflow-hidden rounded-xl">
                <Image
                  src={`/images/badges/achievement-badges-${String(i + 1).padStart(2, "0")}.jpg`}
                  alt={`Achievement badge ${i + 1}`}
                  width={120}
                  height={120}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Level progression */}
          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-5">
            {[
              { level: "1st Year", xp: "0", color: "#94A3B8", badge: "/images/level-badges/level-1.png" },
              { level: "2nd Year", xp: "500", color: "#3B82F6", badge: "/images/level-badges/level-2.png" },
              { level: "3rd Year", xp: "1,500", color: "#10B981", badge: "/images/level-badges/level-3.png" },
              { level: "4th Year", xp: "3,000", color: "#F59E0B", badge: "/images/level-badges/level-4.jpeg" },
              { level: "Journeyman", xp: "5,000", color: "#8B5CF6", badge: "/images/level-badges/level-5.png" },
              { level: "Master", xp: "8,000", color: "#EC4899", badge: "/images/level-badges/level-6.jpeg" },
            ].map((lvl) => (
              <div
                key={lvl.level}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className="overflow-hidden rounded-xl border-2 p-1"
                  style={{
                    borderColor: `${lvl.color}44`,
                    backgroundColor: `${lvl.color}0D`,
                  }}
                >
                  <Image
                    src={lvl.badge}
                    alt={`${lvl.level} badge`}
                    width={80}
                    height={80}
                    className="rounded-lg"
                  />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold" style={{ color: lvl.color }}>{lvl.level}</div>
                  <div className="text-[10px] text-text-tertiary">{lvl.xp} XP</div>
                </div>
              </div>
            ))}
          </div>

          {/* Trade avatars row */}
          <div className="mx-auto mt-12 max-w-2xl">
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-text-disabled">
              Choose Your Avatar
            </p>
            <div className="flex justify-center gap-4">
              {[
                "avatar-hvac",
                "avatar-electrical",
                "avatar-controls",
                "avatar-hydronics-plumbing-andpipe-fitter",
                "avatar-fire-protection",
                "avatar-concrete",
              ].map((name) => (
                <div key={name} className="h-16 w-16 overflow-hidden rounded-full border-2 border-border transition-all hover:border-accent hover:scale-110">
                  <Image
                    src={`/images/avatars/${name}.jpg`}
                    alt={name.replace("avatar-", "").replace(/-/g, " ")}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-blueprint-grid py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-text-disabled">Pricing</h2>
            <p className="mt-3 font-mono text-3xl font-bold md:text-4xl">
              Start Free. Go Pro When You&apos;re Ready.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
            {/* Free */}
            <div className="rounded-2xl border border-border bg-surface-light p-8">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-text-disabled">Free</h3>
              <div className="mt-4">
                <span className="font-mono text-5xl font-extrabold">$0</span>
              </div>
              <ul className="mt-8 space-y-3">
                {[
                  "3 puzzles per day",
                  "Difficulty levels 1-2",
                  "All 5 core trades",
                  "Progress tracking",
                  "Daily code tips",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-base text-text-secondary">
                    <span className="text-success">&#10003;</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="/play"
                className="mt-8 block rounded-xl border border-border-medium bg-surface px-6 py-3 text-center text-sm font-semibold text-text-primary transition-colors hover:bg-white/[0.08]"
              >
                Play Free Now
              </a>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl border-2 border-accent bg-accent-glow p-8">
              <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                MOST POPULAR
              </span>
              <h3 className="text-[10px] font-semibold uppercase tracking-widest text-accent">Pro</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-mono text-5xl font-extrabold">$9.99</span>
                <span className="text-text-tertiary">/month</span>
              </div>
              <p className="mt-2 text-sm text-text-secondary">
                or <span className="font-semibold text-success">$79.99/year</span>{" "}
                <span className="rounded bg-success/15 px-1.5 py-0.5 text-xs font-semibold text-success">
                  Save 33%
                </span>
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Unlimited puzzles",
                  "All difficulty levels",
                  "All 10 trades (base + specialty)",
                  "Full code reference library",
                  "Spaced repetition reviews",
                  "Priority support",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-base text-text-primary">
                    <span className="text-accent">&#10003;</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#download"
                className="mt-8 block rounded-xl bg-accent px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/30"
              >
                Start Pro Free Trial
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise — with crew illustration */}
      <section id="enterprise" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="overflow-hidden rounded-2xl border border-border">
            <div className="grid md:grid-cols-2">
              {/* Illustration side */}
              <div className="relative hidden h-full min-h-[400px] md:block">
                <Image
                  src="/images/banners/enterprise.png"
                  alt="Enterprise JATC training programs"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface-light/80" />
              </div>

              {/* Content side */}
              <div className="bg-surface-light p-10 md:p-14">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-text-disabled">
                  For Training Programs
                </h2>
                <p className="mt-3 font-mono text-3xl font-bold">
                  Bulk Licensing for JATC &amp; Training Centers
                </p>
                <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                  Training directors and JATC coordinators: CraftIQ offers volume discounts
                  for apprenticeship programs. Bring CraftIQ to your entire training center.
                </p>

                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[
                    { seats: "10+", discount: "20%" },
                    { seats: "25+", discount: "30%" },
                    { seats: "50+", discount: "40%" },
                  ].map((tier) => (
                    <div key={tier.seats} className="rounded-xl border border-border bg-background p-4 text-center">
                      <div className="font-mono text-2xl font-extrabold text-accent">{tier.discount}</div>
                      <div className="mt-1 text-xs text-text-tertiary">{tier.seats} licenses</div>
                    </div>
                  ))}
                </div>

                <a
                  href="mailto:scoprixlabs@gmail.com"
                  className="mt-8 inline-block rounded-xl bg-accent px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:shadow-xl"
                >
                  Contact for Bulk Pricing
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download CTA — with XP gauge image */}
      <section id="download" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative overflow-hidden rounded-2xl border border-accent/20 p-10 text-center md:p-20">
            {/* Background images */}
            <div className="absolute inset-0 opacity-10">
              <Image src="/images/banners/play-browser.png" alt="" fill className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background/95 to-controls/10" />

            <div className="relative">
              <h2 className="font-mono text-3xl font-bold md:text-5xl">
                Ready to Level Up?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary">
                Join thousands of union apprentices mastering trade codes the smart way.
                Free to start — no credit card required.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="/play"
                  className="flex h-14 w-56 items-center justify-center rounded-xl bg-accent text-white font-semibold text-sm shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/30"
                >
                  Play Free in Browser
                </a>
                <a
                  href="#"
                  className="flex h-14 w-48 items-center justify-center rounded-xl bg-white text-background font-semibold text-sm transition-opacity hover:opacity-90"
                >
                  <span className="mr-2 text-xl">&#63743;</span> App Store
                </a>
                <a
                  href="#"
                  className="flex h-14 w-48 items-center justify-center rounded-xl bg-white text-background font-semibold text-sm transition-opacity hover:opacity-90"
                >
                  <span className="mr-2 text-xl">&#9654;</span> Google Play
                </a>
              </div>

              <p className="mt-6 text-sm text-text-tertiary">
                Does your employer offer education benefits? Many union training programs cover CraftIQ Pro.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
