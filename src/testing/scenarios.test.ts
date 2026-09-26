import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getScenarioNames,
  getScenarioLabel,
  seedScenario,
  clearStoredState,
  copyCurrentState,
  STORAGE_KEY,
  type ScenarioName,
} from './scenarios';

describe('scenarios', () => {
  const reloadMock = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.stubGlobal('location', { ...window.location, reload: reloadMock });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns all scenario names and non-empty labels for each', () => {
    const names = getScenarioNames();
    expect(names.length).toBeGreaterThan(0);

    names.forEach((name) => {
      const label = getScenarioLabel(name);
      expect(label).toBeTruthy();
    });
  });

  it('seeds each scenario correctly into localStorage and reloads', () => {
    const names = getScenarioNames();
    names.forEach((name) => {
      seedScenario(name);
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.state).toBeDefined();
    });

    expect(reloadMock).toHaveBeenCalled();

    // Test default branch of buildScenario
    seedScenario('unknown' as unknown as ScenarioName);
  });

  it('clears stored state and reloads', () => {
    localStorage.setItem(STORAGE_KEY, 'test-data');
    clearStoredState();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });

  it('copies current state to clipboard when state exists', async () => {
    localStorage.setItem(STORAGE_KEY, '{"test":true}');
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    await copyCurrentState();
    expect(writeText).toHaveBeenCalledWith('{"test":true}');
  });

  it('does nothing in copyCurrentState when no state exists', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    await copyCurrentState();
    expect(writeText).not.toHaveBeenCalled();
  });
});
