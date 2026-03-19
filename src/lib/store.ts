import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PuzzleResult, PuzzleType } from '@/types/puzzle';
import { TradeCode } from '@/types/trade';
import { getLevel, getLevelProgress, getXPToNextLevel, calculateXP, didLevelUp } from '@/lib/xp-system';
import { createClient } from '@/lib/supabase';

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
  userId: string | null;

  // Actions
  addResult: (result: PuzzleResult) => { xpEarned: number; leveledUp: boolean };
  getCompletedIds: () => string[];
  reset: () => void;
  setUserId: (id: string | null) => void;
  syncFromSupabase: (userId: string) => Promise<void>;
  syncToSupabase: (userId: string) => Promise<void>;
}

const INITIAL_STATE: PlayerProgress & { history: PuzzleResult[]; userId: string | null } = {
  totalXP: 0,
  puzzlesCompleted: 0,
  puzzlesCorrect: 0,
  completedPuzzleIds: [],
  currentStreak: 0,
  bestStreak: 0,
  lastPuzzleDate: null,
  history: [],
  userId: null,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setUserId: (id: string | null) => set({ userId: id }),

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

        // Fire-and-forget sync to Supabase if user is authenticated
        const { userId } = get();
        if (userId) {
          get().syncToSupabase(userId).catch(() => {});
        }

        return { xpEarned: finalXP, leveledUp };
      },

      getCompletedIds: () => get().completedPuzzleIds,

      reset: () => set(INITIAL_STATE),

      syncFromSupabase: async (userId: string) => {
        try {
          const supabase = createClient();
          if (!supabase) return;

          // Fetch remote progress
          const { data: remoteProgress } = await supabase
            .from('user_progress')
            .select('total_xp, puzzles_completed, puzzles_correct, completed_puzzle_ids, current_streak, best_streak, last_puzzle_date')
            .eq('user_id', userId)
            .single();

          // Fetch remote puzzle history
          const { data: remoteHistory } = await supabase
            .from('puzzle_history')
            .select('puzzle_id, puzzle_type, trade, difficulty, xp_earned, correct_count, incorrect_count, total_possible, timestamp')
            .eq('user_id', userId)
            .order('timestamp', { ascending: true });

          const state = get();

          if (remoteProgress) {
            // Merge: take higher XP, union of completed IDs, higher streaks
            const remoteIds: string[] = remoteProgress.completed_puzzle_ids ?? [];
            const mergedIds = [...new Set([...state.completedPuzzleIds, ...remoteIds])];

            set({
              totalXP: Math.max(state.totalXP, remoteProgress.total_xp ?? 0),
              puzzlesCompleted: Math.max(state.puzzlesCompleted, remoteProgress.puzzles_completed ?? 0),
              puzzlesCorrect: Math.max(state.puzzlesCorrect, remoteProgress.puzzles_correct ?? 0),
              completedPuzzleIds: mergedIds,
              currentStreak: Math.max(state.currentStreak, remoteProgress.current_streak ?? 0),
              bestStreak: Math.max(state.bestStreak, remoteProgress.best_streak ?? 0),
              lastPuzzleDate: remoteProgress.last_puzzle_date ?? state.lastPuzzleDate,
            });
          }

          if (remoteHistory && remoteHistory.length > 0) {
            const localIds = new Set(state.history.map((h) => `${h.puzzleId}-${h.timestamp}`));
            const newRemoteResults: PuzzleResult[] = remoteHistory
              .filter((r: any) => !localIds.has(`${r.puzzle_id}-${r.timestamp}`))
              .map((r: any) => ({
                puzzleId: r.puzzle_id,
                puzzleType: r.puzzle_type as PuzzleType,
                trade: r.trade as TradeCode,
                difficulty: r.difficulty,
                xpEarned: r.xp_earned,
                correctCount: r.correct_count,
                incorrectCount: r.incorrect_count,
                totalPossible: r.total_possible,
                timestamp: r.timestamp,
              }));

            if (newRemoteResults.length > 0) {
              set({ history: [...state.history, ...newRemoteResults] });
            }
          }
        } catch {
          // Graceful degradation — continue with local state
        }
      },

      syncToSupabase: async (userId: string) => {
        try {
          const supabase = createClient();
          if (!supabase) return;
          const state = get();

          // Upsert user progress
          await supabase.from('user_progress').upsert(
            {
              user_id: userId,
              total_xp: state.totalXP,
              puzzles_completed: state.puzzlesCompleted,
              puzzles_correct: state.puzzlesCorrect,
              completed_puzzle_ids: state.completedPuzzleIds,
              current_streak: state.currentStreak,
              best_streak: state.bestStreak,
              last_puzzle_date: state.lastPuzzleDate,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' },
          );

          // Insert new puzzle history (upsert by puzzle_id + timestamp to avoid dupes)
          if (state.history.length > 0) {
            const rows = state.history.map((h) => ({
              user_id: userId,
              puzzle_id: h.puzzleId,
              puzzle_type: h.puzzleType,
              trade: h.trade,
              difficulty: h.difficulty,
              xp_earned: h.xpEarned,
              correct_count: h.correctCount,
              incorrect_count: h.incorrectCount,
              total_possible: h.totalPossible,
              timestamp: h.timestamp,
            }));

            await supabase
              .from('puzzle_history')
              .upsert(rows, { onConflict: 'user_id,puzzle_id,timestamp', ignoreDuplicates: true });
          }
        } catch {
          // Graceful degradation — data stays local, syncs next time
        }
      },
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
