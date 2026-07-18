import { useTreatmentStore } from '@/store/useTreatmentStore';

let ctx: AudioContext | null = null;

async function getCtx(): Promise<AudioContext | null> {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) {
    ctx = new Ctor();
  }
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  return ctx;
}

function makeOscillator(
  audio: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  gainNode: GainNode,
): OscillatorNode {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.6, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration - 0.02);
  osc.connect(gain);
  gain.connect(gainNode);
  osc.start(startTime);
  osc.stop(startTime + duration);
  return osc;
}

export async function playBeep(): Promise<void> {
  const soundOn = useTreatmentStore.getState().settings.sound;
  if (!soundOn) return;
  const audio = await getCtx();
  if (!audio) return;
  const now = audio.currentTime;
  const master = audio.createGain();
  master.gain.value = 1;
  master.connect(audio.destination);
  makeOscillator(audio, 880, now, 0.42, master);
}

export async function playBeepHigh(): Promise<void> {
  const soundOn = useTreatmentStore.getState().settings.sound;
  if (!soundOn) return;
  const audio = await getCtx();
  if (!audio) return;
  const now = audio.currentTime;
  const master = audio.createGain();
  master.gain.value = 1;
  master.connect(audio.destination);
  makeOscillator(audio, 1320, now, 0.42, master);
}

async function playCue(frequencies: number[]): Promise<void> {
  const soundOn = useTreatmentStore.getState().settings.sound;
  if (!soundOn) return;
  const audio = await getCtx();
  if (!audio) return;

  const now = audio.currentTime;
  const toneDuration = 0.24;
  const gap = 0.005;
  const master = audio.createGain();
  master.gain.value = 1;
  master.connect(audio.destination);

  frequencies.forEach((freq, index) => {
    const start = now + index * (toneDuration + gap);
    makeOscillator(audio, freq, start, toneDuration, master);
  });
}

export async function playPositionCue(): Promise<void> {
  await playCue([880, 1320]);
}

export async function playRestCue(): Promise<void> {
  await playCue([1320, 880]);
}
