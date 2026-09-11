import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

/**
 * SADECE Server Component'lerden çağrılmalıdır (client bundle'a girmemeli).
 * `proxy.ts` sadece "oturum var mı" diye bakar (kaba kapı); asıl yetki
 * kararı — profiles.role'ün 'admin' ya da 'editor' olması — burada verilir.
 * `/admin` altındaki her korumalı sayfa/layout bunu çağırmalı.
 *
 * NOT: profiles tablosunda bir "aktif/is_active" kolonu YOK (bkz.
 * supabase/migrations/20260910120100_profiles.sql). Bu yüzden "kullanıcı
 * aktif olmalı" şartı, mevcut şemayla uyumlu tek güvenli şekilde
 * yorumlanmıştır: profiles.role sütunundaki CHECK kısıtı zaten sadece
 * 'admin' | 'editor' değerine izin verir — bir profil satırının VAR OLMASI
 * ve bu rollerden birine sahip olması "aktif" kabul edilir. Ayrı bir
 * is_active kolonu gerekiyorsa bu yeni bir migration ister; bu faz
 * kapsamında migration eklenmedi (bkz. Faz 2.2 raporu).
 */
export type AdminSession = {
  user: { id: string; email: string };
  profile: Tables<"profiles">;
};

export async function requireAdminSession(): Promise<AdminSession> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "admin" && profile.role !== "editor")) {
    redirect("/admin/login");
  }

  return {
    user: { id: user.id, email: user.email ?? profile.email },
    profile,
  };
}
