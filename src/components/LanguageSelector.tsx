import { memo } from 'react';
import type { Language } from '@/types';
import { LANGUAGES } from '@/i18n/languages';
import { Logo } from '@/components/Logo';

const Flags: Record<Language, React.FC<{ className?: string }>> = {
  en: ({ className }) => (
    <svg viewBox="0 0 60 40" className={className} aria-hidden preserveAspectRatio="none">
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" strokeWidth="8" />
      <path d="M0 0 L60 40 M60 0 L0 40" stroke="#C8102E" strokeWidth="3" />
      <path d="M30 0 V40 M0 20 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0 V40 M0 20 H60" stroke="#C8102E" strokeWidth="5" />
    </svg>
  ),
  ca: ({ className }) => (
    <svg viewBox="0 0 60 40" className={className} aria-hidden preserveAspectRatio="none">
      <rect width="60" height="40" fill="#FCDD09" />
      <rect y="8" width="60" height="5.3" fill="#DA121A" />
      <rect y="18.7" width="60" height="5.3" fill="#DA121A" />
      <rect y="29.3" width="60" height="5.3" fill="#DA121A" />
    </svg>
  ),
  es: ({ className }) => (
    <svg viewBox="0 0 60 40" className={className} aria-hidden preserveAspectRatio="none">
      <rect width="60" height="40" fill="#AA151B" />
      <rect y="10" width="60" height="20" fill="#F1BF00" />
    </svg>
  ),
};

interface LanguageSelectorProps {
  onSelect: (code: Language) => void;
}

export const LanguageSelector = memo(function LanguageSelector({ onSelect }: LanguageSelectorProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 p-6">
      <Logo />
      <ul className="flex w-full max-w-sm flex-col gap-3">
        {LANGUAGES.map(({ code, label }) => {
          const Flag = Flags[code];
          return (
            <li key={code}>
              <button
                type="button"
                onClick={() => onSelect(code)}
                className="flex w-full min-h-touch items-center gap-4 rounded-xl border border-slate-700 bg-slate-800 px-4 text-lg font-semibold text-white active:scale-[.99]"
              >
                <Flag className="h-7 w-10 shrink-0 overflow-hidden rounded shadow" />
                <span>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
