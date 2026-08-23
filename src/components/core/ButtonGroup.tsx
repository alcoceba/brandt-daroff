import type { ReactNode } from 'react';

interface ButtonGroupProps {
  title: string;
  children: ReactNode;
}

export function ButtonGroup({ title, children }: ButtonGroupProps) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{children}</div>
    </section>
  );
}
