"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { Button } from "@/components/ui/Button";
import { mainNav, ctaLabels } from "@/config/site";
import { cn } from "@/lib/utils";

type SocialLinkItem = {
  label: string;
  href: string | null;
  icon: "instagram" | "whatsapp";
};

type MobileNavProps = {
  open: boolean;
  socialLinks: SocialLinkItem[];
  onClose: () => void;
};

export function MobileNav({ open, socialLinks, onClose }: MobileNavProps) {
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
        aria-label="Mobil navigasyon"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-surface px-6 pt-6 pb-8 shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <Logo size="sm" />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Menüyü kapat"
            className="flex size-11 items-center justify-center text-foreground"
          >
            <X className="size-6" aria-hidden />
          </button>
        </div>

        <nav aria-label="Mobil navigasyon" className="mt-10 flex flex-col">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="border-b border-border py-4 font-display text-2xl text-foreground first:pt-0"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex flex-col gap-3">
          <Button href="/randevu-al" onClick={onClose}>
            {ctaLabels.bookAppointment}
          </Button>
          <Button href="/teklif-al" variant="outline" onClick={onClose}>
            {ctaLabels.requestQuote}
          </Button>
        </div>

        <SocialLinks links={socialLinks} tone="light" className="mt-auto pt-8" />
      </div>
    </div>
  );
}
