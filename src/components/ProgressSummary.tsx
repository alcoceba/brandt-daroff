import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flame, Clock, CalendarDays } from 'lucide-react';
import { CircularProgress } from '@/components/CircularProgress';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { todayISO } from '@/utils/date';
import { formatLongDuration } from '@/utils/format';
import {
  countCompletedDays,
  countCompletedSessions,
  computeStreak,
  sumInvestedSeconds,
} from '@/utils/sessions';

export const ProgressSummary = memo(function ProgressSummary() {
  const { t } = useTranslation();
  const { startDate, sessions, sessionDurations, config } = useTreatmentStore((s) => ({
    startDate: s.startDate,
    sessions: s.sessions,
    sessionDurations: s.sessionDurations,
    config: s.config,
  }));

  const today = todayISO();

  const totalSessions = config.sessionsPerDay * config.totalDays;
  const completedSessions = countCompletedSessions(sessions, config.sessionsPerDay);
  const sessionPct = totalSessions ? Math.round((completedSessions / totalSessions) * 100) : 0;
  const completedDays = useMemo(
    () => (startDate ? countCompletedDays(sessions, config, startDate) : 0),
    [sessions, config, startDate],
  );
  const streak = useMemo(
    () => (config.sessionsPerDay > 0 ? computeStreak(sessions, config, today) : 0),
    [sessions, config, today],
  );
  const investedSeconds = useMemo(() => sumInvestedSeconds(sessionDurations), [sessionDurations]);
  const investedLabel = formatLongDuration(investedSeconds);

  const daysLeft = Math.max(0, config.totalDays - completedDays);

  const finished = useMemo(() => {
    if (!startDate) return false;
    const todayDayNumber =
      Math.floor(
        (new Date(`${today}T00:00:00`).getTime() - new Date(`${startDate}T00:00:00`).getTime()) /
          86_400_000,
      ) + 1;
    return todayDayNumber > config.totalDays || completedDays >= config.totalDays;
  }, [startDate, today, completedDays, config.totalDays]);

  if (!startDate) return null;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-700/70 bg-slate-800/50 p-4">
      <CircularProgress value={completedSessions / totalSessions} size={72} strokeWidth={6}>
        <span className="text-sm font-bold text-white">{sessionPct}%</span>
      </CircularProgress>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="text-sm font-semibold text-white">
          {t('home.sessionsSummary', { done: completedSessions, total: totalSessions })}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
          {streak > 0 && (
            <span className="inline-flex items-center gap-1" aria-label={t('home.streak', { count: streak })}>
              <Flame size={12} className="text-amber-400" />
              {t('home.streak', { count: streak })}
            </span>
          )}
          <span className="inline-flex items-center gap-1" aria-label={t('home.timeInvested')}>
            <Clock size={12} className="text-brand-400" />
            {investedLabel}
          </span>
        </div>

        {!finished && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1" aria-label={t('home.daysLeft', { count: daysLeft })}>
              <CalendarDays size={12} className="text-slate-400" />
              {t('home.daysLeft', { count: daysLeft })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});
