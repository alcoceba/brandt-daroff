import { memo, type ReactNode } from 'react';
import { Card, type CardProps } from '@/components/core/Card';

export interface SectionCardProps {
  icon?: ReactNode;
  iconBadgeClassName?: string;
  title: ReactNode;
  titleId?: string;
  titleClassName?: string;
  headerRight?: ReactNode;
  children: ReactNode;
  variant?: CardProps['variant'];
  className?: string;
}

export const SectionCard = memo(function SectionCard({
  icon,
  iconBadgeClassName,
  title,
  titleId,
  titleClassName = 'text-base sm:text-lg font-bold text-white',
  headerRight,
  children,
  variant = 'default',
  className = '',
}: SectionCardProps) {
  return (
    <Card variant={variant} className={className}>
      {(icon || title || headerRight) && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {icon &&
              (iconBadgeClassName ? (
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBadgeClassName}`}
                >
                  {icon}
                </span>
              ) : (
                <span className="shrink-0">{icon}</span>
              ))}
            <h2 id={titleId} className={titleClassName}>
              {title}
            </h2>
          </div>
          {headerRight && <div className="shrink-0">{headerRight}</div>}
        </div>
      )}
      <div className={icon || title || headerRight ? 'mt-3 sm:mt-4' : ''}>
        {children}
      </div>
    </Card>
  );
});
