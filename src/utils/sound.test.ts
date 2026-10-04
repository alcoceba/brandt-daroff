import { describe, it, expect, vi, beforeEach } from 'vitest';

type SoundModule = typeof import('./sound');

async function flush() {
  await Promise.resolve();
  await Promise.resolve();
}

describe('sound engine', () => {
  let sound: SoundModule;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    sound = await import('./sound');
  });

  it('defines tones for every cue', () => {
    for (const name of sound.CUE_NAMES) {
      expect(sound.CUES[name].length).toBeGreaterThan(0);
      expect(sound.getCueDuration(name)).toBeGreaterThan(0);
    }
  });

  it('does not create an AudioContext when sound is disabled', async () => {
    const spy = vi.spyOn(global, 'AudioContext');
    sound.scheduleSound('lie', false);
    await flush();
    expect(spy).not.toHaveBeenCalled();
  });

  it('schedules oscillators for a cue including partials', async () => {
    const spy = vi.spyOn(global, 'AudioContext');
    sound.scheduleSound('lie', true);
    await flush();
    const instance = spy.mock.results[0].value as AudioContext;
    const layers = sound.CUES.lie.reduce((n, tone) => n + 1 + (tone.partials?.length ?? 0), 0);
    expect(instance.createOscillator).toHaveBeenCalledTimes(layers);
  });

  it('schedules a delayed cue in the future on the audio clock', async () => {
    const spy = vi.spyOn(global, 'AudioContext');
    sound.scheduleSound('tick', true, 3);
    await flush();
    const instance = spy.mock.results[0].value as AudioContext;
    const osc = (instance.createOscillator as unknown as ReturnType<typeof vi.fn>).mock.results[0].value;
    const startAt = osc.start.mock.calls[0][0] as number;
    expect(startAt).toBeGreaterThan(2.5);
  });

  it('cancelling before the context is ready plays nothing', async () => {
    const spy = vi.spyOn(global, 'AudioContext');
    const cancel = sound.scheduleSound('complete', true, 1);
    cancel();
    await flush();
    const instance = spy.mock.results[0].value as AudioContext;
    expect(instance.createOscillator).not.toHaveBeenCalled();
  });

  it('resumes a suspended context before scheduling', async () => {
    const spy = vi.spyOn(global, 'AudioContext');
    sound.scheduleSound('tick', true);
    await flush();
    const instance = spy.mock.results[0].value as AudioContext;
    expect(instance.resume).toHaveBeenCalled();
  });

  it('falls back to webkitAudioContext and handles no audio support', async () => {
    vi.resetModules();
    const originalAC = window.AudioContext;
    const originalWebkit = (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext;
    // @ts-expect-error delete for testing
    delete window.AudioContext;

    const webkit = vi.fn().mockImplementation(function (this: unknown) {
      return new (originalAC as unknown as new () => AudioContext)();
    });
    (window as unknown as { webkitAudioContext: unknown }).webkitAudioContext = webkit;
    const mod1 = await import('./sound');
    mod1.scheduleSound('tick', true);
    await flush();
    expect(webkit).toHaveBeenCalled();

    vi.resetModules();
    delete (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext;
    const mod2 = await import('./sound');
    expect(mod2.getAudioState()).toBe('unavailable');
    expect(() => mod2.scheduleSound('tick', true)).not.toThrow();

    window.AudioContext = originalAC;
    (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext = originalWebkit;
  });

  it('unlocks audio and sets the iOS audio session to playback', () => {
    const spy = vi.spyOn(global, 'AudioContext');
    const audioSession = { type: 'auto' };
    (navigator as unknown as { audioSession?: { type: string } }).audioSession = audioSession;

    sound.unlockAudio();

    expect(audioSession.type).toBe('playback');
    expect(sound.getAudioSessionType()).toBe('playback');
    const instance = spy.mock.results[0].value as AudioContext;
    expect(instance.resume).toHaveBeenCalled();
    expect(instance.createBuffer).toHaveBeenCalledWith(1, 1, 22050);
    expect(instance.createBufferSource).toHaveBeenCalled();

    delete (navigator as unknown as { audioSession?: unknown }).audioSession;
  });

  it('registers and removes global audio unlock listeners', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const cleanup = sound.registerAudioUnlock();
    for (const type of ['pointerdown', 'touchstart', 'keydown']) {
      expect(addSpy).toHaveBeenCalledWith(type, expect.any(Function), expect.objectContaining({ capture: true }));
    }

    cleanup();
    for (const type of ['pointerdown', 'touchstart', 'keydown']) {
      expect(removeSpy).toHaveBeenCalledWith(type, expect.any(Function), true);
    }

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
