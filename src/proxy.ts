import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js 16 Proxy (eski adıyla "middleware" — bkz.
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md).
 * `src/app` ile aynı seviyede olmalı (src/ dizini kullanıldığı için burada).
 *
 * İki iş yapar:
 * 1. Her istekte Supabase oturumunu tazeler (`updateSession`) — bu olmadan
 *    access token süresi dolan kullanıcılar sessizce çıkış yapmış gibi
 *    görünür.
 * 2. `/admin/*` altında (yalnızca `/admin/login` hariç) oturumu olmayan
 *    istekleri `/admin/login`'e yönlendirir — bu KABA (coarse) bir kapıdır;
 *    asıl/kesin yetki kontrolü (profiles.role admin/editor) her korumalı
 *    sayfanın kendisinde `requireAdminSession()` ile ayrıca yapılır (bkz.
 *    src/lib/supabase/admin-auth.ts). Böylece koruma yalnızca client-side
 *    yönlendirmeye değil, iki bağımsız server-side katmana dayanır.
 */
export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);

  const { pathname } = request.nextUrl;
  const isAdminArea = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  if (isAdminArea && !isLoginPage && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
