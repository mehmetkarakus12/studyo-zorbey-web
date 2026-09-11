import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Tables } from "@/types/database";

export type PublicTestimonial = Tables<"testimonials">;

/** Ana sayfa "Çiftlerimiz Ne Diyor?" — aktif yorumlar, öne çıkanlar önce, sonra sort_order. */
export const getActiveTestimonials = cache(async (limit = 6): Promise<PublicTestimonial[]> => {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(limit);
  return data ?? [];
});
