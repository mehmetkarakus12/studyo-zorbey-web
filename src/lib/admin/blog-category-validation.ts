import { SLUG_PATTERN } from "@/lib/admin/service-validation";

export type BlogCategoryFormValues = {
  name: string;
  slug: string;
};

export type BlogCategoryFieldErrors = Partial<Record<"name" | "slug", string>>;

/**
 * `blog_categories` şemasıyla birebir eşleşir (bkz.
 * supabase/migrations/20260910120600_blog.sql) — bu tabloda SADECE
 * `id`/`name`/`slug`/`created_at` var; `is_active`, `sort_order` ve
 * `description` YOK (portfolio_categories'ten farklı olarak). Var
 * olmayan kolonlar burada tahmin edilerek eklenmedi. `SLUG_PATTERN`
 * Faz 2.4.1'deki `service-validation.ts`'ten paylaşılır.
 */
export function parseBlogCategoryFormData(formData: FormData): {
  values: BlogCategoryFormValues;
  errors: BlogCategoryFieldErrors;
} {
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();

  const errors: BlogCategoryFieldErrors = {};

  if (!name) {
    errors.name = "Kategori adı boş olamaz.";
  }

  if (!slug) {
    errors.slug = "Slug boş olamaz.";
  } else if (!SLUG_PATTERN.test(slug)) {
    errors.slug =
      "Slug yalnızca küçük harf, rakam ve tire (-) içerebilir (ör. rehber).";
  }

  return {
    values: { name, slug },
    errors,
  };
}
