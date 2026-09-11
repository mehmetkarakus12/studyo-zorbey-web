"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavGroups } from "@/config/admin-nav";
import { cn } from "@/lib/utils";

type AdminNavLinksProps = {
  /** Mobil drawer'da bir linke tıklanınca drawer'ı kapatmak için. */
  onNavigate?: () => void;
  className?: string;
};

/**
 * Desktop sidebar VE mobil drawer arasında paylaşılan tek nav listesi.
 * Aktif route, `usePathname()` ile belirlenir — bu yüzden client component
 * olmak zorunda (sunucu bir layout/sayfa isteğin path'ini bu şekilde
 * bilemez).
 */
export function AdminNavLinks({ onNavigate, className }: AdminNavLinksProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Yönetim navigasyonu" className={cn("flex flex-col gap-6", className)}>
      {adminNavGroups.map((group, index) => (
        <div key={group.label ?? `group-${index}`} className="flex flex-col gap-1">
          {group.label && (
            <h3 className="px-3 pb-2 text-[0.68rem] font-semibold tracking-[0.14em] text-white/40 uppercase">
              {group.label}
            </h3>
          )}
          {group.items.map((item) => {
            // "/admin" için tam eşleşme, diğerleri için prefix eşleşmesi
            // (ör. /admin/hizmetler altındaki gelecekteki alt sayfalar da
            // aktif görünsün diye).
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/65 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
