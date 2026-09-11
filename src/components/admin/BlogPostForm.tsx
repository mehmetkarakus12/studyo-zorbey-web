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
import type { BlogPostActionState } from "@/app/admin/(protected)/blog/actions";
import type { Tables } from "@/types/database";

type BlogPostFormProps = {
  mode: "create" | "edit";
  action: (
    prevState: BlogPostActionState,
    formData: FormData,
  ) => Promise<BlogPostActionState>;
  categories: Pick<Tables<"blog_categories">, "id" | "name">[];
  initialValues?: Tables<"blog_posts">;
};

const initialState: BlogPostActionState = {};

function toDateTimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

export function BlogPostForm({ mode, action, categories, initialValues }: BlogPostFormProps) {
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
            <Label htmlFor="post-title">Başlık</Label>
            <Input
              id="post-title"
              name="title"
              required
              defaultValue={initialValues?.title}
              onChange={(event) => handleTitleChange(event.target.value)}
              aria-invalid={Boolean(state.fieldErrors?.title)}
              aria-describedby={state.fieldErrors?.title ? "post-title-error" : undefined}
            />
            {state.fieldErrors?.title && (
              <p id="post-title-error" role="alert" className="text-xs text-red-700">
                {state.fieldErrors.title}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="post-slug">Slug</Label>
            <Input
              id="post-slug"
              name="slug"
              required
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              aria-invalid={Boolean(state.fieldErrors?.slug)}
              aria-describedby={
                state.fieldErrors?.slug ? "post-slug-error" : "post-slug-hint"
              }
            />
            {state.fieldErrors?.slug ? (
              <p id="post-slug-error" role="alert" className="text-xs text-red-700">
                {state.fieldErrors.slug}
              </p>
            ) : (
              <p id="post-slug-hint" className="text-xs text-muted-foreground">
                Web adresinde görünecek — başlıktan otomatik oluşturulur, isterseniz
                değiştirebilirsiniz.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="post-category">Kategori</Label>
            <Select
              id="post-category"
              name="category_id"
              defaultValue={initialValues?.category_id ?? ""}
              aria-invalid={Boolean(state.fieldErrors?.category_id)}
              aria-describedby={
                state.fieldErrors?.category_id ? "post-category-error" : undefined
              }
            >
              <option value="">Kategorisiz</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            {state.fieldErrors?.category_id && (
              <p id="post-category-error" role="alert" className="text-xs text-red-700">
                {state.fieldErrors.category_id}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="post-published-at">Yayın Tarihi</Label>
            <Input
              id="post-published-at"
              name="published_at"
              type="datetime-local"
              defaultValue={toDateTimeLocalValue(initialValues?.published_at)}
              aria-invalid={Boolean(state.fieldErrors?.published_at)}
              aria-describedby={
                state.fieldErrors?.published_at ? "post-published-at-error" : undefined
              }
            />
            {state.fieldErrors?.published_at && (
              <p
                id="post-published-at-error"
                role="alert"
                className="text-xs text-red-700"
              >
                {state.fieldErrors.published_at}
              </p>
            )}
          </div>
        </div>
      </AdminSection>

      <AdminSection title="İçerik">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="post-excerpt">Kısa Açıklama / Özet</Label>
            <Textarea
              id="post-excerpt"
              name="excerpt"
              rows={3}
              defaultValue={initialValues?.excerpt ?? ""}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="post-content">İçerik</Label>
            <Textarea
              id="post-content"
              name="content"
              rows={12}
              defaultValue={initialValues?.content ?? ""}
            />
          </div>
          <MediaUploadField
            name="cover_image_url"
            label="Kapak Görseli"
            folder="blog"
            recommendedSize={MEDIA_RECOMMENDED_SIZES.blogCover.size}
            recommendedRatio={MEDIA_RECOMMENDED_SIZES.blogCover.ratio}
            note="Yatay görsel kullanmanız önerilir."
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
            <div className="flex flex-col gap-2">
              <Label htmlFor="post-status">Yayın Durumu</Label>
              <Select
                id="post-status"
                name="status"
                defaultValue={initialValues?.status ?? "draft"}
                aria-invalid={Boolean(state.fieldErrors?.status)}
                aria-describedby={
                  state.fieldErrors?.status ? "post-status-error" : undefined
                }
              >
                <option value="draft">Taslak</option>
                <option value="published">Yayında</option>
              </Select>
              {state.fieldErrors?.status && (
                <p id="post-status-error" role="alert" className="text-xs text-red-700">
                  {state.fieldErrors.status}
                </p>
              )}
            </div>
            <AdminToggleField
              name="is_featured"
              label="Öne Çıkan"
              description="Blog sayfasında öne çıkan yazılar arasında gösterilebilir."
              defaultChecked={initialValues?.is_featured ?? false}
            />
          </div>
        </div>
      </AdminSection>

      <AdminSection
        title="SEO"
        description="Boş bırakılırsa yazı başlığı/özeti kullanılır."
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="post-seo-title">SEO Başlığı</Label>
            <Input
              id="post-seo-title"
              name="seo_title"
              defaultValue={initialValues?.seo_title ?? ""}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="post-seo-description">SEO Açıklaması</Label>
            <Textarea
              id="post-seo-description"
              name="seo_description"
              rows={3}
              defaultValue={initialValues?.seo_description ?? ""}
            />
          </div>
        </div>
      </AdminSection>

      <div className="flex flex-wrap gap-3 border-t border-border pt-8">
        <Button type="submit" loading={pending}>
          {mode === "create" ? "Yazıyı Oluştur" : "Değişiklikleri Kaydet"}
        </Button>
        <Button href="/admin/blog" variant="outline">
          Vazgeç
        </Button>
      </div>
    </form>
  );
}
