import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Tables } from "@/types/database";

export type PublicVideo = Tables<"videos">;

/**
 * Ana sayfa "Hareket Halinde Bir Hikâye" bloğu için tek bir video seçer —
 * önce öne çıkan+aktif videolar arasından en son eklenen, hiç öne çıkan
 * yoksa aktif videolar arasından en son eklenen. Ayrı bir /videolar galeri
 * sayfası bu fazın kapsamında değildir (bkz. proje talimatları).
 */
export const getFeaturedActiveVideo = cache(async (): Promise<PublicVideo | null> => {
  const supabase = createPublicClient();

  const { data: featured } = await supabase
    .from("videos")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (featured) return featured;

  const { data: anyActive } = await supabase
    .from("videos")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  return anyActive ?? null;
});
