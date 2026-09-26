import { memo } from 'react';
import { ChevronRight, ListChecks, Play, Plus, Sparkles } from 'lucide-react';

interface TodaySessionCardProps {
  todaysSessionsLabel: string;
  progressLabel: string;
  goalReached: boolean;
  hasInProgress: boolean;
  isInProgress: boolean;
  extrasCompletedToday: number;
  buttonLabel: string;
  buttonSubLabel: string | null;
  showExtraBadge: boolean;
  extraBadgeLabel: string;
  goalReachedLabel: string;
  extraDoneLabel: string;
  extrasDoneLabel: string;
  onStart: () => void;
}

export const TodaySessionCard = memo(function TodaySessionCard({
  todaysSessionsLabel,
  progressLabel,
  goalReached,
  hasInProgress,
  isInProgress,
  extrasCompletedToday,
  buttonLabel,
  buttonSubLabel,
  showExtraBadge,
  extraBadgeLabel,
  goalReachedLabel,
  extraDoneLabel,
  extrasDoneLabel,
  onStart,
}: TodaySessionCardProps) {
  const isAddExtraAction = buttonSubLabel === null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-300">
          <ListChecks size={16} className="text-brand-400" strokeWidth={2} />
          {todaysSessionsLabel}
        </h2>
        <span className="text-sm text-slate-400">{progressLabel}</span>
      </div>

      {goalReached && !hasInProgress && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-state-done/30 bg-state-done/10 px-4 py-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 shrink-0 text-state-done" strokeWidth={1.5} />
            <p className="text-sm font-semibold text-state-done">{goalReachedLabel}</p>
          </div>
          {extrasCompletedToday > 0 && (
            <span className="rounded-full bg-state-done/20 px-2 py-0.5 text-xs font-bold text-state-done">
              {extrasCompletedToday === 1
                ? extraDoneLabel
                : extrasDoneLabel}
            </span>
          )}
        </div>
      )}

      <div className="relative">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -inset-0.5 rounded-2xl blur-md transition-opacity duration-500 animate-aura-pulse ${
            isInProgress ? 'bg-state-progress/30' : 'bg-brand-500/30'
          }`}
        />

        <button
          type="button"
          onClick={onStart}
          className={`group relative w-full overflow-hidden rounded-2xl border text-left transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${
            isInProgress
              ? 'border-state-progress/40 bg-gradient-to-r from-state-progress/15 via-slate-900/90 to-state-progress/5 animate-breathe-progress hover:border-state-progress/80'
              : 'border-brand-500/40 bg-gradient-to-r from-brand-500/15 via-slate-900/90 to-brand-500/5 animate-breathe-brand hover:border-brand-500/80'
          }`}
        >
          <div className="relative flex items-center gap-3.5 p-4 sm:gap-4 sm:p-5">
            <div
              aria-hidden="true"
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105 ${
                isInProgress
                  ? 'bg-state-progress/20 text-state-progress ring-1 ring-state-progress/40 shadow-sm shadow-state-progress/20'
                  : 'bg-brand-500/20 text-brand-400 ring-1 ring-brand-500/40 shadow-sm shadow-brand-500/20'
              }`}
            >
              {isAddExtraAction ? (
                <Plus className="h-5 w-5" strokeWidth={2.5} />
              ) : (
                <Play className="ml-0.5 h-5 w-5 fill-current" strokeWidth={2.5} />
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-lg font-bold text-white tracking-tight">{buttonLabel}</span>
              {buttonSubLabel && (
                <span className="flex items-center gap-2 text-sm font-medium text-brand-400">
                  <span className={isInProgress ? 'text-state-progress' : 'text-brand-400'}>
                    {buttonSubLabel}
                  </span>
                  {showExtraBadge && (
                    <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-xs font-bold text-brand-400">
                      {extraBadgeLabel}
                    </span>
                  )}
                </span>
              )}
            </div>
            <ChevronRight
              size={28}
              strokeWidth={2.5}
              className={`shrink-0 transition-colors duration-300 ${
                isInProgress ? 'text-state-progress/70' : 'text-brand-500'
              }`}
            />
          </div>
        </button>
      </div>
    </section>
  );
});
