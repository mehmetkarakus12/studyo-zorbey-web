"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/supabase/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { deleteSiteMediaIfManaged } from "@/lib/supabase/storage-cleanup";
import { parseVideoFormData, type VideoFieldErrors } from "@/lib/admin/video-validation";

export type VideoActionState = {
  error?: string;
  fieldErrors?: VideoFieldErrors;
};

export type DeleteVideoState = {
  error?: string;
};

/**
 * `23505` = unique_violation (slug çakışması) — bu tabloda tek unique
 * kısıt `slug` üzerinde.
 */
function toFriendlyVideoError(error: { code?: string }): string {
  if (error.code === "23505") {
    return "Bu bağlantı adresini (slug) kullanan başka bir video bulunuyor.";
  }
  return "Video kaydedilirken bir hata oluştu.";
}

export async function createVideoAction(
  _prevState: VideoActionState,
  formData: FormData,
): Promise<VideoActionState> {
  await requireAdminSession();

  const { values, errors } = parseVideoFormData(formData);
  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("videos").insert(values);

  if (error) {
    return { error: toFriendlyVideoError(error) };
  }

  revalidatePath("/admin/videolar");
  redirect("/admin/videolar");
}

export async function updateVideoAction(
  id: string,
  _prevState: VideoActionState,
  formData: FormData,
): Promise<VideoActionState> {
  await requireAdminSession();

  const { values, errors } = parseVideoFormData(formData);
  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("videos")
    .select("thumbnail_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("videos").update(values).eq("id", id);

  if (error) {
    return { error: toFriendlyVideoError(error) };
  }

  if (existing && existing.thumbnail_url !== values.thumbnail_url) {
    await deleteSiteMediaIfManaged(supabase, existing.thumbnail_url);
  }

  revalidatePath("/admin/videolar");
  redirect("/admin/videolar");
}

export async function deleteVideoAction(id: string): Promise<DeleteVideoState> {
  await requireAdminSession();

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("videos")
    .select("thumbnail_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("videos").delete().eq("id", id);

  if (error) {
    return { error: "Video silinirken bir hata oluştu." };
  }

  if (existing) {
    await deleteSiteMediaIfManaged(supabase, existing.thumbnail_url);
  }

  revalidatePath("/admin/videolar");
  return {};
}
