import { memo } from 'react';
import { useTranslation } from 'react-i18next';

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
}

const MARK = 96;

export const Logo = memo(function Logo({ size = MARK, showWordmark = true }: LogoProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox="0 0 96 96"
        role="img"
        aria-label={t('app.name')}
      >
        <circle cx="48" cy="48" r="42" fill="none" stroke="#22c55e" strokeWidth="8" />
        <circle cx="48" cy="48" r="6" fill="#f8fafc" />
      </svg>
      {showWordmark && (
        <div className="text-center leading-tight">
          <p className="text-xl font-bold tracking-tight text-white">{t('app.name')}</p>
          <p className="text-xs font-medium text-slate-400">{t('app.tagline')}</p>
        </div>
      )}
    </div>
  );
});
