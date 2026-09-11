import { SLUG_PATTERN } from "@/lib/admin/service-validation";

export type PortfolioCategoryFormValues = {
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
};

export type PortfolioCategoryFieldErrors = Partial<
  Record<"name" | "slug" | "sort_order", string>
>;

function optionalText(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

/**
 * `portfolio_categories` şemasıyla birebir eşleşir (bkz.
 * supabase/migrations/20260910120400_portfolio.sql). `SLUG_PATTERN`
 * Faz 2.4.1'deki `service-validation.ts`'ten paylaşılır — ikinci bir kopya
 * oluşturulmadı.
 */
export function parsePortfolioCategoryFormData(formData: FormData): {
  values: PortfolioCategoryFormValues;
  errors: PortfolioCategoryFieldErrors;
} {
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const sortOrderRaw = String(formData.get("sort_order") ?? "").trim();
  const sortOrderNumber = Number(sortOrderRaw);

  const errors: PortfolioCategoryFieldErrors = {};

  if (!name) {
    errors.name = "Kategori adı boş olamaz.";
  }

  if (!slug) {
    errors.slug = "Slug boş olamaz.";
  } else if (!SLUG_PATTERN.test(slug)) {
    errors.slug =
      "Slug yalnızca küçük harf, rakam ve tire (-) içerebilir (ör. dugun).";
  }

  if (sortOrderRaw === "" || !Number.isInteger(sortOrderNumber) || sortOrderNumber < 0) {
    errors.sort_order = "Sıralama 0 veya daha büyük bir tam sayı olmalı.";
  }

  return {
    values: {
      name,
      slug,
      description: optionalText(formData.get("description")),
      is_active: formData.get("is_active") === "on",
      sort_order: Number.isFinite(sortOrderNumber) ? sortOrderNumber : 0,
    },
    errors,
  };
}
