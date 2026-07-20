import type { PositionDef, SessionSlot, TreatmentConfig } from '@/types';

export const POSITIONS: readonly PositionDef[] = [
  { kind: 'sitting', labelKey: 'position.sitting', durationKind: 'transition', canAdvanceEarly: false },
  { kind: 'lying-right', labelKey: 'position.lyingRight', durationKind: 'positionDuration', canAdvanceEarly: true },
  { kind: 'rest', labelKey: 'position.rest', durationKind: 'restBetweenPositions', canAdvanceEarly: true },
  { kind: 'lying-left', labelKey: 'position.lyingLeft', durationKind: 'positionDuration', canAdvanceEarly: true },
  { kind: 'long-rest', labelKey: 'position.longRest', durationKind: 'restBetweenCycles', canAdvanceEarly: true },
] as const;

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

export function getSessionSlotId(index: number): string {
  return `session-${index + 1}`;
}

export function getSessionSlots(sessionsPerDay: number): SessionSlot[] {
  return Array.from({ length: sessionsPerDay }, (_, i) => ({
    id: getSessionSlotId(i),
    labelKey: 'session.sessionN',
  }));
}
