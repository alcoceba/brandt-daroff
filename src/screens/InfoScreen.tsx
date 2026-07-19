import { memo } from 'react';
import { CalendarDays, Clock, Ear, Lightbulb, Move, ShieldAlert, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BackButton } from '@/components/core/BackButton';

interface InfoScreenProps {
  onBack: () => void;
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-bold text-white">{title}</h2>
      </div>
      <div className="mt-2 text-xs leading-relaxed text-slate-300">{children}</div>
    </div>
  );
}

export const InfoScreen = memo(function InfoScreen({ onBack }: InfoScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col gap-4 p-5">
      <header className="flex items-center gap-3">
        <BackButton onBack={onBack} />
        <h1 className="text-xl font-bold text-white">{t('info.title')}</h1>
      </header>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="shrink-0 text-amber-400" />
            <h2 className="text-sm font-bold text-amber-300">{t('wizard.disclaimerTitle')}</h2>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-amber-200/90">{t('wizard.disclaimerBody')}</p>
        </div>

        <Section icon={<Ear size={18} className="text-blue-400" />} title={t('info.whatIsVPPBTitle')}>
          <p>{t('info.whatIsVPPBBody')}</p>
        </Section>

        <Section icon={<Move size={18} className="text-brand-500" />} title={t('info.whatIsMethodTitle')}>
          <p>{t('info.whatIsMethodBody')}</p>
        </Section>

        <Section icon={<Clock size={18} className="text-amber-400" />} title={t('info.cycleTitle')}>
          <p className="mb-2">{t('info.cycleIntro')}</p>
          <ol className="flex flex-col gap-1.5 pl-4">
            <li className="list-decimal">{t('info.step1')}</li>
            <li className="list-decimal">{t('info.step2')}</li>
            <li className="list-decimal">{t('info.step3')}</li>
            <li className="list-decimal">{t('info.step4')}</li>
            <li className="list-decimal">{t('info.step5')}</li>
          </ol>
        </Section>

        <Section icon={<CalendarDays size={18} className="text-purple-400" />} title={t('info.frequencyTitle')}>
          <p>{t('info.frequencyBody')}</p>
        </Section>

        <Section icon={<Lightbulb size={18} className="text-yellow-400" />} title={t('info.tipsTitle')}>
          <p>{t('info.tipsBody')}</p>
        </Section>

        <Section icon={<TrendingUp size={18} className="text-brand-500" />} title={t('info.effectivenessTitle')}>
          <p>{t('info.effectivenessBody')}</p>
        </Section>
      </div>
    </div>
  );
});
