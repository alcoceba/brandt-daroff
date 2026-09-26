import { memo, type ReactNode } from 'react';
import { BackButton } from './BackButton';

export interface ScreenHeaderProps {
  title: ReactNode;
  onBack?: () => void;
  rightAction?: ReactNode;
  className?: string;
  titleClassName?: string;
}

export const ScreenHeader = memo(function ScreenHeader({
  title,
  onBack,
  rightAction,
  className = '',
  titleClassName = 'text-xl font-bold text-white',
}: ScreenHeaderProps) {
  return (
    <header className={`flex items-center gap-3 ${className}`}>
      {onBack && <BackButton onBack={onBack} />}
      <h1 className={`${titleClassName} ${rightAction ? 'min-w-0' : 'min-w-0 flex-1'}`}>{title}</h1>
      {rightAction}
    </header>
  );
});
