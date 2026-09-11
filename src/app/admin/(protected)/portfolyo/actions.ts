"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/supabase/admin-auth";
import { createClient } from "@/lib/supabase/server";
import {
  deleteSiteMediaIfManaged,
  deleteSiteMediaFolderIfManaged,
} from "@/lib/supabase/storage-cleanup";
import {
  parsePortfolioProjectFormData,
  type PortfolioProjectFieldErrors,
} from "@/lib/admin/portfolio-project-validation";

export type PortfolioProjectActionState = {
  error?: string;
  fieldErrors?: PortfolioProjectFieldErrors;
};

export type DeletePortfolioProjectState = {
  error?: string;
};

/**
 * `23505` = slug çakışması. `23503` = foreign_key_violation — bu tabloda
 * `category_id` dışarıya FK verir, bu yüzden CREATE/UPDATE sırasında
 * geçersiz/silinmiş bir kategori id'si gönderilirse bu hata oluşur
 * (nadir bir yarış durumu — biçim kontrolü zaten geçersiz UUID'yi daha
 * önce eler).
 */
function toFriendlyProjectError(error: { code?: string }): string {
  if (error.code === "23505") {
    return "Bu bağlantı adresini (slug) kullanan başka bir portfolyo projesi bulunuyor.";
  }
  if (error.code === "23503") {
    return "Seçilen kategori bulunamadı. Lütfen listeyi yenileyip tekrar deneyin.";
  }
  return "Portfolyo projesi kaydedilirken bir hata oluştu.";
}

export async function createPortfolioProjectAction(
  _prevState: PortfolioProjectActionState,
  formData: FormData,
): Promise<PortfolioProjectActionState> {
  await requireAdminSession();

  const { values, errors } = parsePortfolioProjectFormData(formData);
  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("portfolio_projects").insert(values);

  if (error) {
    return { error: toFriendlyProjectError(error) };
  }

  revalidatePath("/admin/portfolyo");
  revalidatePath("/admin");
  redirect("/admin/portfolyo");
}

export async function updatePortfolioProjectAction(
  id: string,
  _prevState: PortfolioProjectActionState,
  formData: FormData,
): Promise<PortfolioProjectActionState> {
  await requireAdminSession();

  const { values, errors } = parsePortfolioProjectFormData(formData);
  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("portfolio_projects")
    .select("cover_image_url")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("portfolio_projects")
    .update(values)
    .eq("id", id);

  if (error) {
    return { error: toFriendlyProjectError(error) };
  }

  if (existing && existing.cover_image_url !== values.cover_image_url) {
    await deleteSiteMediaIfManaged(supabase, existing.cover_image_url);
  }

  revalidatePath("/admin/portfolyo");
  redirect("/admin/portfolyo");
}

export async function deletePortfolioProjectAction(
  id: string,
): Promise<DeletePortfolioProjectState> {
  await requireAdminSession();

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("portfolio_projects")
    .select("cover_image_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("portfolio_projects").delete().eq("id", id);

  if (error) {
    return { error: toFriendlyProjectError(error) };
  }

  if (existing) {
    await deleteSiteMediaIfManaged(supabase, existing.cover_image_url);
  }
  // `portfolio_images` satırları DB CASCADE ile silindi ama bu, Storage'daki
  // dosyaları silmez — proje klasörü altındaki tüm galeri dosyaları burada
  // ayrıca temizlenir (bkz. proje talimatları: "DB CASCADE tek başına
  // Storage cleanup sayılmaz").
  await deleteSiteMediaFolderIfManaged(supabase, `portfolio/${id}/gallery`);

  revalidatePath("/admin/portfolyo");
  revalidatePath("/admin");
  return {};
}
