import React from 'react';
import { useTranslation } from 'react-i18next';
import { Github } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="mx-auto flex h-dvh w-full max-w-[700px] flex-col overflow-y-auto border-x border-slate-800 bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl">
      <main className="flex flex-1 flex-col">
        <div className="flex min-h-full flex-col">{children}</div>
      </main>
      <GlobalFooter />
    </div>
  );
}

function GlobalFooter() {
  const { t } = useTranslation();
  return (
    <footer className="shrink-0 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-slate-800 px-5 py-3 text-center text-xs text-slate-500 sm:justify-between">
      <span>
        {t('footer.copyright', { year: new Date().getFullYear() })} — {t('footer.privacyNote')}
      </span>
      <a
        href="https://github.com/alcoceba/brandt-daroff"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-slate-400 transition-colors hover:text-white"
        title={t('footer.github')}
      >
        <Github size={14} />
        {t('footer.github')}
      </a>
    </footer>
  );
}
