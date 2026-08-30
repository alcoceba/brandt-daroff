import { memo, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ReadyScreenProps {
  onDone: () => void;
}

const DISPLAY_MS = 2500;

export const ReadyScreen = memo(function ReadyScreen({ onDone }: ReadyScreenProps) {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(onDone, DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex h-24 w-24 animate-scale-in items-center justify-center rounded-full bg-state-done/20">
        <Check size={48} className="text-state-done" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">{t('ready.title')}</h1>
        <p className="text-lg text-slate-300">{t('ready.subtitle')}</p>
      </div>
    </div>
  );
});
