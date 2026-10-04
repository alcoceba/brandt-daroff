import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';

function installWakeLock() {
  const sentinel = { released: false, release: vi.fn(async () => { sentinel.released = true; }) };
  const request = vi.fn(async () => {
    sentinel.released = false;
    return sentinel;
  });
  Object.defineProperty(navigator, 'wakeLock', { value: { request }, configurable: true });
  return { request, sentinel };
}

async function flush() {
  for (let i = 0; i < 5; i++) await Promise.resolve();
}

describe('wake lock', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    delete (navigator as unknown as { wakeLock?: unknown }).wakeLock;
  });

  it('is a no-op when unsupported', async () => {
    const mod = await import('@/utils/wakeLock');
    expect(mod.isWakeLockSupported()).toBe(false);
    await expect(mod.requestWakeLock()).resolves.toBeUndefined();
    expect(mod.isWakeLockHeld()).toBe(false);
  });

  it('requests and releases the screen lock', async () => {
    const { request, sentinel } = installWakeLock();
    const mod = await import('@/utils/wakeLock');
    await mod.requestWakeLock();
    expect(request).toHaveBeenCalledWith('screen');
    expect(mod.isWakeLockHeld()).toBe(true);
    await mod.releaseWakeLock();
    expect(sentinel.release).toHaveBeenCalled();
    expect(mod.isWakeLockHeld()).toBe(false);
  });

  it('useWakeLock acquires while active, re-acquires on visibility and releases on unmount', async () => {
    const { request, sentinel } = installWakeLock();
    const { useWakeLock } = await import('@/hooks/useWakeLock');
    const { unmount } = renderHook(() => useWakeLock(true));
    await flush();
    expect(request).toHaveBeenCalledTimes(1);

    sentinel.released = true;
    document.dispatchEvent(new Event('visibilitychange'));
    await flush();
    expect(request).toHaveBeenCalledTimes(2);

    unmount();
    await flush();
    expect(sentinel.release).toHaveBeenCalled();
  });

  it('useWakeLock does nothing when inactive', async () => {
    const { request } = installWakeLock();
    const { useWakeLock } = await import('@/hooks/useWakeLock');
    renderHook(() => useWakeLock(false));
    await flush();
    expect(request).not.toHaveBeenCalled();
  });
});
