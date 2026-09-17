"use server";

import { randomUUID } from "node:crypto";

import { after } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { parseAppointmentFormData, type AppointmentFieldErrors } from "@/lib/public/appointment-validation";
import {
  checkRateLimit,
  getRateLimitKey,
  isHoneypotTriggered,
} from "@/lib/public/spam-protection";
import { notifyNewAppointment } from "@/lib/notifications/dispatch";

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
  // `id` burada üretilir çünkü public (anon) rolün bu tabloda SELECT
  // izni yoktur (bkz. appointments_public_insert politikası) — bildirim
  // katmanının admin panel linki kurabilmesi için `insert().select()` ile
  // geri okumak yerine id'yi baştan biliyoruz.
  // `status`/`notes` kasıtlı olarak gönderilmez — RLS'in izin verdiği
  // tek başlangıç durumu (`new`, notes null) budur; kullanıcı bunları
  // asla seçemez (bkz. appointments_public_insert politikası).
  const id = randomUUID();
  const { error } = await supabase.from("appointments").insert({ id, ...values });

  if (error) {
    return {
      error: "Randevu talebiniz gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
    };
  }

  // Kayıt zaten başarıyla tamamlandı — bildirim gönderimi yanıttan SONRA
  // (after) çalışır ve hata verse bile talep asla kaybolmaz/rollback
  // edilmez (bkz. proje talimatı).
  after(() =>
    notifyNewAppointment({
      id,
      full_name: values.full_name,
      phone: values.phone,
      service_id: values.service_id,
      preferred_date: values.preferred_date,
      preferred_time: values.preferred_time,
    }),
  );

  return { success: true };
}
