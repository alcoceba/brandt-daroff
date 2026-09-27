import { memo, type ButtonHTMLAttributes, type ReactNode } from 'react';
import {
  getButtonClassName,
  type ButtonSize,
  type ButtonVariant,
} from './buttonStyles';

export type { ButtonSize, ButtonVariant };

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

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
      className={getButtonClassName({ variant, size, fullWidth, className })}
      {...rest}
    >
      {children}
    </button>
  );
});
