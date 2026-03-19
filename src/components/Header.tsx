"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, isAuthenticated, signOut, loading } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/images/app/icon.png"
            alt="CraftIQ"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="font-mono text-xl font-bold tracking-tight text-text-primary">
            CraftIQ
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/play" className="text-sm font-semibold text-accent hover:text-accent/80 transition-colors">
            Play Now
          </Link>
          <a href="/#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Features
          </a>
          <a href="/#trades" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Trades
          </a>
          <a href="/#pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Pricing
          </a>
          <a
            href="/#download"
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Download
          </a>
          {!loading && (
            isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent"
                  title={user?.email ?? ''}
                >
                  {user?.email?.charAt(0).toUpperCase() ?? '?'}
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors"
              >
                Sign In
              </button>
            )
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`h-0.5 w-6 bg-text-secondary transition-all ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-text-secondary transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-text-secondary transition-all ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4 px-6 py-6">
            <Link href="/play" onClick={() => setMenuOpen(false)} className="font-semibold text-accent">Play Now</Link>
            <a href="/#features" onClick={() => setMenuOpen(false)} className="text-text-secondary hover:text-text-primary">Features</a>
            <a href="/#trades" onClick={() => setMenuOpen(false)} className="text-text-secondary hover:text-text-primary">Trades</a>
            <a href="/#pricing" onClick={() => setMenuOpen(false)} className="text-text-secondary hover:text-text-primary">Pricing</a>
            <a
              href="/#download"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-xl bg-accent px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Download
            </a>
            {!loading && (
              isAuthenticated ? (
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                    {user?.email?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                  <span className="text-sm text-text-secondary truncate flex-1">{user?.email}</span>
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setAuthModalOpen(true); setMenuOpen(false); }}
                  className="mt-2 rounded-xl border border-accent/30 px-5 py-3 text-center text-sm font-semibold text-accent"
                >
                  Sign In
                </button>
              )
            )}
          </div>
        </div>
      )}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
}
