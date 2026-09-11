"use client";

import { useEffect, useRef } from "react";
import { ExternalLink, X } from "lucide-react";
import { AdminNavLinks } from "@/components/admin/AdminNavLinks";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { cn } from "@/lib/utils";

type AdminMobileDrawerProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Mobilde sidebar'ın yerini alan slide-over. Davranış (ESC ile kapanma,
 * body scroll kilidi, focus trap, backdrop click) public sitedeki
 * `MobileNav` ile bilinçli olarak birebir aynı desende — bu proje için
 * zaten kanıtlanmış erişilebilirlik mantığını tekrar icat etmiyoruz.
 */
export function AdminMobileDrawer({ open, onClose }: AdminMobileDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
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
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-secondary/50 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Yönetim navigasyonu"
        className={cn(
          "absolute inset-y-0 left-0 flex w-full max-w-xs flex-col bg-secondary shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <div className="flex flex-col gap-0.5">
            <span className="font-display text-lg text-white">
              Stüdyo <span className="text-accent italic">Zorbey</span>
            </span>
            <span className="text-xs font-medium tracking-[0.08em] text-white/45 uppercase">
              Yönetim Paneli
            </span>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Menüyü kapat"
            className="flex size-10 items-center justify-center text-white/70 hover:text-white"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          <AdminNavLinks onNavigate={onClose} />
        </div>

        <div className="flex flex-col gap-1 border-t border-white/10 px-3 py-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/65 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="size-4 shrink-0" aria-hidden />
            Siteyi Görüntüle
          </a>
          <LogoutButton variant="sidebar" />
        </div>
      </div>
    </div>
  );
}
