// AUTO-SYNCED from craftiq (mobile) — do not edit directly
// Run `npm run sync` in craftiq to update

import {
  WhatsWrongPuzzle,
  WhatsMissingPuzzle,
  SequencePuzzle,
  CodeCheckPuzzle,
  SizeItPuzzle,
  BuildAssemblyPuzzle,
  Puzzle,
  PuzzleType,
  PuzzleResult,
  PuzzleListItem,
  CompletionStatus,
  SequenceStep,
} from '@/types/puzzle';
import { TradeCode } from '@/types/trade';
import {
  WHATS_WRONG_CORRECT_HIT,
  WHATS_WRONG_FALSE_POSITIVE,
  WHATS_WRONG_MISSED,
  CODE_CHECK_WRONG,
  WHATS_MISSING_CORRECT,
  WHATS_MISSING_FALSE_POSITIVE,
  WHATS_MISSING_MISSED,
  SIZE_IT_WRONG,
  BUILD_ASSEMBLY_CORRECT,
  BUILD_ASSEMBLY_MISPLACEMENT,
  MIN_XP_PER_PUZZLE,
} from '@/constants/scoring';

// Import puzzle data — HVAC
import hvacWhatsWrong from '@/data/puzzles/hvac/whats-wrong.json';
import hvacWhatsMissing from '@/data/puzzles/hvac/whats-missing.json';
import hvacSequence from '@/data/puzzles/hvac/sequence.json';
import hvacCodeCheck from '@/data/puzzles/hvac/code-check.json';
import hvacSizeIt from '@/data/puzzles/hvac/size-it.json';
import hvacBuildAssembly from '@/data/puzzles/hvac/build-assembly.json';

// Import puzzle data — Plumbing
import plumbingWhatsWrong from '@/data/puzzles/plumbing/whats-wrong.json';
import plumbingWhatsMissing from '@/data/puzzles/plumbing/whats-missing.json';
import plumbingSequence from '@/data/puzzles/plumbing/sequence.json';
import plumbingCodeCheck from '@/data/puzzles/plumbing/code-check.json';
import plumbingSizeIt from '@/data/puzzles/plumbing/size-it.json';
import plumbingBuildAssembly from '@/data/puzzles/plumbing/build-assembly.json';

// Import puzzle data — Electrical
import electricalWhatsWrong from '@/data/puzzles/electrical/whats-wrong.json';
import electricalWhatsMissing from '@/data/puzzles/electrical/whats-missing.json';
import electricalSequence from '@/data/puzzles/electrical/sequence.json';
import electricalCodeCheck from '@/data/puzzles/electrical/code-check.json';
import electricalSizeIt from '@/data/puzzles/electrical/size-it.json';
import electricalBuildAssembly from '@/data/puzzles/electrical/build-assembly.json';

// Import puzzle data — Pipefitting
import pipefittingWhatsWrong from '@/data/puzzles/pipefitting/whats-wrong.json';
import pipefittingWhatsMissing from '@/data/puzzles/pipefitting/whats-missing.json';
import pipefittingSequence from '@/data/puzzles/pipefitting/sequence.json';
import pipefittingCodeCheck from '@/data/puzzles/pipefitting/code-check.json';
import pipefittingSizeIt from '@/data/puzzles/pipefitting/size-it.json';
import pipefittingBuildAssembly from '@/data/puzzles/pipefitting/build-assembly.json';

// Import puzzle data — Controls
import controlsWhatsWrong from '@/data/puzzles/controls/whats-wrong.json';
import controlsWhatsMissing from '@/data/puzzles/controls/whats-missing.json';
import controlsSequence from '@/data/puzzles/controls/sequence.json';
import controlsCodeCheck from '@/data/puzzles/controls/code-check.json';
import controlsSizeIt from '@/data/puzzles/controls/size-it.json';
import controlsBuildAssembly from '@/data/puzzles/controls/build-assembly.json';

// Import puzzle data — Data Center (Premium Specialty)
import dataCenterWhatsWrong from '@/data/puzzles/data-center/whats-wrong.json';
import dataCenterWhatsMissing from '@/data/puzzles/data-center/whats-missing.json';
import dataCenterSequence from '@/data/puzzles/data-center/sequence.json';
import dataCenterCodeCheck from '@/data/puzzles/data-center/code-check.json';
import dataCenterSizeIt from '@/data/puzzles/data-center/size-it.json';
import dataCenterBuildAssembly from '@/data/puzzles/data-center/build-assembly.json';

