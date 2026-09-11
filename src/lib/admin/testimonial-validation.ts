export type TestimonialFormValues = {
  customer_name: string;
  shooting_type: string | null;
  event_date: string | null;
  content: string;
  rating: number | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
};

export type TestimonialFieldErrors = Partial<
  Record<"customer_name" | "content" | "rating" | "sort_order", string>
>;

function optionalText(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

/**
 * `testimonials` şemasıyla birebir eşleşir (bkz.
 * supabase/migrations/20260910120800_testimonials.sql). `rating` NULLABLE
 * ve 1-5 CHECK kısıtlıdır — boş bırakılabilir (her yorumda puan olmak
 * zorunda değil).
 */
export function parseTestimonialFormData(formData: FormData): {
  values: TestimonialFormValues;
  errors: TestimonialFieldErrors;
} {
  const customerName = String(formData.get("customer_name") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const ratingRaw = String(formData.get("rating") ?? "").trim();
  const sortOrderRaw = String(formData.get("sort_order") ?? "").trim();
  const sortOrderNumber = Number(sortOrderRaw);

  const errors: TestimonialFieldErrors = {};

  if (!customerName) {
    errors.customer_name = "Müşteri adı boş olamaz.";
  }

  if (!content) {
    errors.content = "Yorum metni boş olamaz.";
  }

  let rating: number | null = null;
  if (ratingRaw !== "") {
    const ratingNumber = Number(ratingRaw);
    if (!Number.isInteger(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
      errors.rating = "Puan 1 ile 5 arasında olmalı.";
    } else {
      rating = ratingNumber;
    }
  }

  if (sortOrderRaw === "" || !Number.isInteger(sortOrderNumber) || sortOrderNumber < 0) {
    errors.sort_order = "Sıralama 0 veya daha büyük bir tam sayı olmalı.";
  }

  return {
    values: {
      customer_name: customerName,
      shooting_type: optionalText(formData.get("shooting_type")),
      event_date: optionalText(formData.get("event_date")),
      content,
      rating,
      is_featured: formData.get("is_featured") === "on",
      is_active: formData.get("is_active") === "on",
      sort_order: Number.isFinite(sortOrderNumber) ? sortOrderNumber : 0,
    },
    errors,
  };
}
