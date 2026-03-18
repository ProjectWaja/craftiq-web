import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — CraftIQ",
  description: "CraftIQ privacy policy. How we collect, use, and protect your data.",
};

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
      <h1 className="font-mono text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-text-tertiary">Last updated: March 17, 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="mb-3 font-mono text-lg font-bold text-text-primary">1. Information We Collect</h2>
          <p>
            <strong className="text-text-primary">Account Information:</strong> When you create an account, we collect your email address and display name. Passwords are hashed and never stored in plaintext.
          </p>
          <p className="mt-2">
            <strong className="text-text-primary">Usage Data:</strong> We collect puzzle completion data, scores, streaks, and progress to provide our service. This data is tied to your account and used to personalize your experience.
          </p>
          <p className="mt-2">
            <strong className="text-text-primary">Device Information:</strong> We collect basic device information (OS version, app version) for crash reporting and compatibility. We do not collect device identifiers for advertising purposes.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-mono text-lg font-bold text-text-primary">2. How We Use Your Information</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>To provide, maintain, and improve CraftIQ</li>
            <li>To track your progress, XP, and achievements</li>
            <li>To display leaderboards and community features</li>
            <li>To send push notifications (with your permission)</li>
            <li>To process subscription payments via RevenueCat</li>
            <li>To respond to support requests</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-mono text-lg font-bold text-text-primary">3. Data Storage &amp; Security</h2>
          <p>
            Your data is stored securely on Supabase (PostgreSQL) with row-level security policies. Authentication sessions use platform-native secure storage (iOS Keychain, Android Keystore). All data is encrypted in transit via TLS.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-mono text-lg font-bold text-text-primary">4. Third-Party Services</h2>
          <ul className="list-inside list-disc space-y-1">
            <li><strong className="text-text-primary">Supabase:</strong> Backend infrastructure and authentication</li>
            <li><strong className="text-text-primary">RevenueCat:</strong> Subscription management and payment processing</li>
            <li><strong className="text-text-primary">Expo:</strong> Push notifications and over-the-air updates</li>
          </ul>
          <p className="mt-2">We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="mb-3 font-mono text-lg font-bold text-text-primary">5. Your Rights (GDPR &amp; CCPA)</h2>
          <p>You have the right to:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Access your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and all associated data</li>
            <li>Export your data in a portable format</li>
            <li>Opt out of non-essential communications</li>
          </ul>
          <p className="mt-2">
            To delete your account, use the &quot;Delete Account&quot; option in the app&apos;s profile settings. This permanently removes your data from our systems.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-mono text-lg font-bold text-text-primary">6. Children&apos;s Privacy</h2>
          <p>
            CraftIQ is designed for trade apprentices and professionals (typically 18+). We do not knowingly collect information from children under 13. If you believe a child has provided us with personal information, please contact us.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-mono text-lg font-bold text-text-primary">7. Contact Us</h2>
          <p>
            If you have questions about this privacy policy, contact us at{" "}
            <a href="mailto:privacy@craftiq.org" className="text-accent hover:underline">privacy@craftiq.org</a>.
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