// Import puzzle data — Central Plant (Premium Specialty)
import centralPlantWhatsWrong from '@/data/puzzles/central-plant/whats-wrong.json';
import centralPlantWhatsMissing from '@/data/puzzles/central-plant/whats-missing.json';
import centralPlantSequence from '@/data/puzzles/central-plant/sequence.json';
import centralPlantCodeCheck from '@/data/puzzles/central-plant/code-check.json';
import centralPlantSizeIt from '@/data/puzzles/central-plant/size-it.json';
import centralPlantBuildAssembly from '@/data/puzzles/central-plant/build-assembly.json';

// Import puzzle data — Healthcare (Premium Specialty — stub)
import healthcareWhatsWrong from '@/data/puzzles/healthcare/whats-wrong.json';
import healthcareWhatsMissing from '@/data/puzzles/healthcare/whats-missing.json';
import healthcareSequence from '@/data/puzzles/healthcare/sequence.json';
import healthcareCodeCheck from '@/data/puzzles/healthcare/code-check.json';
import healthcareSizeIt from '@/data/puzzles/healthcare/size-it.json';
import healthcareBuildAssembly from '@/data/puzzles/healthcare/build-assembly.json';

// Import puzzle data — High-Rise (Premium Specialty — stub)
import highRiseWhatsWrong from '@/data/puzzles/high-rise/whats-wrong.json';
import highRiseWhatsMissing from '@/data/puzzles/high-rise/whats-missing.json';
import highRiseSequence from '@/data/puzzles/high-rise/sequence.json';
import highRiseCodeCheck from '@/data/puzzles/high-rise/code-check.json';
import highRiseSizeIt from '@/data/puzzles/high-rise/size-it.json';
import highRiseBuildAssembly from '@/data/puzzles/high-rise/build-assembly.json';

// Import puzzle data — Industrial (Premium Specialty — stub)
import industrialWhatsWrong from '@/data/puzzles/industrial/whats-wrong.json';
import industrialWhatsMissing from '@/data/puzzles/industrial/whats-missing.json';
import industrialSequence from '@/data/puzzles/industrial/sequence.json';
import industrialCodeCheck from '@/data/puzzles/industrial/code-check.json';
import industrialSizeIt from '@/data/puzzles/industrial/size-it.json';
import industrialBuildAssembly from '@/data/puzzles/industrial/build-assembly.json';

const PUZZLE_DATA: Record<PuzzleType, Puzzle[]> = {
  'whats-wrong': [
    ...hvacWhatsWrong,
    ...plumbingWhatsWrong,
    ...electricalWhatsWrong,
    ...pipefittingWhatsWrong,
    ...controlsWhatsWrong,
    ...dataCenterWhatsWrong,
    ...centralPlantWhatsWrong,
    ...healthcareWhatsWrong,
    ...highRiseWhatsWrong,
    ...industrialWhatsWrong,
  ] as unknown as WhatsWrongPuzzle[],
  'whats-missing': [
    ...hvacWhatsMissing,
    ...plumbingWhatsMissing,
    ...electricalWhatsMissing,
    ...pipefittingWhatsMissing,
    ...controlsWhatsMissing,
    ...dataCenterWhatsMissing,
    ...centralPlantWhatsMissing,
    ...healthcareWhatsMissing,
    ...highRiseWhatsMissing,
    ...industrialWhatsMissing,
  ] as unknown as WhatsMissingPuzzle[],
  sequence: [
    ...hvacSequence,
    ...plumbingSequence,
    ...electricalSequence,
    ...pipefittingSequence,
    ...controlsSequence,
    ...dataCenterSequence,
    ...centralPlantSequence,
    ...healthcareSequence,
    ...highRiseSequence,
    ...industrialSequence,
  ] as unknown as SequencePuzzle[],
  'code-check': [
    ...hvacCodeCheck,
    ...plumbingCodeCheck,
    ...electricalCodeCheck,
    ...pipefittingCodeCheck,
    ...controlsCodeCheck,
    ...dataCenterCodeCheck,
    ...centralPlantCodeCheck,
    ...healthcareCodeCheck,
    ...highRiseCodeCheck,
    ...industrialCodeCheck,
  ] as unknown as CodeCheckPuzzle[],
  'size-it': [
    ...hvacSizeIt,
    ...plumbingSizeIt,
    ...electricalSizeIt,
    ...pipefittingSizeIt,
    ...controlsSizeIt,
    ...dataCenterSizeIt,
    ...centralPlantSizeIt,
    ...healthcareSizeIt,
    ...highRiseSizeIt,
    ...industrialSizeIt,
  ] as unknown as SizeItPuzzle[],
  'build-assembly': [
    ...hvacBuildAssembly,
    ...plumbingBuildAssembly,
    ...electricalBuildAssembly,
    ...pipefittingBuildAssembly,
    ...controlsBuildAssembly,
    ...dataCenterBuildAssembly,
    ...centralPlantBuildAssembly,
    ...healthcareBuildAssembly,
    ...highRiseBuildAssembly,
    ...industrialBuildAssembly,
  ] as unknown as BuildAssemblyPuzzle[],
};

