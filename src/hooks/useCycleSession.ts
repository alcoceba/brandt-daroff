import { useCallback, useEffect, useRef, useState } from 'react';
import { POSITIONS, getDurationSeconds } from '@/constants/positions';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { getDayNumber, todayISO } from '@/utils/date';
import { useCountdown } from '@/hooks/useCountdown';
import { useWakeLock } from '@/hooks/useWakeLock';
import { unlockAudio } from '@/utils/sound';
import { buildStepTimeline, createCueScheduler, triggerCue, type CueScheduler, type TimelineEvent } from '@/utils/cues';
import { countCompletedSessions, getSessionNumber } from '@/utils/sessions';
import type { PositionDef, SessionProgress } from '@/types';

type Dialog = 'none' | 'reset';

interface UseCycleSessionParams {
  sessionId: string;
  onExit: () => void;
}

export function useCycleSession({ sessionId, onExit }: UseCycleSessionParams) {
  const config = useTreatmentStore((s) => s.config);
  const startDate = useTreatmentStore((s) => s.startDate);
  const settings = useTreatmentStore((s) => s.settings);
  const setSessionStatus = useTreatmentStore((s) => s.setSessionStatus);
  const saveSessionProgress = useTreatmentStore((s) => s.saveSessionProgress);
  const clearSessionProgress = useTreatmentStore((s) => s.clearSessionProgress);
  const setSessionDuration = useTreatmentStore((s) => s.setSessionDuration);
  const sessions = useTreatmentStore((s) => s.sessions);
  const completedCount = countCompletedSessions(sessions, config.sessionsPerDay);
  const totalCompleted = countCompletedSessions(sessions);
  const extraCompletedCount = Math.max(0, totalCompleted - completedCount);
  const totalSessions = config.sessionsPerDay * config.totalDays;
  const isExtraSession = (getSessionNumber(sessionId) ?? 0) > config.sessionsPerDay;

  const restored = useState<SessionProgress | null>(
    () => useTreatmentStore.getState().progress[todayISO()]?.[sessionId] ?? null,
  )[0];
  const [cycleIndex, setCycleIndex] = useState(restored?.cycleIndex ?? 0);
  const [positionIndex, setPositionIndex] = useState(restored?.positionIndex ?? 0);
  const [dialog, setDialog] = useState<Dialog>('none');
  const [showCompletion, setShowCompletion] = useState(false);
  const [intentionallyPaused, setIntentionallyPaused] = useState(false);
  const sessionStartRef = useRef(performance.now());
  const completedDurationRef = useRef<number | null>(null);
  const { secondsRemaining, isRunning, start, resume, pause, stop, setOnComplete, getRemaining } = useCountdown();

  const position: PositionDef = POSITIONS[positionIndex];
  const isTransition = position.durationKind === 'transition';
  const duration = getDurationSeconds(position, config);
  const dayNumber = startDate ? getDayNumber(startDate, config.totalDays) : 1;
  const cycleNumber = cycleIndex + 1;

  const sessionElapsedSeconds = useCallback(() => {
    if (completedDurationRef.current !== null) {
      return completedDurationRef.current;
    }
    return Math.max(0, Math.round((performance.now() - sessionStartRef.current) / 1000));
  }, []);

  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const schedulerRef = useRef<CueScheduler | null>(null);
  if (!schedulerRef.current) schedulerRef.current = createCueScheduler();
  const scheduler = schedulerRef.current;
  const timelineRef = useRef<TimelineEvent[]>([]);

  useWakeLock(!showCompletion);

  const finishSession = useCallback(() => {
    stop();
    scheduler.cancel();
    triggerCue('complete', settingsRef.current);
    const elapsed = sessionElapsedSeconds();
    completedDurationRef.current = elapsed;
    clearSessionProgress(todayISO(), sessionId);
    setSessionStatus(todayISO(), sessionId, 'completed');
    setSessionDuration(todayISO(), sessionId, elapsed);
    setShowCompletion(true);
  }, [stop, scheduler, sessionElapsedSeconds, clearSessionProgress, setSessionStatus, setSessionDuration, sessionId]);

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
    unlockAudio();
    if (showCompletion) return;
    setIntentionallyPaused(false);
    if (positionIndex < POSITIONS.length - 1) {
      const isLastCycle = cycleIndex === config.cyclesPerSession - 1;
      const isBeforeLongRest = positionIndex === POSITIONS.length - 2;
      if (isLastCycle && isBeforeLongRest) {
        finishSession();
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
    finishSession();
  }, [showCompletion, positionIndex, cycleIndex, config, finishSession, setSessionStatus, saveSessionProgress, sessionId]);

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
    if (showCompletion) return;
    if (isTransition) return;
    if (duration <= 0) {
      if (bypassRef.current) return;
      bypassRef.current = true;
      advanceRef.current();
      bypassRef.current = false;
      return;
    }
    const kind = position.kind;
    const isRestPosition = kind === 'rest' || kind === 'long-rest';
    triggerCue(kind === 'long-rest' ? 'longRest' : kind === 'rest' ? 'sit' : 'lie', settingsRef.current);
    timelineRef.current = buildStepTimeline(duration, isRestPosition);
    start(duration);
    scheduler.scheduleRemaining(timelineRef.current, duration, settingsRef.current);
  }, [cycleIndex, positionIndex, position.kind, isTransition, duration, start, showCompletion, scheduler]);

  useEffect(() => {
    if (!isRunning || isTransition || showCompletion) {
      scheduler.cancel();
      return;
    }
    scheduler.scheduleRemaining(timelineRef.current, getRemaining(), settings);
  }, [isRunning, isTransition, showCompletion, settings, getRemaining, scheduler]);

  useEffect(() => () => scheduler.cancel(), [scheduler]);

  const handlePauseResume = () => {
    unlockAudio();
    if (isRunning) {
      triggerCue('pause', settings);
      pause();
      setIntentionallyPaused(true);
    } else {
      triggerCue('resume', settings);
      resume();
      setIntentionallyPaused(false);
    }
  };

  const confirmReset = () => {
    stop();
    completedDurationRef.current = null;
    setShowCompletion(false);
    setCycleIndex(0);
    setPositionIndex(0);
    saveSessionProgress(todayISO(), sessionId, { cycleIndex: 0, positionIndex: 0 });
  };

  const isPaused = intentionallyPaused && !isRunning && !isTransition;

  return {
    config,
    position,
    isTransition,
    duration,
    isRunning,
    isPaused,
    secondsRemaining,
    cycleIndex,
    cycleNumber,
    positionIndex,
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
  };
}
