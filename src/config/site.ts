import type { NavItem } from "@/types";

/**
 * `url`: Sitenin canonical production domain'i. Gerçek production domain
 * kesinleşene kadar tek merkezi yer burasıdır — metadataBase, sitemap,
 * robots.txt ve JSON-LD içindeki mutlak URL'lerin hepsi buradan türetilir.
 * Domain değiştiğinde tek satır güncellenir.
 */
export const siteConfig = {
  url: "https://www.studyozorbey.com",
  brandName: "Stüdyo Zorbey",
  brandShort: "Zorbey",
  positioning: "Manisa'da profesyonel fotoğraf ve video stüdyosu",
  tagline: "Hikâyenizi zamansız bir şekilde anlatıyoruz.",
  description:
    "Stüdyo Zorbey; Manisa ve çevresinde düğün, nişan, kına, dış çekim, stüdyo, video ve drone çekimi hizmeti veren premium bir fotoğraf ve video stüdyosudur.",
} as const;

/**
 * NOT: "Videolar" öğesi Faz 1.7'den kalan, hiçbir zaman bir sayfası
 * yapılmamış geçici bir navigation linkiydi (dead link) — Faz 1.8-1.12
 * kontrolünde kaldırıldı. Video içeriği artık gerçek bir hizmet sayfası
 * olan /hizmetler/video-cekimi üzerinden erişilebilir (bkz. CinematicVideo).
 */
export const mainNav: NavItem[] = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hizmetler", href: "/hizmetler" },
  { label: "Portfolyo", href: "/portfolyo" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "/iletisim" },
];

export const footerNav = {
  services: [
    { label: "Düğün Çekimi", href: "/hizmetler/dugun-fotografcisi" },
    { label: "Nişan Çekimi", href: "/hizmetler/nisan-cekimi" },
    { label: "Kına Çekimi", href: "/hizmetler/kina-cekimi" },
    { label: "Dış Çekim", href: "/hizmetler/dis-cekim" },
    { label: "Stüdyo Çekimi", href: "/hizmetler/studyo-cekimi" },
    { label: "Video Çekimi", href: "/hizmetler/video-cekimi" },
  ] satisfies NavItem[],
  studio: [
    { label: "Hizmetler", href: "/hizmetler" },
    { label: "Portfolyo", href: "/portfolyo" },
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "Blog", href: "/blog" },
    { label: "İletişim", href: "/iletisim" },
    { label: "Randevu Al", href: "/randevu-al" },
    { label: "Teklif Al", href: "/teklif-al" },
  ] satisfies NavItem[],
  legal: [
    { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
    { label: "Çerez Politikası", href: "/cerez-politikasi" },
    { label: "KVKK Aydınlatma Metni", href: "/kvkk" },
  ] satisfies NavItem[],
};

export const ctaLabels = {
  bookAppointment: "Randevu Al",
  requestQuote: "Teklif Al",
  viewPortfolio: "Portfolyoyu İncele",
  viewAllServices: "Tüm Hizmetleri Gör",
  viewAllPortfolio: "Tüm Portfolyoyu Gör",
  readMore: "Devamını Oku",
  readArticle: "Yazıyı Oku",
  getInTouch: "Bize Ulaşın",
} as const;

/**
 * NOT: İletişim bilgileri (telefon, e-posta, adres, WhatsApp, Instagram,
 * harita, çalışma saatleri) artık burada DEĞİL — admin panelden yönetilen
 * `site_settings` tablosundan `@/lib/data/site-settings`'teki
 * `getSiteSettings()` ile okunur (Faz 2 Paket 2). Bu, tek kaynak
 * (single source of truth) ilkesini korur; burada ikinci bir statik
 * kopya tutulmaz.
 */
