/**
 * Client Component'lerde (form) de kullanılabilmesi için `next/headers`
 * bağımlılığı OLMAYAN, saf bir modül — `@/lib/public/spam-protection`
 * (rate limiting, `next/headers` kullanır) sadece server-only bağlamlarda
 * import edilebilir; honeypot alan adı ise hem formda (gizli input) hem
 * Server Action'da (kontrol) gerekir.
 */
export const HONEYPOT_FIELD_NAME = "website";

export function isHoneypotTriggered(formData: FormData): boolean {
  const value = String(formData.get(HONEYPOT_FIELD_NAME) ?? "").trim();
  return value.length > 0;
}
