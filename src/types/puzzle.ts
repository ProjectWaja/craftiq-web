import { TradeCode } from './trade';

export type PuzzleType = 'whats-wrong' | 'whats-missing' | 'sequence' | 'code-check' | 'size-it' | 'build-assembly';

export type Difficulty = 1 | 2 | 3;

// What's Wrong puzzle
export interface WhatsWrongComponent {
  id: number;
  name: string;
  description?: string;
  correct: boolean;
  violation?: string;
  codeReference?: string;
  fixDescription?: string;
}

export interface WhatsWrongPuzzle {
  id: string;
  type: 'whats-wrong';
  trade: TradeCode;
  difficulty: Difficulty;
  title: string;
  description?: string;
  image?: string;
  components: WhatsWrongComponent[];
  explanation: string;
  xpReward: number;
}

// Sequence puzzle
export interface SequenceStep {
  id: number;
  text: string;
  order: number;
}

export interface SequencePuzzle {
  id: string;
  type: 'sequence';
  trade: TradeCode;
  difficulty: Difficulty;
  title: string;
  description: string;
  image?: string;
  steps: SequenceStep[];
  explanation: string;
  xpReward: number;
}

// Code Check puzzle
export interface CodeCheckPuzzle {
  id: string;
  type: 'code-check';
  trade: TradeCode;
  difficulty: Difficulty;
  title: string;
  scenario: string;
  image?: string;
  isUpToCode: boolean;
  codeReference: string;
  explanation: string;
  xpReward: number;
}

// What's Missing puzzle
export interface MissingItem {
  name: string;
  explanation: string;
}

export interface WhatsMissingPuzzle {
  id: string;
  type: 'whats-missing';
  trade: TradeCode;
  difficulty: Difficulty;
  title: string;
  description: string;
  image?: string;
  presentItems: string[];
  missingItems: MissingItem[];
  distractors: string[];
  explanation: string;
  xpReward: number;
}

// Size It Right puzzle
export interface SizeItOption {
  text: string;
  value: string;
  correct: boolean;
  feedback: string;
}

export interface SizeItPuzzle {
  id: string;
  type: 'size-it';
  trade: TradeCode;
  difficulty: Difficulty;
  title: string;
  scenario: string;
  hint: string;
  image?: string;
  options: SizeItOption[];
  explanation: string;
  xpReward: number;
}

// Build the Assembly puzzle
export interface AssemblyPart {
  id: number;
  name: string;
  correctPosition: number;
}

export interface AssemblyDistractor {
  id: number;
  name: string;
}

export interface AssemblyPosition {
  id: number;
  label: string;
}

export interface BuildAssemblyPuzzle {
  id: string;
  type: 'build-assembly';
  trade: TradeCode;
  difficulty: Difficulty;
  title: string;
  description: string;
  image?: string;
  parts: AssemblyPart[];
  distractors: AssemblyDistractor[];
  positions: AssemblyPosition[];
  explanation: string;
  xpReward: number;
}

export type Puzzle = WhatsWrongPuzzle | WhatsMissingPuzzle | SequencePuzzle | CodeCheckPuzzle | SizeItPuzzle | BuildAssemblyPuzzle;

// Puzzle result after submission
export interface PuzzleResult {
  puzzleId: string;
  puzzleType: PuzzleType;
  trade: TradeCode;
  difficulty: number;
  xpEarned: number;
  correctCount: number;
  incorrectCount: number;
  totalPossible: number;
  timestamp: number;
}

// Puzzle browser
export type CompletionStatus = 'not-attempted' | 'completed' | 'got-wrong';

export interface PuzzleListItem {
  id: string;
  type: PuzzleType;
  trade: TradeCode;
  difficulty: Difficulty;
  title: string;
  description: string;
  xpReward: number;
  status: CompletionStatus;
  lastAttemptXP?: number;
}
