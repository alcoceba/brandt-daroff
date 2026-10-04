export type CueName =
  | 'lie'
  | 'sit'
  | 'longRest'
  | 'midpoint'
  | 'headsUp'
  | 'tick'
  | 'tickFinal'
  | 'pause'
  | 'resume'
  | 'complete';

export const CUE_NAMES: CueName[] = [
  'lie',
  'sit',
  'longRest',
  'midpoint',
  'headsUp',
  'tick',
  'tickFinal',
  'pause',
  'resume',
  'complete',
];

interface ToneSpec {
  freq: number;
  offset: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
  attack?: number;
  partials?: [ratio: number, gain: number][];
}

const BELL: [number, number][] = [
  [2, 0.35],
  [3, 0.12],
  [4.2, 0.06],
];
const MARIMBA: [number, number][] = [
  [4, 0.18],
  [10, 0.04],
];
const WOOD: [number, number][] = [[2.4, 0.35]];

const NOTE = {
  C5: 523.25,
  E5: 659.25,
  G5: 783.99,
  A5: 880,
  C6: 1046.5,
  E6: 1318.51,
  G6: 1567.98,
  C7: 2093,
};

export const CUES: Record<CueName, ToneSpec[]> = {
  lie: [
    { freq: NOTE.C6, offset: 0, duration: 0.5, partials: BELL, gain: 0.55 },
    { freq: NOTE.G6, offset: 0.18, duration: 0.7, partials: BELL, gain: 0.55 },
  ],
  sit: [
    { freq: NOTE.G6, offset: 0, duration: 0.5, partials: BELL, gain: 0.55 },
    { freq: NOTE.C6, offset: 0.18, duration: 0.7, partials: BELL, gain: 0.55 },
  ],
  longRest: [
    { freq: NOTE.G5, offset: 0, duration: 0.6, partials: MARIMBA, gain: 0.5 },
    { freq: NOTE.E5, offset: 0.24, duration: 0.6, partials: MARIMBA, gain: 0.5 },
    { freq: NOTE.C5, offset: 0.48, duration: 1, partials: MARIMBA, gain: 0.5 },
  ],
  midpoint: [{ freq: 700, offset: 0, duration: 0.14, type: 'triangle', partials: WOOD, gain: 0.6, attack: 0.003 }],
  headsUp: [
    { freq: NOTE.C6, offset: 0, duration: 0.16, gain: 0.45 },
    { freq: NOTE.C6, offset: 0.2, duration: 0.16, gain: 0.45 },
  ],
  tick: [{ freq: NOTE.A5, offset: 0, duration: 0.11, gain: 0.5, attack: 0.004 }],
  tickFinal: [{ freq: NOTE.E6, offset: 0, duration: 0.24, gain: 0.6, attack: 0.004 }],
  pause: [{ freq: 440, offset: 0, duration: 0.08, type: 'triangle', gain: 0.45, attack: 0.003 }],
  resume: [{ freq: 660, offset: 0, duration: 0.08, type: 'triangle', gain: 0.45, attack: 0.003 }],
  complete: [
    { freq: NOTE.C5, offset: 0, duration: 0.35, partials: BELL, gain: 0.45 },
    { freq: NOTE.E5, offset: 0.12, duration: 0.35, partials: BELL, gain: 0.45 },
    { freq: NOTE.G5, offset: 0.24, duration: 0.4, partials: BELL, gain: 0.45 },
    { freq: NOTE.C6, offset: 0.36, duration: 0.9, partials: BELL, gain: 0.5 },
    { freq: NOTE.C7, offset: 0.36, duration: 1, gain: 0.12 },
  ],
};

export function getCueDuration(name: CueName): number {
  return CUES[name].reduce((max, tone) => Math.max(max, tone.offset + tone.duration), 0);
}

let ctx: AudioContext | null = null;
let master: AudioNode | null = null;
let isUnlocked = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) {
    ctx = new Ctor();
  }
  return ctx;
}

function getMaster(audio: AudioContext): AudioNode {
  if (master) return master;
  const gain = audio.createGain();
  gain.gain.value = 0.9;
  if (typeof audio.createDynamicsCompressor === 'function') {
    const comp = audio.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.knee.value = 10;
    comp.ratio.value = 4;
    comp.attack.value = 0.003;
    comp.release.value = 0.2;
    gain.connect(comp);
    comp.connect(audio.destination);
  } else {
    gain.connect(audio.destination);
  }
  master = gain;
  return gain;
}

