import type { SessionMap, TreatmentConfig } from '@/types';
import { getSessionSlots } from '@/constants/positions';
import { addDays } from '@/utils/date';

export function countCompletedSessions(sessions: SessionMap, sessionsPerDay?: number): number {
  return Object.values(sessions).reduce(
    (acc, day) => {
      const dayCompleted = Object.entries(day).filter(([sessionId, s]) => {
        if (s !== 'completed') return false;
        if (sessionsPerDay !== undefined) {
          const match = sessionId.match(/^session-(\d+)$/);
          if (match) {
            const num = parseInt(match[1], 10);
            return num <= sessionsPerDay;
          }
        }
        return true;
      }).length;
      return acc + dayCompleted;
    },
    0,
  );
}

export function isTreatmentComplete(
  startDate: string,
  sessions: SessionMap,
  config: TreatmentConfig,
): boolean {
  const slots = getSessionSlots(config.sessionsPerDay);
  return slots.every((slot) =>
    Array.from({ length: config.totalDays }, (_, dayIdx) => {
      const iso = addDays(startDate, dayIdx);
      return (sessions[iso] ?? {})[slot.id] === 'completed';
    }).every(Boolean),
  );
}
