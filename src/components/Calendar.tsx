import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { ProgressSummary } from '@/components/ProgressSummary';
import { addDays, todayISO } from '@/utils/date';
import { countCompletedSessions, countDayCompletedRaw } from '@/utils/sessions';

function dayOffset(startIso: string, endIso: string): number {
  const start = new Date(`${startIso}T00:00:00`).getTime();
  const end = new Date(`${endIso}T00:00:00`).getTime();
  return Math.floor((end - start) / 86_400_000);
}

const MILESTONES = [25, 50, 75];

export const Calendar = memo(function Calendar() {
  const { t } = useTranslation();
  const { startDate, sessions, config } = useTreatmentStore((s) => ({
    startDate: s.startDate,
    sessions: s.sessions,
    config: s.config,
  }));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const today = todayISO();

  const todayDayNumber = startDate ? dayOffset(startDate, today) + 1 : 0;
  const lastSessionDayNumber = startDate
    ? Object.keys(sessions).reduce((max, iso) => {
        return Math.max(max, dayOffset(startDate, iso) + 1);
      }, 0)
    : 0;
  const finished = startDate ? todayDayNumber > config.totalDays : false;
  const displayDays = startDate
    ? finished
      ? Math.max(config.totalDays, lastSessionDayNumber)
      : Math.max(config.totalDays, todayDayNumber, lastSessionDayNumber)
    : 0;

  const dayInfos = useMemo(
    () =>
      Array.from({ length: displayDays }, (_, dayIdx) => {
        const iso = addDays(startDate!, dayIdx);
        const daySessions = sessions[iso] ?? {};
        const completed = countDayCompletedRaw(daySessions);
        const isFuture = dayIdx + 1 > todayDayNumber;
        const isToday = iso === today;
        return { dayIdx, iso, isToday, isFuture, completed };
      }),
    [displayDays, startDate, sessions, todayDayNumber, today],
  );

  const totalSessions = config.sessionsPerDay * config.totalDays;
  const completedCount = countCompletedSessions(sessions, config.sessionsPerDay);
  const pctDone = totalSessions ? Math.round((completedCount / totalSessions) * 100) : 0;

  if (!startDate) return null;

  const detailForDay = (dayIdx: number, completed: number, isFuture: boolean) => {
    const n = dayIdx + 1;
    if (isFuture) return t('home.dayDetailFuture', { n });
    if (completed === 0) return t('home.dayDetailNone', { n });
    return t('home.dayDetail', { n, completed, total: config.sessionsPerDay });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-300">{t('home.progress')}</h2>
        <span className="text-sm tabular-nums text-slate-400">
          {t('home.progressValue', { done: completedCount, total: totalSessions })}
          {' · '}{pctDone}%
        </span>
      </div>

      <ProgressSummary />

      <section className="rounded-2xl border border-slate-700/70 bg-slate-800/50 p-4">
        <div className="relative mb-4 h-2.5 overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-state-done transition-all duration-700"
            style={{ width: `${pctDone}%` }}
          />
          {MILESTONES.map((pct) => (
            <div
              key={pct}
              className={`absolute top-0 h-full w-px transition-colors duration-700 ${
                pctDone >= pct ? 'bg-state-done/70' : 'bg-slate-600'
              }`}
              style={{ left: `${pct}%` }}
            />
          ))}
        </div>

        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${displayDays}, minmax(0, 1fr))` }}
        >
          {dayInfos.map(({ dayIdx, isToday, isFuture, completed }) => {
            const isSelected = selectedDay === dayIdx;
            const ariaLabel = detailForDay(dayIdx, completed, isFuture);

            return (
              <button
                key={`d-${dayIdx}`}
                type="button"
                aria-label={ariaLabel}
                aria-pressed={isSelected}
                onClick={() => setSelectedDay(isSelected ? null : dayIdx)}
                className="flex flex-col-reverse items-center gap-[3px] rounded-sm p-0.5 transition-colors hover:bg-slate-700/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500"
              >
                <span
                  className={`text-[8px] leading-none tabular-nums ${
                    isToday ? 'font-bold text-brand-400' : 'text-slate-600'
                  }`}
                >
                  {dayIdx + 1}
                </span>
                {Array.from({ length: config.sessionsPerDay }).map((_, slotIdx) => {
                  const isDone = slotIdx < completed;
                  const isLastSquare = slotIdx === config.sessionsPerDay - 1;
                  const showExtraCount = isLastSquare && completed > config.sessionsPerDay;

                  let squareClass = '';
                  if (isDone) {
                    squareClass =
                      'border border-state-done/40 bg-gradient-to-br from-state-done/25 to-state-done/5 text-state-done';
                  } else if (isFuture) {
                    squareClass = 'border border-slate-800/60 bg-slate-900/30';
                  } else {
                    squareClass =
                      'border border-slate-700/60 bg-gradient-to-br from-slate-700/30 to-slate-800/30';
                  }

                  return (
                    <div
                      key={`s-${slotIdx}`}
                      className={`relative flex w-full items-center justify-center rounded-[3px] transition-all duration-300 ${squareClass} ${
                        isToday && !isDone
                          ? 'border-brand-500/40 ring-1 ring-inset ring-brand-500/40'
                          : ''
                      }`}
                      style={{ aspectRatio: '1 / 1' }}
                    >
                      {showExtraCount && (
                        <span className="select-none text-[7px] font-extrabold leading-none text-state-done">
                          +{completed - config.sessionsPerDay}
                        </span>
                      )}
                    </div>
                  );
                })}
              </button>
            );
          })}
        </div>

        {selectedDay !== null && (
          <p className="mt-3 text-center text-xs text-slate-300">
            {detailForDay(
              selectedDay,
              dayInfos[selectedDay].completed,
              dayInfos[selectedDay].isFuture,
            )}
          </p>
        )}
      </section>
    </div>
  );
});
