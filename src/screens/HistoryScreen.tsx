import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Flame,
  Play,
  Sparkles,
  X,
} from 'lucide-react';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { CircularProgress } from '@/components/core/CircularProgress';
import { StatCard } from '@/components/core/StatCard';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { addDays, todayISO } from '@/utils/date';
import { formatLongDuration } from '@/utils/format';
import {
  getDayProgress,
  getDaySessionsView,
  getTreatmentSummary,
  type DayProgress,
  type DaySessionView,
} from '@/utils/sessions';

interface HistoryScreenProps {
  onBack: () => void;
  onStartSession?: (sessionId: string) => void;
}

type FilterMode = 'all' | 'completed' | 'pending';

function getSlotName(
  t: (key: string, options?: Record<string, unknown>) => string,
  n: number,
  sessionsPerDay: number,
  isExtra: boolean,
): string {
  if (isExtra) {
    return t('session.slotExtra', { n: Math.max(1, n - sessionsPerDay) });
  }
  if (sessionsPerDay === 3) {
    if (n === 1) return t('session.slotMorning');
    if (n === 2) return t('session.slotMidday');
    if (n === 3) return t('session.slotEvening');
  }
  return t('session.sessionN', { n });
}

function formatDate(iso: string, lang: string): string {
  try {
    const d = new Date(`${iso}T00:00:00`);
    return new Intl.DateTimeFormat(lang, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return iso;
  }
}

interface DayCardProps {
  dayIdx: number;
  isoDate: string;
  isToday: boolean;
  isFuture: boolean;
  dayProgress: DayProgress;
  sessionsView: DaySessionView[];
  dayDurations: Record<string, number>;
  sessionsPerDay: number;
  lang: string;
}

const DayCard = memo(function DayCard({
  dayIdx,
  isoDate,
  isToday,
  isFuture,
  dayProgress,
  sessionsView,
  dayDurations,
  sessionsPerDay,
  lang,
}: DayCardProps) {
  const { t } = useTranslation();
  const dayNumber = dayIdx + 1;
  const formattedDate = useMemo(() => formatDate(isoDate, lang), [isoDate, lang]);

  const totalDayInvested = useMemo(() => {
    return Object.values(dayDurations).reduce((acc, curr) => acc + curr, 0);
  }, [dayDurations]);

  const statusBadge = useMemo(() => {
    if (isFuture) {
      return (
        <span className="rounded-full bg-slate-800/80 px-2.5 py-0.5 text-xs font-medium text-slate-400">
          {t('history.statusUpcoming')}
        </span>
      );
    }
    if (dayProgress.state === 'done') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-state-done/20 px-2.5 py-0.5 text-xs font-semibold text-state-done">
          <Check size={12} strokeWidth={3} />
          {t('history.statusDone')}
        </span>
      );
    }
    if (isToday && dayProgress.hasInProgress) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-state-progress/20 px-2.5 py-0.5 text-xs font-semibold text-state-progress animate-pulse">
          <Play size={10} className="fill-current" />
          {t('history.statusInProgress')}
        </span>
      );
    }
    if (isToday) {
      return (
        <span className="rounded-full bg-brand-500/20 px-2.5 py-0.5 text-xs font-bold text-brand-400">
          {t('common.today')}
        </span>
      );
    }
    if (dayProgress.completedScheduled > 0) {
      return (
        <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
          {t('history.statusPartial')} ({dayProgress.completedScheduled}/{sessionsPerDay})
        </span>
      );
    }
    return (
      <span className="rounded-full bg-slate-700/60 px-2.5 py-0.5 text-xs font-medium text-slate-400">
        {t('history.statusMissed')}
      </span>
    );
  }, [isFuture, dayProgress, isToday, sessionsPerDay, t]);

  return (
    <article
      className={`flex flex-col gap-3 rounded-2xl border p-4 transition-all ${
        isToday
          ? 'border-brand-500/50 bg-gradient-to-b from-brand-500/10 to-slate-800/70 shadow-lg shadow-brand-500/10'
          : isFuture
            ? 'border-slate-800/60 bg-slate-900/30 opacity-60'
            : 'border-slate-700/70 bg-slate-800/60 shadow-sm'
      }`}
    >
      <header className="flex items-center justify-between gap-2 border-b border-slate-700/40 pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold tabular-nums text-sm ${
              dayProgress.state === 'done'
                ? 'bg-state-done/20 text-state-done'
                : isToday
                  ? 'bg-brand-500/25 text-brand-400 ring-1 ring-brand-400/50'
                  : isFuture
                    ? 'bg-slate-800 text-slate-500'
                    : 'bg-slate-700/60 text-slate-300'
            }`}
          >
            {dayNumber}
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-sm font-bold text-white truncate">
              {t('history.dayN', { n: dayNumber })}
            </h2>
            <span className="text-xs text-slate-400 capitalize">{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {totalDayInvested > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400">
              <Clock size={12} className="text-brand-400" />
              {formatLongDuration(totalDayInvested)}
            </span>
          )}
          {statusBadge}
        </div>
      </header>

      <ul className="flex flex-col gap-2">
        {sessionsView.map((s) => {
          const slotLabel = getSlotName(t, s.n, sessionsPerDay, s.isExtra);
          const duration = dayDurations[s.id];
          const isDone = s.status === 'completed';
          const isInProg = s.status === 'in-progress';
          const isMissedPast = !isDone && !isInProg && !isFuture && !isToday;

          return (
            <li
              key={s.id}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                isDone
                  ? 'bg-state-done/10 border border-state-done/20 text-slate-200'
                  : isInProg
                    ? 'bg-state-progress/10 border border-state-progress/30 text-state-progress'
                    : isMissedPast
                      ? 'bg-slate-900/40 border border-slate-800 text-slate-400'
                      : 'bg-slate-900/30 border border-slate-800/60 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    isDone
                      ? 'bg-state-done text-slate-950 font-bold'
                      : isInProg
                        ? 'bg-state-progress text-slate-950'
                        : isMissedPast
                          ? 'bg-slate-700/60 text-slate-400'
                          : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isDone ? (
                    <Check size={12} strokeWidth={3} />
                  ) : isInProg ? (
                    <Play size={9} className="fill-current ml-0.5" />
                  ) : isMissedPast ? (
                    <X size={11} strokeWidth={2.5} />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                  )}
                </div>

                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className={`font-semibold ${
                      isDone
                        ? 'text-white'
                        : isInProg
                          ? 'text-state-progress'
                          : isMissedPast
                            ? 'text-slate-400'
                            : 'text-slate-400'
                    }`}
                  >
                    {slotLabel}
                  </span>
                  {s.isExtra && (
                    <span className="rounded-full bg-brand-500/20 px-1.5 py-0.2 text-[10px] font-bold text-brand-400">
                      {t('history.extraBadge')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {duration && duration > 0 ? (
                  <span className="inline-flex items-center gap-1 font-mono tabular-nums text-slate-300">
                    <Clock size={11} className="text-brand-400" />
                    {formatLongDuration(duration)}
                  </span>
                ) : isDone ? (
                  <span className="text-[11px] text-state-done font-medium">
                    {t('history.statusDone')}
                  </span>
                ) : isInProg ? (
                  <span className="text-[11px] text-state-progress font-medium">
                    {t('history.statusInProgress')}
                  </span>
                ) : isMissedPast ? (
                  <span className="text-[11px] text-slate-500">
                    {t('history.statusMissed')}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-600">
                    {t('history.statusUpcoming')}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </article>
  );
});

export const HistoryScreen = memo(function HistoryScreen({ onBack }: HistoryScreenProps) {
  const { t, i18n } = useTranslation();
  const { startDate, sessions, sessionDurations, config } = useTreatmentStore((s) => ({
    startDate: s.startDate,
    sessions: s.sessions,
    sessionDurations: s.sessionDurations,
    config: s.config,
  }));

  const today = todayISO();
  const lang = i18n.language || 'en';

  const summary = useMemo(
    () => getTreatmentSummary(startDate, sessions, sessionDurations, config, today),
    [startDate, sessions, sessionDurations, config, today],
  );

  const [filter, setFilter] = useState<FilterMode>('all');

  const allDayCardsData = useMemo(() => {
    if (!startDate) return [];
    return Array.from({ length: config.totalDays }, (_, dayIdx) => {
      const isoDate = addDays(startDate, dayIdx);
      const isToday = isoDate === today;
      const isFuture = isoDate > today;
      const daySessions = sessions[isoDate] ?? {};
      const dayProgress = getDayProgress(daySessions, config.sessionsPerDay);
      const sessionsView = getDaySessionsView(daySessions, config.sessionsPerDay);
      const dayDurs = sessionDurations[isoDate] ?? {};

      return {
        dayIdx,
        isoDate,
        isToday,
        isFuture,
        dayProgress,
        sessionsView,
        dayDurations: dayDurs,
      };
    });
  }, [startDate, config.totalDays, config.sessionsPerDay, today, sessions, sessionDurations]);

  const filteredDays = useMemo(() => {
    if (filter === 'completed') {
      return allDayCardsData.filter((d) => d.dayProgress.state === 'done');
    }
    if (filter === 'pending') {
      return allDayCardsData.filter((d) => d.dayProgress.state !== 'done');
    }
    return allDayCardsData;
  }, [allDayCardsData, filter]);

  if (!startDate) return null;

  const {
    completedSessions,
    totalSessions,
    sessionPct,
    missedSessions,
    streak,
    investedSeconds,
  } = summary;

  return (
    <div className="flex flex-1 flex-col gap-4 px-3 py-5 sm:px-5">
      <ScreenHeader title={t('history.title')} onBack={onBack} />

      <section className="flex flex-col gap-3 rounded-2xl border border-slate-700/80 bg-slate-800/80 p-4 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <CircularProgress
            value={totalSessions > 0 ? completedSessions / totalSessions : 0}
            secondaryValue={totalSessions > 0 ? missedSessions / totalSessions : 0}
            size={76}
            strokeWidth={6}
          >
            <span className="text-sm font-bold text-emerald-400">{sessionPct}%</span>
          </CircularProgress>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2 className="text-sm font-bold text-white">
              {t('home.sessionsSummary', { done: completedSessions, total: totalSessions })}
            </h2>
            <p className="text-xs text-slate-400">{t('history.subtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-slate-700/60 pt-3 min-[480px]:grid-cols-4">
          <StatCard
            variant="compact"
            icon={<Clock size={12} className="text-brand-400" />}
            label={t('history.totalInvested')}
            value={formatLongDuration(investedSeconds)}
          />

          <StatCard
            variant="compact"
            icon={<Flame size={12} className="text-amber-400" />}
            label={t('history.streak')}
            value={`${streak} ${streak === 1 ? t('home.streak', { count: streak }) : t('home.streaks', { count: streak })}`}
          />

          <StatCard
            variant="compact"
            icon={<CheckCircle2 size={12} className="text-state-done" />}
            label={t('history.completedSessions')}
            value={`${completedSessions} / ${totalSessions}`}
            valueClassName="text-state-done"
          />

          <StatCard
            variant="compact"
            icon={<AlertCircle size={12} className="text-amber-400" />}
            label={t('history.missedSessions')}
            value={missedSessions}
            valueClassName={missedSessions > 0 ? 'text-amber-400' : 'text-slate-400'}
          />
        </div>
      </section>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-300">
          <CalendarDays size={16} className="text-brand-400" />
          <span>{t('home.treatmentCalendar')}</span>
        </h3>

        <div className="grid grid-cols-3 rounded-xl border border-slate-700/60 bg-slate-900/60 p-1 text-xs sm:flex sm:w-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-lg py-1.5 px-3 text-center font-medium transition-colors ${
              filter === 'all'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('history.filterAll')}
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`rounded-lg py-1.5 px-3 text-center font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('history.filterCompleted')}
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`rounded-lg py-1.5 px-3 text-center font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('history.filterPending')}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 pb-6">
        {filteredDays.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/30 p-8 text-center text-slate-400">
            <Sparkles size={28} className="text-slate-600 mb-2" />
            <p className="text-sm">{t('history.noSessionsRecorded')}</p>
          </div>
        ) : (
          filteredDays.map((d) => (
            <DayCard
              key={`day-${d.dayIdx}`}
              dayIdx={d.dayIdx}
              isoDate={d.isoDate}
              isToday={d.isToday}
              isFuture={d.isFuture}
              dayProgress={d.dayProgress}
              sessionsView={d.sessionsView}
              dayDurations={d.dayDurations}
              sessionsPerDay={config.sessionsPerDay}
              lang={lang}
            />
          ))
        )}
      </div>
    </div>
  );
});
