import { createClient } from "@/lib/supabase/server";
import { sendNotificationEmail } from "./email";
import {
  buildAppointmentEmail,
  buildContactEmail,
  buildQuoteEmail,
  type AppointmentNotificationData,
  type ContactNotificationData,
  type QuoteNotificationData,
} from "./templates";

/**
 * Bu modüldeki üç `notifyNew*` fonksiyonu, ilgili Server Action'ın
 * `next/server`'dan `after()` içinde çağırdığı tek giriş noktasıdır.
 * Supabase INSERT zaten (çağıran tarafta) başarıyla tamamlanmış ve
 * kullanıcıya cevap verilmiş olur; buradaki HİÇBİR hata bir üst katmana
 * fırlatılmaz — kaydın kendisi asla bundan etkilenmez, sadece güvenli
 * şekilde loglanır (bkz. proje talimatı: "bildirim sistemi ana form
 * sisteminden bağımsız olmalı").
 */

async function safeSend(
  channel: "e-posta",
  event: string,
  send: () => Promise<void>,
): Promise<void> {
  try {
    await send();
  } catch (error) {
    console.error(
      `[notifications] ${event} için ${channel} bildirimi gönderilemedi:`,
      error,
    );
  }
}

async function lookupServiceTitle(serviceId: string | null): Promise<string | null> {
  if (!serviceId) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("services")
      .select("title")
      .eq("id", serviceId)
      .maybeSingle();
    return data?.title ?? null;
  } catch (error) {
    console.error("[notifications] Hizmet adı alınamadı:", error);
    return null;
  }
}

async function dispatch(params: {
  event: string;
  subject: string;
  html: string;
}): Promise<void> {
  await safeSend("e-posta", params.event, () =>
    sendNotificationEmail(params.subject, params.html),
  );
}

export async function notifyNewAppointment(
  data: Omit<AppointmentNotificationData, "serviceTitle" | "createdAt"> & {
    service_id: string | null;
  },
): Promise<void> {
  const serviceTitle = await lookupServiceTitle(data.service_id);
  const payload: AppointmentNotificationData = {
    ...data,
    serviceTitle,
    createdAt: new Date().toISOString(),
  };
  const { subject, html } = buildAppointmentEmail(payload);
  await dispatch({ event: "randevu", subject, html });
}

export async function notifyNewQuoteRequest(
  data: Omit<QuoteNotificationData, "serviceTitle" | "createdAt"> & {
    service_id: string | null;
  },
): Promise<void> {
  const serviceTitle = await lookupServiceTitle(data.service_id);
  const payload: QuoteNotificationData = {
    ...data,
    serviceTitle,
    createdAt: new Date().toISOString(),
  };
  const { subject, html } = buildQuoteEmail(payload);
  await dispatch({ event: "teklif", subject, html });
}

export async function notifyNewContactMessage(
  data: Omit<ContactNotificationData, "createdAt">,
): Promise<void> {
  const payload: ContactNotificationData = {
    ...data,
    createdAt: new Date().toISOString(),
  };
  const { subject, html } = buildContactEmail(payload);
  await dispatch({ event: "iletişim mesajı", subject, html });
}
