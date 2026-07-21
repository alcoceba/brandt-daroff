import { useCallback, useEffect, useRef, useState } from 'react';
import { POSITIONS, getDurationSeconds } from '@/constants/positions';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { getDayNumber, todayISO } from '@/utils/date';
import { useCountdown } from '@/hooks/useCountdown';
import { useBeepCues } from '@/hooks/useBeepCues';
import { playBeep, playBeepHigh, playPositionCue, playRestCue } from '@/utils/sound';
import { cueChange } from '@/utils/vibration';
import { countCompletedSessions } from '@/utils/sessions';
import type { PositionDef, SessionProgress } from '@/types';

type Dialog = 'none' | 'reset' | 'safety';

interface UseCycleSessionParams {
  sessionId: string;
  onExit: () => void;
}

export function useCycleSession({ sessionId, onExit }: UseCycleSessionParams) {
  const config = useTreatmentStore((s) => s.config);
  const startDate = useTreatmentStore((s) => s.startDate);
  const settings = useTreatmentStore((s) => s.settings);
  const skipSafetyWarning = useTreatmentStore((s) => s.skipSafetyWarning);
  const toggleSkipSafetyWarning = useTreatmentStore((s) => s.toggleSkipSafetyWarning);
  const setSessionStatus = useTreatmentStore((s) => s.setSessionStatus);
  const saveSessionProgress = useTreatmentStore((s) => s.saveSessionProgress);
  const clearSessionProgress = useTreatmentStore((s) => s.clearSessionProgress);
  const setSessionDuration = useTreatmentStore((s) => s.setSessionDuration);
  const sessions = useTreatmentStore((s) => s.sessions);
  const completedCount = countCompletedSessions(sessions, config.sessionsPerDay);
  const totalCompleted = countCompletedSessions(sessions);
  const extraCompletedCount = Math.max(0, totalCompleted - completedCount);
  const totalSessions = config.sessionsPerDay * config.totalDays;
  const todayCompletedCount = Object.values(sessions[todayISO()] ?? {}).filter(
    (s) => s === 'completed',
  ).length;
  const isExtraSession = todayCompletedCount > config.sessionsPerDay;

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

  const position: PositionDef = POSITIONS[positionIndex];
  const isTransition = position.durationKind === 'transition';
  const duration = getDurationSeconds(position, config);
  const dayNumber = startDate ? getDayNumber(startDate, config.totalDays) : 1;
  const isRest = position.kind === 'rest' || position.kind === 'long-rest';
  const midPoint = Math.floor(duration / 2);
  const cycleNumber = cycleIndex + 1;

  useBeepCues({
    secondsRemaining,
    isRunning,
    isTransition,
    duration,
    isRest,
    midPoint,
    soundEnabled: settings.sound,
  });

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
      const isLastCycle = cycleIndex === config.cyclesPerSession - 1;
      const isBeforeLongRest = positionIndex === POSITIONS.length - 2;
      if (isLastCycle && isBeforeLongRest) {
        clearSessionProgress(todayISO(), sessionId);
        setSessionStatus(todayISO(), sessionId, 'completed');
        setSessionDuration(todayISO(), sessionId, sessionElapsedSeconds());
        setShowCompletion(true);
        return;
      }
      const nextPos = positionIndex + 1;
      setPositionIndex(nextPos);
      setSessionStatus(todayISO(), sessionId, 'in-progress');
      saveSessionProgress(todayISO(), sessionId, { cycleIndex, positionIndex: nextPos });
      return;
    }
    if (cycleIndex < config.cyclesPerSession - 1) {
      const nextCycle = cycleIndex + 1;
      const comingFromEnd = positionIndex === POSITIONS.length - 1;
      const firstPosEmpty = getDurationSeconds(POSITIONS[0], config) === 0;
      const nextPos = skipTransition || (comingFromEnd && firstPosEmpty) ? 1 : 0;
      setCycleIndex(nextCycle);
      setPositionIndex(nextPos);
      setSessionStatus(todayISO(), sessionId, 'in-progress');
      saveSessionProgress(todayISO(), sessionId, { cycleIndex: nextCycle, positionIndex: nextPos });
      return;
    }
    clearSessionProgress(todayISO(), sessionId);
    setSessionStatus(todayISO(), sessionId, 'completed');
    setSessionDuration(todayISO(), sessionId, sessionElapsedSeconds());
    setShowCompletion(true);
  }, [stop, positionIndex, cycleIndex, config, setSessionStatus, saveSessionProgress, clearSessionProgress, setSessionDuration, sessionId]);

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
      void playRestCue(settings.sound);
    } else {
      void playPositionCue(settings.sound);
    }
    cueChange(settings.vibration);
    start(duration);
  }, [cycleIndex, positionIndex, position.kind, isTransition, duration, start, advance, settings.sound, settings.vibration]);

  const handlePauseResume = async () => {
    if (isRunning) {
      await playBeepHigh(settings.sound);
      pause();
    } else {
      await playBeep(settings.sound);
      resume();
    }
  };

  const confirmReset = () => {
    stop();
    setCycleIndex(0);
    setPositionIndex(0);
    saveSessionProgress(todayISO(), sessionId, { cycleIndex: 0, positionIndex: 0 });
  };

  const handleSafetyConfirm = () => {
    if (skipChecked) toggleSkipSafetyWarning();
    setDialog('none');
  };

  const sessionElapsedSeconds = () =>
    Math.round((performance.now() - sessionStartRef.current) / 1000);

  return {
    config,
    position,
    isTransition,
    duration,
    isRunning,
    secondsRemaining,
    cycleIndex,
    cycleNumber,
    positionIndex,
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
  };
}
