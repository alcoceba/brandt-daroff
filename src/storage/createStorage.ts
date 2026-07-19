export interface StorageAdapter {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
  removeItem: (name: string) => void;
}

export function createStorage(adapter: Storage = localStorage): StorageAdapter {
  return {
    getItem: (name: string) => {
      try {
        return adapter.getItem(name);
      } catch {
        return null;
      }
    },
    setItem: (name: string, value: string) => {
      try {
        adapter.setItem(name, value);
      } catch {
        /* quota exceeded or private browsing — silently fail */
      }
    },
    removeItem: (name: string) => {
      try {
        adapter.removeItem(name);
      } catch {
        /* silently fail */
      }
    },
  };
}
