import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { useCycleSession } from '@/hooks/useCycleSession';
import { ConfirmDialog } from '@/components/core/ConfirmDialog';
import { SessionCompletionCard } from '@/components/cycle/SessionCompletionCard';
import { CycleControls } from '@/components/cycle/CycleControls';
import { CyclePositionView } from '@/components/cycle/CyclePositionView';
import { CycleTopBar } from '@/components/cycle/CycleTopBar';
import type { PositionKind } from '@/types';

const GLOW: Record<PositionKind, string> = {
  sitting: 'bg-yellow-500/25',
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
    isPaused,
    secondsRemaining,
    cycleNumber,
    dayNumber,
    dialog,
    setDialog,
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
    sessionElapsedSeconds,
  } = useCycleSession({ sessionId, onExit });

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
    <div className="relative flex flex-1 flex-col gap-3 px-3 py-4 sm:gap-4 sm:px-5 sm:py-5 min-h-dvh sm:min-h-0">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className={`absolute left-1/2 top-1/2 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px] transition-all duration-700 animate-glow-drift ${glowClass}`}
        />
        {!isPaused && (
          <div
            className={`absolute left-1/3 top-2/3 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] opacity-60 transition-all duration-700 animate-glow-drift-reverse ${glowClass}`}
          />
        )}
      </div>

      <CycleTopBar
        title={t('cycle.title', { x: dayNumber })}
        onBack={handleBack}
        onReset={() => setDialog('reset')}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        moreActionsLabel={t('cycle.moreActions')}
        muteLabel={t('cycle.mute')}
        unmuteLabel={t('cycle.unmute')}
        resetLabel={t('cycle.resetProcess')}
      />

      <CyclePositionView
        position={position}
        isTransition={isTransition}
        isPaused={isPaused}
        secondsRemaining={secondsRemaining}
        duration={duration}
        isRunning={isRunning}
        cycleNumber={cycleNumber}
        totalCycles={config.cyclesPerSession}
        label={t(position.labelKey)}
        cycleLabel={t('cycle.cycle', { x: cycleNumber, total: config.cyclesPerSession })}
      />

      <CycleControls
        kind={position.kind}
        isTransition={isTransition}
        isRunning={isRunning}
        isPaused={isPaused}
        startLabel={t('cycle.start')}
        pauseLabel={t('cycle.pause')}
        resumeLabel={t('cycle.resume')}
        nextLabel={t('cycle.next')}
        onAdvance={() => advance()}
        onAdvanceSkip={() => advance(true)}
        onPauseResume={handlePauseResume}
      />

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
    </div>
  );
});
