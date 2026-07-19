import { memo } from 'react';
import type { Language } from '@/types';
import { LANGUAGES } from '@/constants/languages';
import { Logo } from '@/components/Logo';
import { FlagIcon } from '@/components/FlagIcon';

interface LanguageSelectorScreenProps {
  onSelect: (code: Language) => void;
}

export const LanguageSelectorScreen = memo(function LanguageSelectorScreen({ onSelect }: LanguageSelectorScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
      <Logo />
      <ul className="flex w-full max-w-sm flex-col gap-3">
        {LANGUAGES.map(({ code, label }) => {
          return (
            <li key={code}>
              <button
                type="button"
                onClick={() => onSelect(code)}
                className="flex w-full min-h-touch items-center gap-4 rounded-xl border border-slate-700 bg-slate-800 px-4 text-lg font-semibold text-white active:scale-[.99]"
              >
                <FlagIcon code={code} className="h-7 w-10 shrink-0 overflow-hidden rounded shadow" />
                <span>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
