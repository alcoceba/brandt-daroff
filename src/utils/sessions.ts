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

export function getSessionNumber(id: string): number | null {
  const match = id.match(/^session-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

export interface DaySessionView {
  id: string;
  n: number;
  status: SessionStatus;
  isExtra: boolean;
}

export function getDaySessionsView(
  daySessions: Record<string, SessionStatus> | undefined,
  sessionsPerDay: number,
): DaySessionView[] {
  const view = new Map<number, DaySessionView>();
  for (let i = 1; i <= sessionsPerDay; i++) {
    const id = `session-${i}`;
    view.set(i, { id, n: i, status: daySessions?.[id] ?? 'pending', isExtra: false });
  }
  for (const [id, status] of Object.entries(daySessions ?? {})) {
    const n = getSessionNumber(id);
    if (n === null) continue;
    const existing = view.get(n);
    if (existing) {
      existing.status = status;
    } else {
      view.set(n, { id, n, status, isExtra: n > sessionsPerDay });
    }
  }
  return [...view.values()].sort((a, b) => a.n - b.n);
}

export function getNextSessionId(
  daySessions: Record<string, SessionStatus> | undefined,
  sessionsPerDay: number,
): string {
  const existingNumbers = Object.keys(daySessions ?? {})
    .map(getSessionNumber)
    .filter((n): n is number => n !== null);
  const maxExisting = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
  return `session-${Math.max(maxExisting, sessionsPerDay) + 1}`;
}

export type DayProgressState = 'done' | 'in-progress' | 'partial' | 'pending';

export interface DayProgress {
  completedScheduled: number;
  extrasCompleted: number;
  hasInProgress: boolean;
  ratio: number;
  state: DayProgressState;
}

export function getDayProgress(
  daySessions: Record<string, SessionStatus> | undefined,
  sessionsPerDay: number,
): DayProgress {
  const view = getDaySessionsView(daySessions, sessionsPerDay);
  const completedScheduled = view.filter((s) => !s.isExtra && s.status === 'completed').length;
  const extrasCompleted = view.filter((s) => s.isExtra && s.status === 'completed').length;
  const hasInProgress = view.some((s) => s.status === 'in-progress');
  const ratio = sessionsPerDay > 0 ? completedScheduled / sessionsPerDay : 0;
  const state: DayProgressState =
    sessionsPerDay > 0 && completedScheduled >= sessionsPerDay
      ? 'done'
      : hasInProgress
        ? 'in-progress'
        : completedScheduled > 0
          ? 'partial'
          : 'pending';
  return { completedScheduled, extrasCompleted, hasInProgress, ratio, state };
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

function dayOffset(startIso: string, endIso: string): number {
  const start = new Date(`${startIso}T00:00:00`).getTime();
  const end = new Date(`${endIso}T00:00:00`).getTime();
  return Math.floor((end - start) / 86_400_000);
}

export interface TreatmentDayInfo {
  dayIdx: number;
  iso: string;
  isToday: boolean;
  isFuture: boolean;
  progress: DayProgress;
}

export function getTreatmentDayInfos(
  startDate: string,
  sessions: SessionMap,
  config: TreatmentConfig,
  todayIso: string,
): TreatmentDayInfo[] {
  const todayDayNumber = dayOffset(startDate, todayIso) + 1;

  return Array.from({ length: config.totalDays }, (_, dayIdx) => {
    const iso = addDays(startDate, dayIdx);
    return {
      dayIdx,
      iso,
      isToday: iso === todayIso,
      isFuture: dayIdx + 1 > todayDayNumber,
      progress: getDayProgress(sessions[iso], config.sessionsPerDay),
    };
  });
}

export function chunkIntoWeeks<T>(items: T[]): T[][] {
  const weeks: T[][] = [];
  for (let i = 0; i < items.length; i += 7) {
    weeks.push(items.slice(i, i + 7));
  }
  return weeks;
}

export interface TreatmentSummary {
  totalSessions: number;
  completedSessions: number;
  sessionPct: number;
  completedDays: number;
  streak: number;
  investedSeconds: number;
  extrasCompleted: number;
  currentDayNumber: number;
  rawDayNumber: number;
  daysLeft: number;
  sessionsToGo: number;
  finished: boolean;
}

export function getTreatmentSummary(
  startDate: string | null,
  sessions: SessionMap,
  sessionDurations: SessionDurations,
  config: TreatmentConfig,
  todayIso: string,
): TreatmentSummary {
  const totalSessions = config.sessionsPerDay * config.totalDays;
  const completedSessions = countCompletedSessions(sessions, config.sessionsPerDay);
  const sessionPct = totalSessions ? Math.round((completedSessions / totalSessions) * 100) : 0;
  const completedDays = startDate ? countCompletedDays(sessions, config, startDate) : 0;
  const streak = config.sessionsPerDay > 0 ? computeStreak(sessions, config, todayIso) : 0;
  const investedSeconds = sumInvestedSeconds(sessionDurations);
  const extrasCompleted = Math.max(0, countCompletedSessions(sessions) - completedSessions);

  const rawDayNumber = startDate ? dayOffset(startDate, todayIso) + 1 : 1;
  const currentDayNumber = startDate
    ? Math.min(Math.max(rawDayNumber, 1), config.totalDays)
    : 1;
  const daysLeft = Math.max(0, config.totalDays - currentDayNumber + 1);
  const sessionsToGo = Math.max(0, totalSessions - completedSessions);
  const finished = startDate
    ? rawDayNumber > config.totalDays || completedDays >= config.totalDays
    : false;

  return {
    totalSessions,
    completedSessions,
    sessionPct,
    completedDays,
    streak,
    investedSeconds,
    extrasCompleted,
    currentDayNumber,
    rawDayNumber,
    daysLeft,
    sessionsToGo,
    finished,
  };
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
