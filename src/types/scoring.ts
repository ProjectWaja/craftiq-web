export interface ApprenticeLevel {
  year: number;
  name: string;
  xpRequired: number;
  color: string;
}

export interface PlayerProgress {
  totalXP: number;
  puzzlesCompleted: number;
  puzzlesCorrect: number;
  completedPuzzleIds: string[];
  currentStreak: number;
  bestStreak: number;
  lastPuzzleDate: string | null;
}
