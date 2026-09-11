import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Camera,
  Images,
  Video,
  Newspaper,
  CalendarCheck,
  ClipboardList,
  Mail,
  Star,
  FolderOpen,
  Search,
  Settings,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type AdminNavGroup = {
  /** Grup başlığı yoksa (ör. "Genel Bakış") tek bir üst-seviye link olarak gösterilir. */
  label?: string;
  items: AdminNavItem[];
};

/**
 * Sidebar (desktop) ve mobil drawer arasında paylaşılan tek nav kaynağı.
 * Sayfa başlıkları (AdminTopbar) da buradaki `label` alanından türetilir —
 * başlık iki yerde ayrı ayrı hard-code edilmez.
 */
export const adminNavGroups: AdminNavGroup[] = [
  {
    items: [{ label: "Genel Bakış", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "İçerik Yönetimi",
    items: [
      { label: "Hizmetler", href: "/admin/hizmetler", icon: Camera },
      { label: "Portfolyo", href: "/admin/portfolyo", icon: Images },
      { label: "Videolar", href: "/admin/videolar", icon: Video },
      { label: "Blog", href: "/admin/blog", icon: Newspaper },
    ],
  },
  {
    label: "Müşteri Talepleri",
    items: [
      { label: "Randevular", href: "/admin/randevular", icon: CalendarCheck },
      { label: "Teklif Talepleri", href: "/admin/teklifler", icon: ClipboardList },
      { label: "İletişim Mesajları", href: "/admin/mesajlar", icon: Mail },
    ],
  },
  {
    label: "Site Yönetimi",
    items: [
      { label: "Yorumlar", href: "/admin/yorumlar", icon: Star },
      { label: "Medya", href: "/admin/medya", icon: FolderOpen },
      { label: "SEO", href: "/admin/seo", icon: Search },
      { label: "Site Ayarları", href: "/admin/ayarlar", icon: Settings },
    ],
  },
];

/** Tüm nav öğelerinin düz listesi — aktif sayfa başlığını bulmak için. */
export const adminNavItemsFlat: AdminNavItem[] = adminNavGroups.flatMap(
  (group) => group.items,
);
