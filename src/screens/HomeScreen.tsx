import { memo, useState } from 'react';
import { ChevronRight, Info, Settings as SettingsIcon, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSessionSlots } from '@/constants/positions';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { getDayNumber, todayISO } from '@/utils/date';
import { Calendar } from '@/components/Calendar';
import { ConfirmDialog } from '@/components/core/ConfirmDialog';
import { countCompletedSessions, isTreatmentComplete } from '@/utils/sessions';
import type { SessionStatus } from '@/types';

interface HomeScreenProps {
  onStartSession: (sessionId: string) => void;
  onOpenSettings: () => void;
  onOpenInfo: () => void;
}

const STATUS_STYLE: Record<SessionStatus, { dot: string; label: string }> = {
  pending: { dot: 'bg-state-pending', label: 'home.pending' },
  'in-progress': { dot: 'bg-state-progress', label: 'home.inProgress' },
  completed: { dot: 'bg-state-done', label: 'home.completed' },
};

export const HomeScreen = memo(function HomeScreen({ onStartSession, onOpenSettings, onOpenInfo }: HomeScreenProps) {
  const { t } = useTranslation();
  const {
    config,
    sessions,
    startDate,
    mode,
    setMode,
    setSessionStatus,
    clearSessionProgress,
    setConfig,
    resetTreatment,
  } = useTreatmentStore((s) => ({
    config: s.config,
    sessions: s.sessions,
    startDate: s.startDate,
    mode: s.mode,
    setMode: s.setMode,
    setSessionStatus: s.setSessionStatus,
    clearSessionProgress: s.clearSessionProgress,
    setConfig: s.setConfig,
    resetTreatment: s.resetTreatment,
  }));

  const [restartSlot, setRestartSlot] = useState<string | null>(null);
  const [finishOpen, setFinishOpen] = useState(false);

  const slots = getSessionSlots(config.sessionsPerDay);
  const today = todayISO();
  const dayNumber = startDate ? getDayNumber(startDate, config.totalDays) : 1;
  const rawDayNumber = startDate
    ? Math.floor(
        (new Date(`${today}T00:00:00`).getTime() - new Date(`${startDate}T00:00:00`).getTime()) /
          86_400_000,
      ) + 1
    : 1;

  const treatmentFinished = startDate
    ? isTreatmentComplete(startDate, sessions, config, slots)
    : false;

  const todaySessions = sessions[today] ?? {};
  const totalSessions = config.sessionsPerDay * config.totalDays;
  const completedCount = countCompletedSessions(sessions);
  const finished = rawDayNumber > config.totalDays || treatmentFinished;

  const confirmRestart = () => {
    if (!restartSlot) return;
    setSessionStatus(today, restartSlot, 'pending');
    clearSessionProgress(today, restartSlot);
    onStartSession(restartSlot);
    setRestartSlot(null);
  };

  const handleExtend = () => {
    setConfig({ totalDays: config.totalDays + 1 });
  };

  const handleFinish = () => {
    setFinishOpen(false);
    resetTreatment();
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h1 className="whitespace-nowrap text-xl font-bold text-white">{t('home.title')}</h1>
            {mode === 'progress' && (
              <>
                {finished ? (
                  <span className="text-lg font-bold text-state-done">{t('home.complete')}</span>
                ) : (
                  <span className="whitespace-nowrap text-lg font-semibold text-brand-500">
                    {t('home.day', { x: dayNumber, total: config.totalDays })}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {mode === 'quick' ? (
        <section className="flex flex-col items-center gap-4 rounded-2xl border border-slate-700 bg-slate-800 p-6 text-center">
          <h2 className="text-xl font-bold text-white">{t('wizard.modeQuickTitle')}</h2>
          <p className="text-sm text-slate-300">
            {t('home.quickDesc', { cycles: config.cyclesPerSession, duration: config.positionDuration })}
          </p>
          <button
            type="button"
            onClick={() => onStartSession('quick')}
            className="min-h-touch w-full rounded-xl bg-brand-600 text-lg font-bold text-white"
          >
            {t('home.quickStart')}
          </button>
          <button
            type="button"
            onClick={() => setMode('progress')}
            className="text-sm font-semibold text-brand-500 transition-colors hover:text-brand-400"
          >
            {t('wizard.modeProgressTitle')} →
          </button>
        </section>
      ) : finished ? (
        <section className="flex flex-col items-center gap-4 rounded-2xl border border-slate-700 bg-slate-800 p-6 text-center">
          <Trophy className="h-16 w-16 text-state-done" strokeWidth={1.5} />
          <div>
            <h2 className="text-2xl font-bold text-white">{t('home.treatmentComplete')}</h2>
            <p className="mt-1 text-lg font-semibold text-brand-500">
              {t('home.summarySessions', { completed: completedCount, total: totalSessions })}
            </p>
            <p className="mt-2 text-sm text-slate-300">{t('home.summaryMessage')}</p>
          </div>
          <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setFinishOpen(true)}
              className="min-h-touch flex-1 rounded-xl bg-state-done text-lg font-bold text-white"
            >
              {t('home.finish')}
            </button>
            <button
              type="button"
              onClick={handleExtend}
              className="min-h-touch flex-1 rounded-xl border border-slate-600 text-lg font-semibold text-slate-200"
            >
              {t('home.extendOneDay')}
            </button>
          </div>
        </section>
      ) : (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-slate-300">{t('home.todaysSessions')}</h2>
          <div className="flex flex-col gap-2.5">
            {slots.map((slot) => {
              const status: SessionStatus = todaySessions[slot.id] ?? 'pending';
              const label = t(slot.labelKey, slot.id.includes('-') ? { n: Number(slot.id.split('-')[1]) } : undefined);
              const isCompleted = status === 'completed';
              const isInProgress = status === 'in-progress';
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => isCompleted ? setRestartSlot(slot.id) : onStartSession(slot.id)}
                  className={`group w-full overflow-hidden rounded-2xl border text-left transition-all duration-200 hover:scale-[1.01] hover:brightness-110 active:scale-[0.99] ${
                    isCompleted
                      ? 'border-state-done/30 bg-gradient-to-r from-state-done/10 to-state-done/5'
                      : isInProgress
                        ? 'border-state-progress/40 bg-gradient-to-r from-state-progress/10 to-state-progress/5'
                        : 'border-slate-700/60 bg-slate-800/70 hover:border-brand-500/40'
                  }`}
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-base font-semibold text-white">{label}</span>
                      <span className={`text-xs font-medium ${
                        isCompleted ? 'text-state-done' : isInProgress ? 'text-state-progress' : 'text-slate-500'
                      }`}>
                        {t(STATUS_STYLE[status].label)}
                      </span>
                    </div>
                    <ChevronRight
                      size={18}
                      className={`shrink-0 transition-all duration-200 group-hover:translate-x-0.5 ${
                        isCompleted ? 'text-state-done/60' : isInProgress ? 'text-state-progress/70' : 'text-slate-600 group-hover:text-brand-500'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {mode === 'progress' && <Calendar />}

      <div className="mt-auto flex gap-3">
        <button
          type="button"
          onClick={onOpenInfo}
          className="flex min-h-touch flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 font-semibold text-slate-200"
        >
          <Info size={20} />
          <span className="hidden sm:inline">{t('info.title')}</span>
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex min-h-touch flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 font-semibold text-slate-200"
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
        open={finishOpen}
        title={t('home.confirmFinishTitle')}
        body={t('home.confirmFinishBody')}
        confirmLabel={t('home.finish')}
        cancelLabel={t('common.cancel')}
        danger
        onConfirm={handleFinish}
        onCancel={() => setFinishOpen(false)}
      />
    </div>
  );
});
