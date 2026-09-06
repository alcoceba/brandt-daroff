import { memo } from 'react';
import type { Language } from '@/types';
import { LANGUAGES } from '@/constants/languages';
import { Logo } from '@/components/core/Logo';
import { Button } from '@/components/core/Button';

interface LanguageSelectorScreenProps {
  onSelect: (code: Language) => void;
}

export const LanguageSelectorScreen = memo(function LanguageSelectorScreen({ onSelect }: LanguageSelectorScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-3 py-6 sm:px-6">
      <Logo />
      <ul className="flex w-full max-w-sm flex-col gap-3">
        {LANGUAGES.map(({ code, label }) => {
          return (
            <li key={code}>
              <Button
                variant="outline"
                fullWidth
                onClick={() => onSelect(code)}
                className="gap-3 text-lg"
              >
                <span>{label}</span>
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
