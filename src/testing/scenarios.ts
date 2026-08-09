import type {
  Language,
  SessionDurations,
  SessionMap,
  SessionProgress,
  SessionStatus,
  Settings,
  TreatmentConfig,
} from '@/types';
import { DEFAULT_CONFIG, DEFAULT_SETTINGS } from '@/constants/treatment';
import { addDays, todayISO } from '@/utils/date';

export type ScenarioName =
  | 'fresh'
  | 'day1-none'
  | 'day1-one-done'
  | 'day1-goal-reached'
  | 'day1-extra-done'
  | 'day5-on-track'
  | 'day5-behind'
  | 'day14-last-session'
  | 'treatment-complete'
  | 'treatment-complete-extra'
  | 'in-progress'
  | 'language-ca'
  | 'language-es';

interface ScenarioState {
  language: Language;
  config: TreatmentConfig;
  startDate: string | null;
  sessions: SessionMap;
  progress: Record<string, Record<string, SessionProgress>>;
  sessionDurations: SessionDurations;
  settings: Settings;
  onboardingComplete: boolean;
  skipSafetyWarning: boolean;
}

const STORAGE_KEY = 'brandt-daroff-store';
const STORAGE_VERSION = 5;

function emptyState(): ScenarioState {
  return {
    language: 'en',
    config: DEFAULT_CONFIG,
    startDate: null,
    sessions: {},
    progress: {},
    sessionDurations: {},
    settings: DEFAULT_SETTINGS,
    onboardingComplete: false,
    skipSafetyWarning: false,
  };
}

function completedDay(sessionsPerDay: number): Record<string, SessionStatus> {
  const day: Record<string, SessionStatus> = {};
  for (let i = 0; i < sessionsPerDay; i++) {
    day[`session-${i + 1}`] = 'completed';
  }
  return day;
}

function completedRange(
  startDate: string,
  dayCount: number,
  sessionsPerDay: number,
): SessionMap {
  const sessions: SessionMap = {};
  for (let i = 0; i < dayCount; i++) {
    sessions[addDays(startDate, i)] = completedDay(sessionsPerDay);
  }
  return sessions;
}

