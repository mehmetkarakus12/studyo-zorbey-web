import { getWhatsAppConfig } from "./config";

const WHATSAPP_API_VERSION = "v21.0";

/**
 * Meta WhatsApp Cloud API üzerinden bildirim gönderir. Resmi API
 * dışında (üçüncü taraf/otomasyon) hiçbir yol kullanılmaz.
 *
 * İki mod desteklenir:
 * - `WHATSAPP_TEMPLATE_NAME` ayarlıysa: onaylı bir template ile, TEK bir
 *   {{1}} body parametresi (tam metin) olarak gönderilir. Template'in
 *   Meta'da tam olarak bu şekilde (tek değişkenli body) onaylanmış olması
 *   gerekir; farklı bir yapıdaysa template adı/parametre sırası bu
 *   projenin sahibinden alınıp burada güncellenmelidir.
 * - Ayarlı değilse: düz metin ("text") mesajı gönderilir. Bu yalnızca
 *   alıcı numara işletmeyle son 24 saat içinde bir WhatsApp oturumu
 *   başlatmışsa Meta tarafından kabul edilir; aksi halde Meta bir
 *   template zorunlu kılar.
 */
export async function sendWhatsAppNotification(text: string): Promise<void> {
  const config = getWhatsAppConfig();
  if (!config) return;

  const endpoint = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${config.phoneNumberId}/messages`;

  const body = config.templateName
    ? {
        messaging_product: "whatsapp",
        to: config.to,
        type: "template",
        template: {
          name: config.templateName,
          language: { code: config.templateLang },
          components: [
            {
              type: "body",
              parameters: [{ type: "text", text }],
            },
          ],
        },
      }
    : {
        messaging_product: "whatsapp",
        to: config.to,
        type: "text",
        text: { body: text, preview_url: false },
      };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `WhatsApp Cloud API hatası (HTTP ${response.status}): ${errorBody}`,
    );
  }
}
