import { useMemo, useState } from 'react';
import { AlertCircle, Copy, Play, RotateCcw, TestTube } from 'lucide-react';
import {
  clearStoredState,
  copyCurrentState,
  getScenarioLabel,
  getScenarioNames,
  seedScenario,
  STORAGE_KEY,
  STORAGE_VERSION,
  type ScenarioName,
} from '@/testing/scenarios';
import { DEFAULT_CONFIG, DEFAULT_SETTINGS } from '@/constants/treatment';
import { ButtonGroup } from '@/components/core/ButtonGroup';
import { addDays, todayISO } from '@/utils/date';
import type { SessionDurations, SessionMap } from '@/types';

const GROUPS: { title: string; names: ScenarioName[] }[] = [
  { title: 'Onboarding', names: ['fresh'] },
  {
    title: 'Day 1',
    names: ['day1-none', 'day1-one-done', 'day1-goal-reached', 'day1-extra-done'],
  },
  { title: 'Mid-treatment', names: ['day5-on-track', 'day5-behind'] },
  {
    title: 'End',
    names: ['day14-last-session', 'treatment-complete', 'treatment-complete-extra'],
  },
  { title: 'Resume', names: ['in-progress'] },
];

function parseNumber(value: string, min: number, max: number): number {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed)) return min;
  return Math.max(min, Math.min(max, parsed));
}

function distributeSessions(
  day: number,
  totalSessions: number,
  sessionsPerDay: number,
): Record<number, string[]> {
  const slots: { dayIndex: number; sessionId: string }[] = [];
  for (let d = 1; d <= day; d++) {
    for (let s = 1; s <= sessionsPerDay; s++) {
      slots.push({ dayIndex: d, sessionId: `session-${s}` });
    }
  }

  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }

  const selected = slots.slice(0, totalSessions);
  const byDay: Record<number, string[]> = {};
  for (const { dayIndex, sessionId } of selected) {
    if (!byDay[dayIndex]) byDay[dayIndex] = [];
    byDay[dayIndex].push(sessionId);
  }
  return byDay;
}

function buildManualState(day: number, totalSessions: number) {
  const startDate = addDays(todayISO(), -(day - 1));
  const byDay = distributeSessions(day, totalSessions, DEFAULT_CONFIG.sessionsPerDay);

  const sessions: SessionMap = {};
  const sessionDurations: SessionDurations = {};

  for (const [dayIndexStr, sessionIds] of Object.entries(byDay)) {
    const dayIndex = parseInt(dayIndexStr, 10);
    const isoDate = addDays(startDate, dayIndex - 1);
    sessions[isoDate] = {};
    sessionDurations[isoDate] = {};
    for (const sessionId of sessionIds) {
      sessions[isoDate][sessionId] = 'completed';
      sessionDurations[isoDate][sessionId] = 300;
    }
  }

  return {
    state: {
      language: 'en',
      config: DEFAULT_CONFIG,
      startDate,
      sessions,
      progress: {},
      sessionDurations,
      settings: DEFAULT_SETTINGS,
      onboardingComplete: true,
      skipSafetyWarning: false,
    },
    version: STORAGE_VERSION,
  };
}

function goToAppRoot() {
  const url = new URL(window.location.href);
  url.search = '';
  window.location.href = url.toString();
}

