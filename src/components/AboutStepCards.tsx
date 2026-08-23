import { useTranslation } from 'react-i18next';

interface StepItem {
  number: number;
  image: number;
  duration: string | null;
}

const steps: StepItem[] = [
  { number: 1, image: 1, duration: null },
  { number: 2, image: 2, duration: null },
  { number: 3, image: 3, duration: '30s' },
  { number: 4, image: 1, duration: '30s' },
  { number: 5, image: 4, duration: null },
  { number: 6, image: 5, duration: '30s' },
  { number: 7, image: 1, duration: '2 min' },
];

function StepCard({ item }: { item: StepItem }) {
  const { t } = useTranslation();

  return (
    <div className="flex min-w-[140px] flex-1 flex-col gap-2 rounded-xl border border-slate-700 bg-slate-800 p-3 sm:w-[150px] sm:flex-initial">
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-slate-900">
          {item.number}
        </span>
        {item.duration && (
          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
            {item.duration}
          </span>
        )}
      </div>
      <img
        src={`${import.meta.env.BASE_URL}steps/step-${item.image}.png`}
        alt=""
        className="h-28 w-full object-contain"
      />
      <p className="text-xs font-medium leading-snug text-slate-300">
        {t(`wizard.aboutStep${item.number}`)}
      </p>
    </div>
  );
}

export function AboutStepCards() {
  return (
    <>
      <div className="-mx-3 flex gap-3 overflow-x-auto px-3 pb-2 snap-x snap-mandatory sm:hidden">
        {steps.map((item) => (
          <StepCard key={item.number} item={item} />
        ))}
      </div>
      <div className="hidden sm:flex flex-col gap-3">
        <div className="flex justify-center gap-3">
          {steps.slice(0, 3).map((item) => (
            <StepCard key={item.number} item={item} />
          ))}
        </div>
        <div className="flex justify-center gap-3">
          {steps.slice(3).map((item) => (
            <StepCard key={item.number} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}
