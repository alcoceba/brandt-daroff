import { useTreatmentStore } from '@/store/useTreatmentStore';

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  return ctx;
}

function beep(frequency: number): void {
  const soundOn = useTreatmentStore.getState().settings.sound;
  if (!soundOn) return;
  const audio = getCtx();
  if (!audio) return;
  if (audio.state === 'suspended') void audio.resume();
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.3, audio.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.4);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + 0.42);
}

export function playBeep(): void {
  beep(880);
}

export function playBeepHigh(): void {
  beep(1320);
}
