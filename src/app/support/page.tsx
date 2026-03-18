import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support — CraftIQ",
  description: "Get help with CraftIQ. FAQ, account support, and contact information.",
};

const FAQ = [
  {
    q: "What is CraftIQ?",
    a: "CraftIQ is a mobile puzzle game that teaches union trade codes (NEC, IMC, ASHRAE, SMACNA) through interactive challenges. Every puzzle is rooted in real construction project scenarios.",
  },
  {
    q: "Who is CraftIQ for?",
    a: "CraftIQ is built for UA, IBEW, and SMACNA apprentices learning cross-trade knowledge. It's also valuable for journeymen preparing for exams or anyone wanting to sharpen their code knowledge.",
  },
  {
    q: "Is CraftIQ free?",
    a: "Yes! The free tier includes 3 puzzles per day across 5 core trades at difficulty levels 1-2. Upgrade to Pro for unlimited puzzles, all 10 trades, and the full code reference library.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Subscriptions are managed through your device's app store. On iOS, go to Settings > Apple ID > Subscriptions. On Android, go to Play Store > Subscriptions. Cancel at least 24 hours before your renewal date.",
  },
  {
    q: "Can I use CraftIQ offline?",
    a: "Yes! CraftIQ works offline. Your progress syncs automatically when you reconnect. Puzzle completions are queued and uploaded when you're back online.",
  },
  {
    q: "How do I delete my account?",
    a: "Go to Profile > Settings > Delete Account in the app. This permanently removes your account and all associated data from our servers (GDPR compliant).",
  },
  {
    q: "Does my employer cover CraftIQ Pro?",
    a: "Many union training programs and employers with education benefits cover CraftIQ Pro subscriptions. Ask your training director or HR department about education reimbursement.",
  },
  {
    q: "How do bulk/enterprise licenses work?",
    a: "We offer volume discounts for JATC programs and training centers: 20% off for 10+ licenses, 30% for 25+, and 40% for 50+. Contact scoprixlabs@gmail.com for details.",
  },
];

export default function Support() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
      <h1 className="font-mono text-3xl font-bold">Help &amp; Support</h1>
      <p className="mt-2 text-text-secondary">
        Find answers to common questions or reach out to our team.
      </p>

      {/* Contact */}
      <div className="mt-10 rounded-2xl border border-border bg-surface-light p-6">
        <h2 className="font-mono text-lg font-bold">Contact Us</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Can&apos;t find what you need? Email us at{" "}
          <a href="mailto:scoprixlabs@gmail.com" className="text-accent hover:underline">
            scoprixlabs@gmail.com
          </a>{" "}
          and we&apos;ll get back to you within 24 hours.
        </p>
      </div>

      {/* FAQ */}
      <div className="mt-12">
        <h2 className="text-[10px] font-semibold uppercase tracking-widest text-text-disabled">
          Frequently Asked Questions
        </h2>
        <div className="mt-6 space-y-6">
          {FAQ.map((item) => (
            <div key={item.q} className="rounded-2xl border border-border bg-surface-light p-6">
              <h3 className="font-mono text-sm font-bold text-text-primary">{item.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
