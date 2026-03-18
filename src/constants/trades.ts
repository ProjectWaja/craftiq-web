// AUTO-SYNCED from craftiq (mobile) — do not edit directly
// Run `npm run sync` in craftiq to update

import { TradeCode, TradeMap } from '@/types/trade';

export const TRADES: TradeMap = {
  // --- Base Trades ---
  hvac: {
    name: 'HVAC / Sheet Metal',
    icon: '🌀',
    color: '#3B82F6',
    union: 'SMACNA / UA Local',
  },
  plumbing: {
    name: 'Plumbing',
    icon: '🔧',
    color: '#10B981',
    union: 'UA Local',
  },
  electrical: {
    name: 'Electrical',
    icon: '⚡',
    color: '#F59E0B',
    union: 'IBEW Local',
  },
  pipefitting: {
    name: 'Pipefitting',
    icon: '🔩',
    color: '#8B5CF6',
    union: 'UA Local',
  },
  controls: {
    name: 'Building Controls',
    icon: '🎛️',
    color: '#EC4899',
    union: 'IBEW / NECA',
  },
  // --- Advanced Specialties (Premium) ---
  'data-center': {
    name: 'Data Center Design',
    icon: '🖥️',
    color: '#06B6D4',
    union: 'IBEW / SMACNA / UA',
    isSpecialty: true,
    description: 'Precision cooling, UPS/PDU, TIA-942, NFPA 75/76',
  },
  'central-plant': {
    name: 'Central Plant Design',
    icon: '🏭',
    color: '#0EA5E9',
    union: 'UA / SMACNA',
    isSpecialty: true,
    description: 'Chiller/boiler plants, cooling towers, VFDs',
  },
  healthcare: {
    name: 'Healthcare Facilities',
    icon: '🏥',
    color: '#14B8A6',
    union: 'UA / IBEW',
    isSpecialty: true,
    description: 'Medical gas, ASHRAE 170, NEC 517, NFPA 99',
  },
  'high-rise': {
    name: 'High-Rise MEP',
    icon: '🏙️',
    color: '#6366F1',
    union: 'UA / IBEW / SMACNA',
    isSpecialty: true,
    description: 'Pressure zones, fire pumps, smoke control',
  },
  industrial: {
    name: 'Industrial Process',
    icon: '⚙️',
    color: '#D97706',
    union: 'UA / IBEW',
    isSpecialty: true,
    description: 'Steam, compressed air, process cooling',
  },
};

export const BASE_TRADE_CODES = (Object.keys(TRADES) as TradeCode[]).filter(
  (code) => !TRADES[code].isSpecialty,
);

export const SPECIALTY_CODES = (Object.keys(TRADES) as TradeCode[]).filter(
  (code) => TRADES[code].isSpecialty === true,
);

export const PUZZLE_TYPES = {
  'whats-wrong': {
    name: "What's Wrong?",
    icon: '🔍',
    description: 'Spot the code violation',
  },
  'whats-missing': {
    name: "What's Missing?",
    icon: '❓',
    description: 'Find the missing components',
  },
  sequence: {
    name: 'Sequence the Install',
    icon: '📋',
    description: 'Order the installation steps',
  },
  'code-check': {
    name: 'Code or No Code?',
    icon: '✅',
    description: 'Is this installation up to code?',
  },
  'size-it': {
    name: 'Size It Right',
    icon: '📏',
    description: 'Calculate the correct size',
  },
  'build-assembly': {
    name: 'Build the Assembly',
    icon: '🔨',
    description: 'Assemble components in order',
  },
} as const;
