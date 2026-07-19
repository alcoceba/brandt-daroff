export function vibrate(vibrationEnabled: boolean, pattern: number | number[] = 200): void {
  if (!vibrationEnabled) return;
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  navigator.vibrate(pattern);
}

export function cueChange(vibrationEnabled: boolean): void {
  vibrate(vibrationEnabled, [120, 60, 120]);
}
