import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockAdapter = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

vi.doMock('./createStorage', () => ({
  createStorage: vi.fn(() => mockAdapter),
}));

describe('treatmentStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('delegates getItem to the wrapped adapter', async () => {
    const { treatmentStorage } = await import('./treatmentStorage');
    mockAdapter.getItem.mockReturnValue('{"foo":"bar"}');
    const result = treatmentStorage.getItem('brandt-daroff-store');
    expect(mockAdapter.getItem).toHaveBeenCalledWith('brandt-daroff-store');
    expect(result).toBe('{"foo":"bar"}');
  });

  it('delegates setItem to the wrapped adapter', async () => {
    const { treatmentStorage } = await import('./treatmentStorage');
    treatmentStorage.setItem('brandt-daroff-store', '{"foo":"bar"}');
    expect(mockAdapter.setItem).toHaveBeenCalledWith('brandt-daroff-store', '{"foo":"bar"}');
  });

  it('delegates removeItem to the wrapped adapter', async () => {
    const { treatmentStorage } = await import('./treatmentStorage');
    treatmentStorage.removeItem('brandt-daroff-store');
    expect(mockAdapter.removeItem).toHaveBeenCalledWith('brandt-daroff-store');
  });
});
