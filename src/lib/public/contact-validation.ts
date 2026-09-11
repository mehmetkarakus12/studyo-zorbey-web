export type ContactMessageFormValues = {
  full_name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
};

export type ContactMessageFieldErrors = Partial<
  Record<"full_name" | "email" | "message", string>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function optionalText(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

/**
 * `contact_messages` şemasıyla birebir eşleşir (bkz.
 * supabase/migrations/20260910120700_leads.sql). `status` KASITLI olarak
 * yoktur — RLS zaten `status = 'new'` dışındaki bir INSERT'i reddeder
 * (bkz. `contact_messages_public_insert`); Server Action da aynı kuralı
 * ayrıca uygular.
 */
export function parseContactMessageFormData(formData: FormData): {
  values: ContactMessageFormValues;
  errors: ContactMessageFieldErrors;
} {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const errors: ContactMessageFieldErrors = {};

  if (!fullName) {
    errors.full_name = "Ad soyad boş olamaz.";
  }

  if (!email) {
    errors.email = "E-posta boş olamaz.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Geçerli bir e-posta adresi girin.";
  }

  if (!message) {
    errors.message = "Mesaj boş olamaz.";
  }

  return {
    values: {
      full_name: fullName,
      email,
      phone: optionalText(formData.get("phone")),
      subject: optionalText(formData.get("subject")),
      message,
    },
    errors,
  };
}
