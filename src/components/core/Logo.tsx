import { memo } from 'react';
import { useTranslation } from 'react-i18next';

export interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  name?: string;
  tagline?: string;
  layout?: 'vertical' | 'horizontal';
  className?: string;
}

const MARK = 96;

export const Logo = memo(function Logo({
  size = MARK,
  showWordmark = true,
  name,
  tagline,
  layout = 'vertical',
  className = '',
}: LogoProps) {
  const { t } = useTranslation();
  const displayName = name ?? t('app.name');
  const displayTagline = tagline ?? t('app.tagline');

  if (layout === 'horizontal') {
    const iconSize = size === MARK ? 22 : size;
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-500/25 bg-brand-950/50 shadow-sm shadow-brand-950/50">
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 96 96"
            role="img"
            aria-label={displayName}
            className="shrink-0"
          >
            <circle cx="48" cy="48" r="42" fill="none" stroke="#22c55e" strokeWidth="9" />
            <circle cx="48" cy="48" r="7" fill="#f8fafc" />
          </svg>
        </div>
        {showWordmark && (
          <div className="leading-tight">
            <span className="block text-base font-extrabold tracking-tight text-white sm:text-lg">
              {displayName}
            </span>
            {displayTagline && (
              <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
                {displayTagline}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 96 96"
        role="img"
        aria-label={displayName}
      >
        <circle cx="48" cy="48" r="42" fill="none" stroke="#22c55e" strokeWidth="8" />
        <circle cx="48" cy="48" r="6" fill="#f8fafc" />
      </svg>
      {showWordmark && (
        <div className="text-center leading-tight">
          <p className="text-xl font-bold tracking-tight text-white">{displayName}</p>
          <p className="text-xs font-medium text-slate-400">{displayTagline}</p>
        </div>
      )}
    </div>
  );
});
