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
});
