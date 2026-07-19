import { useEffect, useRef } from 'react';
import { playBeep } from '@/utils/sound';

interface UseBeepCuesParams {
  secondsRemaining: number;
  isRunning: boolean;
  isTransition: boolean;
  duration: number;
  isRest: boolean;
  midPoint: number;
  soundEnabled: boolean;
}

export function useBeepCues({
  secondsRemaining,
  isRunning,
  isTransition,
  duration,
  isRest,
  midPoint,
  soundEnabled,
}: UseBeepCuesParams): void {
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
        void playBeep(soundEnabled);
      } else if (currentSecond <= 5 && currentSecond > 0) {
        void playBeep(soundEnabled);
      }
    } else {
      if (currentSecond === midPoint && midPoint > 5) {
        void playBeep(soundEnabled);
      } else if (currentSecond <= 5 && currentSecond > 0) {
        void playBeep(soundEnabled);
      }
    }
  }, [secondsRemaining, isRunning, isTransition, duration, isRest, midPoint, soundEnabled]);
}
