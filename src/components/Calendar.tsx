import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { getSessionSlots } from '@/data/positions';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { addDays, todayISO } from '@/utils/date';
import type { SessionStatus } from '@/types';

const STATUS_FILL: Record<SessionStatus, string> = {
  pending: 'bg-slate-700',
  'in-progress': 'bg-state-progress',
  completed: 'bg-state-done',
};

const STATUS_LABEL_KEY: Record<SessionStatus, string> = {
  pending: 'home.pending',
  'in-progress': 'home.inProgress',
  completed: 'home.completed',
};

function dayOffset(startIso: string, endIso: string): number {
  const start = new Date(`${startIso}T00:00:00`).getTime();
  const end = new Date(`${endIso}T00:00:00`).getTime();
  return Math.floor((end - start) / 86_400_000);
}

export const Calendar = memo(function Calendar() {
  const { t } = useTranslation();
  const { startDate, sessions, config } = useTreatmentStore((s) => ({
    startDate: s.startDate,
    sessions: s.sessions,
    config: s.config,
  }));
  if (!startDate) return null;

  const slots = getSessionSlots(config.sessionsPerDay);
  const totalSessions = config.sessionsPerDay * config.totalDays;
  const completedCount = Object.values(sessions).reduce(
    (acc, day) => acc + Object.values(day).filter((s) => s === 'completed').length,
    0,
  );
  const pctDone = totalSessions ? Math.round((completedCount / totalSessions) * 100) : 0;
  const today = todayISO();
  const todayDayNumber = dayOffset(startDate, today) + 1;
  const isTreatmentComplete = slots.every((slot) =>
    Array.from({ length: config.totalDays }, (_, dayIdx) => {
      const iso = addDays(startDate, dayIdx);
      return (sessions[iso] ?? {})[slot.id] === 'completed';
    }).every(Boolean),
  );
  const finished = todayDayNumber > config.totalDays || isTreatmentComplete;
  const lastSessionDayNumber = Object.keys(sessions).reduce((max, iso) => {
    return Math.max(max, dayOffset(startDate, iso) + 1);
  }, 0);
  const displayDays = finished
    ? Math.max(config.totalDays, lastSessionDayNumber)
    : Math.max(config.totalDays, todayDayNumber, lastSessionDayNumber);
  const legend: SessionStatus[] = ['completed', 'in-progress', 'pending'];

  const dayInfos = Array.from({ length: displayDays }, (_, dayIdx) => {
    const iso = addDays(startDate, dayIdx);
    return {
      iso,
      dayIdx,
      isToday: iso === today,
      isFuture: dayIdx + 1 > todayDayNumber,
    };
  });

  return (
    <section className="rounded-2xl border border-slate-700/70 bg-slate-800/50 p-4">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-slate-200">{t('home.progress')}</h2>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-slate-300">
            {t('home.progressValue', { done: completedCount, total: totalSessions })}
          </span>
          <span className="font-bold tabular-nums text-state-done">{pctDone}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full bg-state-done transition-all"
            style={{ width: `${pctDone}%` }}
          />
        </div>
      </div>

      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${displayDays}, minmax(0, 1fr))`,
          maxWidth: `${displayDays * 2.5 + (displayDays - 1) * 0.25}rem`,
        }}
      >
        {dayInfos.map(({ dayIdx, isToday }) => (
          <div
            key={`h-${dayIdx}`}
            className={`text-center text-[9px] tabular-nums ${
              isToday ? 'font-bold text-brand-500' : 'text-slate-500'
            }`}
          >
            {dayIdx + 1}
          </div>
        ))}

        {slots.map((slot) =>
          dayInfos.map(({ iso, dayIdx, isToday, isFuture }) => {
            const daySessions = sessions[iso] ?? {};
            const status: SessionStatus = daySessions[slot.id] ?? 'pending';
            const slotLabel = t(
              slot.labelKey,
              slot.id.includes('-') ? { n: Number(slot.id.split('-')[1]) } : undefined,
            );
            return (
              <div
                key={`${slot.id}-${dayIdx}`}
                title={`${t('home.day', { x: dayIdx + 1, total: config.totalDays })} · ${slotLabel} · ${t(STATUS_LABEL_KEY[status])}`}
                className={`aspect-square rounded-[3px] ring-1 ring-inset ring-black/20 transition-colors ${STATUS_FILL[status]} ${
                  isToday && status === 'pending' ? 'ring-2 ring-white/60' : ''
                } ${isFuture && status === 'pending' ? 'opacity-40' : ''}`}
              />
            );
          }),
        )}
      </div>

      <ul className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
        {legend.map((status) => (
          <li key={status} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-[3px] ${STATUS_FILL[status]}`} />
            {t(STATUS_LABEL_KEY[status])}
          </li>
        ))}
      </ul>
    </section>
  );
});
