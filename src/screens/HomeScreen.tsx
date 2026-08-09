import { memo, useCallback, useMemo, useState } from 'react';
import { ChevronRight, Info, ListChecks, Settings as SettingsIcon, Sparkles, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { getDayNumber, todayISO } from '@/utils/date';
import { Calendar } from '@/components/Calendar';
import { ConfirmDialog } from '@/components/core/ConfirmDialog';
import {
  getDayProgress,
  getDaySessionsView,
  getNextSessionId,
  isTreatmentComplete,
  type DaySessionView,
} from '@/utils/sessions';
import type { SessionStatus } from '@/types';

interface HomeScreenProps {
  onStartSession: (sessionId: string) => void;
  onOpenSettings: () => void;
  onOpenInfo: () => void;
}

export const HomeScreen = memo(function HomeScreen({
  onStartSession,
  onOpenSettings,
  onOpenInfo,
}: HomeScreenProps) {
  const { t } = useTranslation();
  const { config, sessions, startDate, setSessionStatus, clearSessionProgress, resetTreatment } =
    useTreatmentStore((s) => ({
      config: s.config,
      sessions: s.sessions,
      startDate: s.startDate,
      setSessionStatus: s.setSessionStatus,
      clearSessionProgress: s.clearSessionProgress,
      resetTreatment: s.resetTreatment,
    }));

  const [completeNoticeDismissed, setCompleteNoticeDismissed] = useState(false);
  const [restartSlot, setRestartSlot] = useState<string | null>(null);
  const [newTreatmentDialogOpen, setNewTreatmentDialogOpen] = useState(false);

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

  const dayView = useMemo(
    () => getDaySessionsView(todaySessions, config.sessionsPerDay),
    [todaySessions, config.sessionsPerDay],
  );

  const dayProgress = useMemo(
    () => getDayProgress(todaySessions, config.sessionsPerDay),
    [todaySessions, config.sessionsPerDay],
  );

  const completedToday = dayProgress.completedScheduled;
  const extrasCompletedToday = dayProgress.extrasCompleted;
  const goalReached = completedToday >= config.sessionsPerDay;
  const hasInProgress = dayProgress.hasInProgress;

  const treatmentFinished = useMemo(() => {
    if (!startDate) return false;
    return isTreatmentComplete(startDate, sessions, config);
  }, [startDate, sessions, config]);

  const finished = rawDayNumber > config.totalDays || treatmentFinished;

  const activeSession = useMemo<DaySessionView | null>(() => {
    const inProgress = dayView.find((s) => s.status === 'in-progress');
    if (inProgress) return inProgress;
    return dayView.find((s) => !s.isExtra && s.status !== 'completed') ?? null;
  }, [dayView]);

  const activeStatus: SessionStatus = activeSession ? activeSession.status : 'completed';

  const handleStart = useCallback(() => {
    if (!activeSession) {
      onStartSession(getNextSessionId(todaySessions, config.sessionsPerDay));
      return;
    }
    if (activeStatus === 'completed') {
      setRestartSlot(activeSession.id);
      return;
    }
    onStartSession(activeSession.id);
  }, [activeSession, activeStatus, todaySessions, config.sessionsPerDay, onStartSession]);

  const handleStartExtra = useCallback(() => {
    onStartSession(getNextSessionId(todaySessions, config.sessionsPerDay));
  }, [todaySessions, config.sessionsPerDay, onStartSession]);

  const handleStartNewTreatment = useCallback(() => {
    resetTreatment();
    setCompleteNoticeDismissed(false);
    setNewTreatmentDialogOpen(false);
  }, [resetTreatment]);

  const confirmRestart = useCallback(() => {
    if (!restartSlot) return;
    setSessionStatus(today, restartSlot, 'pending');
    clearSessionProgress(today, restartSlot);
    onStartSession(restartSlot);
    setRestartSlot(null);
  }, [restartSlot, setSessionStatus, clearSessionProgress, onStartSession, today]);

  const buttonLabel = !activeSession
    ? t('home.addExtraSession')
    : activeStatus === 'in-progress'
      ? t('home.resume')
      : t('home.start');

  const buttonSubLabel = activeSession
    ? t('session.sessionN', { n: activeSession.n })
    : null;

  const showExtraBadge = activeSession?.isExtra ?? false;

  const motivationMessage = useMemo(() => {
    if (completedToday >= config.sessionsPerDay) {
      return null;
    }
    const hour = new Date().getHours();
    if (hour >= 15 && completedToday === 0) {
      return t('home.motivationNoSessionsAfternoon');
    }
    if (hour >= 20) {
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

      {!finished && motivationMessage && (
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
          <div className="flex w-full flex-col gap-3">
            <button
              type="button"
              onClick={handleStartExtra}
              className="group flex min-h-touch w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-lg font-bold text-white transition-all duration-200 hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/25 active:scale-[0.98]"
            >
              <span>{t('home.addExtraSession')}</span>
              <ChevronRight size={20} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={() => setNewTreatmentDialogOpen(true)}
              className="min-h-touch w-full rounded-xl bg-slate-700 text-lg font-semibold text-white transition-all duration-200 hover:bg-slate-600 active:scale-[0.98]"
            >
              {t('home.startNewTreatment')}
            </button>
          </div>
        </section>
      ) : (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-300">
              <ListChecks size={16} className="text-brand-400" strokeWidth={2} />
              {t('home.todaysSessions')}
            </h2>
            <span className="text-sm text-slate-400">
              {goalReached
                ? t('home.allSessionsCompletedToday')
                : t('home.sessionsCompleted', {
                  completed: completedToday,
                  total: config.sessionsPerDay,
                })}
            </span>
          </div>

          {goalReached && !hasInProgress && (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-state-done/30 bg-state-done/10 px-4 py-3 text-center sm:flex-row sm:justify-between sm:text-left">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 shrink-0 text-state-done" strokeWidth={1.5} />
                <p className="text-sm font-semibold text-state-done">{t('home.goalReached')}</p>
              </div>
              {extrasCompletedToday > 0 && (
                <span className="rounded-full bg-state-done/20 px-2 py-0.5 text-xs font-bold text-state-done">
                  {extrasCompletedToday === 1
                    ? t('home.extraDone', { count: extrasCompletedToday })
                    : t('home.extrasDone', { count: extrasCompletedToday })}
                </span>
              )}
            </div>
          )}

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
                  <span className="flex items-center gap-2 text-sm font-medium text-brand-400">
                    <span className={activeStatus === 'in-progress' ? 'text-state-progress' : 'text-brand-400'}>
                      {buttonSubLabel}
                    </span>
                    {showExtraBadge && (
                      <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-xs font-bold text-brand-400">
                        {t('home.extraBadge')}
                      </span>
                    )}
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

      <ConfirmDialog
        open={newTreatmentDialogOpen}
        title={t('home.startNewTreatment')}
        body={t('home.confirmStartNewTreatment')}
        confirmLabel={t('common.confirm')}
        cancelLabel={t('common.cancel')}
        danger
        onConfirm={handleStartNewTreatment}
        onCancel={() => setNewTreatmentDialogOpen(false)}
      />
    </div>
  );
});
