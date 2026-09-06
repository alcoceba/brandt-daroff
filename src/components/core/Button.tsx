import { memo, type ButtonHTMLAttributes, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'solid-danger' | 'ghost';
export type ButtonSize = 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 font-bold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-500 hover:shadow-brand-500/30',
  secondary:
    'border border-slate-600/80 bg-slate-700/80 font-semibold text-white shadow-sm hover:border-slate-500 hover:bg-slate-600',
  outline:
    'border border-slate-700/80 bg-slate-800/60 font-semibold text-slate-200 shadow-sm backdrop-blur-sm hover:border-slate-500 hover:bg-slate-700/80 hover:text-white',
  danger:
    'border border-state-danger/50 bg-slate-800/80 font-semibold text-state-danger shadow-sm backdrop-blur-sm hover:border-state-danger hover:bg-state-danger/10',
  'solid-danger':
    'bg-state-danger font-bold text-white shadow-lg shadow-red-500/20 hover:bg-red-500 hover:shadow-red-500/30',
  ghost:
    'font-semibold text-slate-300 hover:text-white',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'min-h-touch rounded-xl px-4 text-base',
  lg: 'min-h-touch rounded-2xl px-5 text-lg',
  icon: 'min-h-touch min-w-touch rounded-xl p-0',
};

export const Button = memo(function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
        SIZE_CLASSES[size]
      } ${VARIANT_CLASSES[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
});
