import { describe, it, expect } from 'vitest';
import { DEFAULT_CONFIG, DEFAULT_SETTINGS } from './treatment';
import { LANGUAGES, DEFAULT_LANGUAGE } from './languages';
import { POSITIONS, getSessionSlots, getDurationSeconds, getSessionSlotId } from './positions';

describe('treatment constants', () => {
  it('exports the default Brandt-Daroff config', () => {
    expect(DEFAULT_CONFIG).toEqual({
      positionDuration: 30,
      restBetweenPositions: 30,
      restBetweenCycles: 120,
      sessionsPerDay: 3,
      totalDays: 14,
      cyclesPerSession: 5,
    });
  });

  it('exports the default settings', () => {
    expect(DEFAULT_SETTINGS).toEqual({
      sound: true,
      vibration: true,
    });
  });
});

describe('languages constants', () => {
  it('exports the supported languages', () => {
    expect(LANGUAGES).toEqual([
      { code: 'en', label: 'English' },
      { code: 'ca', label: 'Català' },
      { code: 'es', label: 'Castellano' },
    ]);
  });

  it('exports the default language', () => {
    expect(DEFAULT_LANGUAGE).toBe('en');
  });
});

describe('positions constants', () => {
  it('exports the Brandt-Daroff position sequence', () => {
    expect(POSITIONS).toHaveLength(5);
    expect(POSITIONS.map((p) => p.kind)).toEqual([
      'sitting',
      'lying-right',
      'rest',
      'lying-left',
      'long-rest',
    ]);
  });

  it('computes the duration for each duration kind', () => {
    const config = {
      positionDuration: 30,
      restBetweenPositions: 30,
      restBetweenCycles: 120,
      sessionsPerDay: 3,
      totalDays: 14,
      cyclesPerSession: 5,
    };

    expect(getDurationSeconds(POSITIONS[0], config)).toBe(0);
    expect(getDurationSeconds(POSITIONS[1], config)).toBe(config.positionDuration);
    expect(getDurationSeconds(POSITIONS[2], config)).toBe(config.restBetweenPositions);
    expect(getDurationSeconds(POSITIONS[3], config)).toBe(config.positionDuration);
    expect(getDurationSeconds(POSITIONS[4], config)).toBe(config.restBetweenCycles);
  });

  it('generates session slot ids', () => {
    expect(getSessionSlotId(0)).toBe('session-1');
    expect(getSessionSlotId(2)).toBe('session-3');
  });

  it('generates session slots with the correct shape', () => {
    const slots = getSessionSlots(3);
    expect(slots).toHaveLength(3);
    expect(slots[0]).toEqual({ id: 'session-1', labelKey: 'session.sessionN' });
    expect(slots[1]).toEqual({ id: 'session-2', labelKey: 'session.sessionN' });
    expect(slots[2]).toEqual({ id: 'session-3', labelKey: 'session.sessionN' });
  });
});
