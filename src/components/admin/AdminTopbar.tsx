"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { adminNavItemsFlat } from "@/config/admin-nav";
import { AdminMobileDrawer } from "@/components/admin/AdminMobileDrawer";
import { UserAvatar } from "@/components/admin/UserAvatar";

type AdminTopbarProps = {
  displayName: string;
  email: string;
  roleLabel: string;
};

export function AdminTopbar({ displayName, email, roleLabel }: AdminTopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const pageTitle =
    adminNavItemsFlat.find(
      (item) =>
        item.href === pathname ||
        (item.href !== "/admin" && pathname.startsWith(`${item.href}/`)),
    )?.label ?? "Yönetim Paneli";

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-border bg-surface/95 px-4 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Menüyü aç"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            className="flex size-9 items-center justify-center text-foreground lg:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>
          <h2 className="font-display text-lg leading-none sm:text-xl">
            {pageTitle}
          </h2>
        </div>

        <div className="flex min-w-0 items-center gap-3">
          <div
            className="hidden min-w-0 flex-col items-end sm:flex"
            title={email}
          >
            <span className="truncate text-sm font-medium text-foreground">
              {displayName}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {roleLabel}
            </span>
          </div>
          <UserAvatar name={displayName} />
        </div>
      </header>

      <AdminMobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