export function DevScenariosScreen() {
  const [day, setDay] = useState(1);
  const [sessions, setSessions] = useState(0);
  const [copied, setCopied] = useState(false);

  const maxSessions = day * DEFAULT_CONFIG.sessionsPerDay;

  const error = useMemo(() => {
    if (day < 1 || day > DEFAULT_CONFIG.totalDays) {
      return `Day must be between 1 and ${DEFAULT_CONFIG.totalDays}.`;
    }
    if (sessions < 0) {
      return 'Sessions completed cannot be negative.';
    }
    if (sessions > maxSessions) {
      return `Max ${maxSessions} sessions possible by day ${day}.`;
    }
    return null;
  }, [day, sessions, maxSessions]);

  const handleDayChange = (value: string) => {
    setDay(parseNumber(value, 1, DEFAULT_CONFIG.totalDays));
  };

  const handleSessionsChange = (value: string) => {
    const parsed = parseInt(value, 10);
    setSessions(Number.isNaN(parsed) ? 0 : parsed);
  };

  const handleGenerate = () => {
    if (error) return;
    const payload = buildManualState(day, sessions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    goToAppRoot();
  };

  const handleCopy = async () => {
    await copyCurrentState();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const visibleGroups = useMemo(
    () =>
      GROUPS.map((group) => ({
        ...group,
        names: group.names.filter((name) => getScenarioNames().includes(name)),
      })).filter((group) => group.names.length > 0),
    [],
  );

  return (
    <div className="flex flex-1 flex-col gap-5 px-3 py-5 sm:px-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TestTube className="h-5 w-5 text-brand-500" />
          <h1 className="text-xl font-bold text-white">Dev scenarios</h1>
        </div>
        <span className="rounded-full bg-brand-600 px-2.5 py-1 text-xs font-bold text-white">
          DEV ONLY
        </span>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5">
        <div className="flex items-center gap-2">
          <Play className="h-4 w-4 text-brand-500" />
          <h2 className="text-sm font-bold text-white">Manual state builder</h2>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Jump to a specific treatment day with a random distribution of completed sessions.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-300">Day</span>
            <input
              type="number"
              min={1}
              max={DEFAULT_CONFIG.totalDays}
              value={day}
              onChange={(e) => handleDayChange(e.target.value)}
              className="min-h-touch rounded-xl border border-slate-600 bg-slate-900 px-3 text-base font-semibold text-white outline-none focus:border-brand-500"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-300">Sessions completed</span>
            <input
              type="number"
              min={0}
              max={maxSessions}
              value={sessions}
              onChange={(e) => handleSessionsChange(e.target.value)}
              className="min-h-touch rounded-xl border border-slate-600 bg-slate-900 px-3 text-base font-semibold text-white outline-none focus:border-brand-500"
            />
          </label>
        </div>

        {error ? (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-state-danger/30 bg-state-danger/10 px-3 py-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-state-danger" />
            <p className="text-xs text-state-danger">{error}</p>
          </div>
        ) : (
          <p className="mt-3 text-xs text-slate-500">
            Up to {maxSessions} sessions can be completed by day {day}.
          </p>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={!!error}
          className="mt-4 flex min-h-touch w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 text-base font-bold text-white shadow-lg shadow-brand-500/20 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play size={20} />
          <span>Generate & go to app</span>
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {visibleGroups.map((group) => (
          <ButtonGroup key={group.title} title={group.title}>
            {group.names.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => seedScenario(name)}
                className="group flex min-h-touch items-center rounded-xl border border-slate-700 bg-slate-800/60 px-4 text-left transition-all duration-200 hover:border-brand-500 hover:bg-slate-800 active:scale-[0.98]"
              >
                <span className="font-semibold text-slate-200 group-hover:text-white">
                  {getScenarioLabel(name)}
                </span>
              </button>
            ))}
          </ButtonGroup>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="group flex min-h-touch items-center justify-center gap-2 rounded-xl bg-slate-700 px-4 py-3 text-lg font-semibold text-white transition-all duration-200 hover:bg-slate-600 active:scale-[0.98]"
        >
          <Copy size={20} />
          <span>{copied ? 'Copied to clipboard' : 'Copy current localStorage state'}</span>
        </button>
        <button
          type="button"
          onClick={clearStoredState}
          className="flex min-h-touch items-center justify-center gap-2 rounded-xl border-2 border-state-danger px-4 py-3 text-lg font-semibold text-state-danger transition-all duration-200 hover:bg-state-danger/10 active:scale-[0.98]"
        >
          <RotateCcw size={20} />
          <span>Clear storage and reload</span>
        </button>
      </div>
    </div>
  );
}
