/**
 * Supabase environment değişkenleri için tek merkezli okuma noktası.
 *
 * Sadece `NEXT_PUBLIC_` ile başlayan (tarayıcıya açık, "anon" yetkili)
 * değişkenler burada tutulur. `SUPABASE_SERVICE_ROLE_KEY` gibi gizli
 * server-only anahtarlar buradan DEĞİL, doğrudan sadece server-only
 * dosyalarda `process.env.SUPABASE_SERVICE_ROLE_KEY` ile okunmalı ve
 * asla `NEXT_PUBLIC_` öneki almamalıdır.
 */
function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `[supabase] Eksik environment değişkeni: ${name}. ` +
        "Proje köküne bir .env.local dosyası ekleyip " +
        "NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY " +
        "değerlerini Supabase Dashboard > Project Settings > API " +
        "sayfasından girin.",
    );
  }
  return value;
}

export function getSupabaseUrl(): string {
  return requireEnv(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
}

export function getSupabaseAnonKey(): string {
  return requireEnv(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
