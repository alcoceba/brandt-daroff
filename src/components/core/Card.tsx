import { memo, type HTMLAttributes, type ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'solid' | 'subtle';
  className?: string;
}

export const Card = memo(function Card({
  children,
  variant = 'default',
  className = '',
  ...rest
}: CardProps) {
  const variantClasses = {
    default: 'border-slate-700/80 bg-slate-800/80',
    solid: 'border-slate-700/80 bg-slate-800',
    subtle: 'border-slate-800/60 bg-slate-900/40',
  }[variant];

  return (
    <div
      className={`rounded-xl border backdrop-blur-sm shadow-sm p-4 ${variantClasses} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
});
