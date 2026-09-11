import { getSupabaseUrl } from "@/lib/supabase/env";

export const SITE_MEDIA_BUCKET = "site-media";

export const MAX_UPLOAD_SIZE_BYTES = 8 * 1024 * 1024;

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

export type MediaFolder = "services" | "portfolio" | "blog" | "video" | "general";

const MIME_EXTENSION: Record<AllowedImageMimeType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * Hem client (seçim anında hızlı geri bildirim) hem server tarafında
 * (Storage bucket'ının kendi `allowed_mime_types`/`file_size_limit`
 * ayarları, bkz. migration) uygulanan kontrolün istemci tarafındaki
 * kopyası — kullanıcıya Storage'ın ham hatasını göstermeden önce erken
 * ve dostça bir mesaj verir.
 */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as AllowedImageMimeType)) {
    return "Yalnızca JPG, PNG veya WEBP görseller yüklenebilir.";
  }
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return "Dosya boyutu en fazla 8 MB olabilir.";
  }
  return null;
}

/**
 * Kullanıcının orijinal dosya adını Storage path'i olarak KULLANMAZ —
 * path traversal ve çakışma riskini ortadan kaldıran, rastgele ve
 * benzersiz bir isim üretir.
 */
export function buildSafeStoragePath(folder: MediaFolder, file: File): string {
  const extension = MIME_EXTENSION[file.type as AllowedImageMimeType] ?? "jpg";
  const uniqueName = `${crypto.randomUUID()}-${Date.now()}.${extension}`;
  return `${folder}/${uniqueName}`;
}

/**
 * Bir portfolyo projesinin galeri görselleri için proje bazlı, kendi
 * klasörüne izole edilmiş path üretir (`portfolio/{projectId}/gallery/...`)
 * — proje silindiğinde tüm galeri dosyalarının tek bir prefix altında
 * bulunup topluca temizlenebilmesi (bkz. `deleteSiteMediaFolderIfManaged`)
 * için.
 */
export function buildGalleryStoragePath(projectId: string, file: File): string {
  const extension = MIME_EXTENSION[file.type as AllowedImageMimeType] ?? "jpg";
  const uniqueName = `${crypto.randomUUID()}-${Date.now()}.${extension}`;
  return `portfolio/${projectId}/gallery/${uniqueName}`;
}

function siteMediaPublicUrlPrefix(): string {
  return `${getSupabaseUrl()}/storage/v1/object/public/${SITE_MEDIA_BUCKET}/`;
}

/**
 * Verilen URL bu uygulamanın `site-media` bucket'ında yönettiği bir
 * dosyaya mı ait, yoksa harici/legacy bir görsele mi ait olduğunu ayırt
 * eder. Sadece kendi yönettiğimiz path'ler temizlenirken (edit/delete
 * sırasında) kullanılmalı — harici bir URL asla silinmeye çalışılmamalı.
 */
export function extractSiteMediaPath(
  url: string | null | undefined,
): string | null {
  if (!url) return null;
  const prefix = siteMediaPublicUrlPrefix();
  if (!url.startsWith(prefix)) return null;
  const path = url.slice(prefix.length);
  return path.length > 0 ? path : null;
}

export const MEDIA_RECOMMENDED_SIZES = {
  service: { size: "800 × 1000 px", ratio: "4:5" },
  portfolioCover: { size: "1000 × 1250 px", ratio: "4:5" },
  blogCover: { size: "1600 × 900 px", ratio: "16:9" },
  hero: { size: "1200 × 1500 px", ratio: "4:5" },
  about: { size: "1000 × 1250 px", ratio: "4:5" },
  instagram: { size: "1080 × 1080 px", ratio: "1:1" },
  videoCover: { size: "1920 × 1080 px", ratio: "16:9" },
  ogImage: { size: "1200 × 630 px", ratio: "1.91:1" },
  general: { size: "1200 × 1200 px", ratio: "serbest" },
} as const satisfies Record<string, { size: string; ratio: string }>;

/**
 * Portfolyo galerisinde birden fazla oranın bir arada kullanılabileceğini
 * belirten öneri listesi (bkz. proje talimatları — ölçüler bağlayıcı
 * değildir, yalnızca önerilir).
 */
export const GALLERY_RECOMMENDED_SIZES = [
  { label: "Dikey", size: "1000 × 1250 px", ratio: "4:5" },
  { label: "Yatay", size: "1600 × 1000 px", ratio: "16:10" },
  { label: "Kare", size: "1200 × 1200 px", ratio: "1:1" },
] as const;

export const MAX_GALLERY_FILES_PER_UPLOAD = 20;
