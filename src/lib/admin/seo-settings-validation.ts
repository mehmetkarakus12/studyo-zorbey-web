export type SeoSettingFormValues = {
  page_key: string;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
};

export type SeoSettingFieldErrors = Partial<Record<"page_key", string>>;

function optionalText(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

/**
 * `seo_settings` şemasıyla birebir eşleşir (bkz.
 * supabase/migrations/20260910120900_site_and_seo_settings.sql).
 * `page_key` ör. "home", "hizmetler", "portfolyo/dugun-fotografcisi" gibi
 * serbest metin bir tanımlayıcıdır — slug kısıtı YOKTUR, sadece boş
 * olamaz ve tekil olmalıdır (tekillik DB `unique` kısıtına bırakılır).
 */
export function parseSeoSettingFormData(formData: FormData): {
  values: SeoSettingFormValues;
  errors: SeoSettingFieldErrors;
} {
  const pageKey = String(formData.get("page_key") ?? "").trim();

  const errors: SeoSettingFieldErrors = {};

  if (!pageKey) {
    errors.page_key = "Sayfa anahtarı boş olamaz.";
  }

  return {
    values: {
      page_key: pageKey,
      meta_title: optionalText(formData.get("meta_title")),
      meta_description: optionalText(formData.get("meta_description")),
      canonical_url: optionalText(formData.get("canonical_url")),
      og_title: optionalText(formData.get("og_title")),
      og_description: optionalText(formData.get("og_description")),
      og_image_url: optionalText(formData.get("og_image_url")),
    },
    errors,
  };
}
