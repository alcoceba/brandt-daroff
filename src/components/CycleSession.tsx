import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, ArrowRight, Pause, Play, RotateCcw, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { POSITIONS, getDurationSeconds } from '@/data/positions';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import type { SessionProgress } from '@/store/useTreatmentStore';
import { getDayNumber, todayISO } from '@/utils/date';
import { useCountdown } from '@/utils/timer';
import { playBeep, playBeepHigh, playPositionCue, playRestCue } from '@/utils/sound';
import { cueChange } from '@/utils/vibration';
import { PositionIcon } from '@/components/PositionIcon';
import { Timer } from '@/components/Timer';
import { BackButton } from '@/components/BackButton';
import { ConfirmDialog } from '@/components/Modal';
import type { PositionKind } from '@/types';

const GLOW: Record<PositionKind, string> = {
  sitting: 'bg-slate-700/0',
  'lying-right': 'bg-green-500/25',
  'lying-left': 'bg-green-500/25',
  rest: 'bg-yellow-500/25',
  'long-rest': 'bg-red-500/25',
};

interface CycleSessionProps {
  sessionId: string;
  onExit: () => void;
}

type Dialog = 'none' | 'reset' | 'safety';

export const CycleSession = memo(function CycleSession({ sessionId, onExit }: CycleSessionProps) {
  const { t } = useTranslation();
  const config = useTreatmentStore((s) => s.config);
  const mode = useTreatmentStore((s) => s.mode);
  const startDate = useTreatmentStore((s) => s.startDate);
  const skipSafetyWarning = useTreatmentStore((s) => s.skipSafetyWarning);
  const toggleSkipSafetyWarning = useTreatmentStore((s) => s.toggleSkipSafetyWarning);
  const setSessionStatus = useTreatmentStore((s) => s.setSessionStatus);
  const saveSessionProgress = useTreatmentStore((s) => s.saveSessionProgress);
  const clearSessionProgress = useTreatmentStore((s) => s.clearSessionProgress);
  const completedCount = useTreatmentStore((s) =>
    Object.values(s.sessions).reduce(
      (acc, day) => acc + Object.values(day).filter((status) => status === 'completed').length,
      0,
    ),
  );
  const totalSessions = config.sessionsPerDay * config.totalDays;
  const isQuick = mode === 'quick';

  const restored = useState<SessionProgress | null>(
    () => useTreatmentStore.getState().progress[todayISO()]?.[sessionId] ?? null,
  )[0];
  const [cycleIndex, setCycleIndex] = useState(restored?.cycleIndex ?? 0);
  const [positionIndex, setPositionIndex] = useState(restored?.positionIndex ?? 0);
  const [dialog, setDialog] = useState<Dialog>(restored || skipSafetyWarning ? 'none' : 'safety');
  const [skipChecked, setSkipChecked] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const sessionStartRef = useRef(performance.now());
  const { secondsRemaining, isRunning, start, resume, pause, stop, setOnComplete } = useCountdown();

  const position = POSITIONS[positionIndex];
  const isTransition = position.durationKind === 'transition';
  const duration = getDurationSeconds(position, config);
  const dayNumber = startDate ? getDayNumber(startDate, config.totalDays) : 1;



  const goHome = useCallback(
    (status: 'pending' | 'completed') => {
      stop();
      if (!isQuick) {
        setSessionStatus(todayISO(), sessionId, status);
      }
      onExit();
    },
    [stop, isQuick, setSessionStatus, sessionId, onExit],
  );

  const handleBack = useCallback(() => {
    stop();
    onExit();
  }, [stop, onExit]);

  const advance = useCallback((skipTransition = false) => {
    stop();
    if (positionIndex < POSITIONS.length - 1) {
      const isLastCycle = cycleIndex === config.cyclesPerSession - 1;
      const isBeforeLongRest = positionIndex === POSITIONS.length - 2;
      if (isLastCycle && isBeforeLongRest) {
        if (!isQuick) {
          clearSessionProgress(todayISO(), sessionId);
          setSessionStatus(todayISO(), sessionId, 'completed');
        }
        setShowCompletion(true);
        return;
      }
      const nextPos = positionIndex + 1;
      setPositionIndex(nextPos);
      if (!isQuick) {
        setSessionStatus(todayISO(), sessionId, 'in-progress');
        saveSessionProgress(todayISO(), sessionId, { cycleIndex, positionIndex: nextPos });
      }
      return;
    }
    if (cycleIndex < config.cyclesPerSession - 1) {
      const nextCycle = cycleIndex + 1;
      const comingFromEnd = positionIndex === POSITIONS.length - 1;
      const firstPosEmpty = getDurationSeconds(POSITIONS[0], config) === 0;
      const nextPos = skipTransition || (comingFromEnd && firstPosEmpty) ? 1 : 0;
      setCycleIndex(nextCycle);
      setPositionIndex(nextPos);
      if (!isQuick) {
        setSessionStatus(todayISO(), sessionId, 'in-progress');
        saveSessionProgress(todayISO(), sessionId, { cycleIndex: nextCycle, positionIndex: nextPos });
      }
      return;
    }
    if (!isQuick) {
      clearSessionProgress(todayISO(), sessionId);
      setSessionStatus(todayISO(), sessionId, 'completed');
    }
    setShowCompletion(true);
  }, [stop, positionIndex, cycleIndex, config, isQuick, setSessionStatus, saveSessionProgress, clearSessionProgress, sessionId]);

  const advanceRef = useRef(advance);
  advanceRef.current = advance;

  useEffect(() => {
    setOnComplete(() => advanceRef.current());
  }, [setOnComplete]);

  useEffect(() => {
    if (restored !== null && !isQuick) {
      setSessionStatus(todayISO(), sessionId, 'in-progress');
    }
  }, [restored, isQuick, setSessionStatus, sessionId]);

  const bypassRef = useRef(false);

  useEffect(() => {
    if (isTransition) return;
    if (duration <= 0) {
      if (bypassRef.current) return;
      bypassRef.current = true;
      advance();
      bypassRef.current = false;
      return;
    }
    const isRestPosition = position.kind === 'rest' || position.kind === 'long-rest';
    if (isRestPosition) {
      void playRestCue();
    } else {
      void playPositionCue();
    }
    cueChange();
    start(duration);
  }, [cycleIndex, positionIndex, position.kind, isTransition, duration, start, advance]);

  const isRest = position.kind === 'rest' || position.kind === 'long-rest';
  const midPoint = Math.floor(duration / 2);

  const lastBeepSecondRef = useRef<number | null>(null);
  useEffect(() => {
    if (isTransition || !isRunning || duration <= 0) {
      lastBeepSecondRef.current = null;
      return;
    }
    const currentSecond = Math.ceil(secondsRemaining);
    if (lastBeepSecondRef.current === currentSecond) return;
    lastBeepSecondRef.current = currentSecond;

    if (isRest) {
      if (currentSecond === 10) {
        void playBeep();
      } else if (currentSecond <= 5 && currentSecond > 0) {
        void playBeep();
      }
    } else {
      if (currentSecond === midPoint && midPoint > 5) {
        void playBeep();
      } else if (currentSecond <= 5 && currentSecond > 0) {
        void playBeep();
      }
    }
  }, [secondsRemaining, isRunning, isTransition, duration, isRest, midPoint]);

  const handlePauseResume = async () => {
    if (isRunning) {
      await playBeepHigh();
      pause();
    } else {
      await playBeep();
      resume();
    }
  };

  const confirmReset = () => {
    stop();
    setCycleIndex(0);
    setPositionIndex(0);
    if (!isQuick) {
      saveSessionProgress(todayISO(), sessionId, { cycleIndex: 0, positionIndex: 0 });
    }
  };

  const cycleNumber = cycleIndex + 1;

  const glowClass = !isRunning && !isTransition ? 'bg-yellow-500/30' : GLOW[position.kind];

  if (showCompletion) {
    const sessionSeconds = Math.round((performance.now() - sessionStartRef.current) / 1000);
    const minutes = Math.floor(sessionSeconds / 60);
    const seconds = sessionSeconds % 60;
    const timeLabel = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    return (
      <div className="flex flex-1 flex-col gap-3 bg-gradient-to-b from-slate-900 to-slate-800 p-4 sm:gap-4 sm:p-5">
        <header className="flex items-center gap-3">
          <BackButton onBack={() => goHome('completed')} />
          <h1 className="text-xl font-bold text-white">
            {isQuick ? t('wizard.modeQuickTitle') : t('cycle.title', { x: dayNumber })}
          </h1>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <Trophy className="h-24 w-24 text-state-done" strokeWidth={1.5} />
          <div>
            <h2 className="text-3xl font-bold text-white">{t('cycle.completionTitle')}</h2>
            <p className="mt-2 text-lg text-slate-300">{t('cycle.completionBody')}</p>
          </div>
          <div className="grid w-full max-w-xs grid-cols-1 gap-3">
            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
              <p className="text-sm text-slate-400">{t('cycle.timeInvested')}</p>
              <p className="text-2xl font-bold text-white">{timeLabel}</p>
            </div>
            {!isQuick && (
              <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
                <p className="text-sm text-slate-400">{t('cycle.completionTotalSessions')}</p>
                <p className="text-2xl font-bold text-white">
                  {completedCount} / {totalSessions}
                </p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => goHome('completed')}
            className="min-h-touch w-full max-w-xs rounded-xl bg-brand-600 text-lg font-bold text-white"
          >
            {t('cycle.done')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col gap-3 bg-gradient-to-b from-slate-900 to-slate-800 p-4 sm:gap-4 sm:p-5">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] transition-all duration-700 ${glowClass}`}
        />
      </div>
      <header className="relative flex items-center gap-3">
        <BackButton onBack={handleBack} />
        <h1 className="text-xl font-bold text-white">
          {isQuick ? t('wizard.modeQuickTitle') : t('cycle.title', { x: dayNumber })}
        </h1>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <PositionIcon kind={position.kind} className="h-20 w-20 sm:h-28 sm:w-28" />
        <p className="whitespace-pre-line text-center text-xl font-bold text-white sm:text-2xl">
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
                <div className="flex items-center gap-2 sm:gap-3">
                  {Array.from({ length: config.cyclesPerSession }).map((_, i) => {
                    const isCompleted = i < cycleIndex;
                    const isCurrent = i === cycleIndex;
                    return (
                      <span
                        key={i}
                        className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ease-out sm:h-3 sm:w-3 ${
                          isCompleted
                            ? 'scale-100 bg-brand-500'
                            : isCurrent
                              ? 'scale-125 ring-2 ring-brand-500 bg-transparent'
                              : 'scale-100 bg-slate-600'
                        }`}
                      />
                    );
                  })}
                </div>
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
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
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
              />
              {t('common.doNotShowAgain')}
            </label>
          </div>
        }
        confirmLabel={t('cycle.start')}
        single
        onConfirm={() => {
          if (skipChecked) toggleSkipSafetyWarning();
          setDialog('none');
        }}
        onCancel={() => setDialog('none')}
      />
    </div>
  );
});
