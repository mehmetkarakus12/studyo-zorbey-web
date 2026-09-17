import { Resend } from "resend";

import { getEmailConfig } from "./config";

/**
 * Yapılandırma eksikse sessizce (no-op) döner — hata fırlatmaz. Gerçek bir
 * gönderim hatası (Resend API hatası) ise fırlatılır; bunu yakalamak
 * `dispatch.ts`'nin sorumluluğudur (kanallar birbirinden bağımsız
 * başarısız olabilmeli).
 */
export async function sendNotificationEmail(
  subject: string,
  html: string,
): Promise<void> {
  const config = getEmailConfig();
  if (!config) return;

  const resend = new Resend(config.apiKey);
  const { error } = await resend.emails.send({
    from: config.from,
    to: config.to,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Resend gönderim hatası: ${error.message}`);
  }
}
