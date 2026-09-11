import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdminNavLinks } from "@/components/admin/AdminNavLinks";
import { LogoutButton } from "@/components/admin/LogoutButton";

/**
 * Yalnızca masaüstünde görünür (`hidden lg:flex`) sabit/sticky sidebar.
 * Mobilde aynı navigasyon `AdminMobileDrawer` üzerinden gösterilir — ikisi
 * de aynı `AdminNavLinks` bileşenini paylaşır, kopya yoktur.
 */
export function AdminSidebar() {
  return (
    <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col bg-secondary lg:flex">
      <div className="flex flex-col gap-0.5 px-5 py-6">
        <span className="font-display text-lg text-white">
          Stüdyo <span className="text-accent italic">Zorbey</span>
        </span>
        <span className="text-xs font-medium tracking-[0.08em] text-white/45 uppercase">
          Yönetim Paneli
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        <AdminNavLinks />
      </div>

      <div className="flex flex-col gap-1 border-t border-white/10 px-3 py-4">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/65 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="size-4 shrink-0" aria-hidden />
          Siteyi Görüntüle
        </Link>
        <div className="px-3 pt-1">
          <LogoutButton variant="sidebar" />
        </div>
      </div>
    </aside>
  );
}
