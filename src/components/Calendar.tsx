import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { addDays, todayISO } from '@/utils/date';
import { countCompletedSessions, isTreatmentComplete } from '@/utils/sessions';
import type { SessionStatus } from '@/types';

function dayOffset(startIso: string, endIso: string): number {
  const start = new Date(`${startIso}T00:00:00`).getTime();
  const end = new Date(`${endIso}T00:00:00`).getTime();
  return Math.floor((end - start) / 86_400_000);
}

function countDayCompleted(sessions: Record<string, SessionStatus>): number {
  return Object.values(sessions).filter((s) => s === 'completed').length;
}

export const Calendar = memo(function Calendar() {
  const { t } = useTranslation();
  const { startDate, sessions, config } = useTreatmentStore((s) => ({
    startDate: s.startDate,
    sessions: s.sessions,
    config: s.config,
  }));

  if (!startDate) return null;

  const totalSessions = config.sessionsPerDay * config.totalDays;
  const completedCount = countCompletedSessions(sessions, config.sessionsPerDay);
  const pctDone = totalSessions ? Math.round((completedCount / totalSessions) * 100) : 0;
  const today = todayISO();
  const todayDayNumber = dayOffset(startDate, today) + 1;
  const treatmentFinished = isTreatmentComplete(startDate, sessions, config);
  const finished = todayDayNumber > config.totalDays || treatmentFinished;
  const lastSessionDayNumber = Object.keys(sessions).reduce((max, iso) => {
    return Math.max(max, dayOffset(startDate, iso) + 1);
  }, 0);
  const displayDays = finished
    ? Math.max(config.totalDays, lastSessionDayNumber)
    : Math.max(config.totalDays, todayDayNumber, lastSessionDayNumber);

  const dayInfos = Array.from({ length: displayDays }, (_, dayIdx) => {
    const iso = addDays(startDate, dayIdx);
    const daySessions = sessions[iso] ?? {};
    const completed = countDayCompleted(daySessions);
    const isFuture = dayIdx + 1 > todayDayNumber;
    const isToday = iso === today;
    return { dayIdx, isToday, isFuture, completed };
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-300">{t('home.progress')}</h2>
        <span className="text-sm tabular-nums text-slate-400">
          {t('home.progressValue', { done: completedCount, total: totalSessions })}
          {' · '}{pctDone}%
        </span>
      </div>
      <section className="rounded-2xl border border-slate-700/70 bg-slate-800/50 p-4">
        <div className="mb-4 h-2.5 overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-state-done transition-all duration-700"
            style={{ width: `${pctDone}%` }}
          />
        </div>

        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${displayDays}, minmax(0, 1fr))` }}
        >
          {dayInfos.map(({ dayIdx, isToday, isFuture, completed }) => {
            return (
              <div key={`d-${dayIdx}`} className="flex flex-col-reverse items-center gap-[3px]">
                <span
                  className={`text-[8px] leading-none tabular-nums ${isToday ? 'font-bold text-brand-400' : 'text-slate-600'
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
                    squareClass = 'border border-state-done/40 bg-gradient-to-br from-state-done/25 to-state-done/5 text-state-done';
                  } else if (isFuture) {
                    squareClass = 'border border-slate-800/60 bg-slate-900/30';
                  } else {
                    squareClass = 'border border-slate-700/60 bg-gradient-to-br from-slate-700/30 to-slate-800/30';
                  }

                  return (
                    <div
                      key={`s-${slotIdx}`}
                      className={`relative flex items-center justify-center w-full rounded-[3px] transition-all duration-300 ${squareClass} ${isToday && !isDone ? 'ring-1 ring-inset ring-brand-500/40 border-brand-500/40' : ''
                        }`}
                      style={{ aspectRatio: '1 / 1' }}
                    >
                      {showExtraCount && (
                        <span className="text-[7px] font-extrabold select-none leading-none text-state-done">
                          +{completed - config.sessionsPerDay}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
});
