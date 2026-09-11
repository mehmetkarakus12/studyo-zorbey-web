import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "@/types/database";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

/**
 * Server Component'ler, Server Function'lar ve Route Handler'larda
 * kullanılacak Supabase client'ı. Sadece anon key kullanır — RLS
 * politikaları tarafından korunur.
 *
 * Not: Next.js 16'da `cookies()` asenkron bir fonksiyondur, bu yüzden bu
 * fabrika fonksiyonu da `async` olmak zorunda.
 *
 * Henüz auth akışı kurulmadığı (Faz 2.2) için `cookies().set` çağrıları
 * yalnızca ileride oturum yenileme (session refresh) için altyapı olarak
 * burada duruyor; bir Server Component içinden çağrıldığında cookie
 * yazılamayacağı için Next.js bu durumu sessizce yok sayar.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component içinden çağrıldıysa cookie set edilemez.
          // Oturum yenileme Faz 2.2'de proxy.ts üzerinden yapılacak.
        }
      },
    },
  });
}
