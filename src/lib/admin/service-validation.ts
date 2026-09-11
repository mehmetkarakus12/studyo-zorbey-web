export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type ServiceFormValues = {
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
};

export type ServiceFieldErrors = Partial<
  Record<"title" | "slug" | "sort_order", string>
>;

function optionalText(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

/**
 * `services` tablosunun gerçek şemasıyla birebir eşleşir (bkz.
 * supabase/migrations/20260910120300_services.sql). Hem `ServiceForm`
 * (client — hızlı geri bildirim) hem Server Action'lar (server — asıl,
 * yetkili doğrulama) tarafından kullanılır; tek kaynak.
 */
export function parseServiceFormData(formData: FormData): {
  values: ServiceFormValues;
  errors: ServiceFieldErrors;
} {
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const sortOrderRaw = String(formData.get("sort_order") ?? "").trim();
  const sortOrderNumber = Number(sortOrderRaw);

  const errors: ServiceFieldErrors = {};

  if (!title) {
    errors.title = "Hizmet adı boş olamaz.";
  }

  if (!slug) {
    errors.slug = "Slug boş olamaz.";
  } else if (!SLUG_PATTERN.test(slug)) {
    errors.slug =
      "Slug yalnızca küçük harf, rakam ve tire (-) içerebilir (ör. dugun-fotografcisi).";
  }

  if (sortOrderRaw === "" || !Number.isInteger(sortOrderNumber) || sortOrderNumber < 0) {
    errors.sort_order = "Sıralama 0 veya daha büyük bir tam sayı olmalı.";
  }

  return {
    values: {
      title,
      slug,
      short_description: optionalText(formData.get("short_description")),
      description: optionalText(formData.get("description")),
      image_url: optionalText(formData.get("image_url")),
      is_active: formData.get("is_active") === "on",
      is_featured: formData.get("is_featured") === "on",
      sort_order: Number.isFinite(sortOrderNumber) ? sortOrderNumber : 0,
      seo_title: optionalText(formData.get("seo_title")),
      seo_description: optionalText(formData.get("seo_description")),
    },
    errors,
  };
}
