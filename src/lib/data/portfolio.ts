import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Tables } from "@/types/database";

export type PublicPortfolioCategory = Tables<"portfolio_categories">;
export type PublicPortfolioProject = Tables<"portfolio_projects"> & {
  categoryName: string | null;
};
export type PublicPortfolioImage = Tables<"portfolio_images">;

export const getActivePortfolioCategories = cache(
  async (): Promise<PublicPortfolioCategory[]> => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("portfolio_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    return data ?? [];
  },
);

async function attachCategoryNames(
  projects: Tables<"portfolio_projects">[],
): Promise<PublicPortfolioProject[]> {
  if (projects.length === 0) return [];

  const supabase = createPublicClient();
  const categoryIds = [
    ...new Set(projects.map((p) => p.category_id).filter((id): id is string => Boolean(id))),
  ];

  const categoryNames = new Map<string, string>();
  if (categoryIds.length > 0) {
    const { data: categories } = await supabase
      .from("portfolio_categories")
      .select("id, name")
      .in("id", categoryIds);
    for (const category of categories ?? []) {
      categoryNames.set(category.id, category.name);
    }
  }

  return projects.map((project) => ({
    ...project,
    categoryName: project.category_id ? (categoryNames.get(project.category_id) ?? null) : null,
  }));
}

/** `/portfolyo` — tüm aktif projeler, sıralamaya göre. */
export const getActivePortfolioProjects = cache(
  async (): Promise<PublicPortfolioProject[]> => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("portfolio_projects")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    return attachCategoryNames(data ?? []);
  },
);

/** Ana sayfa "Öne Çıkan Düğün Hikâyeleri" — aktif + öne çıkan projeler. */
export const getFeaturedPortfolioProjects = cache(
  async (limit = 6): Promise<PublicPortfolioProject[]> => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("portfolio_projects")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("sort_order", { ascending: true })
      .limit(limit);
    return attachCategoryNames(data ?? []);
  },
);

export const getPortfolioProjectBySlug = cache(
  async (slug: string): Promise<PublicPortfolioProject | null> => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("portfolio_projects")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    if (!data) return null;
    const [withCategory] = await attachCategoryNames([data]);
    return withCategory;
  },
);

/** Proje galerisi — `sort_order` ile sıralı, alt metinler `portfolio_images.alt_text`'ten. */
export const getPortfolioGalleryImages = cache(
  async (projectId: string): Promise<PublicPortfolioImage[]> => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("portfolio_images")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: true });
    return data ?? [];
  },
);
