import { describe, it, expect } from 'vitest';
import { countCompletedSessions, isTreatmentComplete } from './sessions';
import type { SessionMap, SessionSlot, TreatmentConfig } from '@/types';

describe('sessions utilities', () => {
  describe('countCompletedSessions', () => {
    it('should return 0 for empty sessions map', () => {
      expect(countCompletedSessions({})).toBe(0);
    });

    it('should count completed sessions correctly', () => {
      const sessions: SessionMap = {
        '2026-07-19': {
          morning: 'completed',
          midday: 'in-progress',
          evening: 'pending',
        },
        '2026-07-20': {
          morning: 'completed',
          midday: 'completed',
          evening: 'completed',
        },
      };
      expect(countCompletedSessions(sessions)).toBe(4);
    });
  });

  describe('isTreatmentComplete', () => {
    const config: TreatmentConfig = {
      positionDuration: 30,
      restBetweenPositions: 30,
      restBetweenCycles: 120,
      sessionsPerDay: 3,
      totalDays: 2,
      cyclesPerSession: 5,
    };

    const slots: SessionSlot[] = [
      { id: 'morning', labelKey: 'session.morning' },
      { id: 'midday', labelKey: 'session.midday' },
      { id: 'evening', labelKey: 'session.evening' },
    ];

    it('should return false if any session is not completed', () => {
      const sessions: SessionMap = {
        '2026-07-19': {
          morning: 'completed',
          midday: 'completed',
          evening: 'completed',
        },
        '2026-07-20': {
          morning: 'completed',
          midday: 'completed',
          // evening is missing
        },
      };
      expect(isTreatmentComplete('2026-07-19', sessions, config, slots)).toBe(false);
    });

    it('should return true if all sessions for all config days are completed', () => {
      const sessions: SessionMap = {
        '2026-07-19': {
          morning: 'completed',
          midday: 'completed',
          evening: 'completed',
        },
        '2026-07-20': {
          morning: 'completed',
          midday: 'completed',
          evening: 'completed',
        },
      };
      expect(isTreatmentComplete('2026-07-19', sessions, config, slots)).toBe(true);
    });
  });
});
