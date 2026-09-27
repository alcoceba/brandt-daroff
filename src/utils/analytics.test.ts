import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GOATCOUNTER_ENDPOINT, GOATCOUNTER_SCRIPT_URL, trackPageView } from './analytics';

describe('analytics utility', () => {
  const originalGoatCounter = window.goatcounter;

  beforeEach(() => {
    delete window.goatcounter;
  });

  afterEach(() => {
    window.goatcounter = originalGoatCounter;
    vi.restoreAllMocks();
  });

  it('exposes correct endpoint and script url', () => {
    expect(GOATCOUNTER_ENDPOINT).toBe('https://alcoceba.goatcounter.com/count');
    expect(GOATCOUNTER_SCRIPT_URL).toBe('//gc.zgo.at/count.js');
  });

  it('safely does nothing if window.goatcounter is not defined', () => {
    expect(() => trackPageView('/#test', 'Test Title')).not.toThrow();
  });

  it('calls window.goatcounter.count when available', () => {
    const countMock = vi.fn();
    window.goatcounter = { count: countMock };

    trackPageView('/#cycle', 'Brandt-Daroff — cycle');

    expect(countMock).toHaveBeenCalledTimes(1);
    expect(countMock).toHaveBeenCalledWith({
      path: '/#cycle',
      title: 'Brandt-Daroff — cycle',
    });
  });

  it('catches and suppresses any errors thrown by window.goatcounter.count', () => {
    window.goatcounter = {
      count: vi.fn().mockImplementation(() => {
        throw new Error('Network error');
      }),
    };

    expect(() => trackPageView('/#error')).not.toThrow();
  });
});
