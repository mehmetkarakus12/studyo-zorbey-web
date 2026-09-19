/**
 * E-posta (Resend) bildirimleri için environment değişkenlerini okur.
 * Kasıtlı olarak `requireEnv` gibi FIRLATAN (throwing) bir okuma
 * kullanmaz — bu proje için bildirim katmanı opsiyoneldir ve
 * eksik/yanlış yapılandırılmışsa formların kendisini (Supabase kaydını)
 * ASLA bozmamalıdır (bkz. proje talimatı: "bildirim sistemi ana form
 * sisteminden bağımsız olmalı").
 *
 * Eksik değişken durumunda `null` döner ve bir kere uyarı loglar; çağıran
 * taraf (dispatch.ts) bunu sessizce atlar.
 */

export type EmailConfig = {
  apiKey: string;
  to: string;
  from: string;
};

let warnedEmailMissing = false;

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
