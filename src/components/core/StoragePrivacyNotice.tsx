import { memo } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface StoragePrivacyNoticeProps {
  className?: string;
}

export const StoragePrivacyNotice = memo(function StoragePrivacyNotice({
  className = '',
}: StoragePrivacyNoticeProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 text-left ${className}`}
    >
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
      <div className="flex flex-col gap-2 text-xs leading-relaxed text-slate-300">
        <p>{t('wizard.storagePrivacyNotice')}</p>
        <p>
          <span className="font-bold text-white">
            {t('wizard.privateBrowsingWarningHighlight')}
          </span>
          , {t('wizard.privateBrowsingWarningReason')}
        </p>
      </div>
    </div>
  );
});
