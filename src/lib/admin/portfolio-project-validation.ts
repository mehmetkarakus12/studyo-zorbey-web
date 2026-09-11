import { SLUG_PATTERN } from "@/lib/admin/service-validation";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type PortfolioProjectFormValues = {
  category_id: string;
  title: string;
  slug: string;
  location: string | null;
  shooting_date: string | null;
  short_description: string | null;
  description: string | null;
  cover_image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
};

export type PortfolioProjectFieldErrors = Partial<
  Record<"title" | "slug" | "category_id" | "sort_order", string>
>;

function optionalText(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

/**
 * `portfolio_projects` şemasıyla birebir eşleşir. Şemada `category_id`
 * NULLABLE'dır, ama admin formunda BİLİNÇLİ olarak zorunlu tutulur — public
 * sitede her projenin bir kategoriye ait olması (kategori filtreleme,
 * /portfolyo sayfası) beklenir. Bu, şemadan DAHA katı bir uygulama
 * kısıtıdır, şemayı ihlal etmez.
 *
 * `category_id`'nin GERÇEKTEN var olan bir kategoriye ait olduğu, biçim
 * kontrolünden sonra veritabanının FK kısıtına bırakılır (ekstra bir
 * "var mı" sorgusu atmak yerine) — geçersiz/silinmiş bir id gönderilirse
 * Postgres `23503` hatası döner, Server Action bunu yakalayıp kullanıcı
 * dostu mesaja çevirir.
 */
export function parsePortfolioProjectFormData(formData: FormData): {
  values: PortfolioProjectFormValues;
  errors: PortfolioProjectFieldErrors;
} {
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const sortOrderRaw = String(formData.get("sort_order") ?? "").trim();
  const sortOrderNumber = Number(sortOrderRaw);

  const errors: PortfolioProjectFieldErrors = {};

  if (!title) {
    errors.title = "Proje başlığı boş olamaz.";
  }

  if (!slug) {
    errors.slug = "Slug boş olamaz.";
  } else if (!SLUG_PATTERN.test(slug)) {
    errors.slug =
      "Slug yalnızca küçük harf, rakam ve tire (-) içerebilir (ör. bir-dugun-hikayesi).";
  }

  if (!categoryId) {
    errors.category_id = "Bir kategori seçmelisiniz.";
  } else if (!UUID_PATTERN.test(categoryId)) {
    errors.category_id = "Geçersiz kategori.";
  }

  if (sortOrderRaw === "" || !Number.isInteger(sortOrderNumber) || sortOrderNumber < 0) {
    errors.sort_order = "Sıralama 0 veya daha büyük bir tam sayı olmalı.";
  }

  return {
    values: {
      category_id: categoryId,
      title,
      slug,
      location: optionalText(formData.get("location")),
      shooting_date: optionalText(formData.get("shooting_date")),
      short_description: optionalText(formData.get("short_description")),
      description: optionalText(formData.get("description")),
      cover_image_url: optionalText(formData.get("cover_image_url")),
      is_active: formData.get("is_active") === "on",
      is_featured: formData.get("is_featured") === "on",
      sort_order: Number.isFinite(sortOrderNumber) ? sortOrderNumber : 0,
    },
    errors,
  };
}
