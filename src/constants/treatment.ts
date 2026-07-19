import type { Settings, TreatmentConfig } from '@/types';

export const DEFAULT_CONFIG: TreatmentConfig = {
  positionDuration: 30,
  restBetweenPositions: 30,
  restBetweenCycles: 120,
  sessionsPerDay: 3,
  totalDays: 14,
  cyclesPerSession: 5,
};

export const DEFAULT_SETTINGS: Settings = {
  sound: true,
  vibration: true,
};
