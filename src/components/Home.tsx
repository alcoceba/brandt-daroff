import { memo, useState } from 'react';
import { Info, Play, RotateCcw, Settings as SettingsIcon, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSessionSlots } from '@/data/positions';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { addDays, getDayNumber, todayISO } from '@/utils/date';
import { Calendar } from '@/components/Calendar';
import { ConfirmDialog } from '@/components/Modal';
import type { SessionStatus } from '@/types';

interface HomeProps {
  onStartSession: (sessionId: string) => void;
  onOpenSettings: () => void;
  onOpenInfo: () => void;
}

const STATUS_STYLE: Record<SessionStatus, { dot: string; label: string }> = {
  pending: { dot: 'bg-state-pending', label: 'home.pending' },
  'in-progress': { dot: 'bg-state-progress', label: 'home.inProgress' },
  completed: { dot: 'bg-state-done', label: 'home.completed' },
};

export const Home = memo(function Home({ onStartSession, onOpenSettings, onOpenInfo }: HomeProps) {
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
  const isTreatmentComplete = startDate
    ? slots.every((slot) =>
        Array.from({ length: config.totalDays }, (_, dayIdx) => {
          const iso = addDays(startDate, dayIdx);
          return (sessions[iso] ?? {})[slot.id] === 'completed';
        }).every(Boolean),
      )
    : false;
  const todaySessions = sessions[today] ?? {};
  const totalSessions = config.sessionsPerDay * config.totalDays;
  const completedCount = Object.values(sessions).reduce(
    (acc, day) => acc + Object.values(day).filter((s) => s === 'completed').length,
    0,
  );
  const finished = rawDayNumber > config.totalDays || isTreatmentComplete;

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
          {slots.map((slot) => {
            const status: SessionStatus = todaySessions[slot.id] ?? 'pending';
            const style = STATUS_STYLE[status];
            const label = t(slot.labelKey, slot.id.includes('-') ? { n: Number(slot.id.split('-')[1]) } : undefined);
            return (
              <div
              key={slot.id}
              className={`flex overflow-hidden rounded-xl border border-slate-700 ${
                status === 'completed'
                  ? 'bg-state-done/10'
                  : status === 'in-progress'
                    ? 'bg-state-progress/10'
                    : 'bg-slate-800'
              }`}
            >
                <div className={`w-2 shrink-0 ${style.dot}`} />
                <div className="flex flex-1 items-center gap-3 p-4">
                  <span className="flex-1 text-lg font-semibold text-white">{label}</span>
                  {status === 'completed' ? (
                    <button
                      type="button"
                      onClick={() => setRestartSlot(slot.id)}
                      className="flex min-h-touch items-center gap-2 rounded-lg bg-slate-700 px-4 font-bold text-white"
                    >
                      <RotateCcw size={18} />
                      {t('home.restartSession')}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onStartSession(slot.id)}
                      className={`flex min-h-touch items-center gap-2 rounded-lg px-4 font-bold text-white ${
                        status === 'in-progress' ? 'bg-state-progress' : 'bg-brand-600'
                      }`}
                    >
                      <Play size={18} fill="currentColor" />
                      {status === 'in-progress' ? t('home.resume') : t('home.start')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
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
