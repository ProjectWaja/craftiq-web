import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <img src="/images/app/icon.png" alt="CraftIQ" width={32} height={32} className="rounded-lg" />
              <span className="font-mono text-lg font-bold text-text-primary">CraftIQ</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-text-tertiary">
              Master trade codes through puzzles. Built for UA, IBEW &amp; SMACNA apprentices.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-disabled">Product</h4>
            <ul className="space-y-2">
              <li><a href="/#features" className="text-base text-text-secondary hover:text-text-primary transition-colors">Features</a></li>
              <li><a href="/#pricing" className="text-base text-text-secondary hover:text-text-primary transition-colors">Pricing</a></li>
              <li><a href="/#trades" className="text-base text-text-secondary hover:text-text-primary transition-colors">Trades</a></li>
              <li><a href="/#enterprise" className="text-base text-text-secondary hover:text-text-primary transition-colors">Enterprise</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-disabled">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy-policy" className="text-base text-text-secondary hover:text-text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-base text-text-secondary hover:text-text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-disabled">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/support" className="text-base text-text-secondary hover:text-text-primary transition-colors">Help &amp; FAQ</Link></li>
              <li><a href="mailto:scoprixlabs@gmail.com" className="text-base text-text-secondary hover:text-text-primary transition-colors">scoprixlabs@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-text-tertiary">
            &copy; {new Date().getFullYear()} Scoprix LLC. All rights reserved.
          </p>
          <p className="text-xs text-text-tertiary">
            Made for the trades that build America.
          </p>
        </div>
      </div>
    </footer>
  );
}
