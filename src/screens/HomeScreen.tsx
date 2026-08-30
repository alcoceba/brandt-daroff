import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { Calendar } from '@/components/Calendar';
import { ConfirmDialog } from '@/components/core/ConfirmDialog';
import { HomeActions } from '@/components/home/HomeActions';
import { HomeHeader } from '@/components/home/HomeHeader';
import { MotivationCard } from '@/components/home/MotivationCard';
import { TodaySessionCard } from '@/components/home/TodaySessionCard';
import { TreatmentCompleteCard } from '@/components/home/TreatmentCompleteCard';
import { getDayNumber, todayISO } from '@/utils/date';
import {
  getDayProgress,
  getDaySessionsView,
  getNextSessionId,
  getTreatmentSummary,
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
  const { config, sessions, startDate, sessionDurations, setSessionStatus, clearSessionProgress, resetTreatment } =
    useTreatmentStore((s) => ({
      config: s.config,
      sessions: s.sessions,
      startDate: s.startDate,
      sessionDurations: s.sessionDurations,
      setSessionStatus: s.setSessionStatus,
      clearSessionProgress: s.clearSessionProgress,
      resetTreatment: s.resetTreatment,
    }));

  const [completeNoticeDismissed, setCompleteNoticeDismissed] = useState(false);
  const [restartSlot, setRestartSlot] = useState<string | null>(null);
  const [newTreatmentDialogOpen, setNewTreatmentDialogOpen] = useState(false);

  const today = todayISO();
  const summary = useMemo(
    () => getTreatmentSummary(startDate, sessions, sessionDurations, config, today),
    [startDate, sessions, sessionDurations, config, today],
  );
  const dayNumber = startDate ? getDayNumber(startDate, config.totalDays) : 1;
  const finished = summary.finished;

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

  const activeSession = useMemo<DaySessionView | null>(() => {
    const inProgress = dayView.find((s) => s.status === 'in-progress');
    if (inProgress) return inProgress;
    return dayView.find((s) => !s.isExtra && s.status !== 'completed') ?? null;
  }, [dayView]);

  const activeStatus: SessionStatus = activeSession ? activeSession.status : 'completed';
  const isInProgress = activeStatus === 'in-progress';

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

  const buttonSubLabel = activeSession ? t('session.sessionN', { n: activeSession.n }) : null;
  const showExtraBadge = activeSession?.isExtra ?? false;

  const motivationMessage = useMemo(() => {
    if (goalReached) return null;
    const hour = new Date().getHours();
    if (hour >= 15 && completedToday === 0) return t('home.motivationNoSessionsAfternoon');
    if (hour >= 20) return t('home.motivationLateReminder');
    if (completedToday > 0) return t('home.motivationProgress');
    return t('home.motivationStartDay');
  }, [goalReached, completedToday, t]);

  const progressLabel = goalReached
    ? t('home.allSessionsCompletedToday')
    : t('home.sessionsCompleted', { completed: completedToday, total: config.sessionsPerDay });

  return (
    <div className="flex flex-1 flex-col gap-4 px-3 py-5 sm:px-5">
      <HomeHeader
        finished={finished}
        dayNumber={dayNumber}
        totalDays={config.totalDays}
        title={t('home.title')}
        completeLabel={t('home.complete')}
        dayLabel={t('home.day', { x: dayNumber, total: config.totalDays })}
      />

      {!finished && <MotivationCard message={motivationMessage} />}

      {finished && !completeNoticeDismissed ? (
        <TreatmentCompleteCard
          title={t('home.treatmentComplete')}
          body={t('home.treatmentCompleteBody')}
          addExtraLabel={t('home.addExtraSession')}
          startNewLabel={t('home.startNewTreatment')}
          onAddExtra={handleStartExtra}
          onStartNewTreatment={() => setNewTreatmentDialogOpen(true)}
        />
      ) : (
        <TodaySessionCard
          todaysSessionsLabel={t('home.todaysSessions')}
          progressLabel={progressLabel}
          goalReached={goalReached}
          hasInProgress={hasInProgress}
          isInProgress={isInProgress}
          extrasCompletedToday={extrasCompletedToday}
          buttonLabel={buttonLabel}
          buttonSubLabel={buttonSubLabel}
          showExtraBadge={showExtraBadge}
          extraBadgeLabel={t('home.extraBadge')}
          goalReachedLabel={t('home.goalReached')}
          extraDoneLabel={t('home.extraDone', { count: extrasCompletedToday })}
          extrasDoneLabel={t('home.extrasDone', { count: extrasCompletedToday })}
          onStart={handleStart}
        />
      )}

      <Calendar />

      <HomeActions
        infoLabel={t('info.title')}
        settingsLabel={t('home.settings')}
        onOpenInfo={onOpenInfo}
        onOpenSettings={onOpenSettings}
      />

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
