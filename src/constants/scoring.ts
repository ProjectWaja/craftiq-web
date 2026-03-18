// What's Wrong scoring
export const WHATS_WRONG_CORRECT_HIT = 20;
export const WHATS_WRONG_FALSE_POSITIVE = -10;
export const WHATS_WRONG_MISSED = -5;

// Sequence scoring — proportional to correct positions
// XP = (correctCount / totalSteps) * puzzle.xpReward

// Code Check scoring
export const CODE_CHECK_CORRECT = 1.0; // full xpReward
export const CODE_CHECK_WRONG = 5; // flat 5 XP for wrong answer

// What's Missing scoring
export const WHATS_MISSING_CORRECT = 25;
export const WHATS_MISSING_FALSE_POSITIVE = -15;
export const WHATS_MISSING_MISSED = -10;

// Size It Right scoring
export const SIZE_IT_WRONG = 10;

// Build the Assembly scoring
export const BUILD_ASSEMBLY_CORRECT = 15;
export const BUILD_ASSEMBLY_MISPLACEMENT = -5;

// Global minimums
export const MIN_XP_PER_PUZZLE = 5;

// Daily Challenge
export const DAILY_CHALLENGE_XP_MULTIPLIER = 1.5;

// Streak bonuses
export const STREAK_THRESHOLDS = [
  { minDays: 30, multiplier: 1.0 },  // 100% bonus
  { minDays: 7, multiplier: 0.5 },   // 50% bonus
  { minDays: 3, multiplier: 0.25 },  // 25% bonus
] as const;

// Lightning Round
export const LIGHTNING_QUESTIONS_PER_ROUND = 5;
export const LIGHTNING_TIME_PER_QUESTION_MS = 10_000;
export const LIGHTNING_BASE_XP_PER_CORRECT = 10;
export const LIGHTNING_SPEED_THRESHOLD_MS = 3_000;
export const LIGHTNING_SPEED_BONUS_XP = 5;
export const LIGHTNING_STREAK_3_BONUS_XP = 10;
export const LIGHTNING_STREAK_5_BONUS_XP = 25;
export const LIGHTNING_MIN_XP = 5;

// Code Tips
export const CODE_TIPS_PER_DAY = 3;
export const CODE_TIP_KNEW_IT_XP = 2;
export const CODE_TIP_NEW_TO_ME_XP = 3;
export const CODE_TIP_RESURFACE_THRESHOLD = 3;
export const CODE_TIP_UNLOCK_INTERVAL = 5;
