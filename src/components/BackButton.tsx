import { memo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BackButtonProps {
  onBack: () => void;
  className?: string;
}

export const BackButton = memo(function BackButton({ onBack, className = '' }: BackButtonProps) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onBack}
      aria-label={t('common.back')}
      className={`grid min-h-touch min-w-touch place-items-center rounded-lg text-slate-300 transition-colors hover:text-white active:scale-95 ${className}`}
    >
      <ArrowLeft size={22} />
    </button>
  );
});
