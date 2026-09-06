import { memo, useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { ProgressSummary } from '@/components/home/ProgressSummary';
import { todayISO } from '@/utils/date';
import {
  countCompletedSessions,
  getTreatmentDayInfos,
  type DayProgress,
  type TreatmentDayInfo,
} from '@/utils/sessions';

const MILESTONES = [25, 50, 75];

function dayCellClasses(progress: DayProgress, isFuture: boolean): string {
  if (isFuture) {
    return 'border-slate-800/60 bg-slate-900/30 text-slate-500 opacity-60 hover:opacity-90';
  }
  if (progress.state === 'done') {
    return 'border-state-done/40 bg-gradient-to-br from-state-done/25 to-state-done/10 text-state-done shadow-sm';
  }
  if (progress.state === 'in-progress') {
    return 'border-state-progress/50 bg-gradient-to-br from-state-progress/20 to-state-progress/5 text-state-progress shadow-sm';
  }
  if (progress.state === 'partial') {
    return 'border-brand-500/40 bg-gradient-to-br from-brand-500/15 to-brand-500/5 text-brand-400 shadow-sm';
  }
  return 'border-slate-700/60 bg-gradient-to-br from-slate-700/30 to-slate-800/30 text-slate-400';
}

interface MilestoneBarProps {
  pct: number;
  animatedPct: number;
}

const MilestoneBar = memo(function MilestoneBar({ pct, animatedPct }: MilestoneBarProps) {
  return (
    <div className="relative mb-3 h-2 overflow-hidden rounded-full bg-slate-700 sm:mb-4 sm:h-2.5">
      <div
        className="h-full rounded-full bg-state-done transition-all duration-700"
        style={{ width: `${animatedPct}%` }}
      />
      {MILESTONES.map((pctMark) => (
        <div
          key={pctMark}
          className={`absolute top-0 h-full w-px transition-colors duration-700 ${
            pct >= pctMark ? 'bg-state-done/70' : 'bg-slate-600'
          }`}
          style={{ left: `${pctMark}%` }}
        />
      ))}
    </div>
  );
});

interface DayCellProps {
  dayInfo: TreatmentDayInfo;
  isSelected: boolean;
  sessionsPerDay: number;
  ariaLabel: string;
  onSelect: (dayIdx: number) => void;
}

const DayCell = memo(function DayCell({
  dayInfo,
  isSelected,
  sessionsPerDay,
  ariaLabel,
  onSelect,
}: DayCellProps) {
  const { dayIdx, isToday, isFuture, progress } = dayInfo;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      onClick={() => onSelect(dayIdx)}
      className={`relative flex min-h-[52px] flex-col items-center justify-between rounded-xl border p-1.5 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:min-h-[56px] sm:p-2 ${
        dayCellClasses(progress, isFuture)
      } ${
        isToday
          ? 'ring-2 ring-brand-400 ring-offset-2 ring-offset-slate-900 ring-brand-500/60 shadow-md shadow-brand-500/20'
          : ''
      } ${isSelected ? 'ring-2 ring-white border-transparent z-10 shadow-md' : ''}`}
    >
      <span
        className={`text-sm font-bold leading-none tabular-nums sm:text-base ${
          isToday ? 'text-brand-400' : isFuture ? 'text-slate-500' : 'text-slate-200'
        }`}
      >
        {dayIdx + 1}
      </span>

      {progress.state === 'done' ? (
        <div className="grid h-4 w-4 place-items-center rounded-full bg-state-done/20 text-state-done sm:h-4.5 sm:w-4.5">
          <Check size={12} strokeWidth={3} className="lucide-check" />
        </div>
      ) : (
        <div className="flex items-center justify-center gap-1 pb-0.5">
          {Array.from({ length: sessionsPerDay }).map((_, sIdx) => {
            const isFilled = sIdx < progress.completedScheduled;
            const isInProg =
              !isFilled && progress.hasInProgress && sIdx === progress.completedScheduled;
            return (
              <span
                key={sIdx}
                className={`h-1.5 w-1.5 rounded-full transition-all sm:h-2 sm:w-2 ${
                  isFilled
                    ? 'bg-state-done shadow-sm shadow-state-done/50'
                    : isInProg
                      ? 'bg-state-progress animate-pulse'
                      : isFuture
                        ? 'bg-slate-800'
                        : 'bg-slate-700'
                }`}
              />
            );
          })}
        </div>
      )}
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
  const pctDone = totalSessions ? Math.round((completedCount / totalSessions) * 100) : 0;
  const [animatedPct, setAnimatedPct] = useState(0);

  useEffect(() => {
    setAnimatedPct(pctDone);
  }, [pctDone]);

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
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-300">
          <TrendingUp size={16} className="text-brand-400" strokeWidth={2} />
          {t('home.progress')}
        </h2>
        <span className="text-sm tabular-nums text-slate-400">
          {t('home.progressValue', { done: completedCount, total: totalSessions })}
          {' · '}
          {pctDone}%
        </span>
      </div>

      <ProgressSummary />

      <section className="rounded-2xl border border-slate-700/80 bg-slate-800/75 p-3 sm:p-4 backdrop-blur-sm shadow-xl">
        <MilestoneBar pct={pctDone} animatedPct={animatedPct} />

        <div className="grid grid-cols-4 min-[380px]:grid-cols-5 sm:grid-cols-7 gap-2">
          {dayInfos.map((dayInfo) => (
            <DayCell
              key={`d-${dayInfo.dayIdx}`}
              dayInfo={dayInfo}
              isSelected={selectedDay === dayInfo.dayIdx}
              sessionsPerDay={config.sessionsPerDay}
              ariaLabel={detailForDay(dayInfo)}
              onSelect={handleSelectDay}
            />
          ))}
        </div>

        <div className="mt-2.5 flex min-h-[42px] items-center justify-center rounded-xl border border-slate-700/50 bg-slate-900/50 px-3 py-2 text-center backdrop-blur-sm sm:mt-3">
          {selectedDay !== null ? (
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-300">
              <CalendarDays size={14} className="shrink-0 text-brand-400" />
              <span className="font-semibold text-white">
                {detailForDay(dayInfos[selectedDay])}
              </span>
              {dayInfos[selectedDay]?.isToday && (
                <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-bold text-brand-400">
                  {t('common.today', 'Avui')}
                </span>
              )}
            </div>
          ) : (
            <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <CalendarDays size={14} className="shrink-0 text-slate-500" />
              {t('home.dayDetailHint')}
            </p>
          )}
        </div>
      </section>
    </div>
  );
});
