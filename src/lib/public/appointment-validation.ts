export type AppointmentFormValues = {
  full_name: string;
  phone: string;
  email: string | null;
  service_id: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
};

export type AppointmentFieldErrors = Partial<
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
 * `appointments` şemasıyla birebir eşleşir (bkz.
 * supabase/migrations/20260910120700_leads.sql). `status`/`notes` burada
 * KASITLI olarak yoktur — public formdan asla kabul edilmez, RLS zaten
 * `status = 'new' and notes is null` dışındaki bir INSERT'i reddeder
 * (bkz. `appointments_public_insert` politikası); Server Action da aynı
 * kuralı ayrıca (RLS'e güvenmeden önce, dostça bir hata için) uygular.
 */
export function parseAppointmentFormData(formData: FormData): {
  values: AppointmentFormValues;
  errors: AppointmentFieldErrors;
} {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = optionalText(formData.get("email"));
  const serviceId = optionalText(formData.get("service_id"));

  const errors: AppointmentFieldErrors = {};

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
      preferred_date: optionalText(formData.get("preferred_date")),
      preferred_time: optionalText(formData.get("preferred_time")),
      message: optionalText(formData.get("message")),
    },
    errors,
  };
}
