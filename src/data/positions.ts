import type { PositionDef, SessionSlot, TreatmentConfig } from '@/types';

export const POSITIONS: readonly PositionDef[] = [
  { kind: 'sitting', labelKey: 'position.sitting', durationKind: 'transition', canAdvanceEarly: false },
  { kind: 'lying-right', labelKey: 'position.lyingRight', durationKind: 'positionDuration', canAdvanceEarly: true },
  { kind: 'sitting', labelKey: 'position.rest', durationKind: 'restBetweenPositions', canAdvanceEarly: true },
  { kind: 'lying-left', labelKey: 'position.lyingLeft', durationKind: 'positionDuration', canAdvanceEarly: true },
  { kind: 'sitting', labelKey: 'position.longRest', durationKind: 'restBetweenCycles', canAdvanceEarly: true },
] as const;

export const CYCLES_PER_SESSION = 5;

export function getDurationSeconds(pos: PositionDef, config: TreatmentConfig): number {
  switch (pos.durationKind) {
    case 'transition':
      return 0;
    case 'positionDuration':
      return config.positionDuration;
    case 'restBetweenPositions':
      return config.restBetweenPositions;
    case 'restBetweenCycles':
      return config.restBetweenCycles;
  }
}

export function getSessionSlots(sessionsPerDay: number): SessionSlot[] {
  if (sessionsPerDay === 3) {
    return [
      { id: 'morning', labelKey: 'session.morning' },
      { id: 'midday', labelKey: 'session.midday' },
      { id: 'evening', labelKey: 'session.evening' },
    ];
  }
  return Array.from({ length: sessionsPerDay }, (_, i) => ({
    id: `cycle-${i + 1}`,
    labelKey: 'session.cycleN',
  }));
}