/** Get all puzzles across all trades and types */
export function getAllPuzzles(): Puzzle[] {
  return Object.values(PUZZLE_DATA).flat();
}

/** Load all puzzles for a given trade and type */
export function loadPuzzles(trade: TradeCode, type: PuzzleType): Puzzle[] {
  const puzzles = PUZZLE_DATA[type] ?? [];
  return puzzles.filter((p) => p.trade === trade);
}

/** Get a random puzzle, avoiding already-completed ones */
export function getRandomPuzzle(
  trade: TradeCode,
  type: PuzzleType,
  completedIds: string[] = [],
  maxDifficulty?: number,
): Puzzle | null {
  let all = loadPuzzles(trade, type);
  if (maxDifficulty != null) {
    all = all.filter((p) => p.difficulty <= maxDifficulty);
  }
  const available = all.filter((p) => !completedIds.includes(p.id));
  const pool = available.length > 0 ? available : all; // restart if all completed
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Shuffle an array (Fisher-Yates) */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Find a specific puzzle by its ID across all types */
export function getPuzzleById(puzzleId: string): Puzzle | null {
  for (const puzzles of Object.values(PUZZLE_DATA)) {
    const found = puzzles.find((p) => p.id === puzzleId);
    if (found) return found;
  }
  return null;
}

/** Get all puzzles with completion status derived from history */
export function getAllPuzzlesWithStatus(history: PuzzleResult[]): PuzzleListItem[] {
  const historyMap = new Map<string, PuzzleResult>();
  for (const record of history) {
    historyMap.set(record.puzzleId, record);
  }

  const items: PuzzleListItem[] = [];

  for (const puzzles of Object.values(PUZZLE_DATA)) {
    for (const puzzle of puzzles) {
      const record = historyMap.get(puzzle.id);
      let status: CompletionStatus = 'not-attempted';
      let lastAttemptXP: number | undefined;

      if (record) {
        const wasCorrect =
          record.incorrectCount === 0 && record.correctCount === record.totalPossible;
        status = wasCorrect ? 'completed' : 'got-wrong';
        lastAttemptXP = record.xpEarned;
      }

      items.push({
        id: puzzle.id,
        type: puzzle.type,
        trade: puzzle.trade,
        difficulty: puzzle.difficulty,
        title: puzzle.title,
        description: (puzzle as any).description ?? (puzzle as any).scenario ?? '',
        xpReward: puzzle.xpReward,
        status,
        lastAttemptXP,
      });
    }
  }

  return items;
}

// ─── SCORING ────────────────────────────────────────

export interface WhatsWrongResult {
  correctHits: number[];    // IDs correctly flagged
  falsePositives: number[]; // IDs flagged that are actually correct
  missed: number[];         // violation IDs not flagged
  rawScore: number;
  xpEarned: number;
}

/** Score a What's Wrong puzzle submission */
export function scoreWhatsWrong(
  selectedIds: number[],
  puzzle: WhatsWrongPuzzle,
): WhatsWrongResult {
  const violationIds = puzzle.components
    .filter((c) => !c.correct)
    .map((c) => c.id);

  const correctHits = selectedIds.filter((id) => violationIds.includes(id));
  const falsePositives = selectedIds.filter((id) => !violationIds.includes(id));
  const missed = violationIds.filter((id) => !selectedIds.includes(id));

  const rawScore =
    correctHits.length * WHATS_WRONG_CORRECT_HIT +
    falsePositives.length * WHATS_WRONG_FALSE_POSITIVE +
    missed.length * WHATS_WRONG_MISSED;

  const xpEarned = Math.max(MIN_XP_PER_PUZZLE, rawScore);

  return { correctHits, falsePositives, missed, rawScore, xpEarned };
}

export interface SequenceResult {
  correctCount: number;
  totalSteps: number;
  xpEarned: number;
}

/** Score a Sequence puzzle submission */
export function scoreSequence(
  userOrder: SequenceStep[],
  puzzle: SequencePuzzle,
): SequenceResult {
  let correctCount = 0;
  userOrder.forEach((step, idx) => {
    if (step.order === idx + 1) correctCount++;
  });

  const ratio = correctCount / userOrder.length;
  const xpEarned = Math.max(
    MIN_XP_PER_PUZZLE,
    Math.floor(ratio * puzzle.xpReward),
  );

  return { correctCount, totalSteps: userOrder.length, xpEarned };
}

export interface CodeCheckResult {
  isCorrect: boolean;
  xpEarned: number;
}

/** Score a Code Check puzzle submission */
export function scoreCodeCheck(
  answer: boolean,
  puzzle: CodeCheckPuzzle,
): CodeCheckResult {
  const isCorrect = answer === puzzle.isUpToCode;
  const xpEarned = isCorrect ? puzzle.xpReward : CODE_CHECK_WRONG;
  return { isCorrect, xpEarned };
}

// ─── WHAT'S MISSING SCORING ────────────────────────────

export interface WhatsMissingResult {
  correctSelections: string[];
  falsePositives: string[];
  missed: string[];
  rawScore: number;
  xpEarned: number;
}

/** Score a What's Missing puzzle submission */
export function scoreWhatsMissing(
  selectedNames: string[],
  puzzle: WhatsMissingPuzzle,
): WhatsMissingResult {
  const missingNames = puzzle.missingItems.map((m) => m.name);

  const correctSelections = selectedNames.filter((name) => missingNames.includes(name));
  const falsePositives = selectedNames.filter((name) => !missingNames.includes(name));
  const missed = missingNames.filter((name) => !selectedNames.includes(name));

  const rawScore =
    correctSelections.length * WHATS_MISSING_CORRECT +
    falsePositives.length * WHATS_MISSING_FALSE_POSITIVE +
    missed.length * WHATS_MISSING_MISSED;

  const xpEarned = Math.max(MIN_XP_PER_PUZZLE, rawScore);

  return { correctSelections, falsePositives, missed, rawScore, xpEarned };
}

// ─── SIZE IT RIGHT SCORING ──────────────────────────────

export interface SizeItResult {
  isCorrect: boolean;
  selectedValue: string;
  correctValue: string;
  feedback: string;
  xpEarned: number;
}

/** Score a Size It Right puzzle submission */
export function scoreSizeIt(
  selectedValue: string,
  puzzle: SizeItPuzzle,
): SizeItResult {
  const correctOption = puzzle.options.find((o) => o.correct)!;
  const selectedOption = puzzle.options.find((o) => o.value === selectedValue);
  const isCorrect = selectedValue === correctOption.value;

  const xpEarned = isCorrect ? puzzle.xpReward : SIZE_IT_WRONG;
  const feedback = selectedOption?.feedback ?? correctOption.feedback;

  return { isCorrect, selectedValue, correctValue: correctOption.value, feedback, xpEarned };
}

// ─── BUILD THE ASSEMBLY SCORING ─────────────────────────

export interface BuildAssemblyResult {
  correctPlacements: number[];
  misplacements: number[];
  unusedDistractors: number[];
  usedDistractors: number[];
  rawScore: number;
  xpEarned: number;
}

/** Score a Build the Assembly puzzle submission */
export function scoreBuildAssembly(
  placements: Record<number, number | null>,
  puzzle: BuildAssemblyPuzzle,
): BuildAssemblyResult {
  const correctPlacements: number[] = [];
  const misplacements: number[] = [];
  const usedDistractors: number[] = [];

  const distractorIds = puzzle.distractors.map((d) => d.id);

  for (const position of puzzle.positions) {
    const placedPartId = placements[position.id];

    if (placedPartId == null) {
      misplacements.push(position.id);
      continue;
    }

    if (distractorIds.includes(placedPartId)) {
      usedDistractors.push(placedPartId);
      misplacements.push(position.id);
      continue;
    }

    const part = puzzle.parts.find((p) => p.id === placedPartId);
    if (part && part.correctPosition === position.id) {
      correctPlacements.push(position.id);
    } else {
      misplacements.push(position.id);
    }
  }

  const unusedDistractors = distractorIds.filter((id) => !usedDistractors.includes(id));

  const rawScore =
    correctPlacements.length * BUILD_ASSEMBLY_CORRECT +
    misplacements.length * BUILD_ASSEMBLY_MISPLACEMENT;

  const xpEarned = Math.max(MIN_XP_PER_PUZZLE, rawScore);

  return { correctPlacements, misplacements, unusedDistractors, usedDistractors, rawScore, xpEarned };
}
