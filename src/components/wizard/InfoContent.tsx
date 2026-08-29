import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays, Clock, Ear, Lightbulb, Move, TrendingUp } from 'lucide-react';
import { WizardInfoSection } from './WizardInfoSection';
import { AboutStepCards } from '@/components/AboutStepCards';

export const InfoContent = memo(function InfoContent() {
  const { t } = useTranslation();

  return (
    <>
      <WizardInfoSection icon={<Ear size={18} className="text-blue-400" />} title={t('info.whatIsVPPBTitle')}>
        <p>{t('info.whatIsVPPBBody')}</p>
      </WizardInfoSection>

      <WizardInfoSection icon={<Move size={18} className="text-brand-500" />} title={t('info.whatIsMethodTitle')}>
        <p>{t('info.whatIsMethodBody')}</p>
      </WizardInfoSection>

      <WizardInfoSection icon={<Clock size={18} className="text-amber-400" />} title={t('info.cycleTitle')}>
        <p className="mb-4">{t('info.cycleIntro')}</p>
        <div className="mb-2">
          <AboutStepCards variant="full" />
        </div>
      </WizardInfoSection>

      <WizardInfoSection
        icon={<CalendarDays size={18} className="text-purple-400" />}
        title={t('info.frequencyTitle')}
      >
        <p>{t('info.frequencyBody')}</p>
      </WizardInfoSection>

      <WizardInfoSection icon={<Lightbulb size={18} className="text-yellow-400" />} title={t('info.tipsTitle')}>
        <p>{t('info.tipsBody')}</p>
      </WizardInfoSection>

      <WizardInfoSection
        icon={<TrendingUp size={18} className="text-brand-500" />}
        title={t('info.effectivenessTitle')}
      >
        <p>{t('info.effectivenessBody')}</p>
      </WizardInfoSection>
    </>
  );
});
