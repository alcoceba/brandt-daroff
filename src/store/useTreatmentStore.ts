import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Language, SessionMap, SessionStatus, Settings, TreatmentConfig, SessionProgress, SessionDurations } from '@/types';
import { todayISO } from '@/utils/date';
import { DEFAULT_CONFIG, DEFAULT_SETTINGS } from '@/constants/treatment';
import { treatmentStorage } from '@/storage/treatmentStorage';

type ProgressMap = Record<string, Record<string, SessionProgress>>;

interface TreatmentState {
  language: Language;
  config: TreatmentConfig;
  startDate: string | null;
  sessions: SessionMap;
  progress: ProgressMap;
  sessionDurations: SessionDurations;
  settings: Settings;
  onboardingComplete: boolean;
  skipSafetyWarning: boolean;
  setLanguage: (language: Language) => void;
  setConfig: (patch: Partial<TreatmentConfig>) => void;
  completeOnboarding: () => void;
  setSessionStatus: (isoDate: string, sessionId: string, status: SessionStatus) => void;
  saveSessionProgress: (isoDate: string, sessionId: string, progress: SessionProgress) => void;
  clearSessionProgress: (isoDate: string, sessionId: string) => void;
  setSessionDuration: (isoDate: string, sessionId: string, seconds: number) => void;
  resetTreatment: () => void;
  fullReset: () => void;
  toggleSound: () => void;
  toggleVibration: () => void;
  toggleSkipSafetyWarning: () => void;
}

export const useTreatmentStore = create<TreatmentState>()(
  persist(
    (set) => ({
      language: 'en',
      config: DEFAULT_CONFIG,
      startDate: null,
      sessions: {},
      progress: {},
      sessionDurations: {},
      settings: DEFAULT_SETTINGS,
      onboardingComplete: false,
      skipSafetyWarning: false,
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
      setSessionDuration: (isoDate, sessionId, seconds) =>
        set((state) => ({
          sessionDurations: {
            ...state.sessionDurations,
            [isoDate]: { ...state.sessionDurations[isoDate], [sessionId]: seconds },
          },
        })),
      resetTreatment: () =>
        set({
          startDate: todayISO(),
          sessions: {},
          progress: {},
          sessionDurations: {},
        }),
      fullReset: () =>
        set({
          language: 'en',
          config: DEFAULT_CONFIG,
          startDate: null,
          sessions: {},
          progress: {},
          sessionDurations: {},
          settings: DEFAULT_SETTINGS,
          onboardingComplete: false,
        }),
      toggleSound: () =>
        set((state) => ({ settings: { ...state.settings, sound: !state.settings.sound } })),
      toggleVibration: () =>
        set((state) => ({ settings: { ...state.settings, vibration: !state.settings.vibration } })),
      toggleSkipSafetyWarning: () =>
        set((state) => ({ skipSafetyWarning: !state.skipSafetyWarning })),
    }),
    {
      name: 'brandt-daroff-store',
      version: 5,
      storage: createJSONStorage(() => treatmentStorage),
      migrate: (persistedState) => {
        const state = persistedState as Record<string, unknown>;
        if (!state.sessionDurations) {
          state.sessionDurations = {};
        }
        return state as unknown as TreatmentState;
      },
    },
  ),
);
