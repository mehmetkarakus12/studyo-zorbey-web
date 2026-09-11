"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/supabase/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { deleteSiteMediaIfManaged } from "@/lib/supabase/storage-cleanup";
import {
  parseBlogPostFormData,
  type BlogPostFieldErrors,
} from "@/lib/admin/blog-post-validation";

export type BlogPostActionState = {
  error?: string;
  fieldErrors?: BlogPostFieldErrors;
};

export type DeleteBlogPostState = {
  error?: string;
};

/**
 * `23505` = slug çakışması. `23503` = foreign_key_violation — `category_id`
 * dışarıya FK verir, geçersiz/silinmiş bir kategori id'si gönderilirse
 * (nadir bir yarış durumu) oluşabilir.
 */
function toFriendlyPostError(error: { code?: string }): string {
  if (error.code === "23505") {
    return "Bu bağlantı adresini (slug) kullanan başka bir blog yazısı bulunuyor.";
  }
  if (error.code === "23503") {
    return "Seçilen kategori bulunamadı. Lütfen listeyi yenileyip tekrar deneyin.";
  }
  return "Blog yazısı kaydedilirken bir hata oluştu.";
}

export async function createBlogPostAction(
  _prevState: BlogPostActionState,
  formData: FormData,
): Promise<BlogPostActionState> {
  await requireAdminSession();

  const { values, errors } = parseBlogPostFormData(formData);
  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").insert(values);

  if (error) {
    return { error: toFriendlyPostError(error) };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  redirect("/admin/blog");
}

export async function updateBlogPostAction(
  id: string,
  _prevState: BlogPostActionState,
  formData: FormData,
): Promise<BlogPostActionState> {
  await requireAdminSession();

  const { values, errors } = parseBlogPostFormData(formData);
  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("blog_posts")
    .select("cover_image_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("blog_posts").update(values).eq("id", id);

  if (error) {
    return { error: toFriendlyPostError(error) };
  }

  if (existing && existing.cover_image_url !== values.cover_image_url) {
    await deleteSiteMediaIfManaged(supabase, existing.cover_image_url);
  }

  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPostAction(id: string): Promise<DeleteBlogPostState> {
  await requireAdminSession();

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("blog_posts")
    .select("cover_image_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) {
    return { error: "Blog yazısı silinirken bir hata oluştu." };
  }

  if (existing) {
    await deleteSiteMediaIfManaged(supabase, existing.cover_image_url);
  }

  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  return {};
}
