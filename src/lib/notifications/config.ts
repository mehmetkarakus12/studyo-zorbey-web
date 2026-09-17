/**
 * E-posta (Resend) ve WhatsApp (Meta Cloud API) bildirimleri için
 * environment değişkenlerini okur. Kasıtlı olarak `requireEnv` gibi
 * FIRLATAN (throwing) bir okuma kullanmaz — bu proje için bildirim
 * katmanı opsiyoneldir ve eksik/yanlış yapılandırılmışsa formların
 * kendisini (Supabase kaydını) ASLA bozmamalıdır (bkz. proje talimatı:
 * "bildirim sistemi ana form sisteminden bağımsız olmalı").
 *
 * Eksik değişken durumunda `null` döner ve bir kere uyarı loglar; çağıran
 * taraf (dispatch.ts) bunu sessizce atlar.
 */

export type EmailConfig = {
  apiKey: string;
  to: string;
  from: string;
};

export type WhatsAppConfig = {
  accessToken: string;
  phoneNumberId: string;
  to: string;
  /** Ayarlıysa mesaj "template" tipinde, tek {{1}} body parametresiyle gönderilir. */
  templateName?: string;
  templateLang: string;
};

let warnedEmailMissing = false;
let warnedWhatsAppMissing = false;

export function getEmailConfig(): EmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL;
  const from = process.env.NOTIFICATION_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    if (!warnedEmailMissing) {
      console.warn(
        "[notifications] E-posta bildirimi devre dışı: RESEND_API_KEY, " +
          "NOTIFICATION_EMAIL veya NOTIFICATION_FROM_EMAIL environment " +
          "değişkeni eksik.",
      );
      warnedEmailMissing = true;
    }
    return null;
  }

  return { apiKey, to, from };
}

export function getWhatsAppConfig(): WhatsAppConfig | null {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = process.env.WHATSAPP_NOTIFICATION_TO;

  if (!accessToken || !phoneNumberId || !to) {
    if (!warnedWhatsAppMissing) {
      console.warn(
        "[notifications] WhatsApp bildirimi devre dışı: " +
          "WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID veya " +
          "WHATSAPP_NOTIFICATION_TO environment değişkeni eksik.",
      );
      warnedWhatsAppMissing = true;
    }
    return null;
  }

  return {
    accessToken,
    phoneNumberId,
    to,
    templateName: process.env.WHATSAPP_TEMPLATE_NAME || undefined,
    templateLang: process.env.WHATSAPP_TEMPLATE_LANG || "tr",
  };
}
