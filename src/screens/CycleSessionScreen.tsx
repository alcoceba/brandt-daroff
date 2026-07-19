import { memo } from 'react';
import { AlertTriangle, ArrowRight, Pause, Play, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PositionIcon } from '@/components/PositionIcon';
import { Timer } from '@/components/Timer';
import { BackButton } from '@/components/core/BackButton';
import { ConfirmDialog } from '@/components/core/ConfirmDialog';
import { CycleProgressDots } from '@/components/CycleProgressDots';
import { SessionCompletionCard } from '@/components/SessionCompletionCard';
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
  const {
    config,
    position,
    isTransition,
    duration,
    isQuick,
    isRunning,
    secondsRemaining,
    cycleIndex,
    cycleNumber,
    dayNumber,
    positionIndex,
    dialog,
    setDialog,
    skipChecked,
    setSkipChecked,
    showCompletion,
    completedCount,
    totalSessions,

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
  const bgGradientClass = positionIndex === 0
    ? 'bg-gradient-to-t from-yellow-500/15 to-slate-900'
    : 'bg-gradient-to-b from-slate-900 to-slate-800';

  if (showCompletion) {
    return (
      <SessionCompletionCard
        dayNumber={dayNumber}
        isQuick={isQuick}
        completedCount={completedCount}
        totalSessions={totalSessions}
        elapsedSeconds={sessionElapsedSeconds()}
        onDone={() => goHome('completed')}
      />
    );
  }

  return (
    <div className={`relative flex flex-1 flex-col gap-3 ${bgGradientClass} p-4 sm:gap-4 sm:p-5 min-h-dvh sm:min-h-0`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px] transition-all duration-700 animate-glow-drift ${glowClass}`}
        />
        {!isPaused && position.kind !== 'sitting' && (
          <div
            className={`absolute left-1/3 top-2/3 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] opacity-50 transition-all duration-700 animate-glow-drift-reverse ${glowClass}`}
          />
        )}
      </div>
      <header className="relative flex items-center gap-3">
        <BackButton onBack={handleBack} />
        <h1 className="text-xl font-bold text-white">
          {isQuick ? t('wizard.modeQuickTitle') : t('cycle.title', { x: dayNumber })}
        </h1>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-5">
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

            {!isQuick && (
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-lg font-bold text-white">
                  {t('cycle.cycle', { x: cycleNumber, total: config.cyclesPerSession })}
                </p>
                <CycleProgressDots total={config.cyclesPerSession} currentIndex={cycleIndex} kind={position.kind} isPaused={isPaused} />
              </div>
            )}
          </>
        )}
      </div>

      {isTransition ? (
        <button
          type="button"
          onClick={() => advance()}
          className="flex min-h-touch items-center justify-center gap-2 rounded-xl bg-brand-600 text-xl font-bold text-white"
        >
          <Play size={26} /> {t('cycle.start')}
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-1.5 mt-2 sm:gap-2 sm:mt-4">
          <button
            type="button"
            onClick={() => setDialog('reset')}
            aria-label={t('cycle.resetProcess')}
            className="flex min-h-touch items-center justify-center gap-2 rounded-xl border border-state-danger/50 text-sm font-semibold text-state-danger"
          >
            <RotateCcw size={24} />
            <span className="hidden sm:inline">{t('cycle.resetProcess')}</span>
          </button>
          <button
            type="button"
            onClick={handlePauseResume}
            aria-label={isRunning ? t('cycle.pause') : t('cycle.resume')}
            className="flex min-h-touch items-center justify-center gap-2 rounded-xl bg-brand-600 text-lg font-bold text-white"
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
            className="flex min-h-touch items-center justify-center gap-2 rounded-xl border-2 border-brand-500 text-lg font-bold text-brand-500"
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
