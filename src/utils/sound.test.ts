import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('sound utilities', () => {
  let playBeep: (enabled: boolean) => Promise<void>;
  let playBeepHigh: (enabled: boolean) => Promise<void>;
  let playPositionCue: (enabled: boolean) => Promise<void>;
  let playRestCue: (enabled: boolean) => Promise<void>;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    
    const soundModule = await import('./sound');
    playBeep = soundModule.playBeep;
    playBeepHigh = soundModule.playBeepHigh;
    playPositionCue = soundModule.playPositionCue;
    playRestCue = soundModule.playRestCue;
  });

  it('should not initialize AudioContext or play sounds if soundEnabled is false', async () => {
    const audioContextSpy = vi.spyOn(global, 'AudioContext');
    
    await playBeep(false);
    await playBeepHigh(false);
    await playPositionCue(false);
    await playRestCue(false);

    expect(audioContextSpy).not.toHaveBeenCalled();
  });

  it('should play beep sound when enabled', async () => {
    const audioContextSpy = vi.spyOn(global, 'AudioContext');

    await playBeep(true);

    expect(audioContextSpy).toHaveBeenCalled();
    const mockContextInstance = audioContextSpy.mock.results[0].value as AudioContext;
    
    expect(mockContextInstance.createOscillator).toHaveBeenCalled();
    expect(mockContextInstance.createGain).toHaveBeenCalled();
  });

  it('should play high beep sound when enabled', async () => {
    const audioContextSpy = vi.spyOn(global, 'AudioContext');

    await playBeepHigh(true);

    expect(audioContextSpy).toHaveBeenCalled();
    const mockContextInstance = audioContextSpy.mock.results[0].value as AudioContext;
    
    expect(mockContextInstance.createOscillator).toHaveBeenCalled();
  });

  it('should play position cues with two oscillator tones', async () => {
    const audioContextSpy = vi.spyOn(global, 'AudioContext');

    await playPositionCue(true);

    expect(audioContextSpy).toHaveBeenCalled();
    const mockContextInstance = audioContextSpy.mock.results[0].value as AudioContext;
    
    // Position cue plays 2 frequencies [880, 1320]
    expect(mockContextInstance.createOscillator).toHaveBeenCalledTimes(2);
  });

  it('should play rest cues with two oscillator tones', async () => {
    const audioContextSpy = vi.spyOn(global, 'AudioContext');

    await playRestCue(true);

    expect(audioContextSpy).toHaveBeenCalled();
    const mockContextInstance = audioContextSpy.mock.results[0].value as AudioContext;
    
    // Rest cue plays 2 frequencies [1320, 880]
    expect(mockContextInstance.createOscillator).toHaveBeenCalledTimes(2);
  });

  it('resumes suspended audio context', async () => {
    const resumeMock = vi.fn().mockResolvedValue(undefined);
    class SuspendedContext {
      state = 'suspended';
      resume = resumeMock;
      currentTime = 0;
      destination = {};
      createOscillator = vi.fn(() => ({
        type: 'sine',
        frequency: { value: 0 },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      }));
      createGain = vi.fn(() => ({
        gain: { value: 1, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        connect: vi.fn(),
      }));
    }
    const audioContextSpy = vi.spyOn(global, 'AudioContext').mockImplementation(function (this: unknown) {
      return new SuspendedContext() as unknown as AudioContext;
    });

    await playBeep(true);
    expect(resumeMock).toHaveBeenCalledTimes(1);
    audioContextSpy.mockRestore();
  });

  it('handles environment with no AudioContext or only webkitAudioContext', async () => {
    vi.resetModules();
    const originalAC = window.AudioContext;
    // @ts-expect-error delete for testing
    delete window.AudioContext;

    // Test with webkitAudioContext
    const mockResume = vi.fn().mockResolvedValue(undefined);
    class WebkitContext {
      state = 'running';
      resume = mockResume;
      currentTime = 0;
      destination = {};
      createOscillator = vi.fn(() => ({
        type: 'sine',
        frequency: { value: 0 },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      }));
      createGain = vi.fn(() => ({
        gain: { value: 1, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        connect: vi.fn(),
      }));
    }
    const mockWebkit = vi.fn().mockImplementation(function (this: unknown) {
      return new WebkitContext();
    });
    (window as unknown as { webkitAudioContext: unknown }).webkitAudioContext = mockWebkit;

    const soundModule1 = await import('./sound');
    await soundModule1.playBeep(true);
    expect(mockWebkit).toHaveBeenCalled();

    // Test with neither
    vi.resetModules();
    delete (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext;
    const soundModule2 = await import('./sound');
    await expect(soundModule2.playBeep(true)).resolves.toBeUndefined();

    window.AudioContext = originalAC;
  });
});
