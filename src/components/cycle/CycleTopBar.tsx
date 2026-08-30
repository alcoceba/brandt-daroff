import { memo, useState } from 'react';
import { MoreHorizontal, RotateCcw, Volume2, VolumeX, X } from 'lucide-react';
import { BackButton } from '@/components/core/BackButton';

interface CycleTopBarProps {
  title: string;
  onBack: () => void;
  onReset: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  moreActionsLabel: string;
  muteLabel: string;
  unmuteLabel: string;
  resetLabel: string;
}

export const CycleTopBar = memo(function CycleTopBar({
  title,
  onBack,
  onReset,
  soundEnabled,
  onToggleSound,
  moreActionsLabel,
  muteLabel,
  unmuteLabel,
  resetLabel,
}: CycleTopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-30 flex items-center gap-3">
      <BackButton onBack={onBack} />
      <h1 className="text-xl font-bold text-white">{title}</h1>
      <div className="relative ml-auto flex items-center">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={moreActionsLabel}
          aria-expanded={menuOpen}
          className="relative z-30 flex h-14 w-14 items-center justify-center rounded-xl border border-slate-600 text-slate-200 transition-all duration-200 hover:border-slate-500 hover:bg-slate-800 hover:text-white active:scale-[0.98]"
        >
          {menuOpen ? <X size={22} /> : <MoreHorizontal size={22} />}
        </button>

        <div
          aria-hidden={!menuOpen}
          className={`absolute right-0 top-full z-20 mt-2 flex flex-col gap-2 transition-all duration-200 ${
            menuOpen
              ? 'translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-2 opacity-0'
          }`}
        >
          <button
            type="button"
            onClick={onReset}
            aria-label={resetLabel}
            className="flex h-14 w-14 items-center justify-center rounded-xl border border-state-danger/50 text-state-danger transition-all duration-200 hover:bg-state-danger/10 hover:border-state-danger active:scale-[0.98]"
          >
            <RotateCcw size={22} />
          </button>
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? muteLabel : unmuteLabel}
            className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-600 text-slate-200 transition-all duration-200 hover:border-slate-500 hover:bg-slate-800 hover:text-white active:scale-[0.98]"
          >
            {soundEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
});
