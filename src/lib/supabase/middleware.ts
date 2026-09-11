import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

/**
 * Oturum yenileme (session refresh) yardımcı fonksiyonu — `src/proxy.ts`
 * tarafından çağrılır (bkz. proxy.ts'teki not: Next.js 16'da `middleware.ts`
 * dosya adı deprecated olup `proxy.ts` ile değiştirildi).
 *
 * Supabase Auth'a doğrulatarak (auth.getUser()) access token süresi
 * dolmuşsa refresh token ile yeniler ve güncel cookie'leri response'a
 * yazar. Ayrıca çağıranın (proxy.ts) route koruması kararı verebilmesi
 * için doğrulanmış `user` nesnesini de döner — burada herhangi bir
 * yönlendirme kararı VERİLMEZ, bu bilinçli olarak proxy.ts'e bırakılmıştır
 * (tek sorumluluk: bu dosya sadece Supabase oturum mekaniğini bilir, hangi
 * path'lerin korunacağını bilmez).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // NOT: `getSession()` değil `getUser()` kullanılır — `getUser()` her
  // seferinde Supabase Auth sunucusuna doğrulatır, cookie'deki token'a
  // körü körüne güvenmez. Proxy/middleware katmanında yetki kararları için
  // resmi Supabase önerisi budur.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response: supabaseResponse, user: user as User | null };
}
