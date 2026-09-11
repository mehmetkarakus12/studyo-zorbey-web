"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/supabase/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { deleteSiteMediaIfManaged } from "@/lib/supabase/storage-cleanup";

export type MediaActionState = { error?: string };

export type CreateMediaInput = {
  file_name: string;
  file_path: string;
  public_url: string;
  mime_type: string;
  file_size: number;
  width: number | null;
  height: number | null;
  folder: string;
};

/**
 * Client tarafında Storage'a zaten yüklenmiş bir dosyanın (bkz.
 * `MediaLibraryUploader`) `media` kaydını oluşturur. DB insert başarısız
 * olursa, önceden yüklenmiş dosya Storage'da "orphan" kalmasın diye geri
 * silinir.
 */
export async function createMediaAction(input: CreateMediaInput): Promise<MediaActionState> {
  await requireAdminSession();
  const supabase = await createClient();

  const { error } = await supabase.from("media").insert(input);

  if (error) {
    await deleteSiteMediaIfManaged(supabase, input.public_url);
    return { error: "Dosya kaydedilirken bir hata oluştu." };
  }

  revalidatePath("/admin/medya");
  return {};
}

export async function updateMediaAltTextAction(
  id: string,
  altText: string,
): Promise<MediaActionState> {
  await requireAdminSession();
  const supabase = await createClient();

  const { error } = await supabase
    .from("media")
    .update({ alt_text: altText.trim() || null })
    .eq("id", id);

  if (error) return { error: "Alt metin kaydedilirken bir hata oluştu." };

  revalidatePath("/admin/medya");
  return {};
}

/**
 * Silmeden önce, bu dosyanın public URL'sinin diğer içerik tablolarında
 * (kapak görselleri, galeri görselleri, SEO OG görseli) hâlâ kullanılıp
 * kullanılmadığını kontrol eder — Storage'daki dosya körlemesine silinmez.
 */
export async function deleteMediaAction(id: string): Promise<MediaActionState> {
  await requireAdminSession();
  const supabase = await createClient();

  const { data: mediaRow } = await supabase
    .from("media")
    .select("public_url")
    .eq("id", id)
    .single();

  if (!mediaRow) {
    return { error: "Dosya bulunamadı." };
  }

  const url = mediaRow.public_url;

  const [services, projects, galleryImages, posts, videos, seo] = await Promise.all([
    supabase
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("image_url", url),
    supabase
      .from("portfolio_projects")
      .select("id", { count: "exact", head: true })
      .eq("cover_image_url", url),
    supabase
      .from("portfolio_images")
      .select("id", { count: "exact", head: true })
      .eq("image_url", url),
    supabase
      .from("blog_posts")
      .select("id", { count: "exact", head: true })
      .eq("cover_image_url", url),
    supabase
      .from("videos")
      .select("id", { count: "exact", head: true })
      .eq("thumbnail_url", url),
    supabase
      .from("seo_settings")
      .select("id", { count: "exact", head: true })
      .eq("og_image_url", url),
  ]);

  const usageCount =
    (services.count ?? 0) +
    (projects.count ?? 0) +
    (galleryImages.count ?? 0) +
    (posts.count ?? 0) +
    (videos.count ?? 0) +
    (seo.count ?? 0);

  if (usageCount > 0) {
    return {
      error:
        "Bu dosya şu anda aktif bir içerikte kullanılıyor. Silmeden önce ilgili içerikten kaldırın.",
    };
  }

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) {
    return { error: "Dosya silinirken bir hata oluştu." };
  }

  await deleteSiteMediaIfManaged(supabase, url);

  revalidatePath("/admin/medya");
  return {};
}
