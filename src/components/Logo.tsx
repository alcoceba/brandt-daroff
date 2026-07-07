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
        <circle cx="48" cy="48" r="42" fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle
          cx="48"
          cy="48"
          r="42"
          fill="none"
          stroke="#22c55e"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 42}
          strokeDashoffset={2 * Math.PI * 42 * 0.25}
          transform="rotate(-90 48 48)"
        />
        <path
          d="M34 50 q-6 0 -6 8 v6 h40 v-6 q0 -8 -6 -8 z"
          fill="#e2e8f0"
        />
        <circle cx="48" cy="36" r="9" fill="#f59e0b" />
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
