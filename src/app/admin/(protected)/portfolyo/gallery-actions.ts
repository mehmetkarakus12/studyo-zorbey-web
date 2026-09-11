"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/supabase/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { deleteSiteMediaIfManaged } from "@/lib/supabase/storage-cleanup";

export type GalleryActionState = { error?: string };

/**
 * Client tarafında Storage'a zaten yüklenmiş bir görselin (bkz.
 * `PortfolioGalleryManager`) `portfolio_images` kaydını oluşturur. DB
 * insert başarısız olursa (nadir), önceden yüklenmiş dosya Storage'da
 * "orphan" kalmasın diye geri silinir.
 */
export async function addPortfolioGalleryImageAction(
  projectId: string,
  imageUrl: string,
): Promise<GalleryActionState> {
  await requireAdminSession();
  const supabase = await createClient();

  const { count } = await supabase
    .from("portfolio_images")
    .select("*", { count: "exact", head: true })
    .eq("project_id", projectId);

  const { error } = await supabase.from("portfolio_images").insert({
    project_id: projectId,
    image_url: imageUrl,
    sort_order: count ?? 0,
  });

  if (error) {
    await deleteSiteMediaIfManaged(supabase, imageUrl);
    return { error: "Görsel eklenirken bir hata oluştu." };
  }

  revalidatePath(`/admin/portfolyo/${projectId}/duzenle`);
  return {};
}

export async function deletePortfolioGalleryImageAction(
  projectId: string,
  id: string,
): Promise<GalleryActionState> {
  await requireAdminSession();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("portfolio_images")
    .select("image_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("portfolio_images").delete().eq("id", id);
  if (error) {
    return { error: "Görsel silinirken bir hata oluştu." };
  }

  if (existing) {
    await deleteSiteMediaIfManaged(supabase, existing.image_url);
  }

  revalidatePath(`/admin/portfolyo/${projectId}/duzenle`);
  return {};
}

export async function updatePortfolioGalleryAltTextAction(
  projectId: string,
  id: string,
  altText: string,
): Promise<GalleryActionState> {
  await requireAdminSession();
  const supabase = await createClient();

  const { error } = await supabase
    .from("portfolio_images")
    .update({ alt_text: altText.trim() || null })
    .eq("id", id);

  if (error) return { error: "Alt metin kaydedilirken bir hata oluştu." };

  revalidatePath(`/admin/portfolyo/${projectId}/duzenle`);
  return {};
}

/**
 * Komşu görselle `sort_order` değerlerini takas ederek yukarı/aşağı
 * taşır — sürükle-bırak yerine basit ve güvenilir bir sıralama kontrolü.
 */
export async function movePortfolioGalleryImageAction(
  projectId: string,
  id: string,
  direction: "up" | "down",
): Promise<GalleryActionState> {
  await requireAdminSession();
  const supabase = await createClient();

  const { data: images, error: listError } = await supabase
    .from("portfolio_images")
    .select("id, sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });

  if (listError || !images) {
    return { error: "Görseller yüklenirken bir hata oluştu." };
  }

  const index = images.findIndex((image) => image.id === id);
  if (index === -1) return {};

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= images.length) return {};

  const current = images[index];
  const target = images[targetIndex];

  const [{ error: error1 }, { error: error2 }] = await Promise.all([
    supabase
      .from("portfolio_images")
      .update({ sort_order: target.sort_order })
      .eq("id", current.id),
    supabase
      .from("portfolio_images")
      .update({ sort_order: current.sort_order })
      .eq("id", target.id),
  ]);

  if (error1 || error2) {
    return { error: "Sıralama güncellenirken bir hata oluştu." };
  }

  revalidatePath(`/admin/portfolyo/${projectId}/duzenle`);
  return {};
}
