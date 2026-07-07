import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Pause, Play, RotateCcw, Square } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CYCLES_PER_SESSION, POSITIONS, getDurationSeconds } from '@/data/positions';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { getDayNumber, todayISO } from '@/utils/date';
import { useCountdown } from '@/utils/timer';
import { playBeep, playBeepHigh } from '@/utils/sound';
import { cueChange } from '@/utils/vibration';
import { PositionIcon } from '@/components/PositionIcon';
import { Timer } from '@/components/Timer';
import { ConfirmDialog } from '@/components/Modal';

interface CycleSessionProps {
  sessionId: string;
  onExit: () => void;
}

type Dialog = 'none' | 'reset' | 'abandon' | 'safety';

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

  const [cycleIndex, setCycleIndex] = useState(0);
  const [positionIndex, setPositionIndex] = useState(0);
  const [dialog, setDialog] = useState<Dialog>('safety');
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
    total += (CYCLES_PER_SESSION - cycleIndex - 1) * cycleTotal;
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

  const advance = useCallback(() => {
    stop();
    if (positionIndex < POSITIONS.length - 1) {
      setPositionIndex(positionIndex + 1);
      return;
    }
    if (cycleIndex < CYCLES_PER_SESSION - 1) {
      setCycleIndex(cycleIndex + 1);
      setPositionIndex(0);
      return;
    }
    goHome('completed');
  }, [stop, positionIndex, cycleIndex, goHome]);

  const advanceRef = useRef(advance);
  advanceRef.current = advance;

  useEffect(() => {
    setOnComplete(() => advanceRef.current());
  }, [setOnComplete]);

  useEffect(() => {
    setSessionStatus(todayISO(), sessionId, 'in-progress');
  }, [setSessionStatus, sessionId]);

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
    setCycleIndex(0);
    setPositionIndex(0);
  };

  const cycleNumber = cycleIndex + 1;
  const cyclesRemaining = CYCLES_PER_SESSION - cycleNumber;

  return (
    <div className="flex min-h-dvh flex-col gap-4 p-5">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{t('cycle.title', { x: dayNumber })}</p>
          <p className="text-xl font-bold text-white">
            {t('cycle.cycle', { x: cycleNumber, total: CYCLES_PER_SESSION })}
          </p>
        </div>
        <div className="text-right">
          <p className="whitespace-nowrap text-sm text-slate-300">
            {t('cycle.cyclesRemaining', { n: cyclesRemaining })}
          </p>
          <p className="whitespace-nowrap text-sm font-semibold text-brand-500">
            {t('cycle.timeRemaining', { time: formatMinutesSeconds(remainingTotal) })}
          </p>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <PositionIcon kind={position.kind} className="h-28 w-28" />
        <p className="text-center text-2xl font-bold text-white">{t(position.labelKey)}</p>
        <Timer
          secondsRemaining={secondsRemaining}
          totalDuration={duration}
          isRunning={isRunning}
        />
      </div>

      {isTransition ? (
        <button
          type="button"
          onClick={advance}
          className="flex min-h-touch items-center justify-center gap-2 rounded-xl bg-brand-600 text-xl font-bold text-white"
        >
          <Play size={26} /> {t('cycle.start')}
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          {position.canAdvanceEarly && (
            <button
              type="button"
              onClick={advance}
              className="flex min-h-touch w-full items-center justify-center gap-2 rounded-xl border border-brand-500 text-lg font-bold text-brand-500"
            >
              {t('cycle.next')}
              <ArrowRight size={22} />
            </button>
          )}
          <button
            type="button"
            onClick={handlePauseResume}
            className="flex min-h-touch w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-lg font-bold text-white"
          >
            {isRunning ? <Pause size={22} /> : <Play size={22} />}
            {isRunning ? t('cycle.pause') : t('cycle.resume')}
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setDialog('abandon')}
          className="flex min-h-touch flex-col items-center justify-center gap-1 rounded-xl border border-slate-700 py-2 text-xs font-semibold text-slate-200"
        >
          <Square size={20} />
          {t('cycle.stop')}
        </button>
        <button
          type="button"
          onClick={() => setDialog('reset')}
          className="flex min-h-touch flex-col items-center justify-center gap-1 rounded-xl border border-state-danger/50 py-2 text-xs font-semibold text-state-danger"
        >
          <RotateCcw size={20} />
          {t('cycle.resetProcess')}
        </button>
      </div>

      <ConfirmDialog
        open={dialog === 'abandon'}
        title={t('cycle.stop')}
        body={t('cycle.confirmAbandon')}
        confirmLabel={t('cycle.stop')}
        cancelLabel={t('common.cancel')}
        onConfirm={() => {
          setDialog('none');
          goHome('pending');
        }}
        onCancel={() => setDialog('none')}
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
      <ConfirmDialog
        open={dialog === 'safety'}
        title={`⚠️ ${t('safety.title')}`}
        body={
          <p className="text-sm leading-relaxed text-slate-300">
            {t('safety.prefix')}{' '}
            <span className="font-semibold text-white">
              {t('safety.weakness')}
            </span>
            ,{' '}
            <span className="font-semibold text-white">
              {t('safety.numbness')}
            </span>{' '}
            {t('common.or')}{' '}
            <span className="font-semibold text-white">
              {t('safety.vision')}
            </span>
            , {t('safety.suffix')}
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
