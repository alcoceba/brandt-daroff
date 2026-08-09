import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flame, Clock, CalendarDays, Target } from 'lucide-react';
import { CircularProgress } from '@/components/CircularProgress';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { getDayNumber, todayISO } from '@/utils/date';
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
  const extrasCompleted = Math.max(0, countCompletedSessions(sessions) - completedSessions);

  const rawDayNumber = useMemo(() => {
    if (!startDate) return 1;
    const todayTime = new Date(`${today}T00:00:00`).getTime();
    const startTime = new Date(`${startDate}T00:00:00`).getTime();
    return Math.floor((todayTime - startTime) / 86_400_000) + 1;
  }, [startDate, today]);

  const currentDayNumber = startDate ? getDayNumber(startDate, config.totalDays) : 1;
  const daysLeft = Math.max(0, config.totalDays - currentDayNumber + 1);
  const sessionsToGo = Math.max(0, totalSessions - completedSessions);

  const finished = useMemo(() => {
    if (!startDate) return false;
    return rawDayNumber > config.totalDays || completedDays >= config.totalDays;
  }, [startDate, rawDayNumber, completedDays, config.totalDays]);

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
            <span className="inline-flex items-center gap-1" aria-label={streak === 1 ? t('home.streak', { count: streak }) : t('home.streaks', { count: streak })}>
              <Flame size={12} className="text-amber-400" />
              {streak === 1 ? t('home.streak', { count: streak }) : t('home.streaks', { count: streak })}
            </span>
          )}
          <span className="inline-flex items-center gap-1" aria-label={t('home.timeInvested')}>
            <Clock size={12} className="text-brand-400" />
            {investedLabel}
          </span>
          {extrasCompleted > 0 && (
            <span className="inline-flex items-center gap-1 font-medium text-brand-400" aria-label={extrasCompleted === 1 ? t('home.extraDone', { count: extrasCompleted }) : t('home.extrasDone', { count: extrasCompleted })}>
              <Target size={12} className="text-brand-400" />
              {extrasCompleted === 1 ? t('home.extraDone', { count: extrasCompleted }) : t('home.extrasDone', { count: extrasCompleted })}
            </span>
          )}
        </div>

        {!finished && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1" aria-label={daysLeft === 1 ? t('home.dayLeft', { count: daysLeft }) : t('home.daysLeft', { count: daysLeft })}>
              <CalendarDays size={12} className="text-slate-400" />
              {daysLeft === 1 ? t('home.dayLeft', { count: daysLeft }) : t('home.daysLeft', { count: daysLeft })}
            </span>
            {sessionsToGo > 0 && (
              <span className="inline-flex items-center gap-1 font-medium text-brand-400" aria-label={sessionsToGo === 1 ? t('home.sessionToGo', { count: sessionsToGo }) : t('home.sessionsToGo', { count: sessionsToGo })}>
                <Target size={12} className="text-brand-400" />
                {sessionsToGo === 1 ? t('home.sessionToGo', { count: sessionsToGo }) : t('home.sessionsToGo', { count: sessionsToGo })}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
