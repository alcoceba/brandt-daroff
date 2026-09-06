import { describe, it, expect } from 'vitest';
import {
  countCompletedSessions,
  isTreatmentComplete,
  countCompletedDays,
  computeStreak,
  estimatedSessionSeconds,
  sumInvestedSeconds,
  getSessionNumber,
  getDaySessionsView,
  getNextSessionId,
  getDayProgress,
  getTreatmentDayInfos,
  chunkIntoWeeks,
  getTreatmentSummary,
} from './sessions';
import type { SessionMap, SessionDurations, SessionStatus, TreatmentConfig } from '@/types';

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

  describe('getSessionNumber', () => {
    it('parses session ids', () => {
      expect(getSessionNumber('session-1')).toBe(1);
      expect(getSessionNumber('session-12')).toBe(12);
      expect(getSessionNumber('foo')).toBeNull();
    });
  });

  describe('getDaySessionsView', () => {
    it('returns scheduled slots as pending when empty', () => {
      const view = getDaySessionsView(undefined, 3);
      expect(view.map((s) => s.id)).toEqual(['session-1', 'session-2', 'session-3']);
      expect(view.every((s) => s.status === 'pending' && !s.isExtra)).toBe(true);
    });

    it('marks sessions beyond sessionsPerDay as extra and sorts by number', () => {
      const daySessions: Record<string, SessionStatus> = {
        'session-1': 'completed',
        'session-4': 'in-progress',
      };
      const view = getDaySessionsView(daySessions, 3);
      expect(view.map((s) => [s.n, s.status, s.isExtra])).toEqual([
        [1, 'completed', false],
        [2, 'pending', false],
        [3, 'pending', false],
        [4, 'in-progress', true],
      ]);
    });

    it('ignores ids that are not session ids', () => {
      const view = getDaySessionsView({ other: 'completed' }, 1);
      expect(view).toHaveLength(1);
      expect(view[0].id).toBe('session-1');
    });
  });

  describe('getNextSessionId', () => {
    it('returns the first extra id when empty', () => {
      expect(getNextSessionId(undefined, 3)).toBe('session-4');
    });

    it('skips existing sessions including in-progress extras', () => {
      const daySessions: Record<string, SessionStatus> = {
        'session-1': 'completed',
        'session-2': 'completed',
        'session-3': 'completed',
        'session-4': 'in-progress',
      };
      expect(getNextSessionId(daySessions, 3)).toBe('session-5');
    });

    it('never returns a scheduled id', () => {
      expect(getNextSessionId({ 'session-1': 'completed' }, 3)).toBe('session-4');
    });
  });

  describe('getDayProgress', () => {
    it('is pending when nothing is done', () => {
      const progress = getDayProgress(undefined, 3);
      expect(progress).toEqual({
        completedScheduled: 0,
        extrasCompleted: 0,
        hasInProgress: false,
        ratio: 0,
        state: 'pending',
      });
    });

    it('is partial when some scheduled sessions are completed', () => {
      const progress = getDayProgress({ 'session-1': 'completed' }, 3);
      expect(progress.state).toBe('partial');
      expect(progress.ratio).toBeCloseTo(1 / 3);
    });

    it('is in-progress when any session is in progress', () => {
      const progress = getDayProgress({ 'session-2': 'in-progress' }, 3);
      expect(progress.state).toBe('in-progress');
      expect(progress.hasInProgress).toBe(true);
    });

    it('is done when all scheduled sessions are completed and counts extras separately', () => {
      const progress = getDayProgress(
        {
          'session-1': 'completed',
          'session-2': 'completed',
          'session-3': 'completed',
          'session-4': 'completed',
        },
        3,
      );
      expect(progress.state).toBe('done');
      expect(progress.completedScheduled).toBe(3);
      expect(progress.extrasCompleted).toBe(1);
      expect(progress.ratio).toBe(1);
    });

    it('extras do not count toward the scheduled ratio', () => {
      const progress = getDayProgress({ 'session-4': 'completed' }, 3);
      expect(progress.completedScheduled).toBe(0);
      expect(progress.extrasCompleted).toBe(1);
      expect(progress.ratio).toBe(0);
      expect(progress.state).toBe('pending');
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

  describe('getTreatmentDayInfos', () => {
    const config: TreatmentConfig = { sessionsPerDay: 2, totalDays: 3, cyclesPerSession: 5, positionDuration: 30, restBetweenPositions: 30, restBetweenCycles: 120 };

    it('returns one entry per treatment day', () => {
      const infos = getTreatmentDayInfos('2026-01-14', {}, config, '2026-01-14');
      expect(infos).toHaveLength(3);
      expect(infos[0]?.iso).toBe('2026-01-14');
      expect(infos[0]?.isToday).toBe(true);
      expect(infos[1]?.isFuture).toBe(true);
      expect(infos[2]?.isFuture).toBe(true);
    });

    it('marks future days based on today', () => {
      const infos = getTreatmentDayInfos('2026-01-14', {}, config, '2026-01-15');
      expect(infos[0]?.isFuture).toBe(false);
      expect(infos[1]?.isFuture).toBe(false);
      expect(infos[2]?.isFuture).toBe(true);
      expect(infos[1]?.isToday).toBe(true);
    });

    it('limits display days to totalDays even when sessions exist beyond totalDays', () => {
      const sessions: SessionMap = { '2026-01-18': { 'session-1': 'completed' } };
      const infos = getTreatmentDayInfos('2026-01-14', sessions, config, '2026-01-14');
      expect(infos).toHaveLength(3);
    });

    it('does not extend display days after treatment is finished', () => {
      const sessions: SessionMap = { '2026-01-20': { 'session-1': 'completed' } };
      const infos = getTreatmentDayInfos('2026-01-14', sessions, config, '2026-01-25');
      expect(infos).toHaveLength(3);
    });

    it('computes progress for each day', () => {
      const sessions: SessionMap = {
        '2026-01-14': { 'session-1': 'completed', 'session-2': 'completed' },
      };
      const infos = getTreatmentDayInfos('2026-01-14', sessions, config, '2026-01-14');
      expect(infos[0]?.progress.state).toBe('done');
      expect(infos[1]?.progress.state).toBe('pending');
    });
  });

  describe('chunkIntoWeeks', () => {
    it('splits items into chunks of 7', () => {
      const items = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      expect(chunkIntoWeeks(items)).toEqual([
        [0, 1, 2, 3, 4, 5, 6],
        [7, 8],
      ]);
    });

    it('returns empty array for empty input', () => {
      expect(chunkIntoWeeks([])).toEqual([]);
    });
  });

  describe('getTreatmentSummary', () => {
    const config: TreatmentConfig = { sessionsPerDay: 2, totalDays: 5, cyclesPerSession: 5, positionDuration: 30, restBetweenPositions: 30, restBetweenCycles: 120 };

    it('returns zeroed summary when startDate is null', () => {
      const summary = getTreatmentSummary(null, {}, {}, config, '2026-01-14');
      expect(summary.totalSessions).toBe(10);
      expect(summary.completedSessions).toBe(0);
      expect(summary.sessionPct).toBe(0);
      expect(summary.daysLeft).toBe(5);
      expect(summary.sessionsToGo).toBe(10);
      expect(summary.finished).toBe(false);
    });

    it('computes completion and remaining values', () => {
      const sessions: SessionMap = {
        '2026-01-14': { 'session-1': 'completed', 'session-2': 'completed' },
        '2026-01-15': { 'session-1': 'completed' },
      };
      const durations: SessionDurations = {
        '2026-01-14': { 'session-1': 100, 'session-2': 200 },
      };
      const summary = getTreatmentSummary('2026-01-14', sessions, durations, config, '2026-01-15');
      expect(summary.completedSessions).toBe(3);
      expect(summary.sessionPct).toBe(30);
      expect(summary.completedDays).toBe(1);
      expect(summary.streak).toBe(1);
      expect(summary.investedSeconds).toBe(300);
      expect(summary.daysLeft).toBe(4);
      expect(summary.sessionsToGo).toBe(7);
      expect(summary.finished).toBe(false);
    });

    it('counts extra sessions separately', () => {
      const sessions: SessionMap = {
        '2026-01-14': { 'session-1': 'completed', 'session-2': 'completed', 'session-3': 'completed' },
      };
      const summary = getTreatmentSummary('2026-01-14', sessions, {}, config, '2026-01-14');
      expect(summary.completedSessions).toBe(2);
      expect(summary.extrasCompleted).toBe(1);
    });

    it('marks treatment as finished when past totalDays', () => {
      const summary = getTreatmentSummary('2026-01-14', {}, {}, config, '2026-01-25');
      expect(summary.finished).toBe(true);
      expect(summary.daysLeft).toBe(1);
    });

    it('marks treatment as finished when all days completed', () => {
      const sessions: SessionMap = {
        '2026-01-14': { 'session-1': 'completed', 'session-2': 'completed' },
        '2026-01-15': { 'session-1': 'completed', 'session-2': 'completed' },
        '2026-01-16': { 'session-1': 'completed', 'session-2': 'completed' },
        '2026-01-17': { 'session-1': 'completed', 'session-2': 'completed' },
        '2026-01-18': { 'session-1': 'completed', 'session-2': 'completed' },
      };
      const summary = getTreatmentSummary('2026-01-14', sessions, {}, config, '2026-01-18');
      expect(summary.finished).toBe(true);
      expect(summary.completedDays).toBe(5);
      expect(summary.sessionsToGo).toBe(0);
    });
  });
});
