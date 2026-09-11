import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

/**
 * Public (ziyaretçi tarafı) Server Component'ler ve `generateStaticParams`/
 * `sitemap`/`robots` gibi build-time bağlamlar için kullanılan, anon-key'e
 * bağlı Supabase client'ı. `@/lib/supabase/server` içindeki
 * `createClient()`'tan FARKLI olarak `cookies()` OKUMAZ — bu sayede public
 * sayfalar dinamik API kullanmadığı için statik/ISR render'a uygun kalır
 * (bkz. proje talimatları: "Public data server-side cache/revalidation
 * stratejisini sade kur"). Session/oturum farkı yoktur çünkü ziyaretçiler
 * hiçbir zaman kimlik doğrulamalı değildir — sadece anon RLS politikaları
 * geçerlidir (aynı `services_public_read_active` vb. politikalar).
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false },
  });
}
