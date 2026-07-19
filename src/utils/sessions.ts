import type { SessionMap, SessionSlot, TreatmentConfig } from '@/types';
import { addDays } from '@/utils/date';

export function countCompletedSessions(sessions: SessionMap): number {
  return Object.values(sessions).reduce(
    (acc, day) => acc + Object.values(day).filter((s) => s === 'completed').length,
    0,
  );
}

export function isTreatmentComplete(
  startDate: string,
  sessions: SessionMap,
  config: TreatmentConfig,
  slots: SessionSlot[],
): boolean {
  return slots.every((slot) =>
    Array.from({ length: config.totalDays }, (_, dayIdx) => {
      const iso = addDays(startDate, dayIdx);
      return (sessions[iso] ?? {})[slot.id] === 'completed';
    }).every(Boolean),
  );
}
