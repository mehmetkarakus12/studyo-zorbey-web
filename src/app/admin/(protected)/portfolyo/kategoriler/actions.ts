"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/supabase/admin-auth";
import { createClient } from "@/lib/supabase/server";
import {
  parsePortfolioCategoryFormData,
  type PortfolioCategoryFieldErrors,
} from "@/lib/admin/portfolio-category-validation";

export type PortfolioCategoryActionState = {
  error?: string;
  fieldErrors?: PortfolioCategoryFieldErrors;
};

export type DeletePortfolioCategoryState = {
  error?: string;
};

/**
 * `23505` = unique_violation (slug çakışması). `23503` = foreign_key_
 * violation — bu tabloda dışarı giden bir FK olmadığı için, bu hata
 * SADECE silme sırasında (başka bir tablonun BUNA referans vermesi
 * nedeniyle) oluşabilir: portfolio_projects.category_id ON DELETE
 * RESTRICT (bkz. migration). Bu yüzden güvenle "bağlı proje var" olarak
 * yorumlanabilir.
 */
function toFriendlyCategoryError(error: { code?: string }): string {
  if (error.code === "23505") {
    return "Bu bağlantı adresini (slug) kullanan başka bir kategori bulunuyor.";
  }
  if (error.code === "23503") {
    return "Bu kategoriye bağlı portfolyo projeleri bulunduğu için kategori silinemez.";
  }
  return "Kategori kaydedilirken bir hata oluştu.";
}

export async function createPortfolioCategoryAction(
  _prevState: PortfolioCategoryActionState,
  formData: FormData,
): Promise<PortfolioCategoryActionState> {
  await requireAdminSession();

  const { values, errors } = parsePortfolioCategoryFormData(formData);
  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("portfolio_categories").insert(values);

  if (error) {
    return { error: toFriendlyCategoryError(error) };
  }

  revalidatePath("/admin/portfolyo/kategoriler");
  revalidatePath("/admin/portfolyo");
  redirect("/admin/portfolyo/kategoriler");
}

export async function updatePortfolioCategoryAction(
  id: string,
  _prevState: PortfolioCategoryActionState,
  formData: FormData,
): Promise<PortfolioCategoryActionState> {
  await requireAdminSession();

  const { values, errors } = parsePortfolioCategoryFormData(formData);
  if (Object.keys(errors).length > 0) {
    return { fieldErrors: errors };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("portfolio_categories")
    .update(values)
    .eq("id", id);

  if (error) {
    return { error: toFriendlyCategoryError(error) };
  }

  revalidatePath("/admin/portfolyo/kategoriler");
  redirect("/admin/portfolyo/kategoriler");
}

export async function deletePortfolioCategoryAction(
  id: string,
): Promise<DeletePortfolioCategoryState> {
  await requireAdminSession();

  const supabase = await createClient();
  const { error } = await supabase
    .from("portfolio_categories")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: toFriendlyCategoryError(error) };
  }

  revalidatePath("/admin/portfolyo/kategoriler");
  revalidatePath("/admin/portfolyo");
  return {};
}
