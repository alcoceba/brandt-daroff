import type { StateStorage } from 'zustand/middleware';
import { createStorage } from '@/storage/createStorage';

const adapter = createStorage();

export const treatmentStorage: StateStorage = {
  getItem: (name) => adapter.getItem(name),
  setItem: (name, value) => adapter.setItem(name, value),
  removeItem: (name) => adapter.removeItem(name),
};
