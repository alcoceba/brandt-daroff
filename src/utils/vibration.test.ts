import { describe, it, expect, vi, beforeEach } from 'vitest';
import { vibrate, cueChange } from './vibration';

describe('vibration utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not trigger navigator.vibrate if vibrationEnabled is false', () => {
    const vibrateSpy = vi.spyOn(navigator, 'vibrate');
    
    vibrate(false, 200);
    cueChange(false);

    expect(vibrateSpy).not.toHaveBeenCalled();
  });

  it('should trigger navigator.vibrate with the provided pattern when enabled', () => {
    const vibrateSpy = vi.spyOn(navigator, 'vibrate');
    
    vibrate(true, 150);

    expect(vibrateSpy).toHaveBeenCalledWith(150);
  });

  it('should trigger navigator.vibrate with default pattern if not provided', () => {
    const vibrateSpy = vi.spyOn(navigator, 'vibrate');
    
    vibrate(true);

    expect(vibrateSpy).toHaveBeenCalledWith(200);
  });

  it('should trigger navigator.vibrate with cue change pattern', () => {
    const vibrateSpy = vi.spyOn(navigator, 'vibrate');
    
    cueChange(true);

    expect(vibrateSpy).toHaveBeenCalledWith([120, 60, 120]);
  });
});
