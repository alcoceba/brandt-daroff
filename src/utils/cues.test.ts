import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const scheduleSound = vi.fn((..._args: unknown[]) => vi.fn());
const vibrate = vi.fn();

vi.mock('@/utils/sound', () => ({
  scheduleSound: (...args: unknown[]) => scheduleSound(...args),
}));
vi.mock('@/utils/vibration', () => ({
  vibrate: (...args: unknown[]) => vibrate(...args),
}));

import { buildStepTimeline, createCueScheduler, CUE_VIBRATION, DEMO_SEQUENCE, playDemo, triggerCue } from './cues';

describe('cues', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    scheduleSound.mockClear();
    vibrate.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('buildStepTimeline', () => {
    it('adds midpoint and a 5-beep countdown for a 30s position', () => {
      expect(buildStepTimeline(30, false)).toEqual([
        { secondsLeft: 15, cue: 'midpoint' },
        { secondsLeft: 5, cue: 'tick' },
        { secondsLeft: 4, cue: 'tick' },
        { secondsLeft: 3, cue: 'tick' },
        { secondsLeft: 2, cue: 'tick' },
        { secondsLeft: 1, cue: 'tickFinal' },
      ]);
    });

    it('adds heads-up at 10s and countdown for rests', () => {
      const timeline = buildStepTimeline(120, true);
      expect(timeline[0]).toEqual({ secondsLeft: 10, cue: 'headsUp' });
      expect(timeline.filter((e) => e.cue === 'tick')).toHaveLength(4);
      expect(timeline.at(-1)).toEqual({ secondsLeft: 1, cue: 'tickFinal' });
      expect(timeline.some((e) => e.cue === 'midpoint')).toBe(false);
    });

    it('skips midpoint and heads-up for short steps', () => {
      expect(buildStepTimeline(10, false).some((e) => e.cue === 'midpoint')).toBe(false);
      expect(buildStepTimeline(10, true).some((e) => e.cue === 'headsUp')).toBe(false);
      expect(buildStepTimeline(3, false).map((e) => e.secondsLeft)).toEqual([2, 1]);
    });
  });

  describe('triggerCue', () => {
    it('plays sound and vibration immediately', () => {
      triggerCue('lie', { sound: true, vibration: true });
      expect(scheduleSound).toHaveBeenCalledWith('lie', true, 0);
      expect(vibrate).toHaveBeenCalledWith(true, CUE_VIBRATION.lie);
    });

    it('delays vibration to match the scheduled sound', () => {
      triggerCue('tick', { sound: true, vibration: true }, 2);
      expect(scheduleSound).toHaveBeenCalledWith('tick', true, 2);
      expect(vibrate).not.toHaveBeenCalled();
      vi.advanceTimersByTime(2000);
      expect(vibrate).toHaveBeenCalledWith(true, CUE_VIBRATION.tick);
    });

    it('cancel stops pending sound and vibration', () => {
      const cancelSound = vi.fn();
      scheduleSound.mockReturnValueOnce(cancelSound);
      const cancel = triggerCue('tick', { sound: true, vibration: true }, 2);
      cancel();
      vi.advanceTimersByTime(3000);
      expect(cancelSound).toHaveBeenCalled();
      expect(vibrate).not.toHaveBeenCalled();
    });

    it('does not vibrate when vibration is off', () => {
      triggerCue('lie', { sound: true, vibration: false });
      expect(vibrate).not.toHaveBeenCalled();
    });
  });

  describe('createCueScheduler', () => {
    it('schedules only the remaining events relative to now', () => {
      const scheduler = createCueScheduler();
      scheduler.scheduleRemaining(buildStepTimeline(30, false), 12, { sound: true, vibration: false });
      const delays = scheduleSound.mock.calls.map((c) => c[2]);
      expect(delays).toEqual([7, 8, 9, 10, 11]);
    });

    it('cancels previous events when rescheduling or cancelling', () => {
      const cancels = [vi.fn(), vi.fn()];
      scheduleSound.mockReturnValueOnce(cancels[0]).mockReturnValueOnce(cancels[1]);
      const scheduler = createCueScheduler();
      scheduler.scheduleRemaining([{ secondsLeft: 2, cue: 'tick' }, { secondsLeft: 1, cue: 'tickFinal' }], 5, {
        sound: true,
        vibration: false,
      });
      scheduler.cancel();
      expect(cancels[0]).toHaveBeenCalled();
      expect(cancels[1]).toHaveBeenCalled();
    });
  });

  it('playDemo schedules the demo sequence', () => {
    playDemo({ sound: true, vibration: false });
    expect(scheduleSound.mock.calls.map((c) => [c[0], c[2]])).toEqual(DEMO_SEQUENCE.map((s) => [s.cue, s.at]));
  });
});
