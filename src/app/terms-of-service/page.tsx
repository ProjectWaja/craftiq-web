import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — CraftIQ",
  description: "CraftIQ terms of service and conditions of use.",
};

export default function TermsOfService() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
      <h1 className="font-mono text-3xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-sm text-text-tertiary">Last updated: March 17, 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="mb-3 font-mono text-lg font-bold text-text-primary">1. Acceptance of Terms</h2>
          <p>
            By downloading, installing, or using CraftIQ (&quot;the App&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the App.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-mono text-lg font-bold text-text-primary">2. Description of Service</h2>
          <p>
            CraftIQ is an educational mobile application that teaches trade codes through interactive puzzles. The App is designed for informational and educational purposes only. CraftIQ is not a substitute for professional training, licensed instruction, or official code books.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-mono text-lg font-bold text-text-primary">3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information and to update it as needed. One account per person — sharing accounts is not permitted.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-mono text-lg font-bold text-text-primary">4. Subscriptions &amp; Payments</h2>
          <p>
            CraftIQ offers free and paid subscription tiers. Paid subscriptions are processed through the Apple App Store or Google Play Store via RevenueCat. Subscription terms, billing cycles, and cancellation policies are governed by the respective app store&apos;s terms.
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Subscriptions auto-renew unless cancelled at least 24 hours before the end of the current period</li>
            <li>You can manage or cancel subscriptions through your device&apos;s app store settings</li>
            <li>Promo codes are single-use and non-transferable unless otherwise stated</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-mono text-lg font-bold text-text-primary">5. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Reverse engineer, decompile, or disassemble the App</li>
            <li>Attempt to manipulate scores, XP, or leaderboard rankings</li>
            <li>Share or redistribute puzzle content outside the App</li>
            <li>Use the App for any unlawful purpose</li>
            <li>Impersonate another user or entity</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-mono text-lg font-bold text-text-primary">6. Intellectual Property</h2>
          <p>
            All content in CraftIQ — including puzzles, explanations, illustrations, and code references — is owned by Scoprix LLC. Code standards referenced (NEC, IMC, ASHRAE, etc.) are cited for educational purposes under fair use. CraftIQ is not affiliated with or endorsed by any standards body.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-mono text-lg font-bold text-text-primary">7. Disclaimer</h2>
          <p>
            CraftIQ is provided &quot;as is&quot; without warranty of any kind. The educational content is for learning purposes and should not be used as the sole reference for code compliance decisions on the jobsite. Always consult the current edition of applicable codes and a qualified professional.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-mono text-lg font-bold text-text-primary">8. Limitation of Liability</h2>
          <p>
            Scoprix LLC shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the App. Our total liability shall not exceed the amount you paid for the App in the 12 months preceding the claim.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-mono text-lg font-bold text-text-primary">9. Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the App after changes constitutes acceptance of the new terms. We will notify users of material changes via the App or email.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-mono text-lg font-bold text-text-primary">10. Contact</h2>
          <p>
            Questions about these terms? Contact us at{" "}
            <a href="mailto:legal@craftiq.org" className="text-accent hover:underline">legal@craftiq.org</a>.
          </p>
          <p className="mt-2">
            Scoprix LLC<br />
            United States
          </p>
        </section>
      </div>
    </div>
  );
}
