import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language, SessionMap, SessionStatus, Settings, TreatmentConfig } from '@/types';
import { todayISO } from '@/utils/date';

export const DEFAULT_CONFIG: TreatmentConfig = {
  positionDuration: 30,
  restBetweenPositions: 30,
  restBetweenCycles: 120,
  sessionsPerDay: 3,
  totalDays: 14,
};

const DEFAULT_SETTINGS: Settings = {
  sound: true,
  vibration: true,
};

export interface SessionProgress {
  cycleIndex: number;
  positionIndex: number;
}

type ProgressMap = Record<string, Record<string, SessionProgress>>;

interface TreatmentState {
  language: Language;
  config: TreatmentConfig;
  startDate: string | null;
  sessions: SessionMap;
  progress: ProgressMap;
  settings: Settings;
  onboardingComplete: boolean;
  setLanguage: (language: Language) => void;
  setConfig: (patch: Partial<TreatmentConfig>) => void;
  completeOnboarding: () => void;
  setSessionStatus: (isoDate: string, sessionId: string, status: SessionStatus) => void;
  saveSessionProgress: (isoDate: string, sessionId: string, progress: SessionProgress) => void;
  clearSessionProgress: (isoDate: string, sessionId: string) => void;
  resetTreatment: () => void;
  fullReset: () => void;
  toggleSound: () => void;
  toggleVibration: () => void;
}

export const useTreatmentStore = create<TreatmentState>()(
  persist(
    (set) => ({
      language: 'en',
      config: DEFAULT_CONFIG,
      startDate: null,
      sessions: {},
      progress: {},
      settings: DEFAULT_SETTINGS,
      onboardingComplete: false,
      setLanguage: (language) => set({ language }),
      setConfig: (patch) => set((state) => ({ config: { ...state.config, ...patch } })),
      completeOnboarding: () =>
        set((state) => ({
          onboardingComplete: true,
          startDate: state.startDate ?? todayISO(),
        })),
      setSessionStatus: (isoDate, sessionId, status) =>
        set((state) => ({
          sessions: {
            ...state.sessions,
            [isoDate]: { ...state.sessions[isoDate], [sessionId]: status },
          },
        })),
      saveSessionProgress: (isoDate, sessionId, prog) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [isoDate]: { ...state.progress[isoDate], [sessionId]: prog },
          },
        })),
      clearSessionProgress: (isoDate, sessionId) =>
        set((state) => {
          const dayProgress = { ...state.progress[isoDate] };
          delete dayProgress[sessionId];
          return {
            progress: {
              ...state.progress,
              [isoDate]: dayProgress,
            },
          };
        }),
      resetTreatment: () =>
        set({
          startDate: todayISO(),
          sessions: {},
          progress: {},
        }),
      fullReset: () =>
        set({
          language: 'en',
          config: DEFAULT_CONFIG,
          startDate: null,
          sessions: {},
          progress: {},
          settings: DEFAULT_SETTINGS,
          onboardingComplete: false,
        }),
      toggleSound: () =>
        set((state) => ({ settings: { ...state.settings, sound: !state.settings.sound } })),
      toggleVibration: () =>
        set((state) => ({ settings: { ...state.settings, vibration: !state.settings.vibration } })),
    }),
    {
      name: 'brandt-daroff-store',
      version: 2,
    },
  ),
);
