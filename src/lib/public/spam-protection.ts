import { headers } from "next/headers";

export { HONEYPOT_FIELD_NAME, isHoneypotTriggered } from "./honeypot";

/**
 * Basit, bellek-içi (in-memory) sabit pencereli (fixed-window) rate
 * limiter. Kalıcı bir store (Redis vb.) gerektirmez — tek sunucu
 * process'i için yeterli, "hızlı ve güvenli" bir ilk savunma katmanıdır
 * (bkz. proje talimatları). Cloudflare Turnstile için secret/site key
 * env'de tanımlı DEĞİL; bu yüzden Turnstile burada zorunlu kılınmadı —
 * env eklendiğinde bu modülün üzerine opsiyonel bir doğrulama katmanı
 * olarak eklenebilir.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

const MAX_MAP_SIZE = 5000;

function pruneIfNeeded(now: number) {
  if (hits.size <= MAX_MAP_SIZE) return;
  for (const [key, entry] of hits) {
    if (entry.resetAt <= now) hits.delete(key);
  }
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  pruneIfNeeded(now);

  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true };
}

/**
 * Sunucusuz/edge ortamlarda gerçek istemci IP'si her zaman güvenilir
 * şekilde alınamayabilir — bu durumda sabit bir anahtara düşülür (rate
 * limit o zaman IP bazlı değil, sunucu process'i genelinde çalışır; en
 * kötü ihtimalle biraz daha gevşek bir sınır olur, form tamamen
 * korumasız kalmaz).
 */
export async function getRateLimitKey(formName: string): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || headerList.get("x-real-ip") || "unknown";
  return `${formName}:${ip}`;
}
