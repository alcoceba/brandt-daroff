import { memo } from 'react';
import { AlertTriangle, ArrowRight, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PositionIcon } from '@/components/PositionIcon';
import { Timer } from '@/components/Timer';
import { BackButton } from '@/components/core/BackButton';
import { ConfirmDialog } from '@/components/core/ConfirmDialog';
import { CycleProgressDots } from '@/components/CycleProgressDots';
import { SessionCompletionCard } from '@/components/SessionCompletionCard';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { useCycleSession } from '@/hooks/useCycleSession';
import type { PositionKind } from '@/types';

const GLOW: Record<PositionKind, string> = {
  sitting: 'bg-slate-700/0',
  'lying-right': 'bg-green-500/25',
  'lying-left': 'bg-green-500/25',
  rest: 'bg-yellow-500/25',
  'long-rest': 'bg-red-500/25',
};

interface CycleSessionScreenProps {
  sessionId: string;
  onExit: () => void;
}

export const CycleSessionScreen = memo(function CycleSessionScreen({ sessionId, onExit }: CycleSessionScreenProps) {
  const { t } = useTranslation();
  const soundEnabled = useTreatmentStore((s) => s.settings.sound);
  const toggleSound = useTreatmentStore((s) => s.toggleSound);
  const {
    config,
    position,
    isTransition,
    duration,
    isRunning,
    secondsRemaining,
    cycleIndex,
    cycleNumber,
    dayNumber,

    dialog,
    setDialog,
    skipChecked,
    setSkipChecked,
    showCompletion,
    completedCount,
    extraCompletedCount,
    totalSessions,
    isExtraSession,

    advance,
    goHome,
    handleBack,
    handlePauseResume,
    confirmReset,
    handleSafetyConfirm,
    sessionElapsedSeconds,
  } = useCycleSession({ sessionId, onExit });

  const isPaused = !isRunning && !isTransition;
  const glowClass = isPaused ? 'bg-yellow-500/30' : GLOW[position.kind];


  if (showCompletion) {
    return (
      <SessionCompletionCard
        dayNumber={dayNumber}
        isExtraSession={isExtraSession}
        completedCount={completedCount}
        extraCompletedCount={extraCompletedCount}
        totalSessions={totalSessions}
        elapsedSeconds={sessionElapsedSeconds()}
        onDone={() => goHome('completed')}
      />
    );
  }

  return (
    <div className="relative flex flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-5 min-h-dvh sm:min-h-0">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className={`absolute left-1/2 top-1/2 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px] transition-all duration-700 animate-glow-drift ${glowClass}`}
        />
        {!isPaused && position.kind !== 'sitting' && (
          <div
            className={`absolute left-1/3 top-2/3 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] opacity-60 transition-all duration-700 animate-glow-drift-reverse ${glowClass}`}
          />
        )}
      </div>
      <header className="relative z-10 flex items-center gap-3">
        <BackButton onBack={handleBack} />
        <h1 className="text-xl font-bold text-white">{t('cycle.title', { x: dayNumber })}</h1>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDialog('reset')}
            aria-label={t('cycle.resetProcess')}
            className="flex h-14 w-14 items-center justify-center rounded-xl border border-state-danger/50 text-state-danger transition-all duration-200 hover:bg-state-danger/10 hover:border-state-danger active:scale-[0.98]"
          >
            <RotateCcw size={22} />
          </button>
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundEnabled ? t('cycle.mute') : t('cycle.unmute')}
            className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-600 text-slate-200 transition-all duration-200 hover:border-slate-500 hover:bg-slate-800 hover:text-white active:scale-[0.98]"
          >
            {soundEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </button>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5">
        <PositionIcon kind={position.kind} isPaused={isPaused} className="h-20 w-20 sm:h-28 sm:w-28" />
        <p className="whitespace-pre-line text-center text-xl font-bold text-white leading-7 h-14 sm:text-2xl sm:leading-8 sm:h-16 flex items-center justify-center">
          {t(position.labelKey)}
        </p>
        {!isTransition && (
          <>
            <Timer
              secondsRemaining={secondsRemaining}
              totalDuration={duration}
              isRunning={isRunning}
              kind={position.kind}
            />

            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-lg font-bold text-white">
                {t('cycle.cycle', { x: cycleNumber, total: config.cyclesPerSession })}
              </p>
              <CycleProgressDots total={config.cyclesPerSession} currentIndex={cycleIndex} kind={position.kind} isPaused={isPaused} />
            </div>
          </>
        )}
      </div>

      {isTransition ? (
        <button
          type="button"
          onClick={() => advance()}
          className="relative z-10 flex min-h-touch items-center justify-center gap-2 rounded-xl bg-brand-600 text-xl font-bold text-white transition-all duration-200 hover:bg-brand-500 hover:scale-[1.01] active:scale-[0.98] hover:shadow-lg hover:shadow-brand-500/20"
        >
          <Play size={26} /> {t('cycle.start')}
        </button>
      ) : (
        <div className="relative z-10 grid grid-cols-2 gap-1.5 mt-2 sm:gap-2 sm:mt-4">
          <button
            type="button"
            onClick={handlePauseResume}
            aria-label={isRunning ? t('cycle.pause') : t('cycle.resume')}
            className="flex min-h-touch items-center justify-center gap-2 rounded-xl border-2 border-brand-500 text-lg font-bold text-brand-500 transition-all duration-200 hover:bg-brand-500/10 hover:scale-[1.01] active:scale-[0.98]"
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
            <span className="hidden sm:inline">
              {isRunning ? t('cycle.pause') : t('cycle.resume')}
            </span>
          </button>
          <button
            type="button"
            onClick={() => advance(true)}
            aria-label={t('cycle.next')}
            className="flex min-h-touch items-center justify-center gap-2 rounded-xl bg-brand-600 text-lg font-bold text-white transition-all duration-200 hover:bg-brand-500 hover:scale-[1.01] active:scale-[0.98] hover:shadow-lg hover:shadow-brand-500/20"
          >
            <ArrowRight size={24} />
            <span className="hidden sm:inline">{t('cycle.next')}</span>
          </button>
        </div>
      )}

      <ConfirmDialog
        open={dialog === 'reset'}
        title={t('cycle.resetProcess')}
        body={t('cycle.confirmReset')}
        confirmLabel={t('cycle.resetProcess')}
        cancelLabel={t('common.cancel')}
        danger
        onConfirm={() => {
          setDialog('none');
          confirmReset();
        }}
        onCancel={() => setDialog('none')}
      />
      <ConfirmDialog
        open={dialog === 'safety'}
        title={
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-yellow-400" />
            {t('safety.title')}
          </div>
        }
        body={
          <div className="flex flex-col gap-3">
            <p className="text-sm leading-relaxed text-slate-300">
              {t('safety.prefix')}{' '}
              <span className="font-semibold text-white">{t('safety.weakness')}</span>,{' '}
              <span className="font-semibold text-white">{t('safety.numbness')}</span>{' '}
              {t('common.or')}{' '}
              <span className="font-semibold text-white">{t('safety.vision')}</span>,{' '}
              {t('safety.suffix')}
            </p>
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input
                type="checkbox"
                checked={skipChecked}
                onChange={(e) => setSkipChecked(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-brand-500 focus:ring-brand-500"
              >
              </input>
              {t('common.doNotShowAgain')}
            </label>
          </div>
        }
        confirmLabel={t('cycle.start')}
        single
        onConfirm={handleSafetyConfirm}
        onCancel={() => setDialog('none')}
      />
    </div>
  );
});
