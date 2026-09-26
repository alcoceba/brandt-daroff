import { memo } from 'react';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StatusNotice } from '@/components/core/StatusNotice';

interface ReadyScreenProps {
  onDone: () => void;
}

export const ReadyScreen = memo(function ReadyScreen({ onDone }: ReadyScreenProps) {
  const { t } = useTranslation();

  return (
    <StatusNotice
      icon={<Check size={48} className="text-state-done" strokeWidth={2.5} />}
      iconBadgeClassName="bg-state-done/20 text-state-done"
      title={t('ready.title')}
      subtitle={t('ready.subtitle')}
      durationMs={2500}
      onDone={onDone}
    />
  );
});
