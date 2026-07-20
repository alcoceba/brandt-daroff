import { describe, it, expect } from 'vitest';
import { countCompletedSessions, isTreatmentComplete } from './sessions';
import type { SessionMap, TreatmentConfig } from '@/types';

describe('sessions utilities', () => {
  describe('countCompletedSessions', () => {
    it('should return 0 for empty sessions map', () => {
      expect(countCompletedSessions({})).toBe(0);
    });

    it('should count completed sessions correctly', () => {
      const sessions: SessionMap = {
        '2026-07-19': {
          'session-1': 'completed',
          'session-2': 'in-progress',
          'session-3': 'pending',
        },
        '2026-07-20': {
          'session-1': 'completed',
          'session-2': 'completed',
          'session-3': 'completed',
          'session-4': 'completed', // extra
        },
      };
      expect(countCompletedSessions(sessions)).toBe(5);
      expect(countCompletedSessions(sessions, 3)).toBe(4);
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

    it('should return false if any session is not completed', () => {
      const sessions: SessionMap = {
        '2026-07-19': {
          'session-1': 'completed',
          'session-2': 'completed',
          'session-3': 'completed',
        },
        '2026-07-20': {
          'session-1': 'completed',
          'session-2': 'completed',
          // session-3 is missing
        },
      };
      expect(isTreatmentComplete('2026-07-19', sessions, config)).toBe(false);
    });

    it('should return true if all sessions for all config days are completed', () => {
      const sessions: SessionMap = {
        '2026-07-19': {
          'session-1': 'completed',
          'session-2': 'completed',
          'session-3': 'completed',
        },
        '2026-07-20': {
          'session-1': 'completed',
          'session-2': 'completed',
          'session-3': 'completed',
        },
      };
      expect(isTreatmentComplete('2026-07-19', sessions, config)).toBe(true);
    });
  });
});
