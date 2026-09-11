import { SLUG_PATTERN } from "@/lib/admin/service-validation";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const BLOG_POST_STATUSES = ["draft", "published"] as const;
export type BlogPostStatus = (typeof BLOG_POST_STATUSES)[number];

export type BlogPostFormValues = {
  category_id: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  status: BlogPostStatus;
  is_featured: boolean;
};

export type BlogPostFieldErrors = Partial<
  Record<"title" | "slug" | "category_id" | "status" | "published_at", string>
>;

function optionalText(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

/**
 * `blog_posts` şemasıyla birebir eşleşir (bkz.
 * supabase/migrations/20260910120600_blog.sql). `category_id` şemada
 * NULLABLE ve BİLİNÇLİ olarak uygulama katmanında da OPSİYONEL bırakıldı
 * — portfolio_projects'in aksine (migration yorumunda açıklandığı gibi,
 * blog kategorileri URL yapısının zorunlu bir parçası değil, bir kategori
 * silinirse yazılar ON DELETE SET NULL ile "kategorisiz" kalabilir).
 * `status` DB'de serbest `text` ama CHECK kısıtı 'draft'/'published' ile
 * sınırlıyor — burada aynı iki değerle doğrulanır.
 */
export function parseBlogPostFormData(formData: FormData): {
  values: BlogPostFormValues;
  errors: BlogPostFieldErrors;
} {
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "").trim();
  const publishedAtRaw = String(formData.get("published_at") ?? "").trim();

  const errors: BlogPostFieldErrors = {};

  if (!title) {
    errors.title = "Başlık boş olamaz.";
  }

  if (!slug) {
    errors.slug = "Slug boş olamaz.";
  } else if (!SLUG_PATTERN.test(slug)) {
    errors.slug =
      "Slug yalnızca küçük harf, rakam ve tire (-) içerebilir (ör. dugun-hazirlik-rehberi).";
  }

  if (categoryId && !UUID_PATTERN.test(categoryId)) {
    errors.category_id = "Geçersiz kategori.";
  }

  let status: BlogPostStatus = "draft";
  if (!BLOG_POST_STATUSES.includes(statusRaw as BlogPostStatus)) {
    errors.status = "Geçerli bir yayın durumu seçmelisiniz.";
  } else {
    status = statusRaw as BlogPostStatus;
  }

  let publishedAt: string | null = null;
  if (publishedAtRaw) {
    const parsed = new Date(publishedAtRaw);
    if (Number.isNaN(parsed.getTime())) {
      errors.published_at = "Geçerli bir yayın tarihi girmelisiniz.";
    } else {
      publishedAt = parsed.toISOString();
    }
  }

  return {
    values: {
      category_id: categoryId || null,
      title,
      slug,
      excerpt: optionalText(formData.get("excerpt")),
      content: optionalText(formData.get("content")),
      cover_image_url: optionalText(formData.get("cover_image_url")),
      seo_title: optionalText(formData.get("seo_title")),
      seo_description: optionalText(formData.get("seo_description")),
      published_at: publishedAt,
      status,
      is_featured: formData.get("is_featured") === "on",
    },
    errors,
  };
}
