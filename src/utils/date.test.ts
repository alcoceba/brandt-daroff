import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { toDateISO, todayISO, getDayNumber, addDays } from './date';

describe('date utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('toDateISO', () => {
    it('should format a Date object into YYYY-MM-DD', () => {
      const date = new Date(2026, 6, 19); // Months are 0-indexed, so 6 is July
      expect(toDateISO(date)).toBe('2026-07-19');
    });

    it('should pad single digit month and day with zeros', () => {
      const date = new Date(2026, 0, 5); // January 5th
      expect(toDateISO(date)).toBe('2026-01-05');
    });
  });

  describe('todayISO', () => {
    it('should return current date in ISO format', () => {
      const date = new Date(2026, 11, 25);
      vi.setSystemTime(date);
      expect(todayISO()).toBe('2026-12-25');
    });
  });

  describe('getDayNumber', () => {
    it('should return 1 on the start date', () => {
      const today = new Date('2026-07-19T12:00:00');
      vi.setSystemTime(today);
      expect(getDayNumber('2026-07-19', 14)).toBe(1);
    });

    it('should return 2 on the next day', () => {
      const today = new Date('2026-07-20T12:00:00');
      vi.setSystemTime(today);
      expect(getDayNumber('2026-07-19', 14)).toBe(2);
    });

    it('should clamp the value to totalDays', () => {
      const today = new Date('2026-08-10T12:00:00');
      vi.setSystemTime(today);
      expect(getDayNumber('2026-07-19', 14)).toBe(14);
    });

    it('should clamp the value to 1 if today is before the start date', () => {
      const today = new Date('2026-07-15T12:00:00');
      vi.setSystemTime(today);
      expect(getDayNumber('2026-07-19', 14)).toBe(1);
    });
  });

  describe('addDays', () => {
    it('should add days to a YYYY-MM-DD date string', () => {
      expect(addDays('2026-07-19', 5)).toBe('2026-07-24');
    });

    it('should handle month and year boundaries when adding days', () => {
      expect(addDays('2026-12-30', 3)).toBe('2027-01-02');
    });
  });
});
