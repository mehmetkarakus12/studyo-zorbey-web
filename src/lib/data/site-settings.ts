import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { SITE_SETTINGS_TEXT_KEYS } from "@/lib/admin/site-settings";
import { siteConfig } from "@/config/site";

export type PublicContactInfo = {
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  mapUrl: string | null;
  workingHours: { label: string; value: string }[];
};

export type PublicSocialLinks = {
  instagramUrl: string | null;
  whatsappUrl: string | null;
};

export type PublicHeroContent = {
  title: string | null;
  subtitle: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
};

export type PublicSiteSettings = {
  contactInfo: PublicContactInfo;
  social: PublicSocialLinks;
  footerText: string | null;
  hero: PublicHeroContent;
};

const WORKING_HOURS_LABELS: Record<string, string> = {
  mon: "Pazartesi",
  tue: "Salı",
  wed: "Çarşamba",
  thu: "Perşembe",
  fri: "Cuma",
  sat: "Cumartesi",
  sun: "Pazar",
};
const WORKING_HOURS_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

/**
 * WhatsApp numarasını `wa.me` derin bağlantısına çevirir. Kullanıcı admin
 * panelinde sadece rakam (ör. "905XXXXXXXXX") ya da yaygın ayraçlarla
 * ("+90 5XX ...") girebilir — burada rakam dışı her şey ayıklanır, boşsa
 * `null` döner (bozuk link üretilmez).
 */
function toWhatsAppUrl(raw: string | null): string | null {
  if (!raw) return null;
  const digits = raw.replace(/[^0-9]/g, "");
  return digits.length > 0 ? `https://wa.me/${digits}` : null;
}

/**
 * `maps_embed` alanı yalnızca `http(s)://` ile başlayan bir bağlantıysa
 * kullanılır — serbest metin/boş değer güvenli şekilde `null`'a düşer,
 * bozuk/`javascript:` gibi güvensiz bir URL asla render edilmez.
 */
function toSafeUrl(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? raw : null;
  } catch {
    return null;
  }
}

/**
 * Tüm public bileşenler (Header/Footer, ContactPreview, InstagramPreview,
 * Hero, /iletisim, form sayfaları) AYNI kaynağı kullanır — `cache()`
 * sayesinde aynı istek içinde kaç yerden çağrılırsa çağrılsın veritabanına
 * yalnızca bir kez gidilir (React request memoization).
 */
export const getSiteSettings = cache(async (): Promise<PublicSiteSettings> => {
  const supabase = createPublicClient();
  const { data: rows } = await supabase
    .from("site_settings")
    .select("*")
    .in("key", [...SITE_SETTINGS_TEXT_KEYS, "working_hours"]);

  const values: Record<string, string> = {};
  let workingHoursRaw: Record<string, string> = {};

  for (const row of rows ?? []) {
    if (row.key === "working_hours") {
      workingHoursRaw = (row.value as Record<string, string>) ?? {};
    } else if (typeof row.value === "string" && row.value.trim().length > 0) {
      values[row.key] = row.value.trim();
    }
  }

  const workingHours = WORKING_HOURS_ORDER.filter((day) => workingHoursRaw[day]).map(
    (day) => ({ label: WORKING_HOURS_LABELS[day], value: workingHoursRaw[day] }),
  );

  return {
    contactInfo: {
      phone: values.phone ?? null,
      whatsapp: values.whatsapp ?? null,
      email: values.email ?? null,
      address: values.address ?? null,
      mapUrl: toSafeUrl(values.maps_embed ?? null),
      workingHours,
    },
    social: {
      instagramUrl: toSafeUrl(values.instagram_url ?? null),
      whatsappUrl: toWhatsAppUrl(values.whatsapp ?? null),
    },
    footerText: values.footer_text ?? siteConfig.description,
    hero: {
      title: values.hero_title ?? null,
      subtitle: values.hero_subtitle ?? null,
      ctaLabel: values.hero_cta_label ?? null,
      ctaHref: values.hero_cta_href ?? null,
    },
  };
});
