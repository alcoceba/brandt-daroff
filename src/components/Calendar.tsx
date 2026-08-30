import { memo, useEffect, useMemo, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { ProgressSummary } from '@/components/ProgressSummary';
import { todayISO } from '@/utils/date';
import {
  chunkIntoWeeks,
  countCompletedSessions,
  getTreatmentDayInfos,
  type DayProgress,
  type TreatmentDayInfo,
} from '@/utils/sessions';

const MILESTONES = [25, 50, 75];

function dayCellClasses(progress: DayProgress, isFuture: boolean): string {
  if (isFuture) {
    return 'border-slate-800/60 bg-slate-900/30';
  }
  if (progress.state === 'done') {
    return 'border-state-done/40 bg-gradient-to-br from-state-done/25 to-state-done/5';
  }
  if (progress.state === 'in-progress') {
    return 'border-state-progress/40 bg-gradient-to-br from-state-progress/15 to-state-progress/5';
  }
  if (progress.state === 'partial') {
    return 'border-brand-500/40 bg-gradient-to-br from-brand-500/15 to-brand-500/5';
  }
  return 'border-slate-700/60 bg-gradient-to-br from-slate-700/30 to-slate-800/30';
}

interface MilestoneBarProps {
  pct: number;
  animatedPct: number;
}

const MilestoneBar = memo(function MilestoneBar({ pct, animatedPct }: MilestoneBarProps) {
  return (
    <div className="relative mb-4 h-2.5 overflow-hidden rounded-full bg-slate-700">
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
  ariaLabel: string;
  onSelect: (dayIdx: number) => void;
}

const DayCell = memo(function DayCell({ dayInfo, isSelected, ariaLabel, onSelect }: DayCellProps) {
  const { dayIdx, isToday, isFuture, progress } = dayInfo;
  const fillWidth = `${Math.round(progress.ratio * 100)}%`;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      onClick={() => onSelect(dayIdx)}
      className={`relative flex min-h-[48px] flex-col items-center justify-between gap-1 rounded-lg border px-0.5 py-1.5 transition-all hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 sm:min-h-[56px] ${
        dayCellClasses(progress, isFuture)
      } ${isToday ? 'ring-1 ring-brand-500/60' : ''}`}
    >
      <span
        className={`text-xs leading-none tabular-nums ${
          isToday ? 'font-bold text-brand-400' : 'text-slate-400'
        }`}
      >
        {dayIdx + 1}
      </span>
      <div className="flex w-full flex-1 flex-col justify-end gap-1">
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-700/60 sm:h-2">
          <div
            className={`absolute left-0 top-0 h-full rounded-full ${
              progress.state === 'done' ? 'bg-state-done' : 'bg-brand-500'
            }`}
            style={{ width: fillWidth }}
          />
        </div>
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
  const weeks = useMemo(() => chunkIntoWeeks(dayInfos), [dayInfos]);

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
    return t('home.dayDetail', { n, completed: progress.completedScheduled, total: config.sessionsPerDay });
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
          {' · '}{pctDone}%
        </span>
      </div>

      <ProgressSummary />

      <section className="rounded-2xl border border-slate-700/70 bg-slate-800/50 p-3 sm:p-4">
        <MilestoneBar pct={pctDone} animatedPct={animatedPct} />

        <div className="flex flex-col gap-1.5 sm:gap-2">
          {weeks.map((week, weekIdx) => (
            <div
              key={`w-${weekIdx}`}
              className="grid grid-cols-7 gap-1.5 sm:gap-2"
            >
              {week.map((dayInfo) => (
                <DayCell
                  key={`d-${dayInfo.dayIdx}`}
                  dayInfo={dayInfo}
                  isSelected={selectedDay === dayInfo.dayIdx}
                  ariaLabel={detailForDay(dayInfo)}
                  onSelect={handleSelectDay}
                />
              ))}
            </div>
          ))}
        </div>

        <p
          className={`mt-3 text-center text-xs ${
            selectedDay !== null ? 'text-slate-300' : 'text-slate-500'
          }`}
        >
          {selectedDay !== null ? detailForDay(dayInfos[selectedDay]) : t('home.dayDetailHint')}
        </p>
      </section>
    </div>
  );
});
