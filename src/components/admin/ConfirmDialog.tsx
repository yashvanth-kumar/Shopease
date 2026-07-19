"use client";

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  danger = false,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-sm animate-scaleIn rounded-xl2 bg-white p-6 shadow-popover">
        <h2 className="font-display text-lg font-bold text-ink-900">{title}</h2>
        <p className="mt-2 text-sm text-ink-600">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className={danger ? "btn-danger" : "btn-primary"}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
