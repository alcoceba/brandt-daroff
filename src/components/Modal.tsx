import { memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  single?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = memo(function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel,
  danger = false,
  single = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !single) onCancel();
    },
    [onCancel, single],
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, handleKey]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onClick={single ? undefined : onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="text-lg font-bold text-white">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-300">{body}</p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className={`min-h-touch rounded-xl font-bold text-white ${danger ? 'bg-state-danger' : 'bg-brand-600'}`}
          >
            {confirmLabel ?? t('common.confirm')}
          </button>
          {!single && (
            <button
              type="button"
              onClick={onCancel}
              className="min-h-touch rounded-xl border border-slate-700 font-semibold text-slate-200"
            >
              {cancelLabel ?? t('common.cancel')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
