import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Tables } from "@/types/database";

export type PublicBlogPost = Tables<"blog_posts"> & { categoryName: string | null };

async function attachCategoryNames(
  posts: Tables<"blog_posts">[],
): Promise<PublicBlogPost[]> {
  if (posts.length === 0) return [];

  const supabase = createPublicClient();
  const categoryIds = [
    ...new Set(posts.map((p) => p.category_id).filter((id): id is string => Boolean(id))),
  ];

  const categoryNames = new Map<string, string>();
  if (categoryIds.length > 0) {
    const { data: categories } = await supabase
      .from("blog_categories")
      .select("id, name")
      .in("id", categoryIds);
    for (const category of categories ?? []) {
      categoryNames.set(category.id, category.name);
    }
  }

  return posts.map((post) => ({
    ...post,
    categoryName: post.category_id ? (categoryNames.get(post.category_id) ?? null) : null,
  }));
}

function orderByPublishedThenCreated<T extends { published_at: string | null; created_at: string }>(
  posts: T[],
): T[] {
  return [...posts].sort((a, b) => {
    const dateA = a.published_at ?? a.created_at;
    const dateB = b.published_at ?? b.created_at;
    return dateB.localeCompare(dateA);
  });
}

/** `/blog` — yalnızca yayınlanmış yazılar, en yeni önce. */
export const getPublishedBlogPosts = cache(async (): Promise<PublicBlogPost[]> => {
  const supabase = createPublicClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("status", "published");
  return orderByPublishedThenCreated(await attachCategoryNames(data ?? []));
});

/** Ana sayfa "Rehber ve İlham" — en yeni yayınlanmış N yazı. */
export const getFeaturedBlogPosts = cache(async (limit = 3): Promise<PublicBlogPost[]> => {
  const posts = await getPublishedBlogPosts();
  return posts.slice(0, limit);
});

export const getBlogPostBySlug = cache(async (slug: string): Promise<PublicBlogPost | null> => {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (!data) return null;
  const [withCategory] = await attachCategoryNames([data]);
  return withCategory;
});

/** Aynı kategoriden, mevcut yazı hariç en fazla `limit` ilgili yazı. */
export const getRelatedBlogPosts = cache(
  async (post: PublicBlogPost, limit = 2): Promise<PublicBlogPost[]> => {
    if (!post.category_id) return [];
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .eq("category_id", post.category_id)
      .neq("id", post.id)
      .limit(limit);
    return orderByPublishedThenCreated(await attachCategoryNames(data ?? []));
  },
);

/**
 * Serbest metin `content` sütununu editoryal paragraflara böler (bkz.
 * `splitParagraphs` in `@/lib/data/services.ts` — aynı mantık, blog_posts
 * şemasında da tek `text` kolonu var, ayrı başlık/alıntı blok tipi yok).
 */
export function splitBlogParagraphs(text: string | null): string[] {
  if (!text) return [];
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0);
}
