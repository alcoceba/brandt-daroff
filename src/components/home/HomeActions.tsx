import { memo } from 'react';
import { Info, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/core/Button';

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
      <Button
        variant="outline"
        onClick={onOpenInfo}
        className="flex-1"
      >
        <Info size={20} />
        <span className="hidden sm:inline">{infoLabel}</span>
      </Button>
      <Button
        variant="outline"
        onClick={onOpenSettings}
        className="flex-1"
      >
        <SettingsIcon size={20} />
        <span className="hidden sm:inline">{settingsLabel}</span>
      </Button>
    </div>
  );
});
