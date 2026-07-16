import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Pause, Play, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { POSITIONS, getDurationSeconds } from '@/data/positions';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import type { SessionProgress } from '@/store/useTreatmentStore';
import { getDayNumber, todayISO } from '@/utils/date';
import { useCountdown } from '@/utils/timer';
import { playBeep, playBeepHigh } from '@/utils/sound';
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

function formatMinutesSeconds(totalSeconds: number): string {
  const total = Math.max(Math.round(totalSeconds), 0);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, '0')}` : `${s}s`;
}

export const CycleSession = memo(function CycleSession({ sessionId, onExit }: CycleSessionProps) {
  const { t } = useTranslation();
  const config = useTreatmentStore((s) => s.config);
  const startDate = useTreatmentStore((s) => s.startDate);
  const setSessionStatus = useTreatmentStore((s) => s.setSessionStatus);
  const saveSessionProgress = useTreatmentStore((s) => s.saveSessionProgress);
  const clearSessionProgress = useTreatmentStore((s) => s.clearSessionProgress);

  const restored = useState<SessionProgress | null>(
    () => useTreatmentStore.getState().progress[todayISO()]?.[sessionId] ?? null,
  )[0];
  const [cycleIndex, setCycleIndex] = useState(restored?.cycleIndex ?? 0);
  const [positionIndex, setPositionIndex] = useState(restored?.positionIndex ?? 0);
  const [dialog, setDialog] = useState<Dialog>(restored ? 'none' : 'safety');
  const { secondsRemaining, isRunning, start, resume, pause, stop, setOnComplete } = useCountdown();

  const position = POSITIONS[positionIndex];
  const isTransition = position.durationKind === 'transition';
  const duration = getDurationSeconds(position, config);
  const dayNumber = startDate ? getDayNumber(startDate, config.totalDays) : 1;

  const remainingTotal = useMemo(() => {
    let total = Math.max(secondsRemaining, 0);
    for (let i = positionIndex + 1; i < POSITIONS.length; i++) {
      total += getDurationSeconds(POSITIONS[i], config);
    }
    const cycleTotal = POSITIONS.reduce((sum, p) => sum + getDurationSeconds(p, config), 0);
    total += (config.cyclesPerSession - cycleIndex - 1) * cycleTotal;
    return total;
  }, [secondsRemaining, positionIndex, cycleIndex, config]);

  const goHome = useCallback(
    (status: 'pending' | 'completed') => {
      stop();
      setSessionStatus(todayISO(), sessionId, status);
      onExit();
    },
    [stop, setSessionStatus, sessionId, onExit],
  );

  const handleBack = useCallback(() => {
    stop();
    onExit();
  }, [stop, onExit]);

  const advance = useCallback((skipTransition = false) => {
    stop();
    if (positionIndex < POSITIONS.length - 1) {
      const nextPos = positionIndex + 1;
      setPositionIndex(nextPos);
      setSessionStatus(todayISO(), sessionId, 'in-progress');
      saveSessionProgress(todayISO(), sessionId, { cycleIndex, positionIndex: nextPos });
      return;
    }
    if (cycleIndex < config.cyclesPerSession - 1) {
      const nextCycle = cycleIndex + 1;
      const nextPos = skipTransition ? 1 : 0;
      setCycleIndex(nextCycle);
      setPositionIndex(nextPos);
      setSessionStatus(todayISO(), sessionId, 'in-progress');
      saveSessionProgress(todayISO(), sessionId, { cycleIndex: nextCycle, positionIndex: nextPos });
      return;
    }
    clearSessionProgress(todayISO(), sessionId);
    goHome('completed');
  }, [stop, positionIndex, cycleIndex, config.cyclesPerSession, setSessionStatus, saveSessionProgress, clearSessionProgress, sessionId, goHome]);

  const advanceRef = useRef(advance);
  advanceRef.current = advance;

  useEffect(() => {
    setOnComplete(() => advanceRef.current());
  }, [setOnComplete]);

  useEffect(() => {
    if (restored !== null) {
      setSessionStatus(todayISO(), sessionId, 'in-progress');
    }
  }, [restored, setSessionStatus, sessionId]);

  useEffect(() => {
    if (isTransition) return;
    playBeepHigh();
    cueChange();
    start(duration);
  }, [cycleIndex, positionIndex, isTransition, duration, start]);

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
        playBeep();
      } else if (currentSecond <= 5 && currentSecond > 0) {
        playBeep();
      }
    } else {
      if (currentSecond === midPoint && midPoint > 5) {
        playBeep();
      } else if (currentSecond <= 5 && currentSecond > 0) {
        playBeep();
      }
    }
  }, [secondsRemaining, isRunning, isTransition, duration, isRest, midPoint]);

  const handlePauseResume = () => {
    if (isRunning) pause();
    else resume();
  };

  const confirmReset = () => {
    stop();
    setPositionIndex(0);
    saveSessionProgress(todayISO(), sessionId, { cycleIndex, positionIndex: 0 });
  };

  const cycleNumber = cycleIndex + 1;

  const glowClass = !isRunning && !isTransition ? 'bg-yellow-500/30' : GLOW[position.kind];

  return (
    <div className="relative flex min-h-dvh flex-col gap-4 overflow-hidden bg-slate-900 p-5">
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] transition-all duration-700 ${glowClass}`}
      />
      <header className="relative flex items-center gap-3">
        <BackButton onBack={handleBack} />
        <h1 className="text-xl font-bold text-white">{t('cycle.title', { x: dayNumber })}</h1>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <PositionIcon kind={position.kind} className="h-28 w-28" />
        <p className="whitespace-pre-line text-center text-2xl font-bold text-white">
          {t(position.labelKey)}
        </p>
        <Timer
          secondsRemaining={secondsRemaining}
          totalDuration={duration}
          isRunning={isRunning}
          kind={position.kind}
        />
        <div className="text-center">
          <p className="text-lg font-bold text-white">
            {t('cycle.cycle', { x: cycleNumber, total: config.cyclesPerSession })}
          </p>
          <p className="text-sm font-semibold text-slate-300">
            {t('cycle.timeRemaining', { time: formatMinutesSeconds(remainingTotal) })}
          </p>
        </div>
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
        <div className="grid grid-cols-3 gap-2">
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
        title={`⚠️ ${t('safety.title')}`}
        body={
          <p className="text-sm leading-relaxed text-slate-300">
            {t('safety.prefix')}{' '}
            <span className="font-semibold text-white">{t('safety.weakness')}</span>,{' '}
            <span className="font-semibold text-white">{t('safety.numbness')}</span>{' '}
            {t('common.or')}{' '}
            <span className="font-semibold text-white">{t('safety.vision')}</span>,{' '}
            {t('safety.suffix')}
          </p>
        }
        confirmLabel={t('cycle.start')}
        single
        onConfirm={() => setDialog('none')}
        onCancel={() => setDialog('none')}
      />
    </div>
  );
});
