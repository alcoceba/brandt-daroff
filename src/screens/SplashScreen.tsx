import { memo } from 'react';
import { Logo } from '@/components/Logo';

export const SplashScreen = memo(function SplashScreen() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8">
      <Logo />
      <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-slate-700 border-t-brand-500" />
    </div>
  );
});
