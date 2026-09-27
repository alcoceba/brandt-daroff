import { memo, useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { ProgressSummary } from '@/components/home/ProgressSummary';
import { todayISO } from '@/utils/date';
import {
  countCompletedSessions,
  countMissedSessions,
  getTreatmentDayInfos,
  type DayProgress,
  type TreatmentDayInfo,
} from '@/utils/sessions';

function dayCellClasses(progress: DayProgress, isFuture: boolean): string {
  if (isFuture) {
    return 'border-slate-800/60 bg-slate-900/30 text-slate-500 opacity-40 hover:opacity-70';
  }
  if (progress.state === 'done') {
    return 'border-state-done/35 bg-gradient-to-b from-state-done/25 to-state-done/10 shadow-sm hover:border-state-done/60';
  }
  if (progress.state === 'in-progress') {
    return 'border-state-progress/45 bg-gradient-to-b from-state-progress/20 to-state-progress/5 shadow-sm hover:border-state-progress/65';
  }
  if (progress.state === 'partial') {
    return 'border-amber-400/35 bg-gradient-to-b from-amber-400/20 to-amber-400/5 shadow-sm hover:border-amber-400/60';
  }
  return 'border-slate-700/50 bg-slate-800/40 hover:border-slate-600';
}

interface DayCellProps {
  dayInfo: TreatmentDayInfo;
  isSelected: boolean;
  ariaLabel: string;
  onSelect: (dayIdx: number) => void;
}

const DayCell = memo(function DayCell({
  dayInfo,
  isSelected,
  ariaLabel,
  onSelect,
}: DayCellProps) {
  const { dayIdx, isToday, isFuture, progress } = dayInfo;

  const numColour = isToday
    ? 'text-brand-400 font-bold'
    : progress.state === 'done'
      ? 'text-state-done font-bold'
      : progress.state === 'in-progress'
        ? 'text-state-progress font-bold'
        : progress.state === 'partial'
          ? 'text-amber-400 font-bold'
          : isFuture
            ? 'text-slate-600'
            : 'text-slate-300';

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      onClick={() => onSelect(dayIdx)}
      className={`relative flex min-h-[52px] sm:min-h-[56px] flex-col items-center justify-between p-1.5 sm:p-2 rounded-xl border transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
        dayCellClasses(progress, isFuture)
      } ${
        isToday
          ? 'ring-2 ring-brand-400 ring-offset-1 ring-offset-slate-900 shadow-md shadow-brand-500/20'
          : ''
      } ${isSelected ? 'ring-2 ring-white/80 border-transparent z-10 shadow-md scale-[1.03]' : ''}`}
    >
      <span className={`text-xs sm:text-sm tabular-nums leading-none ${numColour}`}>
        {dayIdx + 1}
      </span>

      <div className="flex h-4 w-4 items-center justify-center">
        {progress.state === 'done' ? (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-state-done/25 text-state-done">
            <Check size={10} strokeWidth={3} className="lucide-check" />
          </span>
        ) : progress.state === 'in-progress' ? (
          <span className="h-2 w-2 rounded-full bg-state-progress animate-pulse shadow-sm shadow-state-progress/50" />
        ) : progress.state === 'partial' ? (
          <span className="h-2 w-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
        ) : isFuture ? null : (
          <span className="h-1.5 w-1.5 rounded-full bg-slate-600/70" />
        )}
      </div>
    </button>
  );
});

export const Calendar = memo(function Calendar() {
  const { t } = useTranslation();
  const { startDate, sessions, config } = useTreatmentStore((s) => ({
    startDate: s.startDate,
    sessions: s.sessions,
    config: s.config,
  }));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const today = todayISO();

  const dayInfos = useMemo(
    () => (startDate ? getTreatmentDayInfos(startDate, sessions, config, today) : []),
    [startDate, sessions, config, today],
  );

  const totalSessions = config.sessionsPerDay * config.totalDays;
  const completedCount = countCompletedSessions(sessions, config.sessionsPerDay);
  const missedCount = startDate ? countMissedSessions(startDate, sessions, config, today) : 0;
  const pctDone = totalSessions ? Math.round((completedCount / totalSessions) * 100) : 0;
  const missedPct = totalSessions
    ? Math.min(Math.round((missedCount / totalSessions) * 100), Math.max(0, 100 - pctDone))
    : 0;
  const [animatedPct, setAnimatedPct] = useState(0);
  const [animatedMissedPct, setAnimatedMissedPct] = useState(0);

  useEffect(() => {
    setAnimatedPct(pctDone);
    setAnimatedMissedPct(missedPct);
  }, [pctDone, missedPct]);

  if (!startDate) return null;

  const detailForDay = (dayInfo: TreatmentDayInfo) => {
    const { dayIdx, isFuture, progress } = dayInfo;
    const n = dayIdx + 1;
    if (isFuture) return t('home.dayDetailFuture', { n });
    if (progress.state === 'in-progress') return t('home.dayDetailInProgress', { n });
    if (progress.completedScheduled === 0 && progress.extrasCompleted === 0) {
      return t('home.dayDetailNone', { n });
    }
    if (progress.extrasCompleted > 0) {
      return t('home.dayDetailExtra', {
        n,
        completed: progress.completedScheduled,
        total: config.sessionsPerDay,
        extras: progress.extrasCompleted,
      });
    }
    return t('home.dayDetail', {
      n,
      completed: progress.completedScheduled,
      total: config.sessionsPerDay,
    });
  };

  const handleSelectDay = (dayIdx: number) => {
    setSelectedDay((prev) => (prev === dayIdx ? null : dayIdx));
  };

  return (
    <div className="flex flex-col gap-3">
      <ProgressSummary
        pct={pctDone}
        animatedPct={animatedPct}
        missedPct={missedPct}
        animatedMissedPct={animatedMissedPct}
      />

      <section className="rounded-2xl border border-slate-700/80 bg-slate-800/75 p-3 sm:p-4 backdrop-blur-sm shadow-xl">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {dayInfos.map((dayInfo) => (
            <DayCell
              key={`d-${dayInfo.dayIdx}`}
              dayInfo={dayInfo}
              isSelected={selectedDay === dayInfo.dayIdx}
              ariaLabel={detailForDay(dayInfo)}
              onSelect={handleSelectDay}
            />
          ))}
        </div>

        <div className="mt-3 flex min-h-[38px] items-center justify-center rounded-full border border-slate-700/50 bg-slate-900/50 px-4 py-2 text-center">
          {selectedDay !== null ? (
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-200">
              <CalendarDays size={13} className="shrink-0 text-brand-400" />
              <span className="font-semibold text-white">
                {detailForDay(dayInfos[selectedDay])}
              </span>
              {dayInfos[selectedDay]?.isToday && (
                <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-bold text-brand-400">
                  {t('common.today')}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3.5 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-state-done/25 text-state-done">
                  <Check size={9} strokeWidth={3} />
                </span>
                {t('home.legendDone')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
                {t('home.legendPartial')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-600/70" />
                {t('home.legendPending')}
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
});
