// AUTO-SYNCED from craftiq (mobile) — do not edit directly
// Run `npm run sync` in craftiq to update

// === SHARED (synced to craftiq-web) ===

import { ApprenticeLevel } from '@/types/scoring';

export const APPRENTICE_LEVELS: ApprenticeLevel[] = [
  { year: 1, name: '1st Year Apprentice', xpRequired: 0, color: '#94A3B8' },
  { year: 2, name: '2nd Year Apprentice', xpRequired: 500, color: '#3B82F6' },
  { year: 3, name: '3rd Year Apprentice', xpRequired: 1500, color: '#10B981' },
  { year: 4, name: '4th Year Apprentice', xpRequired: 3000, color: '#F59E0B' },
  { year: 5, name: 'Journeyman', xpRequired: 5000, color: '#8B5CF6' },
  { year: 6, name: 'Master Tradesman', xpRequired: 8000, color: '#EC4899' },
];
