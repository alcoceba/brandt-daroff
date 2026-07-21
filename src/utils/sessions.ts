import type { SessionDurations, SessionMap, SessionStatus, TreatmentConfig } from '@/types';
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

export function countDayCompletedRaw(daySessions: Record<string, SessionStatus> | undefined): number {
  if (!daySessions) return 0;
  return Object.values(daySessions).filter((s) => s === 'completed').length;
}

export function countCompletedDays(
  sessions: SessionMap,
  config: TreatmentConfig,
  startDate: string,
): number {
  let completed = 0;
  for (let dayIdx = 0; dayIdx < config.totalDays; dayIdx++) {
    const iso = addDays(startDate, dayIdx);
    if (countDayCompletedRaw(sessions[iso]) >= config.sessionsPerDay) {
      completed++;
    }
  }
  return completed;
}

export function computeStreak(
  sessions: SessionMap,
  config: TreatmentConfig,
  todayIso: string,
): number {
  if (config.sessionsPerDay <= 0) return 0;

  const todayComplete = countDayCompletedRaw(sessions[todayIso]) >= config.sessionsPerDay;
  let cursor = todayComplete ? todayIso : addDays(todayIso, -1);
  let streak = 0;

  while (countDayCompletedRaw(sessions[cursor]) >= config.sessionsPerDay) {
    streak++;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function estimatedSessionSeconds(config: TreatmentConfig): number {
  const cycleSeconds = 2 * config.positionDuration + config.restBetweenPositions;
  const cycles = config.cyclesPerSession;
  // The final long-rest is skipped when the last cycle completes.
  return cycleSeconds * cycles + config.restBetweenCycles * Math.max(0, cycles - 1);
}

export function sumInvestedSeconds(sessionDurations: SessionDurations): number {
  return Object.values(sessionDurations).reduce(
    (total, day) => total + Object.values(day).reduce((sum, seconds) => sum + seconds, 0),
    0,
  );
}
