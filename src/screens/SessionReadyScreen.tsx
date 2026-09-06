import { memo, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { getDayNumber, todayISO } from '@/utils/date';
import { getSessionNumber } from '@/utils/sessions';

interface SessionReadyScreenProps {
  sessionId: string;
  onDone: () => void;
}

const DISPLAY_MS = 2200;

export const SessionReadyScreen = memo(function SessionReadyScreen({
  sessionId,
  onDone,
}: SessionReadyScreenProps) {
  const { t } = useTranslation();
  const { config, startDate, sessions } = useTreatmentStore((s) => ({
    config: s.config,
    startDate: s.startDate,
    sessions: s.sessions,
  }));

  useEffect(() => {
    const timer = setTimeout(onDone, DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  const today = todayISO();
  const dayNumber = startDate ? getDayNumber(startDate, config.totalDays) : 1;
  const sessionNum = getSessionNumber(sessionId) ?? 1;
  const isExtra = sessionNum > config.sessionsPerDay;
  const extraNum = isExtra ? sessionNum - config.sessionsPerDay : null;
  const isInProgress = sessions[today]?.[sessionId] === 'in-progress';

  const title = isInProgress ? t('sessionReady.resumeTitle') : t('sessionReady.title');
  const subtitle = isExtra
    ? t('sessionReady.subtitleExtra', { day: dayNumber, n: extraNum })
    : t('sessionReady.subtitle', {
        day: dayNumber,
        session: sessionNum,
        totalSessions: config.sessionsPerDay,
      });

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onDone}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onDone();
      }}
      className="flex flex-1 cursor-pointer select-none flex-col items-center justify-center gap-6 px-6 text-center outline-none"
    >
      <div className="flex h-24 w-24 animate-scale-in items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400">
        <Sparkles size={46} className="text-yellow-400" strokeWidth={2} />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="text-lg text-slate-300">{subtitle}</p>
      </div>
    </div>
  );
});
