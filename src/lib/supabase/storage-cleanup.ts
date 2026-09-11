import type { SupabaseClient } from "@supabase/supabase-js";
import { SITE_MEDIA_BUCKET, extractSiteMediaPath } from "@/lib/admin/media-upload";
import type { Database } from "@/types/database";

/**
 * Bir kaydın eski görselini (edit'te değiştirildiğinde veya kayıt
 * silindiğinde) Storage'dan temizler — SADECE bu uygulamanın `site-media`
 * bucket'ında yönettiği bir dosyaysa (bkz. `extractSiteMediaPath`).
 * Harici/legacy bir URL ise dokunulmaz.
 *
 * En iyi çaba (best-effort) temizliktir: DB işlemi zaten başarıyla
 * tamamlandıktan SONRA çağrılır, bu yüzden Storage silme hatası ana
 * işlemi başarısız yapmamalı — sadece sessizce yutulur (en kötü ihtimalle
 * kullanılmayan bir dosya Storage'da kalır, bu DB tutarlılığını bozmaz).
 */
export async function deleteSiteMediaIfManaged(
  supabase: SupabaseClient<Database>,
  url: string | null | undefined,
): Promise<void> {
  const path = extractSiteMediaPath(url);
  if (!path) return;

  try {
    await supabase.storage.from(SITE_MEDIA_BUCKET).remove([path]);
  } catch {
    // best-effort — ana işlemi etkilemez
  }
}

/**
 * Birden fazla yönetilen URL'yi (ör. bir projenin tüm galeri görselleri)
 * tek seferde temizler. `deleteSiteMediaIfManaged` ile aynı best-effort
 * garantisi geçerlidir.
 */
export async function deleteSiteMediaUrlsIfManaged(
  supabase: SupabaseClient<Database>,
  urls: (string | null | undefined)[],
): Promise<void> {
  const paths = urls
    .map((url) => extractSiteMediaPath(url))
    .filter((path): path is string => Boolean(path));
  if (paths.length === 0) return;

  try {
    await supabase.storage.from(SITE_MEDIA_BUCKET).remove(paths);
  } catch {
    // best-effort — ana işlemi etkilemez
  }
}

/**
 * Bir klasör prefix'i altındaki (ör. `portfolio/{projectId}/gallery/`)
 * TÜM dosyaları listeleyip siler — proje silinirken DB CASCADE'in tek
 * başına Storage'ı temizlemediği durum için kullanılır. Best-effort:
 * listeleme/silme hatası ana DB işlemini etkilemez.
 */
export async function deleteSiteMediaFolderIfManaged(
  supabase: SupabaseClient<Database>,
  folderPath: string,
): Promise<void> {
  try {
    const { data: files } = await supabase.storage
      .from(SITE_MEDIA_BUCKET)
      .list(folderPath, { limit: 1000 });

    if (!files || files.length === 0) return;

    const paths = files
      .filter((file) => file.name)
      .map((file) => `${folderPath}/${file.name}`);

    if (paths.length > 0) {
      await supabase.storage.from(SITE_MEDIA_BUCKET).remove(paths);
    }
  } catch {
    // best-effort — ana işlemi etkilemez
  }
}
