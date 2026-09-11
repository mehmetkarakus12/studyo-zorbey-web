"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { AdminSection } from "@/components/admin/AdminSection";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { MEDIA_RECOMMENDED_SIZES } from "@/lib/admin/media-upload";
import type { SeoSettingActionState } from "@/app/admin/(protected)/seo/actions";
import type { Tables } from "@/types/database";

type SeoSettingFormProps = {
  mode: "create" | "edit";
  action: (
    prevState: SeoSettingActionState,
    formData: FormData,
  ) => Promise<SeoSettingActionState>;
  initialValues?: Tables<"seo_settings">;
};

const initialState: SeoSettingActionState = {};

export function SeoSettingForm({ mode, action, initialValues }: SeoSettingFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

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

      <AdminSection title="Sayfa">
        <div className="flex flex-col gap-2 sm:w-96">
          <Label htmlFor="seo-page-key">Sayfa Anahtarı</Label>
          <Input
            id="seo-page-key"
            name="page_key"
            required
            placeholder="ör. home, hizmetler, portfolyo/dugun-fotografcisi"
            defaultValue={initialValues?.page_key}
            readOnly={mode === "edit"}
            className={mode === "edit" ? "cursor-not-allowed opacity-60" : undefined}
            aria-invalid={Boolean(state.fieldErrors?.page_key)}
            aria-describedby={
              state.fieldErrors?.page_key ? "seo-page-key-error" : "seo-page-key-hint"
            }
          />
          {state.fieldErrors?.page_key ? (
            <p id="seo-page-key-error" role="alert" className="text-xs text-red-700">
              {state.fieldErrors.page_key}
            </p>
          ) : (
            <p id="seo-page-key-hint" className="text-xs text-muted-foreground">
              Bu sayfayı public sitede tanımlayacak benzersiz anahtar — sonradan
              değiştirilemez.
            </p>
          )}
        </div>
      </AdminSection>

      <AdminSection title="Meta Bilgileri">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="seo-meta-title">Sayfa Başlığı (title)</Label>
            <Input
              id="seo-meta-title"
              name="meta_title"
              defaultValue={initialValues?.meta_title ?? ""}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="seo-meta-description">Meta Açıklama</Label>
            <Textarea
              id="seo-meta-description"
              name="meta_description"
              rows={3}
              defaultValue={initialValues?.meta_description ?? ""}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="seo-canonical-url">Canonical URL</Label>
            <Input
              id="seo-canonical-url"
              name="canonical_url"
              type="url"
              placeholder="https://studyozorbey.com/..."
              defaultValue={initialValues?.canonical_url ?? ""}
            />
          </div>
        </div>
      </AdminSection>

      <AdminSection
        title="Open Graph"
        description="Sosyal medyada bu sayfa paylaşıldığında görünecek bilgiler."
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="seo-og-title">OG Başlık</Label>
            <Input
              id="seo-og-title"
              name="og_title"
              defaultValue={initialValues?.og_title ?? ""}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="seo-og-description">OG Açıklama</Label>
            <Textarea
              id="seo-og-description"
              name="og_description"
              rows={3}
              defaultValue={initialValues?.og_description ?? ""}
            />
          </div>
          <MediaUploadField
            name="og_image_url"
            label="OG Görseli"
            folder="general"
            recommendedSize={MEDIA_RECOMMENDED_SIZES.ogImage.size}
            recommendedRatio={MEDIA_RECOMMENDED_SIZES.ogImage.ratio}
            initialUrl={initialValues?.og_image_url}
            pending={pending}
            submitFailed={Boolean(
              state.error || (state.fieldErrors && Object.keys(state.fieldErrors).length > 0),
            )}
          />
        </div>
      </AdminSection>

      <div className="flex flex-wrap gap-3 border-t border-border pt-8">
        <Button type="submit" loading={pending}>
          {mode === "create" ? "SEO Ayarını Oluştur" : "Değişiklikleri Kaydet"}
        </Button>
        <Button href="/admin/seo" variant="outline">
          Vazgeç
        </Button>
      </div>
    </form>
  );
}
