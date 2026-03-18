// AUTO-SYNCED from craftiq (mobile) — do not edit directly
// Run `npm run sync` in craftiq to update

// === SHARED (synced to craftiq-web) ===

export interface ApprenticeLevel {
  year: number;
  name: string;
  xpRequired: number;
  color: string;
}

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastPuzzleDate: string | null;
}
