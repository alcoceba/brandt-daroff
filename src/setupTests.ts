import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      if (options) {
        // Return key with stringified options to allow specific assertions
        return `${key}:${JSON.stringify(options)}`;
      }
      return key;
    },
    i18n: {
      changeLanguage: () => Promise.resolve(),
      language: 'en',
    },
  }),
}));

// Mock AudioContext
class AudioContextMock {
  state = 'suspended';
  currentTime = 0;
  resume = vi.fn().mockResolvedValue(undefined);
  createGain = vi.fn().mockReturnValue({
    gain: {
      value: 1,
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
  });
  createOscillator = vi.fn().mockReturnValue({
    type: 'sine',
    frequency: { value: 0 },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  });
  destination = {};
}

vi.stubGlobal('AudioContext', AudioContextMock);
vi.stubGlobal('webkitAudioContext', AudioContextMock);

// Mock navigator.vibrate
if (typeof navigator !== 'undefined') {
  Object.defineProperty(navigator, 'vibrate', {
    value: vi.fn(),
    writable: true,
    configurable: true,
  });
} else {
  vi.stubGlobal('navigator', {
    vibrate: vi.fn(),
  });
}
