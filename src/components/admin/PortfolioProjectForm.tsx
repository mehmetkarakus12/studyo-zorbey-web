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
import type { PortfolioProjectActionState } from "@/app/admin/(protected)/portfolyo/actions";
import type { Tables } from "@/types/database";

type PortfolioProjectFormProps = {
  mode: "create" | "edit";
  action: (
    prevState: PortfolioProjectActionState,
    formData: FormData,
  ) => Promise<PortfolioProjectActionState>;
  categories: Pick<Tables<"portfolio_categories">, "id" | "name">[];
  initialValues?: Tables<"portfolio_projects">;
};

const initialState: PortfolioProjectActionState = {};

export function PortfolioProjectForm({
  mode,
  action,
  categories,
  initialValues,
}: PortfolioProjectFormProps) {
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
            <Label htmlFor="project-title">Proje Başlığı</Label>
            <Input
              id="project-title"
              name="title"
              required
              defaultValue={initialValues?.title}
              onChange={(event) => handleTitleChange(event.target.value)}
              aria-invalid={Boolean(state.fieldErrors?.title)}
              aria-describedby={
                state.fieldErrors?.title ? "project-title-error" : undefined
              }
            />
            {state.fieldErrors?.title && (
              <p id="project-title-error" role="alert" className="text-xs text-red-700">
                {state.fieldErrors.title}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="project-slug">Slug</Label>
            <Input
              id="project-slug"
              name="slug"
              required
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              aria-invalid={Boolean(state.fieldErrors?.slug)}
              aria-describedby={
                state.fieldErrors?.slug ? "project-slug-error" : "project-slug-hint"
              }
            />
            {state.fieldErrors?.slug ? (
              <p id="project-slug-error" role="alert" className="text-xs text-red-700">
                {state.fieldErrors.slug}
              </p>
            ) : (
              <p id="project-slug-hint" className="text-xs text-muted-foreground">
                Web adresinde görünecek — başlıktan otomatik oluşturulur,
                isterseniz değiştirebilirsiniz.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="project-category">Kategori</Label>
            <Select
              id="project-category"
              name="category_id"
              required
              defaultValue={initialValues?.category_id ?? ""}
              aria-invalid={Boolean(state.fieldErrors?.category_id)}
              aria-describedby={
                state.fieldErrors?.category_id ? "project-category-error" : undefined
              }
            >
              <option value="" disabled>
                Kategori seçin
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            {state.fieldErrors?.category_id && (
              <p
                id="project-category-error"
                role="alert"
                className="text-xs text-red-700"
              >
                {state.fieldErrors.category_id}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="project-location">Konum</Label>
            <Input
              id="project-location"
              name="location"
              defaultValue={initialValues?.location ?? ""}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="project-shooting-date">Çekim Tarihi</Label>
            <Input
              id="project-shooting-date"
              name="shooting_date"
              type="date"
              defaultValue={initialValues?.shooting_date ?? ""}
            />
          </div>
        </div>
      </AdminSection>

      <AdminSection title="İçerik">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-short-description">Kısa Açıklama</Label>
            <Input
              id="project-short-description"
              name="short_description"
              defaultValue={initialValues?.short_description ?? ""}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-description">Detaylı Açıklama</Label>
            <Textarea
              id="project-description"
              name="description"
              rows={6}
              defaultValue={initialValues?.description ?? ""}
            />
          </div>
          <MediaUploadField
            name="cover_image_url"
            label="Kapak Görseli"
            folder="portfolio"
            recommendedSize={MEDIA_RECOMMENDED_SIZES.portfolioCover.size}
            recommendedRatio={MEDIA_RECOMMENDED_SIZES.portfolioCover.ratio}
            note="Galeri görselleri medya yönetimi aşamasında eklenecek — burada yalnızca kapak görseli yüklenir."
            initialUrl={initialValues?.cover_image_url}
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
              description="Kapalıyken bu proje public sitede gösterilmez."
              defaultChecked={initialValues?.is_active ?? true}
            />
            <AdminToggleField
              name="is_featured"
              label="Öne Çıkan"
              description="Portfolyo sayfasında öne çıkan projeler arasında gösterilebilir."
              defaultChecked={initialValues?.is_featured ?? false}
            />
          </div>
          <div className="flex flex-col gap-2 sm:w-48">
            <Label htmlFor="project-sort-order">Sıralama</Label>
            <Input
              id="project-sort-order"
              name="sort_order"
              type="number"
              min={0}
              step={1}
              required
              defaultValue={initialValues?.sort_order ?? 0}
              aria-invalid={Boolean(state.fieldErrors?.sort_order)}
              aria-describedby={
                state.fieldErrors?.sort_order ? "project-sort-order-error" : undefined
              }
            />
            {state.fieldErrors?.sort_order && (
              <p
                id="project-sort-order-error"
                role="alert"
                className="text-xs text-red-700"
              >
                {state.fieldErrors.sort_order}
              </p>
            )}
          </div>
        </div>
      </AdminSection>

      <div className="flex flex-wrap gap-3 border-t border-border pt-8">
        <Button type="submit" loading={pending}>
          {mode === "create" ? "Projeyi Oluştur" : "Değişiklikleri Kaydet"}
        </Button>
        <Button href="/admin/portfolyo" variant="outline">
          Vazgeç
        </Button>
      </div>
    </form>
  );
}