function buildScenario(name: ScenarioName): ScenarioState {
  const today = todayISO();
  const base = emptyState();

  switch (name) {
    case 'fresh':
      return base;

    case 'day1-none':
      return {
        ...base,
        onboardingComplete: true,
        startDate: today,
      };

    case 'day1-one-done':
      return {
        ...base,
        onboardingComplete: true,
        startDate: today,
        sessions: {
          [today]: { 'session-1': 'completed' },
        },
        sessionDurations: {
          [today]: { 'session-1': 300 },
        },
      };

    case 'day1-goal-reached':
      return {
        ...base,
        onboardingComplete: true,
        startDate: today,
        sessions: {
          [today]: completedDay(base.config.sessionsPerDay),
        },
        sessionDurations: {
          [today]: {
            'session-1': 300,
            'session-2': 300,
            'session-3': 300,
          },
        },
      };

    case 'day1-extra-done':
      return {
        ...base,
        onboardingComplete: true,
        startDate: today,
        sessions: {
          [today]: {
            ...completedDay(base.config.sessionsPerDay),
            'session-4': 'completed',
          },
        },
        sessionDurations: {
          [today]: {
            'session-1': 300,
            'session-2': 300,
            'session-3': 300,
            'session-4': 300,
          },
        },
      };

    case 'day5-on-track': {
      const startDate = addDays(today, -4);
      return {
        ...base,
        onboardingComplete: true,
        startDate,
        sessions: completedRange(startDate, 4, base.config.sessionsPerDay),
      };
    }

    case 'day5-behind': {
      const startDate = addDays(today, -4);
      const sessions: SessionMap = {};
      for (let i = 0; i < 4; i++) {
        const day = addDays(startDate, i);
        const completedCount = i % 2 === 0 ? 1 : 2;
        sessions[day] = {};
        for (let j = 0; j < completedCount; j++) {
          sessions[day][`session-${j + 1}`] = 'completed';
        }
      }
      return {
        ...base,
        onboardingComplete: true,
        startDate,
        sessions,
      };
    }

    case 'day14-last-session': {
      const startDate = addDays(today, -13);
      const sessions = completedRange(startDate, 13, base.config.sessionsPerDay);
      sessions[today] = {
        'session-1': 'completed',
        'session-2': 'completed',
      };
      return {
        ...base,
        onboardingComplete: true,
        startDate,
        sessions,
      };
    }

    case 'treatment-complete': {
      const startDate = addDays(today, -13);
      return {
        ...base,
        onboardingComplete: true,
        startDate,
        sessions: completedRange(startDate, 14, base.config.sessionsPerDay),
      };
    }

    case 'treatment-complete-extra': {
      const startDate = addDays(today, -13);
      return {
        ...base,
        onboardingComplete: true,
        startDate,
        sessions: {
          ...completedRange(startDate, 14, base.config.sessionsPerDay),
          [today]: {
            ...completedDay(base.config.sessionsPerDay),
            'session-4': 'in-progress',
          },
        },
        progress: {
          [today]: {
            'session-4': { cycleIndex: 1, positionIndex: 2 },
          },
        },
      };
    }

    case 'in-progress':
      return {
        ...base,
        onboardingComplete: true,
        startDate: today,
        sessions: {
          [today]: {
            'session-1': 'completed',
            'session-2': 'in-progress',
          },
        },
        progress: {
          [today]: {
            'session-2': { cycleIndex: 2, positionIndex: 1 },
          },
        },
      };

    case 'language-ca':
      return {
        ...base,
        language: 'ca',
        onboardingComplete: true,
        startDate: today,
        sessions: {
          [today]: { 'session-1': 'completed' },
        },
      };

    case 'language-es':
      return {
        ...base,
        language: 'es',
        onboardingComplete: true,
        startDate: today,
        sessions: {
          [today]: { 'session-1': 'completed' },
        },
      };

    default:
      return base;
  }
}

export function getScenarioNames(): ScenarioName[] {
  return [
    'fresh',
    'day1-none',
    'day1-one-done',
    'day1-goal-reached',
    'day1-extra-done',
    'day5-on-track',
    'day5-behind',
    'day14-last-session',
    'treatment-complete',
    'treatment-complete-extra',
    'in-progress',
    'language-ca',
    'language-es',
  ];
}

export function getScenarioLabel(name: ScenarioName): string {
  const labels: Record<ScenarioName, string> = {
    fresh: 'Fresh install (no onboarding)',
    'day1-none': 'Day 1 / 14 — no sessions done',
    'day1-one-done': 'Day 1 / 14 — 1 of 3 done',
    'day1-goal-reached': 'Day 1 / 14 — goal reached (3/3)',
    'day1-extra-done': 'Day 1 / 14 — goal + 1 extra done',
    'day5-on-track': 'Day 5 / 14 — on track (days 1–4 done)',
    'day5-behind': 'Day 5 / 14 — behind schedule',
    'day14-last-session': 'Day 14 / 14 — last session pending',
    'treatment-complete': 'Treatment complete (14 days done)',
    'treatment-complete-extra': 'Treatment complete + extra in progress',
    'in-progress': 'In-progress session (resume flow)',
    'language-ca': 'Catalan language',
    'language-es': 'Spanish language',
  };
  return labels[name];
}

export function seedScenario(name: ScenarioName): void {
  const state = buildScenario(name);
  const payload = JSON.stringify({ state, version: STORAGE_VERSION });
  localStorage.setItem(STORAGE_KEY, payload);
  window.location.reload();
}

export function clearStoredState(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}

export async function copyCurrentState(): Promise<void> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  await navigator.clipboard.writeText(raw);
}
