import type { Language } from '@/types';

export const LANGUAGES: readonly { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ca', label: 'Català' },
  { code: 'es', label: 'Castellano' },
] as const;

export const DEFAULT_LANGUAGE: Language = 'en';
