import { describe, it, expect, vi } from 'vitest';
import { createStorage } from './createStorage';

function createFakeStorage(initial: Record<string, string> = {}): Storage {
  const store: Record<string, string> = { ...initial };
  return {
    getItem: vi.fn((key: string) => (key in store ? store[key] : null)),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(),
    key: vi.fn(),
    length: 0,
  } as unknown as Storage;
}

describe('createStorage', () => {
  it('returns the stored value with getItem', () => {
    const fake = createFakeStorage({ foo: 'bar' });
    const storage = createStorage(fake);
    expect(storage.getItem('foo')).toBe('bar');
  });

  it('returns null when a key is missing', () => {
    const fake = createFakeStorage();
    const storage = createStorage(fake);
    expect(storage.getItem('missing')).toBeNull();
  });

  it('stores a value with setItem', () => {
    const fake = createFakeStorage();
    const storage = createStorage(fake);
    storage.setItem('key', 'value');
    expect(storage.getItem('key')).toBe('value');
  });

  it('removes a value with removeItem', () => {
    const fake = createFakeStorage({ key: 'value' });
    const storage = createStorage(fake);
    storage.removeItem('key');
    expect(storage.getItem('key')).toBeNull();
  });

  it('returns null when getItem throws (quota/private browsing)', () => {
    const fake = createFakeStorage();
    fake.getItem = vi.fn(() => {
      throw new Error('quota exceeded');
    });
    const storage = createStorage(fake);
    expect(storage.getItem('foo')).toBeNull();
  });

  it('silently fails when setItem throws (quota exceeded)', () => {
    const fake = createFakeStorage();
    fake.setItem = vi.fn(() => {
      throw new Error('quota exceeded');
    });
    const storage = createStorage(fake);
    expect(() => storage.setItem('foo', 'bar')).not.toThrow();
  });

  it('silently fails when removeItem throws', () => {
    const fake = createFakeStorage();
    fake.removeItem = vi.fn(() => {
      throw new Error('private browsing');
    });
    const storage = createStorage(fake);
    expect(() => storage.removeItem('foo')).not.toThrow();
  });
});
