"use client";

import { useEffect, ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export function Modal({ open, onClose, title, footer, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-[2px] sm:items-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl ring-1 ring-black/5 sm:max-h-[90vh] sm:max-w-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-100 px-6 py-4">
            <div className="min-w-0 flex-1 text-lg font-black text-[#0a0f1e]">{title}</div>
            <button
              aria-label="Fechar"
              onClick={onClose}
              className="flex shrink-0 items-center justify-center rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</div>

        {footer && (
          <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-gray-100 bg-white px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
