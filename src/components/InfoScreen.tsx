import { memo } from 'react';
import { ArrowLeft, Activity, Clock, Lightbulb, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
    <div className="flex min-h-dvh flex-col gap-4 p-5">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label={t('common.back')}
          className="grid min-h-touch min-w-touch place-items-center rounded-lg border border-slate-700 text-white"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold text-white">{t('info.title')}</h1>
      </header>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4">
        <Section icon={<Activity size={18} className="text-brand-500" />} title={t('info.whatIsVPPBTitle')}>
          <p>{t('info.whatIsVPPBBody')}</p>
        </Section>

        <Section icon={<Activity size={18} className="text-brand-500" />} title={t('info.whatIsMethodTitle')}>
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

        <Section icon={<Clock size={18} className="text-amber-400" />} title={t('info.frequencyTitle')}>
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
