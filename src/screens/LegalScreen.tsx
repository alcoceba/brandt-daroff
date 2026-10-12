import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Github, Lock, Scale, ShieldAlert } from 'lucide-react';
import { ScreenHeader } from '@/components/core/ScreenHeader';
import { SectionCard } from '@/components/core/SectionCard';
import { StoragePrivacyNotice } from '@/components/core/StoragePrivacyNotice';

interface LegalScreenProps {
  onBack: () => void;
}

export const LegalScreen = memo(function LegalScreen({ onBack }: LegalScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col gap-4 px-3 py-5 sm:px-5">
      <ScreenHeader title={t('legal.title')} onBack={onBack} />

      <div className="flex flex-1 flex-col gap-3 pb-6">
        <SectionCard
          icon={<ShieldAlert size={20} className="text-red-400" />}
          iconBadgeClassName="bg-red-500/15 border border-red-500/30"
          title={t('legal.medicalDisclaimerTitle')}
        >
          <div className="space-y-2 text-sm leading-relaxed text-slate-300">
            <p>{t('legal.medicalDisclaimerBody1')}</p>
            <p>{t('legal.medicalDisclaimerBody2')}</p>
          </div>
        </SectionCard>

        <SectionCard
          icon={<Lock size={20} className="text-emerald-400" />}
          iconBadgeClassName="bg-emerald-500/15 border border-emerald-500/30"
          title={t('legal.privacyTitle')}
        >
          <div className="space-y-2 text-sm leading-relaxed text-slate-300">
            <p>{t('legal.privacyBody1')}</p>
            <p>{t('legal.privacyBody2')}</p>
          </div>
          <StoragePrivacyNotice className="mt-3" />
        </SectionCard>

        <SectionCard
          icon={<Scale size={20} className="text-amber-400" />}
          iconBadgeClassName="bg-amber-500/15 border border-amber-500/30"
          title={t('legal.termsTitle')}
        >
          <p className="text-sm leading-relaxed text-slate-300">
            {t('legal.termsBody')}
          </p>
        </SectionCard>

        <SectionCard
          icon={<FileText size={20} className="text-blue-400" />}
          iconBadgeClassName="bg-blue-500/15 border border-blue-500/30"
          title={t('legal.contactTitle')}
        >
          <p className="text-sm leading-relaxed text-slate-300">
            {t('legal.contactBody')}
          </p>
          <div className="mt-3">
            <a
              href="https://github.com/alcoceba/brandt-daroff"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white"
            >
              <Github size={16} />
              <span>{t('legal.githubLink')}</span>
            </a>
          </div>
        </SectionCard>
      </div>
    </div>
  );
});
