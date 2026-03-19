'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'signin' | 'signup';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<Tab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSubmitting(false);
    setSignUpSuccess(false);
  };

  const switchTab = (newTab: Tab) => {
    resetForm();
    setTab(newTab);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);
    const { error: authError } = await signIn(email, password);
    setSubmitting(false);

    if (authError) {
      setError(authError.message);
    } else {
      handleClose();
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const { error: authError } = await signUp(email, password);
    setSubmitting(false);

    if (authError) {
      setError(authError.message);
    } else {
      setSignUpSuccess(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="mx-4 w-full max-w-md rounded-2xl border border-border bg-surface p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="text-text-tertiary hover:text-text-primary transition-colors"
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Title */}
        <h2 className="mb-6 text-center font-mono text-xl font-bold text-text-primary">
          {tab === 'signin' ? 'Welcome Back' : 'Create Account'}
        </h2>

        {/* Tabs */}
        <div className="mb-6 flex rounded-xl bg-surface-light p-1">
          <button
            onClick={() => switchTab('signin')}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
              tab === 'signin'
                ? 'bg-accent text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => switchTab('signup')}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
              tab === 'signup'
                ? 'bg-accent text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Sign Up Success */}
        {signUpSuccess ? (
          <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-4 text-center">
            <p className="text-sm font-semibold text-green-400">Check your email</p>
            <p className="mt-1 text-xs text-text-secondary">
              We sent a confirmation link to <strong className="text-text-primary">{email}</strong>.
              Click it to activate your account.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Got it
            </button>
          </div>
        ) : (
          <form onSubmit={tab === 'signin' ? handleSignIn : handleSignUp}>
            {/* Email */}
            <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-text-disabled">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="mb-4 w-full rounded-xl border border-border bg-surface-light px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-colors"
            />

            {/* Password */}
            <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-text-disabled">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Min. 8 characters"
              className="mb-4 w-full rounded-xl border border-border bg-surface-light px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-colors"
            />

            {/* Confirm Password (sign up only) */}
            {tab === 'signup' && (
              <>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-text-disabled">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Re-enter password"
                  className="mb-4 w-full rounded-xl border border-border bg-surface-light px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-colors"
                />
              </>
            )}

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting
                ? 'Loading...'
                : tab === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
