import { describe, it, expect, beforeEach } from 'vitest';
import { useTreatmentStore } from './useTreatmentStore';
import { DEFAULT_CONFIG, DEFAULT_SETTINGS } from '@/constants/treatment';

describe('useTreatmentStore', () => {
  beforeEach(() => {
    // Reset store to default state before each test
    useTreatmentStore.getState().fullReset();
  });

  it('should initialize with correct default values', () => {
    const state = useTreatmentStore.getState();
    
    expect(state.language).toBe('en');
    expect(state.config).toEqual(DEFAULT_CONFIG);
    expect(state.startDate).toBeNull();
    expect(state.sessions).toEqual({});
    expect(state.progress).toEqual({});
    expect(state.settings).toEqual(DEFAULT_SETTINGS);
    expect(state.onboardingComplete).toBe(false);
    expect(state.mode).toBe('progress');
  });

  it('should change language when setLanguage is called', () => {
    useTreatmentStore.getState().setLanguage('ca');
    expect(useTreatmentStore.getState().language).toBe('ca');
  });

  it('should merge configuration patches when setConfig is called', () => {
    useTreatmentStore.getState().setConfig({ positionDuration: 45 });
    expect(useTreatmentStore.getState().config.positionDuration).toBe(45);
    // other fields should remain default
    expect(useTreatmentStore.getState().config.totalDays).toBe(DEFAULT_CONFIG.totalDays);
  });

  it('should mark onboarding as complete and set startDate when completeOnboarding is called', () => {
    useTreatmentStore.getState().completeOnboarding();
    expect(useTreatmentStore.getState().onboardingComplete).toBe(true);
    expect(useTreatmentStore.getState().startDate).not.toBeNull();
  });

  it('should set session status correctly', () => {
    useTreatmentStore.getState().setSessionStatus('2026-07-19', 'morning', 'completed');
    expect(useTreatmentStore.getState().sessions['2026-07-19']?.morning).toBe('completed');
  });

  it('should save, update, and clear session progress', () => {
    const progress = { cycleIndex: 2, positionIndex: 3 };
    
    useTreatmentStore.getState().saveSessionProgress('2026-07-19', 'morning', progress);
    expect(useTreatmentStore.getState().progress['2026-07-19']?.morning).toEqual(progress);

    useTreatmentStore.getState().clearSessionProgress('2026-07-19', 'morning');
    expect(useTreatmentStore.getState().progress['2026-07-19']?.morning).toBeUndefined();
  });

  it('should reset today\'s treatment progress when resetTreatment is called', () => {
    useTreatmentStore.getState().setSessionStatus('2026-07-19', 'morning', 'completed');
    useTreatmentStore.getState().saveSessionProgress('2026-07-19', 'morning', { cycleIndex: 1, positionIndex: 1 });
    
    useTreatmentStore.getState().resetTreatment();
    
    expect(useTreatmentStore.getState().sessions).toEqual({});
    expect(useTreatmentStore.getState().progress).toEqual({});
    expect(useTreatmentStore.getState().startDate).not.toBeNull(); // starts again from today
  });

  it('should toggle sound and vibration settings', () => {
    const initialSound = useTreatmentStore.getState().settings.sound;
    useTreatmentStore.getState().toggleSound();
    expect(useTreatmentStore.getState().settings.sound).toBe(!initialSound);

    const initialVibration = useTreatmentStore.getState().settings.vibration;
    useTreatmentStore.getState().toggleVibration();
    expect(useTreatmentStore.getState().settings.vibration).toBe(!initialVibration);
  });

  it('should update app mode when setMode is called', () => {
    useTreatmentStore.getState().setMode('quick');
    expect(useTreatmentStore.getState().mode).toBe('quick');
  });

  it('should toggle skip safety warning state', () => {
    const initialSkip = useTreatmentStore.getState().skipSafetyWarning;
    useTreatmentStore.getState().toggleSkipSafetyWarning();
    expect(useTreatmentStore.getState().skipSafetyWarning).toBe(!initialSkip);
  });
});
