import { SLUG_PATTERN } from "@/lib/admin/service-validation";

const VIDEO_TYPES = ["youtube", "vimeo", "mp4", "other"] as const;
export type VideoTypeValue = (typeof VIDEO_TYPES)[number];

export type VideoFormValues = {
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string;
  video_type: VideoTypeValue;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
};

export type VideoFieldErrors = Partial<
  Record<"title" | "slug" | "video_url" | "video_type" | "sort_order", string>
>;

function optionalText(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

/**
 * Yalnızca `http:`/`https:` şemalarını kabul eder — `javascript:`, `data:`
 * ve benzeri güvenli olmayan şemaları reddeder. YouTube (watch/youtu.be/
 * shorts) ve Vimeo dahil her normal web bağlantısı bu genel kontrolden
 * geçer; platforma özel bir regex ile daraltılmadı (istenmeyen formatları
 * yanlışlıkla reddetmemek için).
 */
function isSafeVideoUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * `videos` şemasıyla birebir eşleşir (bkz.
 * supabase/migrations/20260910120500_videos.sql). Şemada `seo_title`/
 * `seo_description` YOK — bu yüzden burada da yönetilmiyor. `video_type`
 * DB'de `check (video_type in ('youtube','vimeo','mp4','other'))` ile
 * sınırlı, burada aynı dört değerle doğrulanır.
 */
export function parseVideoFormData(formData: FormData): {
  values: VideoFormValues;
  errors: VideoFieldErrors;
} {
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const videoUrl = String(formData.get("video_url") ?? "").trim();
  const videoTypeRaw = String(formData.get("video_type") ?? "").trim();
  const sortOrderRaw = String(formData.get("sort_order") ?? "").trim();
  const sortOrderNumber = Number(sortOrderRaw);

  const errors: VideoFieldErrors = {};

  if (!title) {
    errors.title = "Video başlığı boş olamaz.";
  }

  if (!slug) {
    errors.slug = "Slug boş olamaz.";
  } else if (!SLUG_PATTERN.test(slug)) {
    errors.slug =
      "Slug yalnızca küçük harf, rakam ve tire (-) içerebilir (ör. dugun-highlight).";
  }

  if (!videoUrl) {
    errors.video_url = "Video bağlantısı boş olamaz.";
  } else if (!isSafeVideoUrl(videoUrl)) {
    errors.video_url = "Geçerli bir video bağlantısı giriniz.";
  }

  let videoType: VideoTypeValue = "youtube";
  if (!VIDEO_TYPES.includes(videoTypeRaw as VideoTypeValue)) {
    errors.video_type = "Geçerli bir video türü seçmelisiniz.";
  } else {
    videoType = videoTypeRaw as VideoTypeValue;
  }

  if (sortOrderRaw === "" || !Number.isInteger(sortOrderNumber) || sortOrderNumber < 0) {
    errors.sort_order = "Sıralama 0 veya daha büyük bir tam sayı olmalı.";
  }

  return {
    values: {
      title,
      slug,
      description: optionalText(formData.get("description")),
      thumbnail_url: optionalText(formData.get("thumbnail_url")),
      video_url: videoUrl,
      video_type: videoType,
      is_active: formData.get("is_active") === "on",
      is_featured: formData.get("is_featured") === "on",
      sort_order: Number.isFinite(sortOrderNumber) ? sortOrderNumber : 0,
    },
    errors,
  };
}
