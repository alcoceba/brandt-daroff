import { useTreatmentStore } from '@/store/useTreatmentStore';

export function vibrate(pattern: number | number[] = 200): void {
  const vibrationOn = useTreatmentStore.getState().settings.vibration;
  if (!vibrationOn) return;
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  navigator.vibrate(pattern);
}

export function cueChange(): void {
  vibrate([120, 60, 120]);
}
