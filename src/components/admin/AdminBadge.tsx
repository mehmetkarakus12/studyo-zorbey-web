import { cn } from "@/lib/utils";

type AdminBadgeTone = "neutral" | "accent" | "warning" | "success" | "danger";

const toneClasses: Record<AdminBadgeTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  accent: "bg-accent/15 text-accent",
  warning: "bg-amber-100 text-amber-800",
  success: "bg-emerald-100 text-emerald-800",
  danger: "bg-red-100 text-red-800",
};

/**
 * Admin paneline özel, düz (solid) durum rozeti — public sitedeki `Badge`
 * (border + backdrop-blur, görsel üzerine bindirmek için tasarlandı) ile
 * karıştırılmamalı; burası tablo/liste satırlarında durum göstermek için.
 * NOT: Bu sadece görsel bir etikettir, yetkilendirme mekanizması değildir.
 */
export function AdminBadge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: AdminBadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
