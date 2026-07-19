import { describe, it, expect } from 'vitest';
import { formatTime, formatDuration } from './format';

describe('format utilities', () => {
  describe('formatTime', () => {
    it('should format seconds <= 59 without minutes prefix', () => {
      expect(formatTime(0)).toBe('0');
      expect(formatTime(9)).toBe('9');
      expect(formatTime(45.5)).toBe('46'); // Math.ceil of 45.5 is 46
      expect(formatTime(59)).toBe('59');
    });

    it('should format seconds >= 60 with minutes and zero-padded seconds', () => {
      expect(formatTime(60)).toBe('1:00');
      expect(formatTime(75)).toBe('1:15');
      expect(formatTime(125.2)).toBe('2:06'); // Math.ceil of 125.2 is 126, which is 2:06
    });

    it('should clamp negative values to 0', () => {
      expect(formatTime(-10)).toBe('0');
    });
  });

  describe('formatDuration', () => {
    it('should format duration as mm:ss', () => {
      expect(formatDuration(0)).toBe('0:00');
      expect(formatDuration(9)).toBe('0:09');
      expect(formatDuration(60)).toBe('1:00');
      expect(formatDuration(75)).toBe('1:15');
      expect(formatDuration(1205)).toBe('20:05');
    });
  });
});
