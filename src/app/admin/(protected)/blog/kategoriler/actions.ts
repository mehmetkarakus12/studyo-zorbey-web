"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/supabase/admin-auth";
import { createClient } from "@/lib/supabase/server";
import {
  parseBlogCategoryFormData,
  type BlogCategoryFieldErrors,
} from "@/lib/admin/blog-category-validation";

export type BlogCategoryActionState = {
  error?: string;
  fieldErrors?: BlogCategoryFieldErrors;
};

export type DeleteBlogCategoryState = {
  error?: string;
};

/**
 * `23505` = unique_violation (slug çakışması). `blog_posts.category_id`
 * bu tabloya ON DELETE SET NULL ile bağlı (bkz. migration) — yani
 * portfolio_categories'in aksine burada bir FK RESTRICT senaryosu YOK;
 * kategoriye bağlı yazılar varken silme her zaman başarılı olur ve o
 * yazılar "kategorisiz" kalır (bu UI'da ConfirmDialog metniyle açıkça
 * belirtilir).
 */
function toFriendlyCategoryError(error: { code?: string }): string {
  if (error.code === "23505") {
    return "Bu bağlantı adresini (slug) kullanan başka bir kategori bulunuyor.";
  }
  return "Kategori kaydedilirken bir hata oluştu.";
}

export async function createBlogCategoryAction(
  _prevState: BlogCategoryActionState,
  formData: FormData,
): Promise<BlogCategoryActionState> {
  await requireAdminSession();

  const { values, errors } = parseBlogCategoryFormData(formData);
  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("blog_categories").insert(values);

  if (error) {
    return { error: toFriendlyCategoryError(error) };
  }

  revalidatePath("/admin/blog/kategoriler");
  revalidatePath("/admin/blog");
  redirect("/admin/blog/kategoriler");
}

export async function updateBlogCategoryAction(
  id: string,
  _prevState: BlogCategoryActionState,
  formData: FormData,
): Promise<BlogCategoryActionState> {
  await requireAdminSession();

  const { values, errors } = parseBlogCategoryFormData(formData);
  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("blog_categories")
    .update(values)
    .eq("id", id);

  if (error) {
    return { error: toFriendlyCategoryError(error) };
  }

  revalidatePath("/admin/blog/kategoriler");
  redirect("/admin/blog/kategoriler");
}

export async function deleteBlogCategoryAction(
  id: string,
): Promise<DeleteBlogCategoryState> {
  await requireAdminSession();

  const supabase = await createClient();
  const { error } = await supabase.from("blog_categories").delete().eq("id", id);

  if (error) {
    return { error: toFriendlyCategoryError(error) };
  }

  revalidatePath("/admin/blog/kategoriler");
  revalidatePath("/admin/blog");
  return {};
}
