import type { Language } from '@/types';

export const LANGUAGES: readonly { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ca', label: 'Català' },
  { code: 'es', label: 'Castellano' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
] as const;

export const DEFAULT_LANGUAGE: Language = 'en';
