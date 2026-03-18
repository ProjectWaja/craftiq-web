import { ApprenticeLevel } from '@/types/scoring';
import { APPRENTICE_LEVELS } from '@/constants/levels';
import { STREAK_THRESHOLDS } from '@/constants/scoring';

/** Get the current apprentice level for a given XP total */
export function getLevel(totalXP: number): ApprenticeLevel {
  for (let i = APPRENTICE_LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= APPRENTICE_LEVELS[i].xpRequired) {
      return APPRENTICE_LEVELS[i];
    }
  }
  return APPRENTICE_LEVELS[0];
}

/** Get the next level milestone, or null if max level */
export function getNextLevel(totalXP: number): ApprenticeLevel | null {
  const current = getLevel(totalXP);
  const idx = APPRENTICE_LEVELS.findIndex((l) => l.year === current.year);
  if (idx < APPRENTICE_LEVELS.length - 1) {
    return APPRENTICE_LEVELS[idx + 1];
  }
  return null;
}

/** Get progress percentage toward next level (0-100) */
export function getLevelProgress(totalXP: number): number {
  const current = getLevel(totalXP);
  const next = getNextLevel(totalXP);
  if (!next) return 100;

  const range = next.xpRequired - current.xpRequired;
  const progress = totalXP - current.xpRequired;
  return Math.min(100, Math.floor((progress / range) * 100));
}

/** Get XP remaining to next level */
export function getXPToNextLevel(totalXP: number): number | null {
  const next = getNextLevel(totalXP);
  if (!next) return null;
  return next.xpRequired - totalXP;
}

/** Calculate streak bonus multiplier */
export function getStreakMultiplier(streakDays: number): number {
  for (const threshold of STREAK_THRESHOLDS) {
    if (streakDays >= threshold.minDays) {
      return threshold.multiplier;
    }
  }
  return 0;
}

/** Calculate final XP with streak bonus applied */
export function calculateXP(baseXP: number, streakDays: number): number {
  const multiplier = getStreakMultiplier(streakDays);
  const bonus = Math.floor(baseXP * multiplier);
  return baseXP + bonus;
}

/** Check if a level-up occurred */
export function didLevelUp(previousXP: number, newXP: number): boolean {
  const prevLevel = getLevel(previousXP);
  const newLevel = getLevel(newXP);
  return newLevel.year > prevLevel.year;
}
