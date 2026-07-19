import { memo } from 'react';
import { Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDuration } from '@/utils/format';
import { BackButton } from '@/components/core/BackButton';

interface SessionCompletionCardProps {
  dayNumber: number;
  isQuick: boolean;
  completedCount: number;
  totalSessions: number;
  elapsedSeconds: number;
  onDone: () => void;
}

export const SessionCompletionCard = memo(function SessionCompletionCard({
  dayNumber,
  isQuick,
  completedCount,
  totalSessions,
  elapsedSeconds,
  onDone,
}: SessionCompletionCardProps) {
  const { t } = useTranslation();
  const timeLabel = formatDuration(elapsedSeconds);

  return (
    <div className="flex flex-1 flex-col gap-3 bg-gradient-to-b from-slate-900 to-slate-800 p-4 sm:gap-4 sm:p-5">
      <header className="flex items-center gap-3">
        <BackButton onBack={onDone} />
        <h1 className="text-xl font-bold text-white">
          {isQuick ? t('wizard.modeQuickTitle') : t('cycle.title', { x: dayNumber })}
        </h1>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <Trophy className="h-24 w-24 text-state-done" strokeWidth={1.5} />
        <div>
          <h2 className="text-3xl font-bold text-white">{t('cycle.completionTitle')}</h2>
          <p className="mt-2 text-lg text-slate-300">{t('cycle.completionBody')}</p>
        </div>
        <div className="grid w-full max-w-xs grid-cols-1 gap-3">
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
            <p className="text-sm text-slate-400">{t('cycle.timeInvested')}</p>
            <p className="text-2xl font-bold text-white">{timeLabel}</p>
          </div>
          {!isQuick && (
            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
              <p className="text-sm text-slate-400">{t('cycle.completionTotalSessions')}</p>
              <p className="text-2xl font-bold text-white">
                {completedCount} / {totalSessions}
              </p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onDone}
          className="min-h-touch w-full max-w-xs rounded-xl bg-brand-600 text-lg font-bold text-white"
        >
          {t('cycle.done')}
        </button>
      </div>
    </div>
  );
});
