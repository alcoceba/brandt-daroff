import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCountdown } from './useCountdown';

describe('useCountdown hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize in stopped state', () => {
    const { result } = renderHook(() => useCountdown());
    
    expect(result.current.secondsRemaining).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });

  it('should start countdown timer and countdown correctly', () => {
    const { result } = renderHook(() => useCountdown());

    act(() => {
      result.current.start(30);
    });

    expect(result.current.isRunning).toBe(true);
    expect(result.current.secondsRemaining).toBe(30);

    // Advance time by 10 seconds
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // We allow minor offset discrepancies due to RAF frames simulation
    expect(result.current.secondsRemaining).toBeLessThanOrEqual(20.1);
    expect(result.current.secondsRemaining).toBeGreaterThanOrEqual(19.9);
  });

  it('should call onComplete when countdown reaches 0', () => {
    const { result } = renderHook(() => useCountdown());
    const onComplete = vi.fn();

    act(() => {
      result.current.setOnComplete(onComplete);
      result.current.start(5);
    });

    expect(onComplete).not.toHaveBeenCalled();

    // Advance past 5 seconds
    act(() => {
      vi.advanceTimersByTime(5100);
    });

    expect(result.current.secondsRemaining).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('should pause and resume the countdown correctly', () => {
    const { result } = renderHook(() => useCountdown());

    act(() => {
      result.current.start(30);
    });

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(result.current.secondsRemaining).toBeCloseTo(20, 1);

    // Pause
    act(() => {
      result.current.pause();
    });

    expect(result.current.isRunning).toBe(false);

    // Advance time while paused
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Time remaining should NOT change
    expect(result.current.secondsRemaining).toBeCloseTo(20, 1);

    // Resume
    act(() => {
      result.current.resume();
    });

    expect(result.current.isRunning).toBe(true);

    // Advance time again
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.secondsRemaining).toBeCloseTo(15, 1);
  });

  it('should stop countdown reset state when stop is called', () => {
    const { result } = renderHook(() => useCountdown());

    act(() => {
      result.current.start(30);
    });

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(result.current.isRunning).toBe(true);

    // Stop
    act(() => {
      result.current.stop();
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.secondsRemaining).toBe(0);
  });
});
