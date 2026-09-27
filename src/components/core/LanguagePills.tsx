import { memo } from 'react';
import type { Language } from '@/types';
import { LANGUAGES } from '@/constants/languages';

export interface LanguagePillsProps {
  currentLanguage: Language;
  languages?: readonly Language[];
  onSelectLanguage?: (lang: Language) => void;
  getHref?: (lang: Language) => string;
  className?: string;
  ariaLabel?: string;
}

const DEFAULT_LANG_ORDER: readonly Language[] = ['ca', 'es', 'en'];

export const LanguagePills = memo(function LanguagePills({
  currentLanguage,
  languages = DEFAULT_LANG_ORDER,
  onSelectLanguage,
  getHref,
  className = '',
  ariaLabel = 'Languages',
}: LanguagePillsProps) {
  const getLabel = (code: Language) => {
    const found = LANGUAGES.find((item) => item.code === code);
    return found ? found.label : code.toUpperCase();
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={`flex items-center rounded-xl border border-slate-800 bg-slate-900/80 p-0.5 shadow-inner ${className}`}
    >
      {languages.map((l) => {
        const isActive = l === currentLanguage;
        const itemClass = `rounded-lg px-2 py-1 text-xs font-semibold uppercase transition-all sm:px-2.5 ${
          isActive
            ? 'bg-brand-600 text-white shadow-sm'
            : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
        }`;

        if (getHref) {
          return (
            <a
              key={l}
              href={getHref(l)}
              aria-current={isActive ? 'page' : undefined}
              title={getLabel(l)}
              className={itemClass}
            >
              {l}
            </a>
          );
        }

        return (
          <button
            key={l}
            type="button"
            onClick={() => onSelectLanguage?.(l)}
            aria-pressed={isActive}
            title={getLabel(l)}
            className={itemClass}
          >
            {l}
          </button>
        );
      })}
    </nav>
  );
});
