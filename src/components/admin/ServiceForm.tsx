"use client";

import { useActionState, useState } from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { AdminSection } from "@/components/admin/AdminSection";
import { AdminToggleField } from "@/components/admin/AdminToggleField";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { slugify } from "@/lib/admin/slugify";
import { MEDIA_RECOMMENDED_SIZES } from "@/lib/admin/media-upload";
import type { ServiceActionState } from "@/app/admin/(protected)/hizmetler/actions";
import type { Tables } from "@/types/database";

type ServiceFormProps = {
  mode: "create" | "edit";
  action: (
    prevState: ServiceActionState,
    formData: FormData,
  ) => Promise<ServiceActionState>;
  initialValues?: Tables<"services">;
};

const initialState: ServiceActionState = {};

export function ServiceForm({ mode, action, initialValues }: ServiceFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  // Düzenleme modunda mevcut slug'ı yazarken başlık değişince ÜZERİNE
  // yazmayalım — sadece kullanıcı slug alanına daha hiç dokunmadıysa
  // (yeni kayıtta varsayılan davranış) başlıktan otomatik türetilir.
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
            <Label htmlFor="service-title">Hizmet Adı</Label>
            <Input
              id="service-title"
              name="title"
              required
              defaultValue={initialValues?.title}
              onChange={(event) => handleTitleChange(event.target.value)}
              aria-invalid={Boolean(state.fieldErrors?.title)}
              aria-describedby={
                state.fieldErrors?.title ? "service-title-error" : undefined
              }
            />
            {state.fieldErrors?.title && (
              <p id="service-title-error" role="alert" className="text-xs text-red-700">
                {state.fieldErrors.title}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="service-slug">Slug</Label>
            <Input
              id="service-slug"
              name="slug"
              required
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              aria-invalid={Boolean(state.fieldErrors?.slug)}
              aria-describedby={
                state.fieldErrors?.slug ? "service-slug-error" : "service-slug-hint"
              }
            />
            {state.fieldErrors?.slug ? (
              <p id="service-slug-error" role="alert" className="text-xs text-red-700">
                {state.fieldErrors.slug}
              </p>
            ) : (
              <p id="service-slug-hint" className="text-xs text-muted-foreground">
                Web adresinde görünecek — başlıktan otomatik oluşturulur,
                isterseniz değiştirebilirsiniz.
              </p>
            )}
          </div>
        </div>
      </AdminSection>

      <AdminSection title="İçerik">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="service-short-description">Kısa Açıklama</Label>
            <Input
              id="service-short-description"
              name="short_description"
              defaultValue={initialValues?.short_description ?? ""}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="service-description">Detaylı Açıklama</Label>
            <Textarea
              id="service-description"
              name="description"
              rows={6}
              defaultValue={initialValues?.description ?? ""}
            />
          </div>
          <MediaUploadField
            name="image_url"
            label="Hizmet Görseli"
            folder="services"
            recommendedSize={MEDIA_RECOMMENDED_SIZES.service.size}
            recommendedRatio={MEDIA_RECOMMENDED_SIZES.service.ratio}
            note="En iyi görünüm için dikey 4:5 oranında görsel kullanın."
            initialUrl={initialValues?.image_url}
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
              description="Kapalıyken bu hizmet public sitede gösterilmez."
              defaultChecked={initialValues?.is_active ?? true}
            />
            <AdminToggleField
              name="is_featured"
              label="Öne Çıkan"
              description="Ana sayfadaki öne çıkan hizmetler arasında gösterilebilir."
              defaultChecked={initialValues?.is_featured ?? false}
            />
          </div>
          <div className="flex flex-col gap-2 sm:w-48">
            <Label htmlFor="service-sort-order">Sıralama</Label>
            <Input
              id="service-sort-order"
              name="sort_order"
              type="number"
              min={0}
              step={1}
              required
              defaultValue={initialValues?.sort_order ?? 0}
              aria-invalid={Boolean(state.fieldErrors?.sort_order)}
              aria-describedby={
                state.fieldErrors?.sort_order ? "service-sort-order-error" : undefined
              }
            />
            {state.fieldErrors?.sort_order && (
              <p
                id="service-sort-order-error"
                role="alert"
                className="text-xs text-red-700"
              >
                {state.fieldErrors.sort_order}
              </p>
            )}
          </div>
        </div>
      </AdminSection>

      <AdminSection
        title="SEO"
        description="Boş bırakılırsa hizmet adı/açıklaması kullanılır."
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="service-seo-title">SEO Başlığı</Label>
            <Input
              id="service-seo-title"
              name="seo_title"
              defaultValue={initialValues?.seo_title ?? ""}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="service-seo-description">SEO Açıklaması</Label>
            <Textarea
              id="service-seo-description"
              name="seo_description"
              rows={3}
              defaultValue={initialValues?.seo_description ?? ""}
            />
          </div>
        </div>
      </AdminSection>

      <div className="flex flex-wrap gap-3 border-t border-border pt-8">
        <Button type="submit" loading={pending}>
          {mode === "create" ? "Hizmeti Oluştur" : "Değişiklikleri Kaydet"}
        </Button>
        <Button href="/admin/hizmetler" variant="outline">
          Vazgeç
        </Button>
      </div>
    </form>
  );
}
