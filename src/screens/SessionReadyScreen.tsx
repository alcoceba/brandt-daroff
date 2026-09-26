import { memo } from 'react';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { getDayNumber, todayISO } from '@/utils/date';
import { getSessionNumber } from '@/utils/sessions';
import { StatusNotice } from '@/components/core/StatusNotice';

interface SessionReadyScreenProps {
  sessionId: string;
  onDone: () => void;
}

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
    <StatusNotice
      icon={<Sparkles size={46} className="text-yellow-400" strokeWidth={2} />}
      iconBadgeClassName="bg-yellow-500/20 text-yellow-400"
      title={title}
      subtitle={subtitle}
      durationMs={2200}
      onDone={onDone}
    />
  );
});
