import { memo } from 'react';
import { Info, Settings as SettingsIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSessionSlots } from '@/data/positions';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { getDayNumber, todayISO } from '@/utils/date';
import { Calendar } from '@/components/Calendar';
import type { SessionStatus } from '@/types';

interface HomeProps {
  onStartSession: (sessionId: string) => void;
  onOpenSettings: () => void;
  onOpenInfo: () => void;
}

const STATUS_STYLE: Record<SessionStatus, { dot: string; label: string }> = {
  pending: { dot: 'bg-state-pending', label: 'home.pending' },
  'in-progress': { dot: 'bg-state-progress', label: 'home.inProgress' },
  completed: { dot: 'bg-state-done', label: 'home.completed' },
};

export const Home = memo(function Home({ onStartSession, onOpenSettings, onOpenInfo }: HomeProps) {
  const { t } = useTranslation();
  const { config, sessions, startDate } = useTreatmentStore((s) => ({
    config: s.config,
    sessions: s.sessions,
    startDate: s.startDate,
  }));

  const slots = getSessionSlots(config.sessionsPerDay);
  const today = todayISO();
  const dayNumber = startDate ? getDayNumber(startDate, config.totalDays) : 1;
  const todaySessions = sessions[today] ?? {};
  const totalSessions = config.sessionsPerDay * config.totalDays;
  const completedCount = Object.values(sessions).reduce(
    (acc, day) => acc + Object.values(day).filter((s) => s === 'completed').length,
    0,
  );
  const pctDone = totalSessions ? Math.round((completedCount / totalSessions) * 100) : 0;
  const finished = dayNumber > config.totalDays;

  return (
    <div className="flex min-h-dvh flex-col gap-4 p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h1 className="whitespace-nowrap text-xl font-bold text-white">{t('home.title')}</h1>
            {finished ? (
              <span className="text-lg font-bold text-state-done">{t('home.complete')}</span>
            ) : (
              <span className="whitespace-nowrap text-lg font-semibold text-brand-500">
                {t('home.day', { x: dayNumber, total: config.totalDays })}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-slate-300">
              {t('home.progressValue', { done: completedCount, total: totalSessions })}
            </span>
            <span className="font-bold tabular-nums text-state-done">{pctDone}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700">
            <div
              className="h-full bg-state-done transition-all"
              style={{ width: `${pctDone}%` }}
            />
          </div>
        </div>
      </header>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-slate-300">{t('home.todaysSessions')}</h2>
        {slots.map((slot) => {
          const status: SessionStatus = todaySessions[slot.id] ?? 'pending';
          const style = STATUS_STYLE[status];
          const label = t(slot.labelKey, slot.id.includes('-') ? { n: Number(slot.id.split('-')[1]) } : undefined);
          const done = status === 'completed';
          return (
            <div
              key={slot.id}
              className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 p-4"
            >
              <span className={`h-3 w-3 shrink-0 rounded-full ${style.dot}`} />
              <span className="flex-1 text-lg font-semibold text-white">{label}</span>
              <span className="text-sm text-slate-400">{t(style.label)}</span>
              <button
                type="button"
                disabled={done}
                onClick={() => onStartSession(slot.id)}
                className="min-h-touch rounded-lg bg-brand-600 px-5 font-bold text-white disabled:opacity-40"
              >
                {status === 'in-progress' ? t('home.resume') : t('home.start')}
              </button>
            </div>
          );
        })}
      </section>

      <Calendar />

      <div className="mt-auto flex gap-3">
        <button
          type="button"
          onClick={onOpenInfo}
          className="flex min-h-touch flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 font-semibold text-slate-200"
        >
          <Info size={20} /> {t('info.title')}
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex min-h-touch flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 font-semibold text-slate-200"
        >
          <SettingsIcon size={20} /> {t('home.settings')}
        </button>
      </div>
    </div>
  );
});
