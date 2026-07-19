import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBeepCues } from './useBeepCues';
import { playBeep } from '@/utils/sound';

vi.mock('@/utils/sound', () => ({
  playBeep: vi.fn().mockResolvedValue(undefined),
}));

describe('useBeepCues hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultParams = {
    secondsRemaining: 30,
    isRunning: true,
    isTransition: false,
    duration: 30,
    isRest: false,
    midPoint: 15,
    soundEnabled: true,
  };

  it('should play beep at midpoint and last 5 seconds for non-rest position', () => {
    const { rerender } = renderHook(
      (params) => useBeepCues(params),
      { initialProps: { ...defaultParams, secondsRemaining: 30 } }
    );

    expect(playBeep).not.toHaveBeenCalled();

    // Rerender at midpoint (15)
    rerender({ ...defaultParams, secondsRemaining: 15 });
    expect(playBeep).toHaveBeenCalledTimes(1);

    // Rerender at 10 (should not play beep for non-rest at 10s)
    rerender({ ...defaultParams, secondsRemaining: 10 });
    expect(playBeep).toHaveBeenCalledTimes(1);

    // Rerender at 5 (last seconds count down)
    rerender({ ...defaultParams, secondsRemaining: 5 });
    expect(playBeep).toHaveBeenCalledTimes(2);

    // Rerender at 4
    rerender({ ...defaultParams, secondsRemaining: 4 });
    expect(playBeep).toHaveBeenCalledTimes(3);

    // Rerender at 0
    rerender({ ...defaultParams, secondsRemaining: 0 });
    expect(playBeep).toHaveBeenCalledTimes(3); // does not beep on 0
  });

  it('should play beep at 10 seconds and last 5 seconds for rest position', () => {
    const restParams = {
      ...defaultParams,
      isRest: true,
      duration: 30,
      midPoint: 15,
    };

    const { rerender } = renderHook(
      (params) => useBeepCues(params),
      { initialProps: { ...restParams, secondsRemaining: 30 } }
    );

    // Rerender at midpoint (15) - rest position should NOT beep at midpoint
    rerender({ ...restParams, secondsRemaining: 15 });
    expect(playBeep).not.toHaveBeenCalled();

    // Rerender at 10 - rest position SHOULD beep at 10
    rerender({ ...restParams, secondsRemaining: 10 });
    expect(playBeep).toHaveBeenCalledTimes(1);

    // Rerender at 5 - should beep
    rerender({ ...restParams, secondsRemaining: 5 });
    expect(playBeep).toHaveBeenCalledTimes(2);
  });

  it('should not play beep if isRunning is false or isTransition is true', () => {
    renderHook(() => useBeepCues({ ...defaultParams, secondsRemaining: 15, isRunning: false }));
    expect(playBeep).not.toHaveBeenCalled();

    renderHook(() => useBeepCues({ ...defaultParams, secondsRemaining: 15, isTransition: true }));
    expect(playBeep).not.toHaveBeenCalled();
  });

  it('should not play beep if soundEnabled is false', () => {
    renderHook(() => useBeepCues({ ...defaultParams, secondsRemaining: 15, soundEnabled: false }));
    expect(playBeep).not.toHaveBeenCalled();
  });
});
