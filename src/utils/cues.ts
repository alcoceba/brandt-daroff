import { scheduleSound, type CancelFn, type CueName } from '@/utils/sound';
import { vibrate } from '@/utils/vibration';

export interface FeedbackSettings {
  sound: boolean;
  vibration: boolean;
}

export const CUE_VIBRATION: Record<CueName, number[]> = {
  lie: [200, 80, 200],
  sit: [120, 60, 120],
  longRest: [300, 120, 150, 120, 150],
  midpoint: [60],
  headsUp: [60, 80, 60],
  tick: [40],
  tickFinal: [140],
  pause: [30],
  resume: [30],
  complete: [100, 60, 100, 60, 100, 60, 400],
};

export function triggerCue(name: CueName, settings: FeedbackSettings, delaySec = 0): CancelFn {
  const cancelSound = scheduleSound(name, settings.sound, delaySec);
  let timer: ReturnType<typeof setTimeout> | null = null;
  if (settings.vibration) {
    if (delaySec <= 0) {
      vibrate(true, CUE_VIBRATION[name]);
    } else {
      timer = setTimeout(() => {
        timer = null;
        vibrate(true, CUE_VIBRATION[name]);
      }, delaySec * 1000);
    }
  }
  return () => {
    cancelSound();
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
}

export interface TimelineEvent {
  secondsLeft: number;
  cue: CueName;
}

export function buildStepTimeline(duration: number, isRest: boolean): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  if (isRest) {
    if (duration > 10) events.push({ secondsLeft: 10, cue: 'headsUp' });
  } else {
    const midPoint = Math.floor(duration / 2);
    if (midPoint > 5 && midPoint < duration) events.push({ secondsLeft: midPoint, cue: 'midpoint' });
  }
  for (let s = 5; s >= 1; s--) {
    if (s < duration) events.push({ secondsLeft: s, cue: s === 1 ? 'tickFinal' : 'tick' });
  }
  return events;
}

export interface CueScheduler {
  scheduleRemaining: (timeline: TimelineEvent[], remaining: number, settings: FeedbackSettings) => void;
  cancel: () => void;
}

export function createCueScheduler(): CueScheduler {
  let pending: CancelFn[] = [];
  const cancel = () => {
    pending.forEach((fn) => fn());
    pending = [];
  };
  const scheduleRemaining = (timeline: TimelineEvent[], remaining: number, settings: FeedbackSettings) => {
    cancel();
    for (const event of timeline) {
      const delay = remaining - event.secondsLeft;
      if (delay > 0.02) pending.push(triggerCue(event.cue, settings, delay));
    }
  };
  return { scheduleRemaining, cancel };
}

export const DEMO_SEQUENCE: { cue: CueName; at: number }[] = [
  { cue: 'lie', at: 0 },
  { cue: 'tick', at: 1 },
  { cue: 'tickFinal', at: 1.4 },
  { cue: 'complete', at: 1.9 },
];

export function playDemo(settings: FeedbackSettings): CancelFn {
  const cancels = DEMO_SEQUENCE.map(({ cue, at }) => triggerCue(cue, settings, at));
  return () => cancels.forEach((fn) => fn());
}
