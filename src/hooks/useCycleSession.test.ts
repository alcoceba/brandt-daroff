import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCycleSession } from './useCycleSession';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { todayISO } from '@/utils/date';

// Mock sound/vibration utilities to avoid console warnings / audio mock errors
vi.mock('@/utils/sound', () => ({
  playBeep: vi.fn().mockResolvedValue(undefined),
  playBeepHigh: vi.fn().mockResolvedValue(undefined),
  playPositionCue: vi.fn().mockResolvedValue(undefined),
  playRestCue: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/utils/vibration', () => ({
  vibrate: vi.fn(),
  cueChange: vi.fn(),
}));

describe('useCycleSession hook', () => {
  const onExit = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    // Map requestAnimationFrame to setTimeout for easy test timing control
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(cb, 16));
    vi.stubGlobal('cancelAnimationFrame', (id: ReturnType<typeof setTimeout>) => clearTimeout(id));
    vi.clearAllMocks();
    useTreatmentStore.getState().fullReset();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('should initialize with correct session parameters', () => {
    const { result } = renderHook(() => useCycleSession({ sessionId: 'session-1', onExit }));

    expect(result.current.cycleIndex).toBe(0);
    expect(result.current.cycleNumber).toBe(1);
    expect(result.current.positionIndex).toBe(0);
    expect(result.current.position.kind).toBe('sitting'); // first position Sitting
    expect(result.current.isTransition).toBe(true);
    expect(result.current.showCompletion).toBe(false);
  });

  it('should transition to next step when advance is called', () => {
    const { result } = renderHook(() => useCycleSession({ sessionId: 'session-1', onExit }));

    // Currently Sitting (Transition state)
    expect(result.current.isTransition).toBe(true);

    // Advance to Lying right
    act(() => {
      result.current.advance();
    });

    expect(result.current.positionIndex).toBe(1);
    expect(result.current.position.kind).toBe('lying-right');
    expect(result.current.isTransition).toBe(false);
    expect(result.current.isRunning).toBe(true);
  });

  it('should complete cycle steps and advance to next cycles correctly', () => {
    const { result } = renderHook(() => useCycleSession({ sessionId: 'session-1', onExit }));

    // 1. Sitting (transition)
    act(() => { result.current.advance(); });

    // 2. Lying right (30s)
    expect(result.current.position.kind).toBe('lying-right');
    act(() => { vi.advanceTimersByTime(30100); }); // wait for timer to run out

    // 3. Rest (30s)
    expect(result.current.position.kind).toBe('rest');
    act(() => { vi.advanceTimersByTime(30100); });

    // 4. Lying left (30s)
    expect(result.current.position.kind).toBe('lying-left');
    act(() => { vi.advanceTimersByTime(30100); });

    // 5. Long rest (120s) - wait for it to transition to next cycle
    expect(result.current.position.kind).toBe('long-rest');
    act(() => { vi.advanceTimersByTime(120100); });

    // Should now be at Cycle 2, Position 0 (Sitting - transition)
    expect(result.current.cycleNumber).toBe(2);
    expect(result.current.positionIndex).toBe(0);
  });

  it('should show completion view when all cycles are finished', () => {
    // Configure store to only require 1 cycle to speed up the test
    useTreatmentStore.getState().setConfig({ cyclesPerSession: 1 });

    const { result } = renderHook(() => useCycleSession({ sessionId: 'session-1', onExit }));

    // 1. Sitting
    act(() => { result.current.advance(); });
    // 2. Lying right
    act(() => { vi.advanceTimersByTime(30100); });
    // 3. Rest
    act(() => { vi.advanceTimersByTime(30100); });
    // 4. Lying left
    act(() => { vi.advanceTimersByTime(30100); });

    // For the last cycle, completing lying-left should directly mark the session completed
    // because rest between cycles (long-rest) is skipped on the final cycle
    expect(result.current.showCompletion).toBe(true);
    expect(useTreatmentStore.getState().sessions[todayISO()]?.['session-1']).toBe('completed');
  });

  it('should toggle pause/resume states correctly', () => {
    const { result } = renderHook(() => useCycleSession({ sessionId: 'session-1', onExit }));

    // Advance to Lying right
    act(() => { result.current.advance(); });
    expect(result.current.isRunning).toBe(true);

    // Pause
    act(() => {
      result.current.handlePauseResume();
    });
    expect(result.current.isRunning).toBe(false);

    // Resume
    act(() => {
      result.current.handlePauseResume();
    });
    expect(result.current.isRunning).toBe(true);
  });

  it('should reset timer progress when reset is confirmed', () => {
    const { result } = renderHook(() => useCycleSession({ sessionId: 'session-1', onExit }));

    act(() => { result.current.advance(); });
    act(() => { vi.advanceTimersByTime(10000); });

    // Cycle 1, Position 1
    expect(result.current.cycleIndex).toBe(0);
    expect(result.current.positionIndex).toBe(1);

    // Reset
    act(() => {
      result.current.confirmReset();
    });

    // Should return to Cycle 1, Position 0
    expect(result.current.cycleIndex).toBe(0);
    expect(result.current.positionIndex).toBe(0);
  });
});
