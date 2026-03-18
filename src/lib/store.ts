import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PuzzleResult, PuzzleType } from '@/types/puzzle';
import { TradeCode } from '@/types/trade';
import { getLevel, getLevelProgress, getXPToNextLevel, calculateXP, didLevelUp } from '@/lib/xp-system';

interface PlayerProgress {
  totalXP: number;
  puzzlesCompleted: number;
  puzzlesCorrect: number;
  completedPuzzleIds: string[];
  currentStreak: number;
  bestStreak: number;
  lastPuzzleDate: string | null;
}

interface GameState extends PlayerProgress {
  history: PuzzleResult[];

  // Actions
  addResult: (result: PuzzleResult) => { xpEarned: number; leveledUp: boolean };
  getCompletedIds: () => string[];
  reset: () => void;
}

const INITIAL_STATE: PlayerProgress & { history: PuzzleResult[] } = {
  totalXP: 0,
  puzzlesCompleted: 0,
  puzzlesCorrect: 0,
  completedPuzzleIds: [],
  currentStreak: 0,
  bestStreak: 0,
  lastPuzzleDate: null,
  history: [],
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      addResult: (result: PuzzleResult) => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const prevXP = state.totalXP;

        // Update streak
        let newStreak = state.currentStreak;
        if (state.lastPuzzleDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          if (state.lastPuzzleDate === yesterdayStr) {
            newStreak = state.currentStreak + 1;
          } else if (state.lastPuzzleDate !== today) {
            newStreak = 1;
          }
        }

        // Calculate XP with streak bonus
        const finalXP = calculateXP(result.xpEarned, newStreak);
        const newTotalXP = prevXP + finalXP;
        const leveledUp = didLevelUp(prevXP, newTotalXP);
        const isCorrect = result.incorrectCount === 0 && result.correctCount === result.totalPossible;

        set({
          totalXP: newTotalXP,
          puzzlesCompleted: state.puzzlesCompleted + 1,
          puzzlesCorrect: state.puzzlesCorrect + (isCorrect ? 1 : 0),
          completedPuzzleIds: [...state.completedPuzzleIds, result.puzzleId],
          currentStreak: newStreak,
          bestStreak: Math.max(state.bestStreak, newStreak),
          lastPuzzleDate: today,
          history: [...state.history, { ...result, xpEarned: finalXP }],
        });

        return { xpEarned: finalXP, leveledUp };
      },

      getCompletedIds: () => get().completedPuzzleIds,

      reset: () => set(INITIAL_STATE),
    }),
    {
      name: 'craftiq-game',
    },
  ),
);

// Derived selectors
export const useLevel = () => useGameStore((s) => getLevel(s.totalXP));
export const useLevelProgress = () => useGameStore((s) => getLevelProgress(s.totalXP));
export const useXPToNext = () => useGameStore((s) => getXPToNextLevel(s.totalXP));
