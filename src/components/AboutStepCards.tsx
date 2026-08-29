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

interface AboutStepCardsProps {
  variant?: 'summary' | 'full';
}

export function AboutStepCards({ variant = 'summary' }: AboutStepCardsProps) {
  const { t } = useTranslation();

  if (variant === 'summary') {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
        <p className="text-sm leading-relaxed text-slate-300">
          {t('wizard.aboutSummary')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {steps.map((item, index) => (
        <div key={item.number} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-slate-900 shadow-md shadow-amber-500/20">
              {item.number}
            </span>
            {index !== steps.length - 1 && (
              <div className="my-2 w-px flex-1 bg-slate-700/50" />
            )}
          </div>
          <div className={`flex-1 ${index !== steps.length - 1 ? 'pb-6' : ''}`}>
            <div className="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-800 p-4">
              <div className="flex shrink-0 items-center justify-center rounded-xl bg-white/95 p-2 shadow-inner">
                <img
                  src={`${import.meta.env.BASE_URL}steps/step-${item.image}.png`}
                  alt=""
                  className="h-16 w-16 object-contain"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium leading-snug text-slate-200">
                  {t(`wizard.aboutStep${item.number}`)}
                </p>
                {item.duration && (
                  <span className="w-fit rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                    {item.duration}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
