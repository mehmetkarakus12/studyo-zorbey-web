import { cache } from "react";
import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase/public";
import { siteConfig } from "@/config/site";
import { defaultOgImage } from "@/lib/seo";
import type { Tables } from "@/types/database";

export const getSeoSettingByPageKey = cache(
  async (pageKey: string): Promise<Tables<"seo_settings"> | null> => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("seo_settings")
      .select("*")
      .eq("page_key", pageKey)
      .maybeSingle();
    return data ?? null;
  },
);

/**
 * Serbest metin `canonical_url` alanı SADECE aynı origin'e ait, iyi
 * biçimli bir değerse kullanılır — aksi halde (boş, yazım hatası, farklı
 * domain) sessizce yok sayılır ve sayfanın kendi gerçek `path`'inden
 * türetilen canonical'a düşülür. Bu, "Canonical yanlış oluşmasın"
 * kuralının uygulanma şeklidir: DB'deki serbest metne körü körüne
 * güvenilmez.
 */
function resolveCanonical(path: string, dbValue: string | null): string {
  if (dbValue) {
    if (dbValue.startsWith("/")) return dbValue;
    if (dbValue.startsWith(siteConfig.url)) return dbValue.slice(siteConfig.url.length) || "/";
  }
  return path;
}

type PageMetadataInput = {
  pageKey: string;
  path: string;
  fallbackTitle: string;
  fallbackDescription: string;
  /** Sayfanın kendi gerçek görseli (ör. proje kapak görseli) — seo_settings'te og_image_url yoksa buna düşülür. */
  fallbackImage?: string | null;
  type?: "website" | "article";
};

/**
 * Sayfa metadata'sı için 3 katmanlı fallback zinciri kurar:
 *   1) sayfaya özel `seo_settings` kaydı (varsa)
 *   2) domain içerik alanları (ör. hizmetin kendi title/description'ı — `fallbackTitle`/`fallbackDescription` olarak verilir)
 *   3) güvenli varsayılan (`defaultOgImage`)
 * Public site bu ayarları Faz 2'nin bu paketinde admin tarafında
 * yönetilebilir hale getirir; sahte/uydurma OG görseli asla üretilmez.
 */
export async function buildPageMetadata({
  pageKey,
  path,
  fallbackTitle,
  fallbackDescription,
  fallbackImage,
  type = "website",
}: PageMetadataInput): Promise<Metadata> {
  const seo = await getSeoSettingByPageKey(pageKey);

  const title = seo?.meta_title || fallbackTitle;
  const description = seo?.meta_description || fallbackDescription;
  const ogTitle = seo?.og_title || title;
  const ogDescription = seo?.og_description || description;
  const ogImageUrl = seo?.og_image_url || fallbackImage || null;
  const canonical = resolveCanonical(path, seo?.canonical_url ?? null);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type,
      title: ogTitle,
      description: ogDescription,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [defaultOgImage],
    },
  };
}
