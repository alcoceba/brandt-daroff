import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  clearStoredState,
  copyCurrentState,
  getScenarioLabel,
  getScenarioNames,
  seedScenario,
} from './scenarios';

const STORAGE_KEY = 'brandt-daroff-store';

describe('scenarios', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('location', { ...window.location, reload: vi.fn() });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exports a stable list of scenario names', () => {
    const names = getScenarioNames();
    expect(names).toContain('fresh');
    expect(names).toContain('day5-on-track');
    expect(names).toContain('treatment-complete');
    expect(names.length).toBeGreaterThan(5);
  });

  it('returns a label for every scenario', () => {
    for (const name of getScenarioNames()) {
      expect(getScenarioLabel(name)).toBeTruthy();
    }
  });

  it('seedScenario writes a versioned payload and reloads', () => {
    seedScenario('day1-none');

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();

    const parsed = JSON.parse(raw!);
    expect(parsed.version).toBe(5);
    expect(parsed.state.onboardingComplete).toBe(true);
    expect(parsed.state.startDate).toBeTruthy();
    expect(location.reload).toHaveBeenCalledTimes(1);
  });

  it('clearStoredState removes storage and reloads', () => {
    localStorage.setItem(STORAGE_KEY, '{}');

    clearStoredState();

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(location.reload).toHaveBeenCalledTimes(1);
  });

  it('copyCurrentState copies localStorage content to clipboard', async () => {
    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText: writeTextSpy } });
    localStorage.setItem(STORAGE_KEY, '{"state":{}}');

    await copyCurrentState();

    expect(writeTextSpy).toHaveBeenCalledWith('{"state":{}}');
  });

  it('copyCurrentState does nothing when storage is empty', async () => {
    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText: writeTextSpy } });

    await copyCurrentState();

    expect(writeTextSpy).not.toHaveBeenCalled();
  });
});
