import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCycleSession } from './useCycleSession';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { todayISO } from '@/utils/date';

const cueMocks = vi.hoisted(() => ({
  triggerCue: vi.fn(() => () => {}),
  scheduleRemaining: vi.fn(),
  cancel: vi.fn(),
}));

vi.mock('@/utils/sound', () => ({
  unlockAudio: vi.fn(),
  registerAudioUnlock: vi.fn(() => () => {}),
}));

vi.mock('@/utils/cues', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/cues')>();
  return {
    ...actual,
    triggerCue: cueMocks.triggerCue,
    createCueScheduler: () => ({ scheduleRemaining: cueMocks.scheduleRemaining, cancel: cueMocks.cancel }),
  };
});

vi.mock('@/utils/wakeLock', () => ({
  requestWakeLock: vi.fn(() => Promise.resolve()),
  releaseWakeLock: vi.fn(() => Promise.resolve()),
}));

const cuesPlayed = () => (cueMocks.triggerCue.mock.calls as unknown as [string][]).map((c) => c[0]);

describe('useCycleSession hook', () => {
  const onExit = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    useTreatmentStore.getState().fullReset();
  });

  afterEach(() => {
    vi.useRealTimers();
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

    // Should now be at Cycle 2. The 0s sitting transition is skipped,
    // so the next active position is Lying right (position 1).
    expect(result.current.cycleNumber).toBe(2);
    expect(result.current.positionIndex).toBe(1);
    expect(result.current.position.kind).toBe('lying-right');
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
    expect(useTreatmentStore.getState().sessionDurations[todayISO()]?.['session-1']).toBeGreaterThan(0);
  });

  it('should toggle pause/resume states correctly', async () => {
    const { result } = renderHook(() => useCycleSession({ sessionId: 'session-1', onExit }));

    // Advance to Lying right
    act(() => { result.current.advance(); });
    expect(result.current.isRunning).toBe(true);

    act(() => {
      result.current.handlePauseResume();
    });
    expect(result.current.isRunning).toBe(false);
    expect(cuesPlayed()).toContain('pause');
    expect(cueMocks.cancel).toHaveBeenCalled();

    cueMocks.scheduleRemaining.mockClear();
    act(() => {
      result.current.handlePauseResume();
    });
    expect(result.current.isRunning).toBe(true);
    expect(cuesPlayed()).toContain('resume');
    expect(cueMocks.scheduleRemaining).toHaveBeenCalled();
  });

  it('plays the right cue at the start of each step and schedules its timeline', () => {
    const { result } = renderHook(() => useCycleSession({ sessionId: 'session-1', onExit }));

    act(() => { result.current.advance(); });
    expect(cuesPlayed().at(-1)).toBe('lie');
    const [timeline, remaining] = cueMocks.scheduleRemaining.mock.calls[0] as [{ cue: string }[], number];
    expect(remaining).toBe(30);
    expect(timeline.map((e) => e.cue)).toEqual(['midpoint', 'tick', 'tick', 'tick', 'tick', 'tickFinal']);

    act(() => { result.current.advance(); });
    expect(cuesPlayed().at(-1)).toBe('sit');

    act(() => { result.current.advance(); });
    expect(cuesPlayed().at(-1)).toBe('lie');

    act(() => { result.current.advance(); });
    expect(cuesPlayed().at(-1)).toBe('longRest');
  });

  it('plays the completion cue when the session finishes', () => {
    useTreatmentStore.getState().setConfig({ cyclesPerSession: 1 });
    const { result } = renderHook(() => useCycleSession({ sessionId: 'session-1', onExit }));
    act(() => { result.current.advance(); });
    act(() => { result.current.advance(); });
    act(() => { result.current.advance(); });
    act(() => { result.current.advance(); });
    expect(result.current.showCompletion).toBe(true);
    expect(cuesPlayed().at(-1)).toBe('complete');
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

  it('should stop timer and freeze elapsed seconds when cycles finish naturally', () => {
    useTreatmentStore.getState().setConfig({ cyclesPerSession: 1 });

    const { result } = renderHook(() => useCycleSession({ sessionId: 'session-1', onExit }));

    // 1. Sitting -> advance to lying right
    act(() => { result.current.advance(); });
    // 2. Lying right (30s)
    act(() => { vi.advanceTimersByTime(30100); });
    // 3. Rest (30s)
    act(() => { vi.advanceTimersByTime(30100); });
    // 4. Lying left (30s)
    act(() => { vi.advanceTimersByTime(30100); });

    expect(result.current.showCompletion).toBe(true);
    expect(result.current.isRunning).toBe(false);

    const elapsed = result.current.sessionElapsedSeconds();
    expect(elapsed).toBeGreaterThan(0);

    // Advancing time further should NOT increment the elapsed seconds
    act(() => { vi.advanceTimersByTime(15000); });
    expect(result.current.sessionElapsedSeconds()).toBe(elapsed);
  });

  it('should stop timer and freeze elapsed seconds when advancing early on the final position', () => {
    useTreatmentStore.getState().setConfig({ cyclesPerSession: 1 });

    const { result } = renderHook(() => useCycleSession({ sessionId: 'session-1', onExit }));

    // 1. Sitting
    act(() => { result.current.advance(); });
    // 2. Lying right
    act(() => { result.current.advance(); });
    // 3. Rest
    act(() => { result.current.advance(); });
    // 4. Lying left - advance early while timer is running
    act(() => { result.current.advance(); });

    expect(result.current.showCompletion).toBe(true);
    expect(result.current.isRunning).toBe(false);

    const elapsed = result.current.sessionElapsedSeconds();
    // Advancing time further should NOT change elapsed seconds or re-trigger advance
    act(() => { vi.advanceTimersByTime(60000); });
    expect(result.current.sessionElapsedSeconds()).toBe(elapsed);
    expect(result.current.showCompletion).toBe(true);
  });

  it('restores in-progress session state from store', () => {
    const today = todayISO();
    useTreatmentStore.getState().saveSessionProgress(today, 'session-1', {
      cycleIndex: 2,
      positionIndex: 3,
    });

    const { result } = renderHook(() => useCycleSession({ sessionId: 'session-1', onExit }));

    expect(result.current.cycleIndex).toBe(2);
    expect(result.current.positionIndex).toBe(3);
    expect(useTreatmentStore.getState().sessions[today]?.['session-1']).toBe('in-progress');
  });

  it('automatically advances when position duration is 0', () => {
    useTreatmentStore.getState().setConfig({ restBetweenPositions: 0 });

    const { result } = renderHook(() => useCycleSession({ sessionId: 'session-1', onExit }));

    // Advance from Sitting to Lying Right (30s)
    act(() => {
      result.current.advance();
    });
    expect(result.current.position.kind).toBe('lying-right');

    // Advance from Lying Right to Rest (duration 0) -> should automatically bypass to Lying Left!
    act(() => {
      result.current.advance();
    });
    expect(result.current.position.kind).toBe('lying-left');
  });

  it('resets session to start on confirmReset', () => {
    const { result } = renderHook(() => useCycleSession({ sessionId: 'session-1', onExit }));

    act(() => {
      result.current.advance(); // now in lying-right
    });
    expect(result.current.positionIndex).toBe(1);

    act(() => {
      result.current.confirmReset();
    });

    expect(result.current.positionIndex).toBe(0);
    expect(result.current.cycleIndex).toBe(0);
    expect(result.current.isTransition).toBe(true);
  });

  it('goHome sets session status and calls onExit', () => {
    const exitMock = vi.fn();
    const today = todayISO();
    const { result } = renderHook(() => useCycleSession({ sessionId: 'session-1', onExit: exitMock }));

    act(() => {
      result.current.goHome('pending');
    });

    expect(useTreatmentStore.getState().sessions[today]?.['session-1']).toBe('pending');
    expect(exitMock).toHaveBeenCalledTimes(1);
  });

  it('finishes session when advance is called on last cycle and last position', () => {
    const today = todayISO();
    useTreatmentStore.getState().setConfig({ cyclesPerSession: 1 });
    useTreatmentStore.getState().saveSessionProgress(today, 'session-1', {
      cycleIndex: 0,
      positionIndex: 4,
    });

    const { result } = renderHook(() => useCycleSession({ sessionId: 'session-1', onExit }));

    // Advance from position 4 of last cycle
    act(() => {
      result.current.advance();
    });

    expect(result.current.showCompletion).toBe(true);
  });

  it('does not restart the countdown timer when toggling sound', () => {
    const { result } = renderHook(() => useCycleSession({ sessionId: 'session-1', onExit }));

    // Advance to Lying right (30s)
    act(() => {
      result.current.advance();
    });
    expect(result.current.position.kind).toBe('lying-right');
    expect(result.current.isRunning).toBe(true);

    // Let 10 seconds pass
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    const remainingBeforeToggle = result.current.secondsRemaining;
    expect(remainingBeforeToggle).toBeLessThan(30);
    expect(remainingBeforeToggle).toBeGreaterThanOrEqual(19);

    // Toggle sound setting (mute)
    act(() => {
      useTreatmentStore.getState().toggleSound();
    });

    // Timer should NOT have restarted back to 30
    expect(result.current.isRunning).toBe(true);
    expect(result.current.secondsRemaining).toBe(remainingBeforeToggle);

    // Toggle sound setting again (unmute)
    act(() => {
      useTreatmentStore.getState().toggleSound();
    });

    expect(result.current.isRunning).toBe(true);
    expect(result.current.secondsRemaining).toBe(remainingBeforeToggle);
  });
});

