import { describe, it, expect } from 'vitest';
import {
  countCompletedSessions,
  isTreatmentComplete,
  countCompletedDays,
  computeStreak,
  estimatedSessionSeconds,
  sumInvestedSeconds,
} from './sessions';
import type { SessionMap, SessionDurations, TreatmentConfig } from '@/types';

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

  describe('countCompletedDays', () => {
    const config: TreatmentConfig = {
      positionDuration: 30,
      restBetweenPositions: 30,
      restBetweenCycles: 120,
      sessionsPerDay: 2,
      totalDays: 3,
      cyclesPerSession: 5,
    };

    it('counts only days with all scheduled sessions completed', () => {
      const sessions: SessionMap = {
        '2026-07-19': { 'session-1': 'completed', 'session-2': 'completed' },
        '2026-07-20': { 'session-1': 'completed', 'session-2': 'pending' },
        '2026-07-21': { 'session-1': 'completed', 'session-2': 'completed' },
      };
      expect(countCompletedDays(sessions, config, '2026-07-19')).toBe(2);
    });
  });

  describe('computeStreak', () => {
    const config: TreatmentConfig = {
      positionDuration: 30,
      restBetweenPositions: 30,
      restBetweenCycles: 120,
      sessionsPerDay: 2,
      totalDays: 5,
      cyclesPerSession: 5,
    };

    it('counts consecutive completed days ending today', () => {
      const sessions: SessionMap = {
        '2026-07-19': { 'session-1': 'completed', 'session-2': 'completed' },
        '2026-07-20': { 'session-1': 'completed', 'session-2': 'completed' },
      };
      expect(computeStreak(sessions, config, '2026-07-20')).toBe(2);
    });

    it('does not break streak when today is incomplete', () => {
      const sessions: SessionMap = {
        '2026-07-19': { 'session-1': 'completed', 'session-2': 'completed' },
        '2026-07-20': { 'session-1': 'completed', 'session-2': 'pending' },
      };
      expect(computeStreak(sessions, config, '2026-07-20')).toBe(1);
    });

    it('returns 0 when yesterday is also incomplete', () => {
      const sessions: SessionMap = {
        '2026-07-20': { 'session-1': 'completed', 'session-2': 'pending' },
      };
      expect(computeStreak(sessions, config, '2026-07-20')).toBe(0);
    });
  });

  describe('estimatedSessionSeconds', () => {
    it('uses the accurate cycle formula (final long-rest skipped)', () => {
      const config: TreatmentConfig = {
        positionDuration: 30,
        restBetweenPositions: 30,
        restBetweenCycles: 120,
        sessionsPerDay: 3,
        totalDays: 14,
        cyclesPerSession: 5,
      };
      // 5 cycles * (2*30 + 30) + 4 * 120 = 5 * 90 + 480 = 930
      expect(estimatedSessionSeconds(config)).toBe(930);
    });
  });

  describe('sumInvestedSeconds', () => {
    it('sums all session durations', () => {
      const durations: SessionDurations = {
        '2026-07-19': { 'session-1': 100, 'session-2': 200 },
        '2026-07-20': { 'session-1': 50 },
      };
      expect(sumInvestedSeconds(durations)).toBe(350);
    });

    it('returns 0 for empty durations', () => {
      expect(sumInvestedSeconds({})).toBe(0);
    });
  });
});
