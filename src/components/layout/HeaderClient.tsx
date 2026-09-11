"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { mainNav, ctaLabels } from "@/config/site";
import { cn } from "@/lib/utils";

type SocialLinkItem = {
  label: string;
  href: string | null;
  icon: "instagram" | "whatsapp";
};

type HeaderClientProps = {
  socialLinks: SocialLinkItem[];
};

export function HeaderClient({ socialLinks }: HeaderClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,padding] duration-500 ease-out",
        solid
          ? "border-b border-border bg-surface/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container>
        <div
          className={cn(
            "flex items-center justify-between transition-[height] duration-500 ease-out",
            solid ? "h-18" : "h-24",
          )}
        >
          <Link
            href="/"
            aria-label="Stüdyo Zorbey — Ana Sayfa"
            className="shrink-0"
          >
            <Logo size={solid ? "sm" : "md"} tone={solid ? "dark" : "light"} />
          </Link>

          <nav
            aria-label="Ana navigasyon"
            className="hidden items-center gap-9 lg:flex"
          >
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative py-1 text-[0.8rem] font-medium tracking-[0.02em] transition-colors",
                  solid
                    ? "text-foreground/80 hover:text-foreground"
                    : "text-white/85 hover:text-white",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100",
                    solid ? "bg-accent" : "bg-white",
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              href="/randevu-al"
              size="sm"
              variant={solid ? "primary" : "outline-inverse"}
              className="hidden sm:inline-flex"
            >
              {ctaLabels.bookAppointment}
            </Button>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Menüyü aç"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              className={cn(
                "flex size-11 items-center justify-center transition-colors lg:hidden",
                solid ? "text-foreground" : "text-white",
              )}
            >
              <Menu className="size-6" aria-hidden />
            </button>
          </div>
        </div>
      </Container>

      <MobileNav
        open={menuOpen}
        socialLinks={socialLinks}
        onClose={() => {
          setMenuOpen(false);
          menuButtonRef.current?.focus();
        }}
      />
    </header>
  );
}
