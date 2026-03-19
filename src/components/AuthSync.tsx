'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGameStore } from '@/lib/store';

export default function AuthSync() {
  const { user } = useAuth();
  const setUserId = useGameStore((s) => s.setUserId);
  const syncFromSupabase = useGameStore((s) => s.syncFromSupabase);
  const syncToSupabase = useGameStore((s) => s.syncToSupabase);
  const prevUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const newUserId = user?.id ?? null;
    const prevUserId = prevUserIdRef.current;

    if (newUserId && !prevUserId) {
      // User just logged in — sync from Supabase, then push local state
      setUserId(newUserId);
      syncFromSupabase(newUserId).then(() => {
        syncToSupabase(newUserId).catch(() => {});
      });
    } else if (!newUserId && prevUserId) {
      // User logged out — clear userId but keep local state
      setUserId(null);
    }

    prevUserIdRef.current = newUserId;
  }, [user, setUserId, syncFromSupabase, syncToSupabase]);

  return null;
}
