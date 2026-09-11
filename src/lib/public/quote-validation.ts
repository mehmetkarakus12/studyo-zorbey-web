export type QuoteRequestFormValues = {
  full_name: string;
  phone: string;
  email: string | null;
  service_id: string | null;
  event_date: string | null;
  location: string | null;
  message: string | null;
};

export type QuoteRequestFieldErrors = Partial<
  Record<"full_name" | "phone" | "email", string>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function optionalText(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

/**
 * `quote_requests` şemasıyla birebir eşleşir (bkz.
 * supabase/migrations/20260910120700_leads.sql). Şemada "video isteği",
 * "drone isteği", "tahmini süre" gibi alanlar YOKTUR — uydurulmadı,
 * form/Server Action yalnızca gerçek kolonları kabul eder.
 */
export function parseQuoteRequestFormData(formData: FormData): {
  values: QuoteRequestFormValues;
  errors: QuoteRequestFieldErrors;
} {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = optionalText(formData.get("email"));
  const serviceId = optionalText(formData.get("service_id"));

  const errors: QuoteRequestFieldErrors = {};

  if (!fullName) {
    errors.full_name = "Ad soyad boş olamaz.";
  }

  if (!phone) {
    errors.phone = "Telefon numarası boş olamaz.";
  }

  if (email && !EMAIL_PATTERN.test(email)) {
    errors.email = "Geçerli bir e-posta adresi girin.";
  }

  return {
    values: {
      full_name: fullName,
      phone,
      email,
      service_id: serviceId && UUID_PATTERN.test(serviceId) ? serviceId : null,
      event_date: optionalText(formData.get("event_date")),
      location: optionalText(formData.get("location")),
      message: optionalText(formData.get("message")),
    },
    errors,
  };
}
