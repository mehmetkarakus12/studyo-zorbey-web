import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

/**
 * Client Component'lerde ("use client") kullanılacak Supabase client'ı.
 * Sadece anon key kullanır — RLS politikaları tarafından korunur.
 */
export function createClient() {
  return createBrowserClient<Database>(getSupabaseUrl(), getSupabaseAnonKey());
}