export function getAudioState(): AudioContextState | 'unavailable' {
  const audio = getAudioContext();
  return audio ? audio.state : 'unavailable';
}

export function getAudioSessionType(): string | null {
  if (typeof navigator === 'undefined') return null;
  const nav = navigator as unknown as { audioSession?: { type: string } };
  return nav.audioSession?.type ?? null;
}

export function unlockAudio(): void {
  if (typeof window === 'undefined') return;

  if (typeof navigator !== 'undefined' && 'audioSession' in navigator) {
    try {
      const nav = navigator as unknown as { audioSession?: { type: string } };
      if (nav.audioSession) {
        nav.audioSession.type = 'playback';
      }
    } catch {
      // Ignore audioSession configuration errors
    }
  }

  const audio = getAudioContext();
  if (!audio) return;

  if (audio.state === 'suspended') {
    void audio.resume();
  }

  if (isUnlocked) return;

  try {
    if (typeof audio.createBuffer === 'function' && typeof audio.createBufferSource === 'function') {
      const buffer = audio.createBuffer(1, 1, 22050);
      const source = audio.createBufferSource();
      source.buffer = buffer;
      source.connect(audio.destination);
      source.start(0);
      isUnlocked = true;
    }
  } catch {
    // Ignore buffer creation errors
  }
}

export function registerAudioUnlock(): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleInteraction = () => {
    unlockAudio();
  };

  window.addEventListener('pointerdown', handleInteraction, { capture: true, passive: true });
  window.addEventListener('touchstart', handleInteraction, { capture: true, passive: true });
  window.addEventListener('keydown', handleInteraction, { capture: true, passive: true });

  return () => {
    window.removeEventListener('pointerdown', handleInteraction, true);
    window.removeEventListener('touchstart', handleInteraction, true);
    window.removeEventListener('keydown', handleInteraction, true);
  };
}

async function getCtx(): Promise<AudioContext | null> {
  const audio = getAudioContext();
  if (!audio) return null;
  if (audio.state === 'suspended') {
    await audio.resume();
  }
  return audio;
}

function playTone(audio: AudioContext, tone: ToneSpec, startTime: number, dest: AudioNode): void {
  const attack = tone.attack ?? 0.01;
  const peak = tone.gain ?? 0.5;
  const end = startTime + tone.duration;
  const env = audio.createGain();
  env.gain.setValueAtTime(0.0001, startTime);
  env.gain.exponentialRampToValueAtTime(peak, startTime + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, end);
  env.connect(dest);

  const layers: [number, number][] = [[1, 1], ...(tone.partials ?? [])];
  for (const [ratio, level] of layers) {
    const osc = audio.createOscillator();
    osc.type = ratio === 1 ? (tone.type ?? 'sine') : 'sine';
    osc.frequency.value = tone.freq * ratio;
    if (level === 1) {
      osc.connect(env);
    } else {
      const partialGain = audio.createGain();
      partialGain.gain.value = level;
      osc.connect(partialGain);
      partialGain.connect(env);
    }
    osc.start(startTime);
    osc.stop(end + 0.02);
  }
}

export type CancelFn = () => void;

export function scheduleSound(name: CueName, enabled: boolean, delaySec = 0): CancelFn {
  if (!enabled) return () => {};
  let cancelled = false;
  let output: GainNode | null = null;
  const requestedAt = typeof performance !== 'undefined' ? performance.now() : 0;

  void getCtx().then((audio) => {
    if (!audio || cancelled) return;
    const waited = typeof performance !== 'undefined' ? (performance.now() - requestedAt) / 1000 : 0;
    const startTime = audio.currentTime + Math.max(0, delaySec - waited);
    output = audio.createGain();
    output.gain.value = 1;
    output.connect(getMaster(audio));
    for (const tone of CUES[name]) {
      playTone(audio, tone, startTime + tone.offset, output);
    }
  });

  return () => {
    cancelled = true;
    if (output) {
      try {
        output.disconnect();
      } catch {
        // Ignore already disconnected nodes
      }
      output = null;
    }
  };
}
