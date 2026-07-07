import { useCallback, useEffect, useRef, useState } from 'react';

export interface CountdownControls {
  secondsRemaining: number;
  isRunning: boolean;
  start: (durationSec: number) => void;
  resume: () => void;
  pause: () => void;
  stop: () => void;
  setOnComplete: (cb?: () => void) => void;
}

export function useCountdown(): CountdownControls {
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const endRef = useRef<number | null>(null);
  const remainingRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const onCompleteRef = useRef<(() => void) | undefined>(undefined);

  const setOnComplete = useCallback((cb?: () => void) => {
    onCompleteRef.current = cb;
  }, []);

  const tick = useCallback(() => {
    if (endRef.current === null) return;
    const remaining = (endRef.current - performance.now()) / 1000;
    if (remaining <= 0) {
      remainingRef.current = 0;
      setSecondsRemaining(0);
      setIsRunning(false);
      endRef.current = null;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      onCompleteRef.current?.();
      return;
    }
    remainingRef.current = remaining;
    setSecondsRemaining(remaining);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(
    (durationSec: number) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      remainingRef.current = durationSec;
      setSecondsRemaining(durationSec);
      endRef.current = performance.now() + durationSec * 1000;
      setIsRunning(true);
      rafRef.current = requestAnimationFrame(tick);
    },
    [tick],
  );

  const resume = useCallback(() => {
    if (endRef.current !== null) return;
    endRef.current = performance.now() + remainingRef.current * 1000;
    setIsRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const pause = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (endRef.current !== null) {
      remainingRef.current = Math.max((endRef.current - performance.now()) / 1000, 0);
      endRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    endRef.current = null;
    remainingRef.current = 0;
    setSecondsRemaining(0);
    setIsRunning(false);
  }, []);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  return { secondsRemaining, isRunning, start, resume, pause, stop, setOnComplete };
}
