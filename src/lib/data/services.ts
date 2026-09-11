import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Tables } from "@/types/database";

export type PublicService = Tables<"services">;

/** `/hizmetler` ve ana sayfa için — yalnızca aktif hizmetler, sıralamaya göre. */
export const getActiveServices = cache(async (): Promise<PublicService[]> => {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
});

/** Ana sayfa "Öne Çıkan Hizmetlerimiz" — aktif + öne çıkan hizmetler. */
export const getFeaturedServices = cache(async (limit = 6): Promise<PublicService[]> => {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .limit(limit);
  return data ?? [];
});

/** Pasif hizmetler public'te asla görünmez — bulunamazsa (ya da pasifse) `null` döner. */
export const getServiceBySlug = cache(
  async (slug: string): Promise<PublicService | null> => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    return data ?? null;
  },
);

/**
 * Serbest metin `description` sütununu editoryal paragraflara böler —
 * boş satırla ayrılmış bloklar paragraf, tek satır atlamaları aynı
 * paragrafın içinde satır sonu olarak kalır. Şemada ayrı bir paragraf/blok
 * yapısı YOKTUR (tek `text` alanı) — burada uydurulmuyor, sadece admin
 * panelde girilen düz metin okunur şekilde render ediliyor.
 */
export function splitParagraphs(text: string | null): string[] {
  if (!text) return [];
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0);
}
