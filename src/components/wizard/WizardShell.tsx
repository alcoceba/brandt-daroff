import { memo } from 'react';

interface WizardShellProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  action?: React.ReactNode;
  wide?: boolean;
}

export const WizardShell = memo(function WizardShell({ children, footer, action, wide = false }: WizardShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-[700px] flex-1 flex-col gap-6 px-3 py-6 sm:px-6">
      <div className={`mx-auto flex w-full flex-1 flex-col gap-6 ${wide ? 'max-w-[700px]' : 'max-w-[480px]'}`}>
        {children}
      </div>
      {(action || footer) && (
        <div className="mx-auto flex w-full max-w-[480px] shrink-0 flex-col gap-3">
          {action}
          {footer}
        </div>
      )}
    </div>
  );
});
