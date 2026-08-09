import { useState } from 'react';
import { Copy, RotateCcw, TestTube } from 'lucide-react';
import {
  clearStoredState,
  copyCurrentState,
  getScenarioLabel,
  getScenarioNames,
  seedScenario,
  type ScenarioName,
} from '@/testing/scenarios';

export function DevScenariosScreen() {
  const [copied, setCopied] = useState(false);

  const handleSeed = (name: ScenarioName) => {
    seedScenario(name);
  };

  const handleCopy = async () => {
    await copyCurrentState();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TestTube className="h-5 w-5 text-brand-500" />
          <h1 className="text-xl font-bold text-white">Dev scenarios</h1>
        </div>
        <span className="rounded-full bg-brand-600 px-2.5 py-1 text-xs font-bold text-white">
          DEV ONLY
        </span>
      </div>

      <p className="text-sm text-slate-300">
        Click a scenario to overwrite local storage and reload the app in that state.
      </p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {getScenarioNames().map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => handleSeed(name)}
            className="group flex min-h-touch items-center rounded-xl border border-slate-700 bg-slate-800/60 px-4 text-left transition-all duration-200 hover:border-brand-500 hover:bg-slate-800 active:scale-[0.98]"
          >
            <span className="font-semibold text-slate-200 group-hover:text-white">
              {getScenarioLabel(name)}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="group flex min-h-touch items-center justify-center gap-2 rounded-xl bg-slate-700 px-4 py-3 text-lg font-semibold text-white transition-all duration-200 hover:bg-slate-600 active:scale-[0.98]"
        >
          <Copy size={20} />
          <span>{copied ? 'Copied to clipboard' : 'Copy current localStorage state'}</span>
        </button>
        <button
          type="button"
          onClick={clearStoredState}
          className="flex min-h-touch items-center justify-center gap-2 rounded-xl border-2 border-state-danger px-4 py-3 text-lg font-semibold text-state-danger transition-all duration-200 hover:bg-state-danger/10 active:scale-[0.98]"
        >
          <RotateCcw size={20} />
          <span>Clear storage and reload</span>
        </button>
      </div>
    </div>
  );
}
