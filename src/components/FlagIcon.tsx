import { memo } from 'react';
import type { Language } from '@/types';

const Flags: Record<Language, React.FC<{ className?: string }>> = {
  en: ({ className }) => (
    <svg viewBox="0 0 60 40" className={className} aria-hidden preserveAspectRatio="none">
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" strokeWidth="8" />
      <path d="M0 0 L60 40 M60 0 L0 40" stroke="#C8102E" strokeWidth="3" />
      <path d="M30 0 V40 M0 20 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0 V40 M0 20 H60" stroke="#C8102E" strokeWidth="5" />
    </svg>
  ),
  ca: ({ className }) => (
    <svg viewBox="0 0 60 40" className={className} aria-hidden preserveAspectRatio="none">
      <rect width="60" height="40" fill="#FCDD09" />
      <rect y="8" width="60" height="5.3" fill="#DA121A" />
      <rect y="18.7" width="60" height="5.3" fill="#DA121A" />
      <rect y="29.3" width="60" height="5.3" fill="#DA121A" />
    </svg>
  ),
  es: ({ className }) => (
    <svg viewBox="0 0 60 40" className={className} aria-hidden preserveAspectRatio="none">
      <rect width="60" height="40" fill="#AA151B" />
      <rect y="10" width="60" height="20" fill="#F1BF00" />
    </svg>
  ),
};

interface FlagIconProps {
  code: Language;
  className?: string;
}

export const FlagIcon = memo(function FlagIcon({ code, className }: FlagIconProps) {
  const Flag = Flags[code];
  return <Flag className={className} />;
});
