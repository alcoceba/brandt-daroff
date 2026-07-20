import { memo, useCallback, useMemo, useState } from 'react';
import { ChevronRight, Info, Settings as SettingsIcon, Sparkles, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSessionSlots } from '@/constants/positions';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { getDayNumber, todayISO } from '@/utils/date';
import { Calendar } from '@/components/Calendar';
import { ConfirmDialog } from '@/components/core/ConfirmDialog';
import { isTreatmentComplete } from '@/utils/sessions';
import type { SessionStatus } from '@/types';

interface HomeScreenProps {
  onStartSession: (sessionId: string) => void;
  onOpenSettings: () => void;
  onOpenInfo: () => void;
}

function countCompletedToday(sessions: Record<string, Record<string, SessionStatus>>, today: string): number {
  const daySessions = sessions[today] ?? {};
  return Object.values(daySessions).filter((status) => status === 'completed').length;
}

export const HomeScreen = memo(function HomeScreen({
  onStartSession,
  onOpenSettings,
  onOpenInfo,
}: HomeScreenProps) {
  const { t } = useTranslation();
  const { config, sessions, startDate, setSessionStatus, clearSessionProgress } = useTreatmentStore(
    (s) => ({
      config: s.config,
      sessions: s.sessions,
      startDate: s.startDate,
      setSessionStatus: s.setSessionStatus,
      clearSessionProgress: s.clearSessionProgress,
    }),
  );

  const [completeNoticeDismissed, setCompleteNoticeDismissed] = useState(false);
  const [restartSlot, setRestartSlot] = useState<string | null>(null);

  const today = todayISO();
  const dayNumber = startDate ? getDayNumber(startDate, config.totalDays) : 1;
  const rawDayNumber = useMemo(() => {
    if (!startDate) return 1;
    return (
      Math.floor(
        (new Date(`${today}T00:00:00`).getTime() - new Date(`${startDate}T00:00:00`).getTime()) /
        86_400_000,
      ) + 1
    );
  }, [startDate, today]);

  const todaySessions = useMemo(() => sessions[today] ?? {}, [sessions, today]);

  const completedToday = useMemo(() => countCompletedToday(sessions, today), [sessions, today]);

  const treatmentFinished = useMemo(() => {
    if (!startDate) return false;
    return isTreatmentComplete(startDate, sessions, config);
  }, [startDate, sessions, config]);

  const finished = rawDayNumber > config.totalDays || treatmentFinished;
  const goalReached = completedToday >= config.sessionsPerDay;
  const extraCount = Math.max(0, completedToday - config.sessionsPerDay);

  const slots = useMemo(() => getSessionSlots(config.sessionsPerDay), [config.sessionsPerDay]);

  const activeSlot = useMemo(
    () => slots.find((slot) => todaySessions[slot.id] !== 'completed') ?? null,
    [slots, todaySessions],
  );

  const activeStatus: SessionStatus = activeSlot ? (todaySessions[activeSlot.id] ?? 'pending') : 'completed';

  const handleStart = useCallback(() => {
    if (!activeSlot) {
      const nextExtraId = `session-${completedToday + 1}`;
      onStartSession(nextExtraId);
      return;
    }
    if (activeStatus === 'completed') {
      setRestartSlot(activeSlot.id);
      return;
    }
    onStartSession(activeSlot.id);
  }, [activeSlot, activeStatus, completedToday, onStartSession]);

  const handleStartExtra = useCallback(() => {
    const nextExtraId = `session-${completedToday + 1}`;
    onStartSession(nextExtraId);
  }, [completedToday, onStartSession]);

  const confirmRestart = useCallback(() => {
    if (!restartSlot) return;
    setSessionStatus(today, restartSlot, 'pending');
    clearSessionProgress(today, restartSlot);
    onStartSession(restartSlot);
    setRestartSlot(null);
  }, [restartSlot, setSessionStatus, clearSessionProgress, onStartSession, today]);

  const sessionNumber = activeSlot
    ? Number(activeSlot.id.split('-')[1])
    : completedToday + 1;

  const buttonLabel = activeStatus === 'in-progress'
    ? t('home.resume')
    : t('home.start');

  const buttonSubLabel = activeSlot
    ? t('session.sessionN', { n: sessionNumber })
    : null;

  const motivationMessage = useMemo(() => {
    if (completedToday >= config.sessionsPerDay) {
      return t('home.motivationGoal');
    }
    const hour = new Date().getHours();
    if (hour >= 15 && completedToday === 0) {
      return t('home.motivationNoSessionsAfternoon');
    }
    if (hour >= 20 && completedToday < config.sessionsPerDay) {
      return t('home.motivationLateReminder');
    }
    if (completedToday > 0) {
      return t('home.motivationProgress');
    }
    return t('home.motivationStartDay');
  }, [completedToday, config.sessionsPerDay, t]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h1 className="whitespace-nowrap text-xl font-bold text-white">{t('home.title')}</h1>
            {finished ? (
              <span className="text-lg font-bold text-state-done">{t('home.complete')}</span>
            ) : (
              <span className="whitespace-nowrap text-lg font-semibold text-brand-500">
                {t('home.day', { x: dayNumber, total: config.totalDays })}
              </span>
            )}
          </div>
        </div>
      </header>

      {!finished && (
        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-4 flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-brand-400 shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="text-sm text-slate-300 leading-relaxed">{motivationMessage}</p>
        </div>
      )}

      {finished && !completeNoticeDismissed ? (
        <section className="flex flex-col items-center gap-4 rounded-2xl border border-slate-700 bg-slate-800 p-6 text-center">
          <Trophy className="h-16 w-16 text-state-done" strokeWidth={1.5} />
          <div>
            <h2 className="text-2xl font-bold text-white">{t('home.treatmentComplete')}</h2>
            <p className="mt-2 text-sm text-slate-300">{t('home.treatmentCompleteBody')}</p>
          </div>
          <button
            type="button"
            onClick={() => setCompleteNoticeDismissed(true)}
            className="min-h-touch w-full rounded-xl bg-state-done text-lg font-bold text-white"
          >
            {t('common.close')}
          </button>
        </section>
      ) : (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300">{t('home.todaysSessions')}</h2>
            <span className="text-sm text-slate-400">
              {goalReached
                ? t('home.allSessionsCompletedToday')
                : t('home.sessionsCompleted', {
                  completed: completedToday,
                  total: config.sessionsPerDay,
                })}
            </span>
          </div>

          {goalReached ? (
            <div className="rounded-2xl border border-state-done/30 bg-gradient-to-br from-state-done/10 via-state-done/5 to-transparent p-4">
              <div className="mb-4 flex flex-col items-center gap-2 text-center">
                <Sparkles className="h-6 w-6 text-state-done" strokeWidth={1.5} />
                <p className="text-lg font-bold text-state-done">{t('home.goalReached')}</p>
                {extraCount > 0 && (
                  <p className="mt-1 text-xs text-slate-400">
                    {t('home.extraSessions', { count: extraCount })}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleStartExtra}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white transition-all duration-200 hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/25 active:scale-[0.98]"
              >
                <span>{t('home.addExtraSession')}</span>
                <ChevronRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleStart}
              className={`group w-full overflow-hidden rounded-2xl border text-left transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${activeStatus === 'in-progress'
                ? 'border-state-progress/40 bg-gradient-to-r from-state-progress/10 to-state-progress/5 hover:border-state-progress/60 hover:shadow-lg hover:shadow-state-progress/10'
                : 'border-brand-500/40 bg-gradient-to-r from-brand-500/10 to-brand-500/5 hover:border-brand-500/70 hover:from-brand-500/15 hover:to-brand-500/8 hover:shadow-lg hover:shadow-brand-500/15'
                }`}
            >
              <div className="flex items-center gap-4 p-5">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-lg font-bold text-white">{buttonLabel}</span>
                  {buttonSubLabel && (
                    <span
                      className={`text-sm font-medium ${activeStatus === 'in-progress' ? 'text-state-progress' : 'text-brand-400'
                        }`}
                    >
                      {buttonSubLabel}
                    </span>
                  )}
                </div>
                <ChevronRight
                  size={22}
                  className={`shrink-0 transition-all duration-300 group-hover:translate-x-1 ${activeStatus === 'in-progress' ? 'text-state-progress/70' : 'text-brand-500'
                    }`}
                />
              </div>
            </button>
          )}
        </section>
      )}

      <Calendar />

      <div className="mt-auto flex gap-3">
        <button
          type="button"
          onClick={onOpenInfo}
          className="flex min-h-touch flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 font-semibold text-slate-200 transition-all duration-200 hover:bg-slate-800 hover:border-slate-600 hover:text-white hover:scale-[1.01] active:scale-[0.97]"
        >
          <Info size={20} />
          <span className="hidden sm:inline">{t('info.title')}</span>
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex min-h-touch flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 font-semibold text-slate-200 transition-all duration-200 hover:bg-slate-800 hover:border-slate-600 hover:text-white hover:scale-[1.01] active:scale-[0.97]"
        >
          <SettingsIcon size={20} />
          <span className="hidden sm:inline">{t('home.settings')}</span>
        </button>
      </div>

      <ConfirmDialog
        open={restartSlot !== null}
        title={t('home.restartSession')}
        body={t('home.confirmRestartSession')}
        confirmLabel={t('home.restartSession')}
        cancelLabel={t('common.cancel')}
        danger
        onConfirm={confirmRestart}
        onCancel={() => setRestartSlot(null)}
      />
    </div>
  );
});
