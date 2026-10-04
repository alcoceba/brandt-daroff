import { useEffect } from 'react';
import { releaseWakeLock, requestWakeLock } from '@/utils/wakeLock';

export function useWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    let disposed = false;

    const acquire = () => {
      if (disposed) return;
      void requestWakeLock().then(() => {
        if (disposed) void releaseWakeLock();
      });
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') acquire();
    };

    acquire();
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pointerdown', acquire, { passive: true });

    return () => {
      disposed = true;
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pointerdown', acquire);
      void releaseWakeLock();
    };
  }, [active]);
}
