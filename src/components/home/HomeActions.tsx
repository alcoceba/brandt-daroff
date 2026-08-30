import { memo } from 'react';
import { Info, Settings as SettingsIcon } from 'lucide-react';

interface HomeActionsProps {
  infoLabel: string;
  settingsLabel: string;
  onOpenInfo: () => void;
  onOpenSettings: () => void;
}

export const HomeActions = memo(function HomeActions({
  infoLabel,
  settingsLabel,
  onOpenInfo,
  onOpenSettings,
}: HomeActionsProps) {
  return (
    <div className="mt-auto flex gap-3">
      <button
        type="button"
        onClick={onOpenInfo}
        className="flex min-h-touch flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 font-semibold text-slate-200 transition-all duration-200 hover:bg-slate-800 hover:border-slate-600 hover:text-white hover:scale-[1.01] active:scale-[0.97]"
      >
        <Info size={20} />
        <span className="hidden sm:inline">{infoLabel}</span>
      </button>
      <button
        type="button"
        onClick={onOpenSettings}
        className="flex min-h-touch flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 font-semibold text-slate-200 transition-all duration-200 hover:bg-slate-800 hover:border-slate-600 hover:text-white hover:scale-[1.01] active:scale-[0.97]"
      >
        <SettingsIcon size={20} />
        <span className="hidden sm:inline">{settingsLabel}</span>
      </button>
    </div>
  );
});
