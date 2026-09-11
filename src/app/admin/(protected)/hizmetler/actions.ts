"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/supabase/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { deleteSiteMediaIfManaged } from "@/lib/supabase/storage-cleanup";
import { parseServiceFormData, type ServiceFieldErrors } from "@/lib/admin/service-validation";

export type ServiceActionState = {
  error?: string;
  fieldErrors?: ServiceFieldErrors;
};

export type DeleteServiceState = {
  error?: string;
};

/**
 * Supabase'in ham hata mesajlarını/kodlarını kullanıcıya birebir
 * göstermeyiz. `23505` Postgres'in standart "unique_violation" SQLSTATE
 * kodudur — bu tabloda tek unique kısıt `slug` üzerinde olduğu için
 * (bkz. migration), bu hatayı güvenle "slug çakışması" olarak
 * yorumlayabiliriz.
 */
function toFriendlyServiceError(error: { code?: string }): string {
  if (error.code === "23505") {
    return "Bu bağlantı adresini (slug) kullanan başka bir hizmet bulunuyor.";
  }
  return "Hizmet kaydedilirken bir hata oluştu.";
}

export async function createServiceAction(
  _prevState: ServiceActionState,
  formData: FormData,
): Promise<ServiceActionState> {
  // Uygulama seviyesi kontrol (hızlı geri bildirim). Asıl, atlatılamaz
  // yetki sınırı RLS'tir (`services_admin_all` politikası) — aşağıdaki
  // `insert` çağrısı hâlâ anon key + kullanıcı oturumu ile, RLS altında
  // çalışır; service_role KULLANILMAZ.
  await requireAdminSession();

  const { values, errors } = parseServiceFormData(formData);
  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("services").insert(values);

  if (error) {
    return { error: toFriendlyServiceError(error) };
  }

  revalidatePath("/admin/hizmetler");
  revalidatePath("/admin");
  redirect("/admin/hizmetler");
}

export async function updateServiceAction(
  id: string,
  _prevState: ServiceActionState,
  formData: FormData,
): Promise<ServiceActionState> {
  await requireAdminSession();

  const { values, errors } = parseServiceFormData(formData);
  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("services")
    .select("image_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("services").update(values).eq("id", id);

  if (error) {
    return { error: toFriendlyServiceError(error) };
  }

  // Görsel değiştiyse eski dosyayı temizle (yalnızca bizim yönettiğimiz
  // site-media path'i ise — bkz. deleteSiteMediaIfManaged).
  if (existing && existing.image_url !== values.image_url) {
    await deleteSiteMediaIfManaged(supabase, existing.image_url);
  }

  revalidatePath("/admin/hizmetler");
  redirect("/admin/hizmetler");
}

export async function deleteServiceAction(id: string): Promise<DeleteServiceState> {
  await requireAdminSession();

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("services")
    .select("image_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    return { error: "Hizmet silinirken bir hata oluştu." };
  }

  if (existing) {
    await deleteSiteMediaIfManaged(supabase, existing.image_url);
  }

  revalidatePath("/admin/hizmetler");
  revalidatePath("/admin");
  return {};
}
