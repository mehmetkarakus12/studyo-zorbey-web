"use client";

import { useActionState, useState } from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { AdminSection } from "@/components/admin/AdminSection";
import { AdminToggleField } from "@/components/admin/AdminToggleField";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { slugify } from "@/lib/admin/slugify";
import { MEDIA_RECOMMENDED_SIZES } from "@/lib/admin/media-upload";
import type { VideoActionState } from "@/app/admin/(protected)/videolar/actions";
import type { Tables } from "@/types/database";

type VideoFormProps = {
  mode: "create" | "edit";
  action: (
    prevState: VideoActionState,
    formData: FormData,
  ) => Promise<VideoActionState>;
  initialValues?: Tables<"videos">;
};

const initialState: VideoActionState = {};

export function VideoForm({ mode, action, initialValues }: VideoFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  function handleTitleChange(value: string) {
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-10">
      {state.error && (
        <p
          role="alert"
          aria-live="polite"
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      <AdminSection title="Temel Bilgiler">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="video-title">Video Başlığı</Label>
            <Input
              id="video-title"
              name="title"
              required
              defaultValue={initialValues?.title}
              onChange={(event) => handleTitleChange(event.target.value)}
              aria-invalid={Boolean(state.fieldErrors?.title)}
              aria-describedby={state.fieldErrors?.title ? "video-title-error" : undefined}
            />
            {state.fieldErrors?.title && (
              <p id="video-title-error" role="alert" className="text-xs text-red-700">
                {state.fieldErrors.title}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="video-slug">Slug</Label>
            <Input
              id="video-slug"
              name="slug"
              required
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              aria-invalid={Boolean(state.fieldErrors?.slug)}
              aria-describedby={
                state.fieldErrors?.slug ? "video-slug-error" : "video-slug-hint"
              }
            />
            {state.fieldErrors?.slug ? (
              <p id="video-slug-error" role="alert" className="text-xs text-red-700">
                {state.fieldErrors.slug}
              </p>
            ) : (
              <p id="video-slug-hint" className="text-xs text-muted-foreground">
                Web adresinde görünecek — başlıktan otomatik oluşturulur, isterseniz
                değiştirebilirsiniz.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="video-type">Video Türü</Label>
            <Select
              id="video-type"
              name="video_type"
              defaultValue={initialValues?.video_type ?? "youtube"}
              aria-invalid={Boolean(state.fieldErrors?.video_type)}
              aria-describedby={
                state.fieldErrors?.video_type ? "video-type-error" : undefined
              }
            >
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
              <option value="mp4">MP4</option>
              <option value="other">Diğer</option>
            </Select>
            {state.fieldErrors?.video_type && (
              <p id="video-type-error" role="alert" className="text-xs text-red-700">
                {state.fieldErrors.video_type}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="video-url">Video URL</Label>
            <Input
              id="video-url"
              name="video_url"
              type="url"
              required
              placeholder="https://www.youtube.com/watch?v=..."
              defaultValue={initialValues?.video_url}
              aria-invalid={Boolean(state.fieldErrors?.video_url)}
              aria-describedby={
                state.fieldErrors?.video_url ? "video-url-error" : "video-url-hint"
              }
            />
            {state.fieldErrors?.video_url ? (
              <p id="video-url-error" role="alert" className="text-xs text-red-700">
                {state.fieldErrors.video_url}
              </p>
            ) : (
              <p id="video-url-hint" className="text-xs text-muted-foreground">
                YouTube, Vimeo veya doğrudan video bağlantısı yapıştırabilirsiniz.
              </p>
            )}
          </div>
        </div>
      </AdminSection>

      <AdminSection title="İçerik">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="video-description">Açıklama</Label>
            <Textarea
              id="video-description"
              name="description"
              rows={4}
              defaultValue={initialValues?.description ?? ""}
            />
          </div>
          <MediaUploadField
            name="thumbnail_url"
            label="Video Kapak Görseli"
            folder="video"
            recommendedSize={MEDIA_RECOMMENDED_SIZES.videoCover.size}
            recommendedRatio={MEDIA_RECOMMENDED_SIZES.videoCover.ratio}
            note="Yatay görsel kullanmanız önerilir."
            initialUrl={initialValues?.thumbnail_url}
            pending={pending}
            submitFailed={Boolean(
              state.error || (state.fieldErrors && Object.keys(state.fieldErrors).length > 0),
            )}
          />
        </div>
      </AdminSection>

      <AdminSection title="Yayın Ayarları">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AdminToggleField
              name="is_active"
              label="Aktif"
              description="Kapalıyken bu video public sitede gösterilmez."
              defaultChecked={initialValues?.is_active ?? true}
            />
            <AdminToggleField
              name="is_featured"
              label="Öne Çıkan"
              description="Öne çıkan videolar arasında gösterilebilir."
              defaultChecked={initialValues?.is_featured ?? false}
            />
          </div>
          <div className="flex flex-col gap-2 sm:w-48">
            <Label htmlFor="video-sort-order">Sıralama</Label>
            <Input
              id="video-sort-order"
              name="sort_order"
              type="number"
              min={0}
              step={1}
              required
              defaultValue={initialValues?.sort_order ?? 0}
              aria-invalid={Boolean(state.fieldErrors?.sort_order)}
              aria-describedby={
                state.fieldErrors?.sort_order ? "video-sort-order-error" : undefined
              }
            />
            {state.fieldErrors?.sort_order && (
              <p id="video-sort-order-error" role="alert" className="text-xs text-red-700">
                {state.fieldErrors.sort_order}
              </p>
            )}
          </div>
        </div>
      </AdminSection>

      <div className="flex flex-wrap gap-3 border-t border-border pt-8">
        <Button type="submit" loading={pending}>
          {mode === "create" ? "Videoyu Oluştur" : "Değişiklikleri Kaydet"}
        </Button>
        <Button href="/admin/videolar" variant="outline">
          Vazgeç
        </Button>
      </div>
    </form>
  );
}
