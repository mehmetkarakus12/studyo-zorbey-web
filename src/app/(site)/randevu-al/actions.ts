"use server";

import { createClient } from "@/lib/supabase/server";
import { parseAppointmentFormData, type AppointmentFieldErrors } from "@/lib/public/appointment-validation";
import {
  checkRateLimit,
  getRateLimitKey,
  isHoneypotTriggered,
} from "@/lib/public/spam-protection";

export type AppointmentActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: AppointmentFieldErrors;
};

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

export async function createAppointmentAction(
  _prevState: AppointmentActionState,
  formData: FormData,
): Promise<AppointmentActionState> {
  // Honeypot doluysa botu fark ettirmeden "başarılı" göster, DB'ye yazma.
  if (isHoneypotTriggered(formData)) {
    return { success: true };
  }

  const rateLimitKey = await getRateLimitKey("appointment");
  const { allowed } = checkRateLimit(rateLimitKey, RATE_LIMIT, RATE_WINDOW_MS);
  if (!allowed) {
    return {
      error: "Çok fazla talep gönderildi. Lütfen birkaç dakika sonra tekrar deneyin.",
    };
  }

  const { values, errors } = parseAppointmentFormData(formData);
  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors };
  }

  const supabase = await createClient();
  // `status`/`notes` kasıtlı olarak gönderilmez — RLS'in izin verdiği
  // tek başlangıç durumu (`new`, notes null) budur; kullanıcı bunları
  // asla seçemez (bkz. appointments_public_insert politikası).
  const { error } = await supabase.from("appointments").insert(values);

  if (error) {
    return {
      error: "Randevu talebiniz gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
    };
  }

  return { success: true };
}
