"use client";

import { useActionState, useState } from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AdminSection } from "@/components/admin/AdminSection";
import { slugify } from "@/lib/admin/slugify";
import type { BlogCategoryActionState } from "@/app/admin/(protected)/blog/kategoriler/actions";
import type { Tables } from "@/types/database";

type BlogCategoryFormProps = {
  mode: "create" | "edit";
  action: (
    prevState: BlogCategoryActionState,
    formData: FormData,
  ) => Promise<BlogCategoryActionState>;
  initialValues?: Tables<"blog_categories">;
};

const initialState: BlogCategoryActionState = {};

export function BlogCategoryForm({ mode, action, initialValues }: BlogCategoryFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  function handleNameChange(value: string) {
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
            <Label htmlFor="blog-category-name">Kategori Adı</Label>
            <Input
              id="blog-category-name"
              name="name"
              required
              defaultValue={initialValues?.name}
              onChange={(event) => handleNameChange(event.target.value)}
              aria-invalid={Boolean(state.fieldErrors?.name)}
              aria-describedby={
                state.fieldErrors?.name ? "blog-category-name-error" : undefined
              }
            />
            {state.fieldErrors?.name && (
              <p
                id="blog-category-name-error"
                role="alert"
                className="text-xs text-red-700"
              >
                {state.fieldErrors.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="blog-category-slug">Slug</Label>
            <Input
              id="blog-category-slug"
              name="slug"
              required
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              aria-invalid={Boolean(state.fieldErrors?.slug)}
              aria-describedby={
                state.fieldErrors?.slug
                  ? "blog-category-slug-error"
                  : "blog-category-slug-hint"
              }
            />
            {state.fieldErrors?.slug ? (
              <p
                id="blog-category-slug-error"
                role="alert"
                className="text-xs text-red-700"
              >
                {state.fieldErrors.slug}
              </p>
            ) : (
              <p id="blog-category-slug-hint" className="text-xs text-muted-foreground">
                Web adresinde görünecek — kategori adından otomatik oluşturulur,
                isterseniz değiştirebilirsiniz.
              </p>
            )}
          </div>
        </div>
      </AdminSection>

      <div className="flex flex-wrap gap-3 border-t border-border pt-8">
        <Button type="submit" loading={pending}>
          {mode === "create" ? "Kategoriyi Oluştur" : "Değişiklikleri Kaydet"}
        </Button>
        <Button href="/admin/blog/kategoriler" variant="outline">
          Vazgeç
        </Button>
      </div>
    </form>
  );
}
