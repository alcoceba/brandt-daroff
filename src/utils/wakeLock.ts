let sentinel: WakeLockSentinel | null = null;
let pending: Promise<void> | null = null;

export function isWakeLockSupported(): boolean {
  return typeof navigator !== 'undefined' && 'wakeLock' in navigator && !!navigator.wakeLock;
}

export function isWakeLockHeld(): boolean {
  return !!sentinel && !sentinel.released;
}

export function requestWakeLock(): Promise<void> {
  if (!isWakeLockSupported() || isWakeLockHeld()) return Promise.resolve();
  if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return Promise.resolve();
  if (pending) return pending;
  pending = navigator.wakeLock
    .request('screen')
    .then((lock) => {
      sentinel = lock;
    })
    .catch(() => {
      sentinel = null;
    })
    .finally(() => {
      pending = null;
    });
  return pending;
}

export async function releaseWakeLock(): Promise<void> {
  if (pending) await pending;
  const lock = sentinel;
  sentinel = null;
  if (lock && !lock.released) {
    try {
      await lock.release();
    } catch {
      // Ignore release errors
    }
  }
}
