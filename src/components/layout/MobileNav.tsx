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
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobil navigasyon"
        className={cn(
          "absolute inset-x-0 top-0 flex h-dvh min-h-dvh w-full flex-col overflow-y-auto bg-white px-6 pt-6 pb-8 text-foreground shadow-2xl transition-transform duration-300 ease-out",
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
            className="flex size-11 items-center justify-center text-foreground transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
              className="border-b border-border py-4 font-display text-2xl text-foreground transition-colors first:pt-0 hover:text-accent focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
