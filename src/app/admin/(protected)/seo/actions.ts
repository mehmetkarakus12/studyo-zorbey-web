"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/supabase/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { deleteSiteMediaIfManaged } from "@/lib/supabase/storage-cleanup";
import {
  parseSeoSettingFormData,
  type SeoSettingFieldErrors,
} from "@/lib/admin/seo-settings-validation";

export type SeoSettingActionState = {
  error?: string;
  fieldErrors?: SeoSettingFieldErrors;
};

export type DeleteSeoSettingState = { error?: string };

/** `23505` = `page_key` çakışması — bu sayfa için zaten bir SEO ayarı var. */
function toFriendlySeoError(error: { code?: string }): string {
  if (error.code === "23505") {
    return "Bu sayfa anahtarı için zaten bir SEO ayarı bulunuyor.";
  }
  return "SEO ayarı kaydedilirken bir hata oluştu.";
}

export async function createSeoSettingAction(
  _prevState: SeoSettingActionState,
  formData: FormData,
): Promise<SeoSettingActionState> {
  await requireAdminSession();

  const { values, errors } = parseSeoSettingFormData(formData);
  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("seo_settings").insert(values);

  if (error) {
    return { error: toFriendlySeoError(error) };
  }

  revalidatePath("/admin/seo");
  redirect("/admin/seo");
}

export async function updateSeoSettingAction(
  id: string,
  _prevState: SeoSettingActionState,
  formData: FormData,
): Promise<SeoSettingActionState> {
  await requireAdminSession();

  const { values, errors } = parseSeoSettingFormData(formData);
  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("seo_settings")
    .select("og_image_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("seo_settings").update(values).eq("id", id);

  if (error) {
    return { error: toFriendlySeoError(error) };
  }

  if (existing && existing.og_image_url !== values.og_image_url) {
    await deleteSiteMediaIfManaged(supabase, existing.og_image_url);
  }

  revalidatePath("/admin/seo");
  redirect("/admin/seo");
}

export async function deleteSeoSettingAction(id: string): Promise<DeleteSeoSettingState> {
  await requireAdminSession();

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("seo_settings")
    .select("og_image_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("seo_settings").delete().eq("id", id);

  if (error) {
    return { error: "SEO ayarı silinirken bir hata oluştu." };
  }

  if (existing) {
    await deleteSiteMediaIfManaged(supabase, existing.og_image_url);
  }

  revalidatePath("/admin/seo");
  return {};
}
