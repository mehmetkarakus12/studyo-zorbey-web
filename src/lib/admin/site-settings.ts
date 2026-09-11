/**
 * `site_settings` bir key/value (jsonb) tablosudur (bkz.
 * supabase/migrations/20260910120900_site_and_seo_settings.sql) — yeni bir
 * ayar eklemek için migration gerekmez. Admin panelinde yönetilen anahtar
 * kümesi burada tek yerden tanımlanır; public site bu ayarları Faz 2'nin
 * sonraki bir paketinde okuyacak (bu pakette henüz okumuyor).
 */
export const SITE_SETTINGS_TEXT_KEYS = [
  "phone",
  "email",
  "whatsapp",
  "address",
  "instagram_url",
  "maps_embed",
  "footer_text",
  "hero_title",
  "hero_subtitle",
  "hero_cta_label",
  "hero_cta_href",
] as const;

export type SiteSettingsTextKey = (typeof SITE_SETTINGS_TEXT_KEYS)[number];

export const WORKING_HOURS_DAYS = [
  { key: "mon", label: "Pazartesi" },
  { key: "tue", label: "Salı" },
  { key: "wed", label: "Çarşamba" },
  { key: "thu", label: "Perşembe" },
  { key: "fri", label: "Cuma" },
  { key: "sat", label: "Cumartesi" },
  { key: "sun", label: "Pazar" },
] as const;

export type WorkingHours = Partial<Record<(typeof WORKING_HOURS_DAYS)[number]["key"], string>>;
