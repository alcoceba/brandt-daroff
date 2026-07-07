import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { getSessionSlots } from '@/data/positions';
import { useTreatmentStore } from '@/store/useTreatmentStore';
import { toDateISO } from '@/utils/date';
import type { SessionStatus } from '@/types';

const STATUS_COLOR: Record<SessionStatus, string> = {
  pending: 'bg-slate-600',
  'in-progress': 'bg-state-progress',
  completed: 'bg-state-done',
};

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toDateISO(d);
}

export const Calendar = memo(function Calendar() {
  const { t } = useTranslation();
  const { startDate, sessions, config } = useTreatmentStore((s) => ({
    startDate: s.startDate,
    sessions: s.sessions,
    config: s.config,
  }));
  if (!startDate) return null;
  const slots = getSessionSlots(config.sessionsPerDay);
  const days = Array.from({ length: config.totalDays }, (_, i) => i);

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-800 p-3">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-300">{t('home.progress')}</h2>
        <p className="text-xs text-slate-500">{t('home.progressLegend')}</p>
      </div>
      <div className="flex flex-col gap-1.5">
        {days.map((dayIdx) => {
          const iso = addDays(startDate, dayIdx);
          const daySessions = sessions[iso] ?? {};
          return (
            <div key={dayIdx} className="flex flex-1 gap-1.5">
              {slots.map((slot, slotIdx) => {
                const status = daySessions[slot.id] ?? 'pending';
                return (
                  <div
                    key={slot.id}
                    className={`flex h-6 flex-1 items-center justify-center rounded-sm ${STATUS_COLOR[status]}`}
                    title={`${t(slot.labelKey, slot.id.includes('-') ? { n: Number(slot.id.split('-')[1]) } : undefined)} · ${status}`}
                  >
                    <span className="text-[9px] font-bold text-white/90">
                      {dayIdx + 1}/{slotIdx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
});
