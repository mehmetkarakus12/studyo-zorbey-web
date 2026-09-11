"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Genel amaçlı onay diyaloğu — `window.confirm()` KULLANILMAZ (bloklayıcı
 * native dialog'lar bu ortamda yasak). Davranış (ESC, backdrop, focus
 * trap, body scroll kilidi) `AdminMobileDrawer` ile aynı kanıtlanmış
 * desendedir. Güvenlik için varsayılan odak, yanlışlıkla Enter'a
 * basılınca yıkıcı işlemi TETİKLEMEYECEK "Vazgeç" butonundadır.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Onayla",
  cancelLabel = "Vazgeç",
  destructive = false,
  pending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    // Güvenlik için varsayılan odak "Vazgeç" butonundadır (panelde ilk
    // sırada render edilir) — yanlışlıkla Enter'a basmak yıkıcı işlemi
    // tetiklemesin diye. `Button` bir forwardRef bileşeni olmadığından
    // doğrudan ref yerine DOM sorgusu kullanılır.
    panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        "button:not([disabled])",
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div
        onClick={pending ? undefined : onCancel}
        aria-hidden
        className="absolute inset-0 bg-secondary/50 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="relative flex w-full max-w-sm flex-col gap-5 border border-border bg-surface p-6 shadow-2xl"
      >
        <div className="flex flex-col gap-2">
          <h2 id="confirm-dialog-title" className="font-display text-xl">
            {title}
          </h2>
          <p
            id="confirm-dialog-description"
            className="text-sm leading-relaxed text-muted-foreground"
          >
            {description}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={pending}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={destructive ? "primary" : "outline"}
            onClick={onConfirm}
            loading={pending}
            className={cn(
              destructive && "bg-red-700 hover:bg-red-800 text-white",
            )}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
